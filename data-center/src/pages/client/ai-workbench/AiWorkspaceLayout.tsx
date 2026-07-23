import React from 'react';
import { Outlet } from 'react-router-dom';
import AiSideNav from './AiSideNav';
import { AiSessionProvider, SessionListSlot, useAiSession } from './AiSessionContext';
import './aiWorkbench.css';

const AiWorkspaceShell: React.FC = () => {
  const { newSession } = useAiSession();

  return (
    <div className="ai-wb">
      <AiSideNav sessionSlot={<SessionListSlot />} onNewChat={newSession} />
      <main className="ai-wb-main">
        <Outlet />
      </main>
    </div>
  );
};

/** AI 工作台统一布局：侧栏菜单 + 常驻会话记录 */
const AiWorkspaceLayout: React.FC = () => {
  return (
    <AiSessionProvider>
      <AiWorkspaceShell />
    </AiSessionProvider>
  );
};

export default AiWorkspaceLayout;
