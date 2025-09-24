import React from 'react';
import { Card, Row, Col, Select, DatePicker, Table, Statistic, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ActivityAnalysis: React.FC = () => {
  // 模拟数据
  const activities = [
    {
      id: 1,
      name: '618购物节活动',
      couponIssued: 150000,
      couponClaimed: 120000,
      couponUsed: 80000,
      roi: 3.5,
      budget: 1000000,
      budgetUsed: 850000,
    },
    {
      id: 2,
      name: '开学季促销',
      couponIssued: 80000,
      couponClaimed: 65000,
      couponUsed: 40000,
      roi: 2.8,
      budget: 500000,
      budgetUsed: 420000,
    },
    {
      id: 3,
      name: '中秋节特惠',
      couponIssued: 100000,
      couponClaimed: 85000,
      couponUsed: 60000,
      roi: 3.2,
      budget: 800000,
      budgetUsed: 650000,
    },
  ];

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '发券量',
      dataIndex: 'couponIssued',
      key: 'couponIssued',
      render: (value: number) => `${value.toLocaleString()}张`,
    },
    {
      title: '领券量',
      dataIndex: 'couponClaimed',
      key: 'couponClaimed',
      render: (value: number) => `${value.toLocaleString()}张`,
    },
    {
      title: '核销量',
      dataIndex: 'couponUsed',
      key: 'couponUsed',
      render: (value: number) => `${value.toLocaleString()}张`,
    },
    {
      title: '核销率',
      key: 'usageRate',
      render: (_: any, record: any) => {
        const rate = (record.couponUsed / record.couponClaimed * 100).toFixed(2);
        return `${rate}%`;
      },
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
    },
    {
      title: '预算使用情况',
      key: 'budgetUsage',
      render: (_: any, record: any) => {
        const usage = (record.budgetUsed / record.budget * 100).toFixed(2);
        return `${usage}%（${record.budgetUsed.toLocaleString()}/${record.budget.toLocaleString()}）`;
      },
    },
  ];

  // 当前选中的活动（默认第一个）
  const selectedActivity = activities[0];

  return (
    <div>
      <h2>活动分析</h2>
      <Divider />
      
      {/* 筛选条件 */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Select defaultValue={selectedActivity.id} style={{ width: '100%' }}>
              {activities.map(activity => (
                <Option key={activity.id} value={activity.id}>{activity.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select defaultValue="all" style={{ width: '100%' }}>
              <Option value="all">全部渠道</Option>
              <Option value="wechat">微信</Option>
              <Option value="alipay">支付宝</Option>
              <Option value="douyin">抖音</Option>
              <Option value="meituan">美团</Option>
            </Select>
          </Col>
          <Col span={8}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col span={4}>
            <Select defaultValue="all" style={{ width: '100%' }}>
              <Option value="all">全部类型</Option>
              <Option value="discount">折扣券</Option>
              <Option value="cashback">满减券</Option>
              <Option value="groupbuy">团购</Option>
            </Select>
          </Col>
        </Row>
      </Card>
      
      {/* 活动数据概览 */}
      <Card title={`${selectedActivity.name} - 数据概览`} style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="发券量"
              value={selectedActivity.couponIssued}
              suffix="张"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="领券量"
              value={selectedActivity.couponClaimed}
              suffix="张"
              valueStyle={{ color: '#1890ff' }}
            />
            <div>
              领取率: 
              <span style={{ color: '#1890ff', marginLeft: 5 }}>
                {(selectedActivity.couponClaimed / selectedActivity.couponIssued * 100).toFixed(2)}%
              </span>
              <ArrowUpOutlined style={{ color: '#1890ff', marginLeft: 5 }} />
            </div>
          </Col>
          <Col span={6}>
            <Statistic
              title="核销量"
              value={selectedActivity.couponUsed}
              suffix="张"
              valueStyle={{ color: '#3f8600' }}
            />
            <div>
              核销率: 
              <span style={{ color: '#3f8600', marginLeft: 5 }}>
                {(selectedActivity.couponUsed / selectedActivity.couponClaimed * 100).toFixed(2)}%
              </span>
              <ArrowUpOutlined style={{ color: '#3f8600', marginLeft: 5 }} />
            </div>
          </Col>
          <Col span={6}>
            <Statistic
              title="ROI"
              value={selectedActivity.roi}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
            />
          </Col>
        </Row>
      </Card>
      
      {/* 活动列表 */}
      <Card title="活动数据明细">
        <Table 
          dataSource={activities} 
          columns={columns} 
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ActivityAnalysis;