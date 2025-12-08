import React, { useState } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Tag, Space, Typography, Row, Col, Drawer, Descriptions, Tabs, Tooltip as AntTooltip } from 'antd';
import { SearchOutlined, DownloadOutlined, FilterOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { unifiedActivities, type ActivityData } from '../../../data/storeMarketingData';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// 使用统一的活动数据
const mockAllActivities: ActivityData[] = unifiedActivities;

const AllActivities: React.FC = () => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<ActivityData[]>(mockAllActivities);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  
  // 侧边抽屉状态
  const [receiveDetailVisible, setReceiveDetailVisible] = useState(false);
  const [verifyDetailVisible, setVerifyDetailVisible] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  
  // 状态管理
  
  // 抽屉内搜索状态
  const [receiveSearchText, setReceiveSearchText] = useState('');
  const [verifySearchText, setVerifySearchText] = useState('');

  // 活动分析页面跳转
  const handleActivityAnalysis = (activityId: string, platforms: string[]) => {
    // 如果活动平台只有微信小店，跳转到微信小店活动分析页面
    if (platforms.length === 1 && platforms[0] === '微信小店') {
      navigate(`/client/small-store-activity-analysis?activityId=${activityId}`);
    } else {
      // 多个平台时，跳转到普通活动分析页面
      navigate(`/client/activity-analysis/${activityId}`);
    }
  };

  // 领券明细处理函数
  const handleReceiveDetail = (activityId: string) => {
    setSelectedActivityId(activityId);
    setReceiveDetailVisible(true);
  };

  // 核销明细处理函数
  const handleVerifyDetail = (activityId: string) => {
    setSelectedActivityId(activityId);
    setVerifyDetailVisible(true);
  };

  // 根据活动ID获取活动信息
  const getActivityInfo = (activityId: string) => {
    return mockAllActivities.find(activity => activity.activityId === activityId);
  };
  
  const mockReceiveData = [
    { key: '1', couponId: 'B001', receiveTime: '2025-01-15 10:30:00' },
    { key: '2', couponId: 'B002', receiveTime: '2025-01-15 11:15:00' },
    { key: '3', couponId: 'B003', receiveTime: '2025-01-15 14:22:00' },
    { key: '4', couponId: 'B004', receiveTime: '2025-01-15 16:45:00' },
    { key: '5', couponId: 'B005', receiveTime: '2025-01-15 18:20:00' },
  ];

  // 模拟核销明细数据
  const mockVerifyData = [
    { key: '1', couponId: 'B001', verifyTime: '2025-01-15 16:45:00', isRefund: false, refundTime: '', orderAmount: 25.50, discountAmount: 2.50 },
    { key: '2', couponId: 'B002', verifyTime: '2025-01-15 18:20:00', isRefund: true, refundTime: '2025-01-16 09:30:00', orderAmount: 18.00, discountAmount: 2.00 },
    { key: '3', couponId: 'B003', verifyTime: '2025-01-15 20:10:00', isRefund: false, refundTime: '', orderAmount: 32.80, discountAmount: 3.00 },
    { key: '4', couponId: 'B004', verifyTime: '2025-01-16 09:15:00', isRefund: false, refundTime: '', orderAmount: 45.20, discountAmount: 4.50 },
    { key: '5', couponId: 'B005', verifyTime: '2025-01-16 14:30:00', isRefund: true, refundTime: '2025-01-17 10:00:00', orderAmount: 28.90, discountAmount: 2.80 },
  ];
  
  // 筛选领券明细数据
  const filteredReceiveData = mockReceiveData.filter(item =>
    item.couponId.toLowerCase().includes(receiveSearchText.toLowerCase())
  );
  
  // 筛选核销明细数据
  const filteredVerifyData = mockVerifyData.filter(item =>
    item.couponId.toLowerCase().includes(verifySearchText.toLowerCase())
  );

  // 领券明细表格列
  const receiveColumns = [
    { title: '券码', dataIndex: 'couponId', key: 'couponId' },
    { title: '领取时间', dataIndex: 'receiveTime', key: 'receiveTime' },
  ];

  // 核销明细表格列
  const verifyColumns = [
    { title: '券码', dataIndex: 'couponId', key: 'couponId' },
    { title: '核销时间', dataIndex: 'verifyTime', key: 'verifyTime' },
    { 
      title: '是否退款', 
      dataIndex: 'isRefund', 
      key: 'isRefund',
      render: (isRefund: boolean) => (
        <Tag color={isRefund ? 'red' : 'green'}>
          {isRefund ? '是' : '否'}
        </Tag>
      )
    },
    { title: '退款时间', dataIndex: 'refundTime', key: 'refundTime' },
    { 
      title: '订单金额', 
      dataIndex: 'orderAmount', 
      key: 'orderAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`
    },
    { 
      title: '优惠金额', 
      dataIndex: 'discountAmount', 
      key: 'discountAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`
    },
  ];

  // 筛选数据
  const filterData = (
    search: string,
    status: string | undefined,
    platforms: string[],
    dateRangeValue: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    let filtered = mockAllActivities;

    // 按名称搜索
    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.activityId.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 按状态筛选
    if (status) {
      filtered = filtered.filter(item => item.status === status);
    }

    // 按平台筛选
    if (platforms && platforms.length > 0) {
      filtered = filtered.filter(item =>
        platforms.some(platform => item.platforms.includes(platform))
      );
    }

    // 按日期范围筛选
    if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
      const startDate = dateRangeValue[0];
      const endDate = dateRangeValue[1];
      filtered = filtered.filter(item => {
        const itemStartDate = dayjs(item.startDate);
        const itemEndDate = dayjs(item.endDate);
        return (
          ((itemStartDate.isAfter(startDate) || itemStartDate.isSame(startDate)) && 
           (itemStartDate.isBefore(endDate) || itemStartDate.isSame(endDate))) ||
          ((itemEndDate.isAfter(startDate) || itemEndDate.isSame(startDate)) && 
           (itemEndDate.isBefore(endDate) || itemEndDate.isSame(endDate))) ||
          ((itemStartDate.isBefore(startDate) || itemStartDate.isSame(startDate)) && 
           (itemEndDate.isAfter(endDate) || itemEndDate.isSame(endDate)))
        );
      });
    }

    setFilteredData(filtered);
  };

  // 表格列定义
  const columns: ColumnsType<ActivityData> = [
    {
      title: '活动编号',
      dataIndex: 'activityId',
      key: 'activityId',
      width: 120,
      fixed: 'left',
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      fixed: 'left',
      render: (text: string) => (
        <AntTooltip title={text}>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            maxWidth: '280px'
          }}>
            {text}
          </div>
        </AntTooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        if (status === '进行中') color = 'processing';
        else if (status === '已结束') color = 'success';
        else if (status === '待开始') color = 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '活动平台',
      dataIndex: 'platforms',
      key: 'platforms',
      width: 200,
      render: (platforms: string[]) => (
        <div>
          {platforms.map((platform, index) => {
            let color = 'default';
            switch (platform) {
              case '微信': color = 'green'; break;
              case '支付宝': color = 'blue'; break;
              case '抖音到店': color = 'black'; break;
              case '美团到店': color = 'gold'; break;
              case '天猫校园': color = 'red'; break;
              case '微信小店': color = 'cyan'; break;
            }
            return (
              <Tag key={index} color={color} style={{ marginBottom: 4 }}>
                {platform}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: '销售金额(元)',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 120,
      sorter: (a, b) => a.salesAmount - b.salesAmount,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '优惠金额(元)',
      dataIndex: 'discount',
      key: 'discount',
      width: 120,
      sorter: (a, b) => a.discount - b.discount,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={(e) => {
              e.preventDefault();
              handleActivityAnalysis(record.activityId, record.platforms);
            }}
            style={{ cursor: 'pointer' }}
          >
            活动详情
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="all-activities-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>活动管理</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={5}>
            <Input
              placeholder="搜索活动名称或编号"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                filterData(e.target.value, selectedStatus, selectedPlatforms, dateRange);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={3}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(value);
                filterData(searchText, value, selectedPlatforms, dateRange);
              }}
              allowClear
            >
              <Option value="进行中">进行中</Option>
              <Option value="已结束">已结束</Option>
              <Option value="待开始">待开始</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              mode="multiple"
              placeholder="选择平台"
              style={{ width: '100%' }}
              value={selectedPlatforms}
              onChange={(value) => {
                setSelectedPlatforms(value);
                filterData(searchText, selectedStatus, value, dateRange);
              }}
              allowClear
            >
              <Option value="微信">微信</Option>
              <Option value="支付宝">支付宝</Option>
              <Option value="抖音到店">抖音到店</Option>
              <Option value="美团到店">美团到店</Option>
              <Option value="天猫校园">天猫校园</Option>
              <Option value="微信小店">微信小店</Option>
            </Select>
          </Col>
          <Col span={5}>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                filterData(searchText, selectedStatus, selectedPlatforms, dates);
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 1800, y: 550 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          size="small"
          style={{ marginBottom: '20px' }}
        />
      </Card>

      {/* 领券明细抽屉 */}
      <Drawer
        title="领券明细"
        placement="right"
        width={600}
        open={receiveDetailVisible}
        onClose={() => setReceiveDetailVisible(false)}
      >
        {selectedActivityId && (
          <>
            <div style={{ marginBottom: 16, fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
              {getActivityInfo(selectedActivityId)?.name}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="请输入券码搜索"
                prefix={<SearchOutlined />}
                value={receiveSearchText}
                onChange={(e) => setReceiveSearchText(e.target.value)}
                allowClear
              />
            </div>
            <Table
              columns={receiveColumns}
              dataSource={filteredReceiveData}
              rowKey="key"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </>
        )}
      </Drawer>

      {/* 核销明细抽屉 */}
      <Drawer
        title="核销明细"
        placement="right"
        onClose={() => setVerifyDetailVisible(false)}
        open={verifyDetailVisible}
        width={800}
      >
        {selectedActivityId && (
          <>
            <div style={{ marginBottom: 16, fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
              {getActivityInfo(selectedActivityId)?.name}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="请输入券码搜索"
                prefix={<SearchOutlined />}
                value={verifySearchText}
                onChange={(e) => setVerifySearchText(e.target.value)}
                allowClear
              />
            </div>
            <Table
              columns={verifyColumns}
              dataSource={filteredVerifyData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </>
        )}
      </Drawer>

    </div>
  );
};

export default AllActivities;