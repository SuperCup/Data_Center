import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Button, Modal, Space, Spin, Typography, message, Tag } from 'antd';
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
  FileExcelOutlined,
  FileMarkdownOutlined,
  FileTextOutlined,
  DownloadOutlined,
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
  ArtifactPayload,
  AttachmentItem,
  CapabilityType,
  ChatReply,
  FORMAT_LABEL,
  formatReplyText,
  respond,
  scriptByType,
  uid,
} from '../../../services/aiMock';
import {
  CustomReportItem,
  MOUNTED_CUSTOM_REPORTS,
} from '../../../services/customReports';

const { Text, Paragraph } = Typography;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  reply?: ChatReply;
  attachments?: AttachmentItem[];
  mentions?: CustomReportItem[];
  capability?: CapabilityType;
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

const FORMAT_ICON: Record<string, React.ReactNode> = {
  html: <FileTextOutlined />,
  md: <FileMarkdownOutlined />,
  xlsx: <FileExcelOutlined />,
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

function renderMdPreview(content: string) {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
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
  const [selectedCapability, setSelectedCapability] = useState<CapabilityType | null>(null);
  const [mention, setMention] = useState<MentionState | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [previewArtifact, setPreviewArtifact] = useState<ArtifactItem | null>(null);

  const openSessionId = (location.state as { openSessionId?: string } | null)?.openSessionId;
  const resetChat = (location.state as { resetChat?: boolean } | null)?.resetChat;
  const inChat = messages.length > 0 || typing;

  const selectedCapMeta = useMemo(
    () => CAPABILITIES.find((c) => c.type === selectedCapability) || null,
    [selectedCapability]
  );

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
      setSelectedCapability(null);
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
    setSelectedCapability(null);
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
    art: ArtifactPayload,
    source: string,
    sid?: string | null
  ): ArtifactItem => {
    const targetSession = sid || sessionId;
    const existing = artifacts.find(
      (a) => a.title === art.title && a.sessionId === targetSession
    );
    if (existing) return existing;
    const next: ArtifactItem = {
      id: uid('a'),
      title: art.title,
      type: art.type,
      source,
      createdAt: '刚刚',
      summary: art.summary,
      sessionId: targetSession || undefined,
      format: art.format,
      url: art.url,
      content: art.content,
    };
    setArtifacts((prev) => {
      if (prev.some((a) => a.title === art.title && a.sessionId === targetSession)) {
        return prev;
      }
      return [next, ...prev];
    });
    return next;
  };

  const openArtifactPreview = (art: ArtifactItem | ArtifactPayload, source?: string) => {
    const item =
      'id' in art
        ? (art as ArtifactItem)
        : ensureArtifact(art, source || activeSession?.title || '当前会话', sessionId);
    setPreviewArtifact(item);
  };

  const selectCapability = (type: CapabilityType) => {
    setSelectedCapability(type);
    setMention(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const clearCapability = () => setSelectedCapability(null);

  const removeMention = (id: string) => {
    setPendingMentions((prev) => prev.filter((x) => x.id !== id));
  };

  const removeLastChip = () => {
    if (pendingFiles.length > 0) {
      setPendingFiles((prev) => prev.slice(0, -1));
      return true;
    }
    if (pendingMentions.length > 0) {
      setPendingMentions((prev) => prev.slice(0, -1));
      return true;
    }
    if (selectedCapability) {
      setSelectedCapability(null);
      return true;
    }
    return false;
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

  /** @报表选中后以输入框内 chip 展示，不在文本中残留 @名 */
  const applyMention = (report: CustomReportItem) => {
    if (!mention) return;
    const el = textareaRef.current;
    const cursor = el?.selectionStart ?? input.length;
    const before = input.slice(0, mention.start);
    const after = input.slice(cursor);
    const next = `${before}${after}`.replace(/\s{2,}/g, ' ');
    setInput(next.trimStart());
    setPendingMentions((prev) =>
      prev.some((m) => m.id === report.id) ? prev : [...prev, report]
    );
    setMention(null);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const pos = before.length;
        textareaRef.current.setSelectionRange(pos, pos);
      }
    });
  };

  const sendMessage = async (raw?: string, forceSessionId?: string) => {
    const content = (raw ?? input).trim();
    if (
      (!content &&
        pendingFiles.length === 0 &&
        pendingMentions.length === 0 &&
        !selectedCapability) ||
      typing
    ) {
      return;
    }

    let sid = forceSessionId || sessionId;
    const capLabel = selectedCapMeta?.name;
    const mentionHint =
      pendingMentions.length > 0
        ? `（引用定制报表：${pendingMentions.map((m) => m.name).join('、')}）`
        : '';
    const displayText =
      content ||
      (pendingMentions.length
        ? `请基于引用的定制报表进行分析${mentionHint}`
        : selectedCapability
          ? scriptByType(selectedCapability).userSeed
          : `已上传 ${pendingFiles.length} 个附件，请结合附件分析。`);

    if (!sid) {
      sid = uid('s');
      setSessions((prev) => [
        {
          id: sid!,
          title: displayText.slice(0, 18),
          type: selectedCapability || 'query',
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
    const usedCap = selectedCapability;

    setInput('');
    setPendingMentions([]);
    setSelectedCapability(null);
    setMention(null);
    setMessages((prev) => [
      ...prev,
      {
        id: uid('m'),
        role: 'user',
        text: displayText,
        attachments: uploaded.length ? uploaded : undefined,
        mentions: usedMentions.length ? usedMentions : undefined,
        capability: usedCap || undefined,
      },
    ]);
    setTyping(true);

    try {
      const promptParts = [displayText];
      if (capLabel) promptParts.push(`[服务能力] ${capLabel}`);
      if (usedMentions.length > 0) {
        promptParts.push(
          `[定制报表上下文]\n${usedMentions
            .map((m) => `- ${m.name}（${m.category}）：${m.description}`)
            .join('\n')}`
        );
      }
      const { script, reply } = await respond(promptParts.join('\n\n'));
      setMessages((prev) => [...prev, { id: uid('m'), role: 'assistant', reply }]);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sid
            ? {
                ...s,
                title: script.title,
                type: usedCap || script.type,
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
        const item = ensureArtifact(
          {
            ...last.reply.artifact,
            type: action.artifactType || last.reply.artifact.type,
          },
          activeSession?.title || '当前会话',
          sessionId
        );
        openArtifactPreview(item);
        message.success('已写入本会话产物，可预览');
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

    if (e.key === 'Backspace') {
      const el = e.currentTarget;
      const atStart = (el.selectionStart ?? 0) === 0 && (el.selectionEnd ?? 0) === 0;
      if (atStart && !input) {
        if (removeLastChip()) {
          e.preventDefault();
          return;
        }
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const downloadMd = (art: ArtifactItem) => {
    const blob = new Blob([art.content || art.summary], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = art.title.endsWith('.md') ? art.title : `${art.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadXlsxStub = (art: ArtifactItem) => {
    const csv = `指标,数值\n标题,${art.title}\n摘要,${art.summary}\n来源,${art.source}\n`;
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = art.title.replace(/\.xlsx$/i, '') + '.csv';
    a.click();
    URL.revokeObjectURL(url);
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
            openArtifactPreview(reply.artifact!, activeSession?.title || '当前会话')
          }
        >
          <Text style={{ color: 'var(--ai-ink)', fontSize: 12 }}>
            {FORMAT_ICON[reply.artifact.format || ''] || null}{' '}
            {reply.artifact.format
              ? FORMAT_LABEL[reply.artifact.format]
              : reply.artifact.type}
            <span style={{ marginLeft: 6, color: 'var(--ai-muted, #8b919a)' }}>点击预览</span>
          </Text>
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

  const hasInlineChips =
    !!selectedCapability || pendingMentions.length > 0 || pendingFiles.length > 0;

  const composerBox = (
    <div className="ai-wb-composer">
      {hasInlineChips && (
        <div className="ai-wb-composer-chips">
          {selectedCapability && selectedCapMeta && (
            <span className="ai-wb-inline-chip capability">
              {CAP_ICONS[selectedCapability]}
              <span>{selectedCapMeta.name}</span>
              <button
                type="button"
                className="ai-wb-inline-chip-x"
                aria-label="移除服务"
                onClick={clearCapability}
              >
                ×
              </button>
            </span>
          )}
          {pendingMentions.map((m) => (
            <span className="ai-wb-inline-chip mention" key={m.id}>
              <LinkOutlined />
              <span>{m.name}</span>
              <button
                type="button"
                className="ai-wb-inline-chip-x"
                aria-label="移除报表"
                onClick={() => removeMention(m.id)}
              >
                ×
              </button>
            </span>
          ))}
          {pendingFiles.map((f) => (
            <span className="ai-wb-inline-chip file" key={f.uid}>
              <PaperClipOutlined />
              <span>{f.name}</span>
              <button
                type="button"
                className="ai-wb-inline-chip-x"
                aria-label="移除附件"
                onClick={() =>
                  setPendingFiles((prev) => prev.filter((x) => x.uid !== f.uid))
                }
              >
                ×
              </button>
            </span>
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
          placeholder={
            selectedCapability
              ? '输入问题，或点击上方提示词…'
              : '今天想了解什么？输入 @ 引用专属定制报表…'
          }
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
            (!input.trim() &&
              pendingFiles.length === 0 &&
              pendingMentions.length === 0 &&
              !selectedCapability)
          }
          onClick={() => sendMessage()}
          title="发送"
        >
          <SendOutlined />
        </button>
      </div>
    </div>
  );

  const skillRow = (
    <div className={`ai-wb-skills ${inChat ? 'in-chat' : ''}`}>
      {!selectedCapability &&
        CAPABILITIES.map((c) => (
          <button
            key={c.type}
            type="button"
            className="ai-wb-skill"
            onClick={() => selectCapability(c.type)}
          >
            {CAP_ICONS[c.type]}
            {c.name}
          </button>
        ))}
    </div>
  );

  const suggestionRow =
    selectedCapability && selectedCapMeta ? (
      <div className="ai-wb-prompt-suggestions">
        {selectedCapMeta.suggestions.map((s) => (
          <button
            key={s}
            type="button"
            className="ai-wb-prompt-chip"
            onClick={() => {
              setInput(s);
              requestAnimationFrame(() => textareaRef.current?.focus());
            }}
          >
            {s}
            <span className="ai-wb-prompt-arrow">↘</span>
          </button>
        ))}
      </div>
    ) : null;

  const previewModal = (
    <Modal
      open={!!previewArtifact}
      title={previewArtifact?.title}
      onCancel={() => setPreviewArtifact(null)}
      width={previewArtifact?.format === 'html' ? '90vw' : 720}
      style={{ top: 24 }}
      styles={{ body: { padding: 0, height: previewArtifact?.format === 'html' ? '75vh' : 'auto' } }}
      footer={
        previewArtifact?.format === 'md' ? (
          <Button
            icon={<DownloadOutlined />}
            onClick={() => previewArtifact && downloadMd(previewArtifact)}
          >
            下载 Markdown
          </Button>
        ) : previewArtifact?.format === 'xlsx' ? (
          <Button
            icon={<DownloadOutlined />}
            onClick={() => previewArtifact && downloadXlsxStub(previewArtifact)}
          >
            下载 CSV（模拟 Excel）
          </Button>
        ) : previewArtifact?.format === 'html' && previewArtifact.url ? (
          <Button
            type="primary"
            href={previewArtifact.url}
            target="_blank"
            rel="noreferrer"
          >
            新窗口打开
          </Button>
        ) : null
      }
      destroyOnClose
    >
      {previewArtifact?.format === 'html' && previewArtifact.url ? (
        <iframe
          title={previewArtifact.title}
          src={previewArtifact.url}
          style={{ width: '100%', height: '75vh', border: 'none' }}
        />
      ) : previewArtifact?.format === 'md' ? (
        <div
          className="ai-wb-md-preview"
          dangerouslySetInnerHTML={{
            __html: renderMdPreview(previewArtifact.content || previewArtifact.summary),
          }}
        />
      ) : previewArtifact?.format === 'xlsx' ? (
        <div style={{ padding: 24 }}>
          <Paragraph>
            <FileExcelOutlined style={{ color: '#217346', marginRight: 8 }} />
            Excel 产物：{previewArtifact.title}
          </Paragraph>
          <Paragraph type="secondary">{previewArtifact.summary}</Paragraph>
          <Paragraph type="secondary" style={{ fontSize: 12 }}>
            当前为模拟产物，可下载 CSV 样例查看字段结构。
          </Paragraph>
        </div>
      ) : (
        <div style={{ padding: 24 }}>
          <Paragraph>{previewArtifact?.summary}</Paragraph>
        </div>
      )}
    </Modal>
  );

  if (!inChat) {
    return (
      <div className="ai-wb-main-scroll">
        <div className="ai-wb-hero">
          <h1 className="ai-wb-brand">{AGENT_NAME}</h1>
          {skillRow}
          {suggestionRow}
          <div className="ai-wb-composer-wrap">{composerBox}</div>
        </div>
        {previewModal}
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
                  {(m.capability || (m.mentions && m.mentions.length > 0)) && (
                    <div className="ai-wb-msg-files">
                      {m.capability && (
                        <Tag color="default" icon={CAP_ICONS[m.capability]}>
                          {CAPABILITIES.find((c) => c.type === m.capability)?.name}
                        </Tag>
                      )}
                      {m.mentions?.map((r) => (
                        <Tag key={r.id} icon={<LinkOutlined />}>
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
          onOpenArtifact={(item) => openArtifactPreview(item)}
        />
      </aside>
      {previewModal}
    </div>
  );
};

export default AiWorkbench;
