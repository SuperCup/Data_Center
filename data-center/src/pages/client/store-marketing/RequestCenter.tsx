import React from 'react';
import { Table, Button, Space, Input, Form, Modal, Card, Tag, Typography, Tabs } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;

const RequestCenter: React.FC = () => {
  // 模拟我的需求数据
  const myRequests = [
    {
      id: 1,
      title: '自定义渠道分析报表',
      description: '需要针对我们的特定渠道进行更详细的分析，包括用户留存率、付费转化率等指标',
      submitTime: '2023-10-10 10:30:22',
      status: 'pending',
    },
    {
      id: 2,
      title: '活动效果归因分析',
      description: '希望能够针对多渠道投放的活动，分析各渠道的贡献度和ROI',
      submitTime: '2023-10-08 14:15:43',
      status: 'in_progress',
    },
    {
      id: 3,
      title: '用户生命周期价值预测',
      description: '需要基于历史数据预测用户的生命周期价值，帮助我们优化获客策略',
      submitTime: '2023-10-05 09:22:10',
      status: 'completed',
    },
  ];

  // 模拟模板需求数据
  const templateRequests = [
    {
      id: 1,
      title: '用户留存分析',
      description: '分析用户在不同时间段的留存率，包括次日留存、7日留存、30日留存等',
      category: '用户分析',
      popularity: 98,
    },
    {
      id: 2,
      title: '渠道ROI分析',
      description: '分析各投放渠道的投资回报率，帮助优化渠道投放策略',
      category: '渠道分析',
      popularity: 95,
    },
    {
      id: 3,
      title: '用户生命周期价值分析',
      description: '分析用户在整个生命周期内的价值，帮助制定用户运营策略',
      category: '用户分析',
      popularity: 92,
    },
    {
      id: 4,
      title: '活动效果分析',
      description: '分析营销活动的效果，包括参与率、转化率、ROI等指标',
      category: '活动分析',
      popularity: 90,
    },
  ];

  // 状态标签颜色映射
  const statusColors: Record<string, string> = {
    pending: 'orange',
    in_progress: 'blue',
    completed: 'green',
    rejected: 'red',
  };

  // 状态文本映射
  const statusText: Record<string, string> = {
    pending: '待处理',
    in_progress: '处理中',
    completed: '已完成',
    rejected: '已拒绝',
  };

  // 我的需求表格列配置
  const myRequestColumns = [
    {
      title: '需求ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>
          {statusText[status]}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />}>查看详情</Button>
        </Space>
      ),
    },
  ];

  // 模板需求表格列配置
  const templateRequestColumns = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '热度',
      dataIndex: 'popularity',
      key: 'popularity',
      render: (popularity: number) => (
        <span>{popularity}%</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />}>查看详情</Button>
          <Button type="primary">申请</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>需求中心</Title>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="我的需求" key="1">
          <Card style={{ marginBottom: 16 }}>
            <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Input placeholder="需求ID/标题" prefix={<SearchOutlined />} style={{ width: 200 }} />
                <Button type="primary">搜索</Button>
              </Space>
              <Button type="primary" icon={<PlusOutlined />}>
                提交新需求
              </Button>
            </Space>
            
            <Table 
              columns={myRequestColumns} 
              dataSource={myRequests} 
              rowKey="id" 
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>
                    <strong>需求描述：</strong> {record.description}
                  </p>
                ),
              }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="需求模板" key="2">
          <Card style={{ marginBottom: 16 }}>
            <Space style={{ marginBottom: 16 }}>
              <Input placeholder="需求标题" prefix={<SearchOutlined />} style={{ width: 200 }} />
              <Button type="primary">搜索</Button>
            </Space>
            
            <Table 
              columns={templateRequestColumns} 
              dataSource={templateRequests} 
              rowKey="id" 
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>
                    <strong>需求描述：</strong> {record.description}
                  </p>
                ),
              }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RequestCenter;