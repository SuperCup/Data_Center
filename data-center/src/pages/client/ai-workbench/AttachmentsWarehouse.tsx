import React, { useMemo, useState } from 'react';
import { Card, Col, Empty, Row, Space, Tag, Typography, Input } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { INITIAL_ATTACHMENTS, AttachmentItem } from '../../../services/aiMock';
import './aiWorkbench.css';

const { Text, Title } = Typography;

const AttachmentsWarehouse: React.FC = () => {
  const [list] = useState<AttachmentItem[]>(INITIAL_ATTACHMENTS);
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(
    () =>
      list.filter(
        (f) =>
          !keyword ||
          f.name.includes(keyword) ||
          (f.sessionTitle && f.sessionTitle.includes(keyword))
      ),
    [list, keyword]
  );

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
            placeholder="搜索附件或会话"
            style={{ width: 260 }}
            onSearch={setKeyword}
            onChange={(e) => !e.target.value && setKeyword('')}
          />
        </Space>

        {filtered.length === 0 ? (
          <Empty description="暂无附件" />
        ) : (
          <Row gutter={[16, 16]}>
            {filtered.map((f) => (
              <Col xs={24} sm={12} lg={8} key={f.id}>
                <Card size="small" hoverable>
                  <Space align="start">
                    <PaperClipOutlined style={{ fontSize: 22, color: '#1890ff', marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 560 }}>{f.name}</div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {f.size} · {f.createdAt}
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        <Tag>{f.mime.toUpperCase()}</Tag>
                        {f.sessionTitle && <Tag color="blue">{f.sessionTitle}</Tag>}
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
