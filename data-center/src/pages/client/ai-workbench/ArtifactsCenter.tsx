import React, { useMemo, useState } from 'react';
import { Card, Col, Empty, Row, Segmented, Space, Tag, Typography } from 'antd';
import { INITIAL_ARTIFACTS, ArtifactItem } from '../../../services/aiMock';
import './aiWorkbench.css';

const { Text, Paragraph, Title } = Typography;

const ArtifactsCenter: React.FC = () => {
  const [list] = useState<ArtifactItem[]>(INITIAL_ARTIFACTS);
  const [filter, setFilter] = useState<string>('全部');

  const filtered = useMemo(
    () => list.filter((a) => filter === '全部' || a.type === filter),
    [list, filter]
  );

  return (
      <div className="ai-wb-page">
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
            <Title level={4} style={{ margin: 0 }}>
              产物仓库
            </Title>
            <Text type="secondary">Agent 生成的报告、建议卡、图表卡与导出文件</Text>
        </div>
        <Segmented
          value={filter}
          onChange={(v) => setFilter(String(v))}
          options={['全部', '报告', '建议卡', '图表卡', '导出文件']}
        />
      </Space>

      {filtered.length === 0 ? (
        <Empty description="暂无产出物" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((a) => (
            <Col xs={24} sm={12} lg={8} key={a.id}>
              <Card size="small" hoverable title={a.title} extra={<Tag color="blue">{a.type}</Tag>}>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                  {a.summary}
                </Paragraph>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  来自「{a.source}」 · {a.createdAt}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      </div>
  );
};

export default ArtifactsCenter;
