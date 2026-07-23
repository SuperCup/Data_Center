import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Button, Space, Spin, Typography, message, Tag } from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  SearchOutlined,
  AlertOutlined,
  BarChartOutlined,
  RocketOutlined,
  CompassOutlined,
  FormOutlined,
  PaperClipOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import SessionAssetPanel from './SessionAssetPanel';
import { useAiSession } from './AiSessionContext';
import './aiWorkbench.css';
import {
  CAPABILITIES,
  INITIAL_ARTIFACTS,
  INITIAL_ATTACHMENTS,
  ArtifactItem,
  AttachmentItem,
  CapabilityType,
  ChatReply,
  formatReplyText,
  respond,
  scriptByType,
  uid,
} from '../../../services/aiMock';
import {
  CustomReportItem,
  MOUNTED_CUSTOM_REPORTS,
} from '../../../services/customReports';

const { Text } = Typography;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  reply?: ChatReply;
  attachments?: AttachmentItem[];
  mentions?: CustomReportItem[];
}

interface MentionState {
  start: number;
  query: string;
}

const CAP_ICONS: Record<CapabilityType, React.ReactNode> = {
  query: <SearchOutlined />,
  diagnose: <AlertOutlined />,
  analyze: <BarChartOutlined />,
  action: <RocketOutlined />,
  opportunity: <CompassOutlined />,
  report: <FormOutlined />,
};

const AGENT_NAME = '即时零售增长Agent';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** 检测光标前是否处于 @ 引用输入中 */
function detectMention(value: string, cursor: number): MentionState | null {
  const before = value.slice(0, cursor);
  const match = before.match(/(^|[\s\n])@([^\s@]*)$/);
  if (!match) return null;
  const atIndex = before.lastIndexOf('@');
  return { start: atIndex, query: match[2] || '' };
}

