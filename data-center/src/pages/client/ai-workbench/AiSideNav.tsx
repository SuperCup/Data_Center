import React from 'react';
import {
  PlusOutlined,
  BookOutlined,
  BulbOutlined,
  FileTextOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import './aiWorkbench.css';

export type AiNavKey = 'chat' | 'knowledge' | 'memory' | 'artifacts' | 'attachments';

interface Props {
  sessionSlot?: React.ReactNode;
  onNewChat?: () => void;
}

const AiSideNav: React.FC<Props> = ({ sessionSlot, onNewChat }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname.replace(/\/$/, '');
  const active: AiNavKey =
    path.endsWith('/knowledge')
      ? 'knowledge'
      : path.endsWith('/memory')
        ? 'memory'
        : path.endsWith('/artifacts')
          ? 'artifacts'
          : path.endsWith('/attachments')
            ? 'attachments'
            : 'chat';

  return (
    <aside className="ai-wb-sider">
      <div className="ai-wb-sider-top">
        <button
          type="button"
          className="ai-wb-nav-btn"
          onClick={() => onNewChat?.()}
        >
          <PlusOutlined />
          <span className="ai-wb-nav-label">新建会话</span>
        </button>
        <button
          type="button"
          className={`ai-wb-nav-btn ${active === 'knowledge' ? 'active' : ''}`}
          onClick={() => navigate('/client/ai/knowledge')}
        >
          <BookOutlined />
          <span className="ai-wb-nav-label">品牌知识库</span>
        </button>
        <button
          type="button"
          className={`ai-wb-nav-btn ${active === 'memory' ? 'active' : ''}`}
          onClick={() => navigate('/client/ai/memory')}
        >
          <BulbOutlined />
          <span className="ai-wb-nav-label">记忆管理</span>
        </button>
        <button
          type="button"
          className={`ai-wb-nav-btn ${active === 'artifacts' ? 'active' : ''}`}
          onClick={() => navigate('/client/ai/artifacts')}
        >
          <FileTextOutlined />
          <span className="ai-wb-nav-label">产物仓库</span>
        </button>
        <button
          type="button"
          className={`ai-wb-nav-btn ${active === 'attachments' ? 'active' : ''}`}
          onClick={() => navigate('/client/ai/attachments')}
        >
          <PaperClipOutlined />
          <span className="ai-wb-nav-label">附件仓库</span>
        </button>
      </div>

      {sessionSlot}
    </aside>
  );
};

export default AiSideNav;
