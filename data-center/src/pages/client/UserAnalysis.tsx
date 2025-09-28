import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Button, Table, Row, Col, Statistic, Typography, Space, Radio } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

// 用户分析数据接口
interface UserAnalysisData {
  key: string;
  channel: string;      // 渠道
  region: string;       // 区域
  activity: string;     // 活动名称
  visitUsers: number;   // 访问用户数
  receiveUsers: number; // 领券用户数
  usageUsers: number;   // 核销用户数
  conversionRate: number; // 转化率
  usageRate: number;    // 使用率
}

// 模拟用户分析数据
const mockUserAnalysisData: UserAnalysisData[] = [
  {
    key: '1',
    channel: '品牌小程序',
    region: '华东',
    activity: '2025年9月秋季促销活动',
    visitUsers: 7708,
    receiveUsers: 7252,
    usageUsers: 7167,
    conversionRate: 94.09,
    usageRate: 92.99,
  },
  {
    key: '2',
    channel: '品牌小程序',
    region: '华南',
    activity: '2025年9月秋季促销活动',
    visitUsers: 6500,
    receiveUsers: 6100,
    usageUsers: 5980,
    conversionRate: 93.85,
    usageRate: 92.03,
  },
  {
    key: '3',
    channel: '品牌小程序',
    region: '华北',
    activity: '2025年10月国庆特惠活动',
    visitUsers: 5800,
    receiveUsers: 5400,
    usageUsers: 5250,
    conversionRate: 93.10,
    usageRate: 90.52,
  },
  {
    key: '4',
    channel: '第三方平台',
    region: '华东',
    activity: '2025年8月夏日清凉活动',
    visitUsers: 4200,
    receiveUsers: 3800,
    usageUsers: 3650,
    conversionRate: 90.48,
    usageRate: 86.90,
  },
  {
    key: '5',
    channel: '第三方平台',
    region: '华南',
    activity: '2025年9月中秋节活动',
    visitUsers: 3900,
    receiveUsers: 3500,
    usageUsers: 3300,
    conversionRate: 89.74,
    usageRate: 84.62,
  },
  {
    key: '6',
    channel: '线下门店',
    region: '华东',
    activity: '康师傅品牌专场活动',
    visitUsers: 2800,
    receiveUsers: 2400,
    usageUsers: 2200,
    conversionRate: 85.71,
    usageRate: 78.57,
  },
];