const AiWorkbench: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    sessions,
    setSessions,
    activeSessionId: sessionId,
    setActiveSessionId: setSessionId,
    setTypingSessionId,
  } = useAiSession();

  const [artifacts, setArtifacts] = useState<ArtifactItem[]>(INITIAL_ARTIFACTS);
  const [attachments, setAttachments] = useState<AttachmentItem[]>(INITIAL_ATTACHMENTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<
    { uid: string; name: string; size?: number }[]
  >([]);
  const [pendingMentions, setPendingMentions] = useState<CustomReportItem[]>([]);
  const [mention, setMention] = useState<MentionState | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);

  const openSessionId = (location.state as { openSessionId?: string } | null)?.openSessionId;
  const resetChat = (location.state as { resetChat?: boolean } | null)?.resetChat;
  const inChat = messages.length > 0 || typing;

  const mentionOptions = useMemo(() => {
    if (!mention) return [];
    const q = mention.query.trim().toLowerCase();
    return MOUNTED_CUSTOM_REPORTS.filter(
      (r) =>
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [mention]);

  useEffect(() => {
    if (resetChat) {
      setMessages([]);
      setPendingFiles([]);
      setPendingMentions([]);
      setMention(null);
      setSessionId(null);
      navigate('/client/ai', { replace: true, state: {} });
    }
  }, [resetChat, navigate, setSessionId]);

  useEffect(() => {
    if (!openSessionId) return;
    const session = sessions.find((s) => s.id === openSessionId);
    if (!session) return;
    setSessionId(openSessionId);
    const script = scriptByType(session.type);
    setMessages([
      { id: uid('m'), role: 'user', text: script.userSeed },
      { id: uid('m'), role: 'assistant', reply: script.reply },
    ]);
    setPendingFiles([]);
    setPendingMentions([]);
    setMention(null);
    navigate('/client/ai', { replace: true, state: {} });
  }, [openSessionId, sessions, setSessionId, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    setTypingSessionId(typing ? sessionId : null);
  }, [typing, sessionId, setTypingSessionId]);

  useEffect(() => {
    setMentionIndex(0);
  }, [mention?.query, mention?.start]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === sessionId) || null,
    [sessions, sessionId]
  );

  const sessionArtifacts = useMemo(
    () => artifacts.filter((a) => a.sessionId === sessionId),
    [artifacts, sessionId]
  );

  const sessionAttachments = useMemo(
    () => attachments.filter((a) => a.sessionId === sessionId),
    [attachments, sessionId]
  );

  const ensureArtifact = (
    art: { title: string; type: string; summary: string },
    source: string,
    sid?: string | null
  ) => {
    const targetSession = sid || sessionId;
    setArtifacts((prev) => {
      if (prev.some((a) => a.title === art.title && a.sessionId === targetSession)) return prev;
      return [
        {
          id: uid('a'),
          title: art.title,
          type: art.type,
          source,
          createdAt: '刚刚',
          summary: art.summary,
          sessionId: targetSession || undefined,
        },
        ...prev,
      ];
    });
  };

  const startCapability = async (type: CapabilityType) => {
    const script = scriptByType(type);
    const id = uid('s');
    setSessions((prev) => [
      {
        id,
        title: script.title,
        type: script.type,
        updatedAt: '刚刚',
        preview: script.userSeed,
      },
      ...prev,
    ]);
    setSessionId(id);
    setMessages([]);
    setPendingFiles([]);
    setPendingMentions([]);
    await sendMessage(script.userSeed, id);
  };

  const consumePendingAttachments = (sid: string, sessionTitle: string) => {
    if (pendingFiles.length === 0) return [] as AttachmentItem[];
    const created: AttachmentItem[] = pendingFiles.map((f) => ({
      id: uid('f'),
      name: f.name,
      size: formatSize(f.size || 0),
      mime: (f.name.split('.').pop() || 'file').toLowerCase(),
      createdAt: '刚刚',
      sessionId: sid,
      sessionTitle,
    }));
    setAttachments((prev) => [...created, ...prev]);
    setPendingFiles([]);
    return created;
  };

  const syncInputMention = (value: string, cursor: number) => {
    setMention(detectMention(value, cursor));
  };

  const applyMention = (report: CustomReportItem) => {
    if (!mention) return;
    const el = textareaRef.current;
    const cursor = el?.selectionStart ?? input.length;
    const before = input.slice(0, mention.start);
    const after = input.slice(cursor);
    const token = `@${report.name} `;
    const next = `${before}${token}${after}`;
    setInput(next);
    setPendingMentions((prev) =>
      prev.some((m) => m.id === report.id) ? prev : [...prev, report]
    );
    setMention(null);
    requestAnimationFrame(() => {
      const pos = before.length + token.length;
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(pos, pos);
      }
    });
  };

  const sendMessage = async (raw?: string, forceSessionId?: string) => {
    const content = (raw ?? input).trim();
    if ((!content && pendingFiles.length === 0 && pendingMentions.length === 0) || typing) {
      return;
    }

    let sid = forceSessionId || sessionId;
    const mentionHint =
      pendingMentions.length > 0
        ? `（引用定制报表：${pendingMentions.map((m) => m.name).join('、')}）`
        : '';
    const displayText =
      content ||
      (pendingMentions.length
        ? `请基于引用的定制报表进行分析${mentionHint}`
        : `已上传 ${pendingFiles.length} 个附件，请结合附件分析。`);

    if (!sid) {
      sid = uid('s');
      setSessions((prev) => [
        {
          id: sid!,
          title: displayText.slice(0, 18),
          type: 'query',
          updatedAt: '刚刚',
          preview: displayText,
        },
        ...prev,
      ]);
      setSessionId(sid);
    }

    const sessionTitle =
      sessions.find((s) => s.id === sid)?.title || displayText.slice(0, 18);
    const uploaded = consumePendingAttachments(sid!, sessionTitle);
    const usedMentions = [...pendingMentions];

    setInput('');
    setPendingMentions([]);
    setMention(null);
    setMessages((prev) => [
      ...prev,
      {
        id: uid('m'),
        role: 'user',
        text: displayText,
        attachments: uploaded.length ? uploaded : undefined,
        mentions: usedMentions.length ? usedMentions : undefined,
      },
    ]);
    setTyping(true);

    try {
      const prompt =
        usedMentions.length > 0
          ? `${displayText}\n\n[定制报表上下文]\n${usedMentions
              .map((m) => `- ${m.name}（${m.category}）：${m.description}`)
              .join('\n')}`
          : displayText;
      const { script, reply } = await respond(prompt);
      setMessages((prev) => [...prev, { id: uid('m'), role: 'assistant', reply }]);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sid
            ? {
                ...s,
                title: script.title,
                type: script.type,
                updatedAt: '刚刚',
                preview: displayText,
              }
            : s
        )
      );
      if (reply.artifact) ensureArtifact(reply.artifact, script.title, sid);
    } finally {
      setTyping(false);
    }
  };

  const handleAction = async (action: NonNullable<ChatReply['actions']>[number]) => {
    if (action.action === 'followup' && action.text) {
      await sendMessage(action.text);
    } else if (action.action === 'artifact') {
      const last = [...messages].reverse().find((m) => m.role === 'assistant');
      if (last?.reply?.artifact) {
        ensureArtifact(
          { ...last.reply.artifact, type: action.artifactType || last.reply.artifact.type },
          activeSession?.title || '当前会话',
          sessionId
        );
        message.success('已写入本会话产物');
      }
    } else if (action.action === 'goto' && action.target) {
      const map: Record<string, string> = {
        'dash-instant': '/client/activity-progress-general',
        'dash-store': '/client/sales-analysis',
        'dash-qr': '/client/qr-user-analysis',
      };
      navigate(map[action.target] || `/client/${action.target}`);
    }
  };

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = files.map((file, idx) => ({
      uid: `${Date.now()}_${idx}`,
      name: file.name,
      size: file.size,
    }));
    setPendingFiles((prev) => [...prev, ...next]);
    e.target.value = '';
  };

  const onComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mention && mentionOptions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex((i) => (i + 1) % mentionOptions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex((i) => (i - 1 + mentionOptions.length) % mentionOptions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applyMention(mentionOptions[mentionIndex] || mentionOptions[0]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMention(null);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderAssistant = (reply: ChatReply) => (
    <div className="ai-wb-bubble">
      <div dangerouslySetInnerHTML={{ __html: formatReplyText(reply.text) }} />
      {reply.metrics && reply.metrics.length > 0 && (
        <div className="ai-wb-metrics">
          {reply.metrics.map((m) => (
            <div className="ai-wb-metric" key={m.label}>
              <div className="ai-wb-metric-label">{m.label}</div>
              <div className="ai-wb-metric-value">{m.value}</div>
            </div>
          ))}
        </div>
      )}
      {reply.artifact && (
        <div
          className="ai-wb-artifact"
          onClick={() =>
            ensureArtifact(reply.artifact!, activeSession?.title || '当前会话', sessionId)
          }
        >
          <Text style={{ color: '#2563eb', fontSize: 12 }}>{reply.artifact.type}</Text>
          <div style={{ fontWeight: 560, marginTop: 2 }}>{reply.artifact.title}</div>
        </div>
      )}
      {reply.actions && reply.actions.length > 0 && (
        <Space wrap style={{ marginTop: 12 }}>
          {reply.actions.map((a) => (
            <Button key={a.label} size="small" shape="round" onClick={() => handleAction(a)}>
              {a.label}
            </Button>
          ))}
        </Space>
      )}
    </div>
  );

  const composerBox = (
    <div className="ai-wb-composer">
      {(pendingFiles.length > 0 || pendingMentions.length > 0) && (
        <div className="ai-wb-pending-files">
          {pendingMentions.map((m) => (
            <Tag
              key={m.id}
              closable
              color="blue"
              onClose={() => {
                setPendingMentions((prev) => prev.filter((x) => x.id !== m.id));
                setInput((prev) => prev.replace(new RegExp(`@${m.name}\\s?`, 'g'), ''));
              }}
              icon={<LinkOutlined />}
            >
              {m.name}
            </Tag>
          ))}
          {pendingFiles.map((f) => (
            <Tag
              key={f.uid}
              closable
              onClose={() => setPendingFiles((prev) => prev.filter((x) => x.uid !== f.uid))}
              icon={<PaperClipOutlined />}
            >
              {f.name}
            </Tag>
          ))}
        </div>
      )}
      <div className="ai-wb-composer-input-wrap">
        {mention && (
          <div className="ai-wb-mention-popup" role="listbox">
            <div className="ai-wb-mention-hd">专属定制报表</div>
            {mentionOptions.length === 0 ? (
              <div className="ai-wb-mention-empty">无匹配的定制链接</div>
            ) : (
              mentionOptions.map((r, idx) => (
                <button
                  key={r.id}
                  type="button"
                  className={`ai-wb-mention-item ${idx === mentionIndex ? 'active' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyMention(r);
                  }}
                  onMouseEnter={() => setMentionIndex(idx)}
                >
                  <LinkOutlined className="ai-wb-mention-icon" />
                  <span className="ai-wb-mention-body">
                    <span className="ai-wb-mention-name">{r.name}</span>
                    <span className="ai-wb-mention-meta">
                      {r.category} · {r.validTime}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);
            syncInputMention(value, e.target.selectionStart ?? value.length);
          }}
          onClick={(e) => {
            const el = e.currentTarget;
            syncInputMention(el.value, el.selectionStart ?? el.value.length);
          }}
          onKeyUp={(e) => {
            const el = e.currentTarget;
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
              syncInputMention(el.value, el.selectionStart ?? el.value.length);
            }
          }}
          placeholder="今天想了解什么？输入 @ 引用专属定制报表…"
          rows={3}
          onKeyDown={onComposerKeyDown}
        />
      </div>
      <div className="ai-wb-composer-bar">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={onPickFiles}
        />
        <button
          type="button"
          className="ai-wb-icon-btn"
          title="添加附件"
          onClick={() => fileInputRef.current?.click()}
        >
          <PaperClipOutlined />
        </button>
        <button
          type="button"
          className="ai-wb-icon-btn"
          title="引用定制报表 @"
          onClick={() => {
            const el = textareaRef.current;
            const cursor = el?.selectionStart ?? input.length;
            const next = `${input.slice(0, cursor)}@${input.slice(cursor)}`;
            setInput(next);
            const pos = cursor + 1;
            setMention({ start: cursor, query: '' });
            requestAnimationFrame(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(pos, pos);
              }
            });
          }}
        >
          @
        </button>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="ai-wb-send"
          disabled={
            typing ||
            (!input.trim() && pendingFiles.length === 0 && pendingMentions.length === 0)
          }
          onClick={() => sendMessage()}
          title="发送"
        >
          <SendOutlined />
        </button>
      </div>
    </div>
  );

  if (!inChat) {
    return (
      <div className="ai-wb-main-scroll">
        <div className="ai-wb-hero">
          <h1 className="ai-wb-brand">{AGENT_NAME}</h1>
          <div className="ai-wb-skills">
            {CAPABILITIES.map((c) => (
              <button
                key={c.type}
                type="button"
                className="ai-wb-skill"
                onClick={() => startCapability(c.type)}
              >
                {CAP_ICONS[c.type]}
                {c.name}
              </button>
            ))}
          </div>
          <div className="ai-wb-composer-wrap">{composerBox}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-wb-chat-layout">
      <div className="ai-wb-chat">
        <div style={{ padding: '8px 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text ellipsis style={{ flex: 1, fontWeight: 500 }}>
            {activeSession?.title || AGENT_NAME}
          </Text>
        </div>
        <div className="ai-wb-chat-scroll" ref={scrollRef}>
          {messages.map((m) =>
            m.role === 'user' ? (
              <div className="ai-wb-msg user" key={m.id}>
                <Avatar size={32} style={{ background: '#87d068' }}>
                  我
                </Avatar>
                <div className="ai-wb-bubble">
                  {m.text}
                  {m.mentions && m.mentions.length > 0 && (
                    <div className="ai-wb-msg-files">
                      {m.mentions.map((r) => (
                        <Tag key={r.id} color="blue" icon={<LinkOutlined />}>
                          {r.name}
                        </Tag>
                      ))}
                    </div>
                  )}
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="ai-wb-msg-files">
                      {m.attachments.map((f) => (
                        <Tag key={f.id} icon={<PaperClipOutlined />}>
                          {f.name}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="ai-wb-msg" key={m.id}>
                <Avatar size={32} style={{ background: '#111827' }} icon={<RobotOutlined />} />
                {m.reply ? renderAssistant(m.reply) : null}
              </div>
            )
          )}
          {typing && (
            <div className="ai-wb-msg">
              <Avatar size={32} style={{ background: '#111827' }} icon={<RobotOutlined />} />
              <div className="ai-wb-bubble">
                <Spin size="small" /> <Text type="secondary"> 正在生成…</Text>
              </div>
            </div>
          )}
        </div>
        <div className="ai-wb-chat-composer">
          <Space wrap style={{ marginBottom: 8 }}>
            {CAPABILITIES.map((c) => (
              <button
                key={c.type}
                type="button"
                className="ai-wb-skill"
                onClick={() => setInput(scriptByType(c.type).userSeed)}
              >
                {CAP_ICONS[c.type]}
                {c.name}
              </button>
            ))}
          </Space>
          {composerBox}
        </div>
      </div>

      <aside className="ai-wb-asset-rail">
        <div className="ai-wb-asset-rail-hd">本会话管理</div>
        <SessionAssetPanel
          artifacts={sessionArtifacts}
          attachments={sessionAttachments}
          onRemoveAttachment={(id) =>
            setAttachments((prev) => prev.filter((a) => a.id !== id))
          }
        />
      </aside>
    </div>
  );
};

export default AiWorkbench;
