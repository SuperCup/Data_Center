import React from 'react';
import { Table, Button, Space, Input, Select, Card, Tag, Typography, Badge } from 'antd';
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const CustomRequestManagement: React.FC = () => {
  // 模拟客户定制需求数据
  const requests = [
    {
      id: 1,
      customer: '腾讯游戏',
      title: '自定义渠道分析报表',
      description: '需要针对我们的特定渠道进行更详细的分析，包括用户留存率、付费转化率等指标',
      submitTime: '2023-10-10 10:30:22',
      status: 'pending',
      priority: 'high',
    },
    {
      id: 2,
      customer: '网易游戏',
      title: '活动效果归因分析',
      description: '希望能够针对多渠道投放的活动，分析各渠道的贡献度和ROI',
      submitTime: '2023-10-08 14:15:43',
      status: 'in_progress',
      priority: 'medium',
    },
    {
      id: 3,
      customer: '完美世界',
      title: '用户生命周期价值预测',
      description: '需要基于历史数据预测用户的生命周期价值，帮助我们优化获客策略',
      submitTime: '2023-10-05 09:22:10',
      status: 'completed',
      priority: 'medium',
    },
    {
      id: 4,
      customer: '米哈游',
      title: '自定义用户分群工具',
      description: '希望能够根据我们的业务特点，开发一套更灵活的用户分群工具',
      submitTime: '2023-10-01 16:45:33',
      status: 'rejected',
      priority: 'low',
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

  // 优先级映射
  const priorityBadge: Record<string, any> = {
    high: { status: 'error', text: '高' },
    medium: { status: 'warning', text: '中' },
    low: { status: 'default', text: '低' },
  };

  // 表格列配置
  const columns = [
    {
      title: '需求ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      key: 'customer',
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
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Badge status={priorityBadge[priority].status} text={priorityBadge[priority].text} />
      ),
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
          <Button type="text" icon={<EyeOutlined />}>查看</Button>
          {record.status === 'pending' && (
            <>
              <Button type="text" icon={<CheckOutlined />} style={{ color: 'green' }}>接受</Button>
              <Button type="text" danger icon={<CloseOutlined />}>拒绝</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>客户定制需求管理</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="需求ID/标题" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">所有状态</Option>
            <Option value="pending">待处理</Option>
            <Option value="in_progress">处理中</Option>
            <Option value="completed">已完成</Option>
            <Option value="rejected">已拒绝</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">所有优先级</Option>
            <Option value="high">高</Option>
            <Option value="medium">中</Option>
            <Option value="low">低</Option>
          </Select>
          <Button type="primary">搜索</Button>
          <Button>重置</Button>
        </Space>
        
        <Table 
          columns={columns} 
          dataSource={requests} 
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
    </div>
  );
};

export default CustomRequestManagement;