const UserAnalysis: React.FC = () => {
  const [userAnalysisData, setUserAnalysisData] = useState<UserAnalysisData[]>(mockUserAnalysisData);
  const [selectedChannel, setSelectedChannel] = useState<string>('品牌小程序'); // 默认选中品牌小程序
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [dateType, setDateType] = useState<string>('custom'); // 时间筛选类型，改为与销售分析一致

  // 初始化时应用默认筛选
  useEffect(() => {
    filterUserAnalysisData('品牌小程序', selectedRegion, selectedActivity, dateRange);
  }, []);

  // 处理时间筛选类型变化
  const handleDateTypeChange = (e: any) => {
    const value = e.target.value;
    setDateType(value);
    let newDateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null = null;

    switch (value) {
      case 'day':
        const yesterday = dayjs().subtract(1, 'day');
        newDateRange = [yesterday, yesterday];
        break;
      case 'month':
        newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
        break;
      case 'year':
        newDateRange = [dayjs().startOf('year'), dayjs().endOf('year')];
        break;
      case 'custom':
        newDateRange = null;
        break;
    }

    setDateRange(newDateRange);
    filterUserAnalysisData(selectedChannel, selectedRegion, selectedActivity, newDateRange);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setDateRange(dates);
    filterUserAnalysisData(selectedChannel, selectedRegion, selectedActivity, dates);
  };

  // 用户分析筛选功能
  const filterUserAnalysisData = (
    channel?: string,
    region?: string,
    activity?: string,
    dateRangeFilter?: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    let filtered = mockUserAnalysisData;

    if (channel) {
      filtered = filtered.filter(item => item.channel === channel);
    }

    if (region) {
      filtered = filtered.filter(item => item.region === region);
    }

    if (activity) {
      filtered = filtered.filter(item => item.activity === activity);
    }

    // 这里可以根据需要添加日期筛选逻辑
    // 由于模拟数据没有具体日期，暂时保留接口

    setUserAnalysisData(filtered);
  };

  // 用户分析表格列定义
  const userAnalysisColumns: ColumnsType<UserAnalysisData> = [
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 120,
      render: (channel: string) => (
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px',
          backgroundColor: channel === '品牌小程序' ? '#e6f7ff' : channel === '第三方平台' ? '#f6ffed' : '#fff7e6',
          color: channel === '品牌小程序' ? '#1890ff' : channel === '第三方平台' ? '#52c41a' : '#fa8c16',
          border: `1px solid ${channel === '品牌小程序' ? '#91d5ff' : channel === '第三方平台' ? '#b7eb8f' : '#ffd591'}`
        }}>
          {channel}
        </span>
      ),
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'activity',
      key: 'activity',
      width: 200,
    },
    {
      title: '访问用户数',
      dataIndex: 'visitUsers',
      key: 'visitUsers',
      width: 120,
      sorter: (a, b) => a.visitUsers - b.visitUsers,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '领券用户数',
      dataIndex: 'receiveUsers',
      key: 'receiveUsers',
      width: 120,
      sorter: (a, b) => a.receiveUsers - b.receiveUsers,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '核销用户数',
      dataIndex: 'usageUsers',
      key: 'usageUsers',
      width: 120,
      sorter: (a, b) => a.usageUsers - b.usageUsers,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 100,
      sorter: (a, b) => a.conversionRate - b.conversionRate,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: '使用率',
      dataIndex: 'usageRate',
      key: 'usageRate',
      width: 100,
      sorter: (a, b) => a.usageRate - b.usageRate,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>用户分析</Title>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Space size="middle" wrap>
              <Select
                placeholder="选择渠道"
                style={{ width: 150 }}
                value={selectedChannel}
                onChange={(value) => {
                  setSelectedChannel(value);
                  filterUserAnalysisData(value, selectedRegion, selectedActivity, dateRange);
                }}
                allowClear
              >
                <Option value="品牌小程序">品牌小程序</Option>
                <Option value="第三方平台">第三方平台</Option>
                <Option value="线下门店">线下门店</Option>
              </Select>
              <Select
                placeholder="选择活动名称"
                style={{ width: 200 }}
                value={selectedActivity}
                onChange={(value) => {
                  setSelectedActivity(value);
                  filterUserAnalysisData(selectedChannel, selectedRegion, value, dateRange);
                }}
                allowClear
              >
                <Option value="2025年9月秋季促销活动">2025年9月秋季促销活动</Option>
                <Option value="2025年10月国庆特惠活动">2025年10月国庆特惠活动</Option>
                <Option value="2025年8月夏日清凉活动">2025年8月夏日清凉活动</Option>
                <Option value="2025年9月中秋节活动">2025年9月中秋节活动</Option>
                <Option value="康师傅品牌专场活动">康师傅品牌专场活动</Option>
                <Option value="鲜Q面新品推广活动">鲜Q面新品推广活动</Option>
              </Select>
              <Select
                placeholder="选择区域"
                style={{ width: 120 }}
                value={selectedRegion}
                onChange={(value) => {
                  setSelectedRegion(value);
                  filterUserAnalysisData(selectedChannel, value, selectedActivity, dateRange);
                }}
                allowClear
              >
                <Option value="华东">华东</Option>
                <Option value="华南">华南</Option>
                <Option value="华北">华北</Option>
              </Select>
            </Space>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space size="middle">
              <Radio.Group value={dateType} onChange={handleDateTypeChange} size="middle">
                <Radio.Button value="day">日</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="year">年</Radio.Button>
                <Radio.Button value="custom">自定义</Radio.Button>
              </Radio.Group>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                placeholder={['开始日期', '结束日期']}
                size="middle"
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 转化漏斗图表 */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>区域流量转化统计</Title>
        <Row gutter={24}>
          <Col span={12}>
            {/* 转化漏斗图表区域 - 移除入群用户数 */}
            <div style={{ 
              height: '350px', 
              background: 'linear-gradient(180deg, #1890ff 0%, #40a9ff 33%, #69c0ff 66%, #91d5ff 100%)',
              borderRadius: '8px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* 漏斗层级 - 移除入群用户数层级 */}
              <div style={{ 
                width: '90%', 
                height: '70px', 
                background: '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '12px',
                clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'
              }}>
                访问用户数: 7,708人
              </div>
              <div style={{ 
                width: '75%', 
                height: '70px', 
                background: '#40a9ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '12px',
                clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'
              }}>
                领券用户数: 7,252人
              </div>
              <div style={{ 
                width: '60%', 
                height: '70px', 
                background: '#69c0ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '12px',
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)'
              }}>
                核销用户数: 7,167人
              </div>
              <div style={{ 
                width: '45%', 
                height: '70px', 
                background: '#91d5ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#1890ff',
                fontSize: '16px',
                fontWeight: 'bold',
                clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'
              }}>
                复购用户数: 0.01%
              </div>
              
              {/* 转化率标签 */}
              <div style={{ 
                position: 'absolute', 
                right: '20px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                background: '#ff7a45',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                转化率: 94.09%
              </div>
            </div>
          </Col>
          <Col span={12}>
            {/* 统计数据卡片 */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="总访问用户数"
                    value={userAnalysisData.reduce((sum, item) => sum + item.visitUsers, 0)}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="总领券用户数"
                    value={userAnalysisData.reduce((sum, item) => sum + item.receiveUsers, 0)}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="总核销用户数"
                    value={userAnalysisData.reduce((sum, item) => sum + item.usageUsers, 0)}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="平均转化率"
                    value={(userAnalysisData.reduce((sum, item) => sum + item.conversionRate, 0) / userAnalysisData.length).toFixed(2)}
                    suffix="%"
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 用户行为分析数据表格 */}
      <Card>
        <Title level={4} style={{ marginBottom: '16px' }}>用户行为分析数据表</Title>
        <Table
          columns={userAnalysisColumns}
          dataSource={userAnalysisData}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total: userAnalysisData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default UserAnalysis;