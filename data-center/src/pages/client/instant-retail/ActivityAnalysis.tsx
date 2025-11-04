import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Select, DatePicker, Button, Space, Typography, Tabs, Progress, Tag, Modal } from 'antd';
import { Line, Column, Pie, Area } from '@ant-design/plots';
import { DownloadOutlined, ReloadOutlined, TrophyOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface ActivityData {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  totalSales: number;
  orderCount: number;
  participantCount: number;
  conversionRate: number;
  roi: number;
  cost: number;
}

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  activity: string;
}

interface CategoryData {
  category: string;
  sales: number;
  percentage: number;
}

const ActivityAnalysis: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [loading, setLoading] = useState(false);

  // 进入页面弹窗一次提醒
  useEffect(() => {
    Modal.info({
      title: '提醒',
      content: '感谢关注，当前页面设计中，请完成后查看。',
      okText: '知道了'
    });
  }, []);

  // 模拟活动数据
  const [activities] = useState<ActivityData[]>([
    {
      id: '1',
      name: '双十一大促',
      type: '促销活动',
      startDate: '2024-11-01',
      endDate: '2024-11-15',
      status: '已结束',
      totalSales: 2580000,
      orderCount: 15420,
      participantCount: 45600,
      conversionRate: 33.8,
      roi: 4.2,
      cost: 614000
    },
    {
      id: '2',
      name: '春季新品发布',
      type: '新品推广',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: '已结束',
      totalSales: 1250000,
      orderCount: 8900,
      participantCount: 28500,
      conversionRate: 31.2,
      roi: 3.8,
      cost: 329000
    },
    {
      id: '3',
      name: '夏日清仓',
      type: '清仓活动',
      startDate: '2024-07-01',
      endDate: '2024-07-20',
      status: '已结束',
      totalSales: 890000,
      orderCount: 12300,
      participantCount: 35200,
      conversionRate: 34.9,
      roi: 2.9,
      cost: 307000
    }
  ]);

  // 模拟销售趋势数据
  const [salesTrendData] = useState<SalesData[]>([
    { date: '2024-11-01', sales: 125000, orders: 850, activity: '双十一大促' },
    { date: '2024-11-02', sales: 145000, orders: 920, activity: '双十一大促' },
    { date: '2024-11-03', sales: 168000, orders: 1050, activity: '双十一大促' },
    { date: '2024-11-04', sales: 189000, orders: 1180, activity: '双十一大促' },
    { date: '2024-11-05', sales: 210000, orders: 1320, activity: '双十一大促' },
    { date: '2024-11-06', sales: 195000, orders: 1250, activity: '双十一大促' },
    { date: '2024-11-07', sales: 178000, orders: 1100, activity: '双十一大促' },
    { date: '2024-11-08', sales: 156000, orders: 980, activity: '双十一大促' },
    { date: '2024-11-09', sales: 142000, orders: 890, activity: '双十一大促' },
    { date: '2024-11-10', sales: 235000, orders: 1580, activity: '双十一大促' },
    { date: '2024-11-11', sales: 385000, orders: 2450, activity: '双十一大促' },
    { date: '2024-11-12', sales: 298000, orders: 1890, activity: '双十一大促' },
    { date: '2024-11-13', sales: 215000, orders: 1350, activity: '双十一大促' },
    { date: '2024-11-14', sales: 178000, orders: 1120, activity: '双十一大促' },
    { date: '2024-11-15', sales: 156000, orders: 985, activity: '双十一大促' }
  ]);

  // 模拟品类销售数据
  const [categoryData] = useState<CategoryData[]>([
    { category: '服装', sales: 1250000, percentage: 48.4 },
    { category: '数码', sales: 680000, percentage: 26.4 },
    { category: '家居', sales: 420000, percentage: 16.3 },
    { category: '美妆', sales: 230000, percentage: 8.9 }
  ]);

  // 活动对比数据
  const comparisonData = activities.map(activity => ({
    activity: activity.name,
    销售额: activity.totalSales,
    订单数: activity.orderCount,
    转化率: activity.conversionRate,
    ROI: activity.roi
  }));

  const activityColumns: ColumnsType<ActivityData> = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Tag color="blue">{record.type}</Tag>
        </div>
      )
    },
    {
      title: '活动周期',
      key: 'period',
      render: (_, record) => (
        <div>
          <Text>{record.startDate}</Text>
          <br />
          <Text>至 {record.endDate}</Text>
        </div>
      )
    },
    {
      title: '销售额',
      dataIndex: 'totalSales',
      key: 'totalSales',
      render: (value) => (
        <Statistic
          value={value}
          precision={0}
          prefix="¥"
          valueStyle={{ fontSize: '14px' }}
        />
      ),
      sorter: (a, b) => a.totalSales - b.totalSales
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (value) => (
        <Statistic
          value={value}
          precision={0}
          valueStyle={{ fontSize: '14px' }}
        />
      ),
      sorter: (a, b) => a.orderCount - b.orderCount
    },
    {
      title: '参与人数',
      dataIndex: 'participantCount',
      key: 'participantCount',
      render: (value) => (
        <Statistic
          value={value}
          precision={0}
          valueStyle={{ fontSize: '14px' }}
        />
      )
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (value) => (
        <div>
          <Text>{value}%</Text>
          <br />
          <Progress percent={value} size="small" showInfo={false} />
        </div>
      ),
      sorter: (a, b) => a.conversionRate - b.conversionRate
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      render: (value) => (
        <Statistic
          value={value}
          precision={1}
          suffix="x"
          valueStyle={{ 
            fontSize: '14px',
            color: value >= 3 ? '#52c41a' : value >= 2 ? '#faad14' : '#ff4d4f'
          }}
        />
      ),
      sorter: (a, b) => a.roi - b.roi
    }
  ];

  // 销售趋势图配置
  const salesTrendConfig = {
    data: salesTrendData,
    xField: 'date',
    yField: 'sales',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 3,
      shape: 'circle'
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '销售额',
        value: `¥${datum.sales.toLocaleString()}`
      })
    },
    xAxis: {
      type: 'time',
      tickCount: 5
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${(+v / 10000).toFixed(0)}万`
      }
    }
  };

  // 订单趋势图配置
  const orderTrendConfig = {
    data: salesTrendData,
    xField: 'date',
    yField: 'orders',
    smooth: true,
    color: '#52c41a',
    point: {
      size: 3,
      shape: 'circle'
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '订单数',
        value: datum.orders.toLocaleString()
      })
    },
    xAxis: {
      type: 'time',
      tickCount: 5
    }
  };

  // 品类销售饼图配置
  const categoryPieConfig = {
    data: categoryData,
    angleField: 'sales',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}'
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.category,
        value: `¥${datum.sales.toLocaleString()}`
      })
    }
  };

  // 活动对比柱状图配置
  const comparisonConfig = {
    data: comparisonData,
    xField: 'activity',
    yField: '销售额',
    color: '#722ed1',
    columnWidthRatio: 0.6,
    tooltip: {
      formatter: (datum: any) => ({
        name: '销售额',
        value: `¥${datum.销售额.toLocaleString()}`
      })
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${(+v / 10000).toFixed(0)}万`
      }
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // 模拟数据刷新
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // 模拟导出功能
    console.log('导出数据');
  };

  // 计算总体指标
  const totalSales = activities.reduce((sum, activity) => sum + activity.totalSales, 0);
  const totalOrders = activities.reduce((sum, activity) => sum + activity.orderCount, 0);
  const totalParticipants = activities.reduce((sum, activity) => sum + activity.participantCount, 0);
  const avgConversionRate = activities.reduce((sum, activity) => sum + activity.conversionRate, 0) / activities.length;
  const avgROI = activities.reduce((sum, activity) => sum + activity.roi, 0) / activities.length;

  return (
    <div className="activity-analysis-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>活动分析</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Select
              value={selectedActivity}
              onChange={setSelectedActivity}
              style={{ width: 200 }}
              placeholder="选择活动"
            >
              <Option value="all">全部活动</Option>
              {activities.map(activity => (
                <Option key={activity.id} value={activity.id}>
                  {activity.name}
                </Option>
              ))}
            </Select>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              style={{ width: 240 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
              刷新
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
              导出报告
            </Button>
          </div>
        </div>
      </Card>

      {/* 核心指标概览 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总销售额"
              value={totalSales}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="总订单数"
              value={totalOrders}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="参与人数"
              value={totalParticipants}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均转化率"
              value={avgConversionRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="平均ROI"
              value={avgROI}
              precision={1}
              suffix="x"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="活动数量"
              value={activities.length}
              precision={0}
              suffix="个"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 分析图表 */}
      <Tabs defaultActiveKey="trend">
        <TabPane tab="趋势分析" key="trend">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="销售额趋势" style={{ marginBottom: '16px' }}>
                <Line {...salesTrendConfig} height={300} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="订单数趋势" style={{ marginBottom: '16px' }}>
                <Line {...orderTrendConfig} height={300} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="品类分析" key="category">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="品类销售分布">
                <Pie {...categoryPieConfig} height={400} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="品类销售排行">
                <div style={{ padding: '20px 0' }}>
                  {categoryData.map((item, index) => (
                    <div key={item.category} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>
                          {index === 0 && <TrophyOutlined style={{ color: '#faad14', marginRight: '8px' }} />}
                          {item.category}
                        </span>
                        <span>¥{item.sales.toLocaleString()}</span>
                      </div>
                      <Progress percent={item.percentage} showInfo={false} />
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="活动对比" key="comparison">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="活动销售额对比">
                <Column {...comparisonConfig} height={400} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="活动效果排行">
                <div style={{ padding: '20px 0' }}>
                  {activities
                    .sort((a, b) => b.roi - a.roi)
                    .map((activity, index) => (
                      <div key={activity.id} style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <Text strong>{activity.name}</Text>
                            <br />
                            <Text type="secondary">ROI: {activity.roi}x</Text>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {index === 0 && <RiseOutlined style={{ color: '#52c41a' }} />}
                            {index === activities.length - 1 && <FallOutlined style={{ color: '#ff4d4f' }} />}
                          </div>
                        </div>
                        <Progress 
                          percent={Math.round((activity.roi / Math.max(...activities.map(a => a.roi))) * 100)} 
                          size="small" 
                          showInfo={false}
                          strokeColor={index === 0 ? '#52c41a' : index === activities.length - 1 ? '#ff4d4f' : '#1890ff'}
                        />
                      </div>
                    ))}
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="详细数据" key="detail">
          <Card title="活动详细数据">
            <Table
              columns={activityColumns}
              dataSource={activities}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ActivityAnalysis;