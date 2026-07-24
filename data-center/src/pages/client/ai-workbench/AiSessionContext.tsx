import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  Empty,
  Input,
  Modal,
  Spin,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  MoreOutlined,
  PushpinFilled,
  PushpinOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { INITIAL_SESSIONS, SessionItem } from '../../../services/aiMock';

interface AiSessionContextValue {
  sessions: SessionItem[];
  setSessions: React.Dispatch<React.SetStateAction<SessionItem[]>>;
  activeSessions: SessionItem[];
  archivedSessions: SessionItem[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  typingSessionId: string | null;
  setTypingSessionId: (id: string | null) => void;
  openSession: (id: string) => void;
  newSession: () => void;
  archiveSession: (id: string) => void;
  restoreSession: (id: string) => void;
  removeSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  togglePinSession: (id: string) => void;
}

const AiSessionContext = createContext<AiSessionContextValue | null>(null);

function sortActiveSessions(list: SessionItem[]) {
  return [...list].sort((a, b) => {
    const pinDiff = Number(!!b.pinned) - Number(!!a.pinned);
    if (pinDiff !== 0) return pinDiff;
    return 0;
  });
}

export function AiSessionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [typingSessionId, setTypingSessionId] = useState<string | null>(null);

  const activeSessions = useMemo(
    () => sortActiveSessions(sessions.filter((s) => !s.archived)),
    [sessions]
  );
  const archivedSessions = useMemo(
    () => sessions.filter((s) => !!s.archived),
    [sessions]
  );

  const openSession = useCallback(
    (id: string) => {
      setActiveSessionId(id);
      navigate('/client/ai', { state: { openSessionId: id } });
    },
    [navigate]
  );

  const newSession = useCallback(() => {
    setActiveSessionId(null);
    setTypingSessionId(null);
    navigate('/client/ai', { state: { resetChat: true } });
  }, [navigate]);

  const archiveSession = useCallback(
    (id: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                archived: true,
                archivedAt: '刚刚',
                updatedAt: '刚刚',
                pinned: false,
              }
            : s
        )
      );
      if (activeSessionId === id) {
        setActiveSessionId(null);
        navigate('/client/ai', { state: { resetChat: true } });
      }
      message.success('会话已归档');
    },
    [activeSessionId, navigate]
  );

  const restoreSession = useCallback((id: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, archived: false, archivedAt: undefined, updatedAt: '刚刚' }
          : s
      )
    );
    message.success('已恢复到会话记录');
  }, []);

  const removeSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        setActiveSessionId(null);
        navigate('/client/ai', { state: { resetChat: true } });
      }
      message.success('会话已删除');
    },
    [activeSessionId, navigate]
  );

  const renameSession = useCallback((id: string, title: string) => {
    const next = title.trim();
    if (!next) {
      message.warning('会话名称不能为空');
      return;
    }
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: next, updatedAt: '刚刚' } : s))
    );
    message.success('已重命名');
  }, []);

  const togglePinSession = useCallback((id: string) => {
    setSessions((prev) => {
      const target = prev.find((s) => s.id === id);
      const willPin = !target?.pinned;
      message.success(willPin ? '已置顶' : '已取消置顶');
      return prev.map((s) => (s.id === id ? { ...s, pinned: willPin } : s));
    });
  }, []);

  const value = useMemo(
    () => ({
      sessions,
      setSessions,
      activeSessions,
      archivedSessions,
      activeSessionId,
      setActiveSessionId,
      typingSessionId,
      setTypingSessionId,
      openSession,
      newSession,
      archiveSession,
      restoreSession,
      removeSession,
      renameSession,
      togglePinSession,
    }),
    [
      sessions,
      activeSessions,
      archivedSessions,
      activeSessionId,
      typingSessionId,
      openSession,
      newSession,
      archiveSession,
      restoreSession,
      removeSession,
      renameSession,
      togglePinSession,
    ]
  );

  return <AiSessionContext.Provider value={value}>{children}</AiSessionContext.Provider>;
}

