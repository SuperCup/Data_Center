import React, { useMemo, useState } from 'react';
import { Card, Col, Empty, Row, Space, Tag, Typography, Input } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { INITIAL_ATTACHMENTS, AttachmentItem } from '../../../services/aiMock';
import './aiWorkbench.css';

const { Text, Title } = Typography;

const AttachmentsWarehouse: React.FC = () => {
  const [list] = useState<AttachmentItem[]>(INITIAL_ATTACHMENTS);
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.sessionTitle && f.sessionTitle.toLowerCase().includes(q)) ||
        f.mime.toLowerCase().includes(q)
    );
  }, [list, keyword]);

  return (
    <div className="ai-wb-page">
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            附件仓库
          </Title>
          <Text type="secondary">各会话上传的文件汇总；也可在会话内管理本会话附件</Text>
        </div>
        <Input.Search
          allowClear
          placeholder="搜索附件名 / 会话 / 类型"
          style={{ width: 280 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </Space>

      {filtered.length === 0 ? (
        <Empty description={keyword ? '无匹配附件' : '暂无附件'} />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((f) => (
            <Col xs={24} sm={12} lg={8} key={f.id}>
              <Card size="small" hoverable>
                <Space align="start">
                  <PaperClipOutlined className="ai-wb-icon-accent" style={{ fontSize: 22, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{f.name}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {f.size} · {f.createdAt}
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <Tag>{f.mime.toUpperCase()}</Tag>
                      {f.sessionTitle && <Tag>{f.sessionTitle}</Tag>}
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AttachmentsWarehouse;
