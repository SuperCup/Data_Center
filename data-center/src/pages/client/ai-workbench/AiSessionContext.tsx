import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { INITIAL_SESSIONS, SessionItem } from '../../../services/aiMock';

interface AiSessionContextValue {
  sessions: SessionItem[];
  setSessions: React.Dispatch<React.SetStateAction<SessionItem[]>>;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  typingSessionId: string | null;
  setTypingSessionId: (id: string | null) => void;
  /** 打开某会话并进入对话页 */
  openSession: (id: string) => void;
  newSession: () => void;
}

const AiSessionContext = createContext<AiSessionContextValue | null>(null);

export function AiSessionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [typingSessionId, setTypingSessionId] = useState<string | null>(null);

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

  const value = useMemo(
    () => ({
      sessions,
      setSessions,
      activeSessionId,
      setActiveSessionId,
      typingSessionId,
      setTypingSessionId,
      openSession,
      newSession,
    }),
    [sessions, activeSessionId, typingSessionId, openSession, newSession]
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

/** 侧栏常驻会话记录列表 */
export function SessionListSlot() {
  const { sessions, activeSessionId, typingSessionId, openSession } = useAiSession();

  return (
    <>
      <div className="ai-wb-task-hd">
        <span>会话记录 ({sessions.length})</span>
      </div>
      <div className="ai-wb-task-list">
        {sessions.map((s) => {
          const loading = typingSessionId === s.id;
          return (
            <div
              key={s.id}
              className={`ai-wb-task-item ${activeSessionId === s.id ? 'active' : ''}`}
              onClick={() => !loading && openSession(s.id)}
              title={s.title}
            >
              <span className="ai-wb-task-title">{s.title}</span>
              {loading ? (
                <Spin size="small" className="ai-wb-session-spin" />
              ) : (
                <span className="ai-wb-task-time">
                  {s.updatedAt.replace('今天 ', '').replace('昨天 ', '昨')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