export function useAiSession() {
  const ctx = useContext(AiSessionContext);
  if (!ctx) {
    throw new Error('useAiSession must be used within AiSessionProvider');
  }
  return ctx;
}

/** 侧栏常驻会话记录列表（不含已归档） */
export function SessionListSlot() {
  const {
    activeSessions,
    activeSessionId,
    typingSessionId,
    openSession,
    archiveSession,
    removeSession,
    renameSession,
    togglePinSession,
  } = useAiSession();
  const [keyword, setKeyword] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return activeSessions;
    return activeSessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.preview.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
    );
  }, [activeSessions, keyword]);

  const openRename = (s: SessionItem) => {
    setRenameId(s.id);
    setRenameValue(s.title);
  };

  const submitRename = () => {
    if (!renameId) return;
    renameSession(renameId, renameValue);
    setRenameId(null);
    setRenameValue('');
  };

  return (
    <>
      <div className="ai-wb-task-hd">
        <span>会话记录 ({activeSessions.length})</span>
      </div>
      <div className="ai-wb-task-search">
        <Input.Search
          allowClear
          size="small"
          placeholder="搜索会话"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="ai-wb-task-list">
        {filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={keyword ? '无匹配会话' : '暂无会话'}
            style={{ marginTop: 24 }}
          />
        ) : (
          filtered.map((s) => {
            const loading = typingSessionId === s.id;
            return (
              <div
                key={s.id}
                className={`ai-wb-task-item ${activeSessionId === s.id ? 'active' : ''} ${
                  s.pinned ? 'pinned' : ''
                }`}
                onClick={() => !loading && openSession(s.id)}
                title={s.title}
              >
                {s.pinned && <PushpinFilled className="ai-wb-task-pin" />}
                <span className="ai-wb-task-title">{s.title}</span>
                {loading ? (
                  <Spin size="small" className="ai-wb-session-spin" />
                ) : (
                  <>
                    <span className="ai-wb-task-time">
                      {s.updatedAt.replace('今天 ', '').replace('昨天 ', '昨')}
                    </span>
                    <Dropdown
                      trigger={['click']}
                      menu={{
                        items: [
                          {
                            key: 'pin',
                            icon: s.pinned ? <PushpinFilled /> : <PushpinOutlined />,
                            label: s.pinned ? '取消置顶' : '置顶',
                            onClick: ({ domEvent }) => {
                              domEvent.stopPropagation();
                              togglePinSession(s.id);
                            },
                          },
                          {
                            key: 'rename',
                            icon: <EditOutlined />,
                            label: '重命名',
                            onClick: ({ domEvent }) => {
                              domEvent.stopPropagation();
                              openRename(s);
                            },
                          },
                          {
                            key: 'archive',
                            icon: <InboxOutlined />,
                            label: '归档',
                            onClick: ({ domEvent }) => {
                              domEvent.stopPropagation();
                              archiveSession(s.id);
                            },
                          },
                          { type: 'divider' },
                          {
                            key: 'delete',
                            icon: <DeleteOutlined />,
                            label: '删除',
                            danger: true,
                            onClick: ({ domEvent }) => {
                              domEvent.stopPropagation();
                              Modal.confirm({
                                title: '删除会话',
                                content: `确定删除「${s.title}」？删除后不可恢复。`,
                                okText: '删除',
                                okType: 'danger',
                                cancelText: '取消',
                                onOk: () => removeSession(s.id),
                              });
                            },
                          },
                        ],
                      }}
                    >
                      <Button
                        type="text"
                        size="small"
                        className="ai-wb-task-more-btn"
                        icon={<MoreOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Dropdown>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal
        title="重命名会话"
        open={!!renameId}
        onCancel={() => {
          setRenameId(null);
          setRenameValue('');
        }}
        onOk={submitRename}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Input
          autoFocus
          maxLength={40}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onPressEnter={submitRename}
          placeholder="请输入会话名称"
        />
      </Modal>
    </>
  );
}
