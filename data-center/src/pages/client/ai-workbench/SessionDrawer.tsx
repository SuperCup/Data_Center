import React from 'react';
import { Drawer, Input, List, Tag, Button, Empty, Typography, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  SessionItem,
  CapabilityType,
  TYPE_LABEL,
  TYPE_COLOR,
} from '../../../services/aiMock';

const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  sessions: SessionItem[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const SessionDrawer: React.FC<Props> = ({
  open,
  onClose,
  sessions,
  activeId,
  onSelect,
  onCreate,
}) => {
  const [keyword, setKeyword] = React.useState('');

  const grouped = React.useMemo(() => {
    const order: CapabilityType[] = [
      'query',
      'diagnose',
      'analyze',
      'action',
      'opportunity',
      'report',
    ];
    const q = keyword.trim();
    return order
      .map((type) => ({
        type,
        items: sessions.filter(
          (s) =>
            s.type === type &&
            (!q || s.title.includes(q) || s.preview.includes(q))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [sessions, keyword]);

  return (
    <Drawer
      title="会话记录"
      placement="left"
      width={320}
      open={open}
      onClose={onClose}
      styles={{ body: { padding: '12px 16px' } }}
      extra={
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onCreate}>
          新建
        </Button>
      }
    >
      <Input
        allowClear
        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
        placeholder="搜索会话"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      {grouped.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无会话" />
      ) : (
        grouped.map((g) => (
          <div key={g.type} style={{ marginBottom: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {TYPE_LABEL[g.type]}
            </Text>
            <List
              size="small"
              dataSource={g.items}
              style={{ marginTop: 6 }}
              renderItem={(item) => (
                <List.Item
                  onClick={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 8,
                    padding: '10px 12px',
                    marginBottom: 4,
                    background: item.id === activeId ? '#e6f7ff' : undefined,
                    border: item.id === activeId ? '1px solid #91d5ff' : '1px solid transparent',
                  }}
                >
                  <Space direction="vertical" size={2} style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text ellipsis style={{ maxWidth: 180, fontWeight: 500 }}>
                        {item.title}
                      </Text>
                      <Tag color={TYPE_COLOR[item.type]} style={{ margin: 0 }}>
                        {TYPE_LABEL[item.type]}
                      </Tag>
                    </Space>
                    <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
                      {item.updatedAt} · {item.preview}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>
        ))
      )}
    </Drawer>
  );
};

export default SessionDrawer;
