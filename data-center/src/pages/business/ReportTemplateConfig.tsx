import React from 'react';
import { Card, Tabs, List, Tag, Button, Space } from 'antd';
import { FileTextOutlined, EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const ReportTemplateConfig: React.FC = () => {
  // 模拟数据
  const standardReports = [
    {
      id: 1,
      title: '活动整体数据',
      description: '展示活动的整体数据，包括覆盖人群、优惠券发放/核销量、预算消耗等',
      tags: ['标准', '通用'],
    },
    {
      id: 2,
      title: '单活动效果',
      description: '单个活动的详细数据，包括发券量、领券量、核销率、ROI等',
      tags: ['标准', '活动'],
    },
    {
      id: 3,
      title: '机制效果对比',
      description: '对比不同玩法（满减券、折扣券、团购等）的表现',
      tags: ['标准', '对比'],
    },
    {
      id: 4,
      title: '预算消耗',
      description: '预算使用情况，包括总预算、已用预算、剩余预算等',
      tags: ['标准', '预算'],
    },
    {
      id: 5,
      title: '渠道贡献度',
      description: '各渠道投放效果对比，包括券核销、转化率、成本等',
      tags: ['标准', '渠道'],
    },
  ];

  const customReports = [
    {
      id: 101,
      title: '食品行业活动效果分析',
      description: '针对食品行业的活动效果分析，包括产品销量、复购率等',
      tags: ['定制', '食品行业'],
      client: '好吃食品有限公司',
    },
    {
      id: 102,
      title: '服装行业用户画像',
      description: '针对服装行业的用户画像分析，包括年龄、性别、消费能力等',
      tags: ['定制', '服装行业'],
      client: '时尚服饰集团',
    },
  ];

  return (
    <div>
      <Card title="报表模板配置">
        <Tabs defaultActiveKey="1">
          <TabPane tab="标准报表" key="1">
            <List
              itemLayout="horizontal"
              dataSource={standardReports}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button icon={<EditOutlined />} type="link">编辑</Button>,
                    <Button icon={<CopyOutlined />} type="link">复制</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                    title={item.title}
                    description={item.description}
                  />
                  <Space>
                    {item.tags.map(tag => (
                      <Tag color="blue" key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </List.Item>
              )}
            />
            <Button type="primary" style={{ marginTop: 16 }}>添加标准报表</Button>
          </TabPane>
          <TabPane tab="定制报表" key="2">
            <List
              itemLayout="horizontal"
              dataSource={customReports}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button icon={<EditOutlined />} type="link">编辑</Button>,
                    <Button icon={<CopyOutlined />} type="link">复制</Button>,
                    <Button icon={<DeleteOutlined />} type="link" danger>删除</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                    title={
                      <span>
                        {item.title}
                        <Tag color="green" style={{ marginLeft: 8 }}>
                          {item.client}
                        </Tag>
                      </span>
                    }
                    description={item.description}
                  />
                  <Space>
                    {item.tags.map(tag => (
                      <Tag color="purple" key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </List.Item>
              )}
            />
            <Button type="primary" style={{ marginTop: 16 }}>添加定制报表</Button>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ReportTemplateConfig;