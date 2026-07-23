import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Outlet } from 'react-router-dom';
import AiSideNav from './AiSideNav';
import { AiSessionProvider, SessionListSlot, useAiSession } from './AiSessionContext';
import './aiWorkbench.css';

/** AI 工作台统一主色：近黑墨色，与侧栏 / 发送按钮一致 */
export const AI_THEME = {
  token: {
    colorPrimary: '#111827',
    colorInfo: '#111827',
    colorLink: '#111827',
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
};

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

/** AI 工作台统一布局：侧栏菜单 + 常驻会话记录 + 主题色 */
const AiWorkspaceLayout: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN} theme={AI_THEME}>
      <AiSessionProvider>
        <AiWorkspaceShell />
      </AiSessionProvider>
    </ConfigProvider>
  );
};

export default AiWorkspaceLayout;
