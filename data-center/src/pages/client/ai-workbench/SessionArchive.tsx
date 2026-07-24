import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Empty, Input, Popconfirm, Row, Space, Tag, Typography } from 'antd';
import { DeleteOutlined, RollbackOutlined } from '@ant-design/icons';
import { TYPE_LABEL } from '../../../services/aiMock';
import { useAiSession } from './AiSessionContext';
import './aiWorkbench.css';

const { Text, Paragraph, Title } = Typography;

/** 会话归档：查看、搜索、恢复或删除已归档会话 */
const SessionArchive: React.FC = () => {
  const { archivedSessions, restoreSession, removeSession, openSession } = useAiSession();
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return archivedSessions;
    return archivedSessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.preview.toLowerCase().includes(q) ||
        TYPE_LABEL[s.type].includes(keyword.trim())
    );
  }, [archivedSessions, keyword]);

  return (
    <div className="ai-wb-page">
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            会话归档
          </Title>
          <Text type="secondary">
            已归档会话不影响侧栏列表；可搜索、恢复或永久删除（共 {archivedSessions.length} 条）
          </Text>
        </div>
        <Input.Search
          allowClear
          placeholder="搜索归档会话标题 / 摘要"
          style={{ width: 280 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Space>

      {filtered.length === 0 ? (
        <Empty description={keyword ? '无匹配的归档会话' : '暂无归档会话'} />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((s) => (
            <Col xs={24} sm={12} lg={8} key={s.id}>
              <Card
                size="small"
                className="ai-wb-archive-card"
                hoverable
                title={s.title}
                extra={<Tag>{TYPE_LABEL[s.type]}</Tag>}
                actions={[
                  <Button
                    key="open"
                    type="link"
                    size="small"
                    onClick={() => {
                      restoreSession(s.id);
                      openSession(s.id);
                    }}
                  >
                    打开
                  </Button>,
                  <Button
                    key="restore"
                    type="link"
                    size="small"
                    icon={<RollbackOutlined />}
                    onClick={() => restoreSession(s.id)}
                  >
                    恢复
                  </Button>,
                  <Popconfirm
                    key="del"
                    title="确定永久删除该归档会话？"
                    onConfirm={() => removeSession(s.id)}
                    okText="删除"
                    cancelText="取消"
                  >
                    <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                  {s.preview}
                </Paragraph>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  归档于 {s.archivedAt || s.updatedAt}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SessionArchive;
