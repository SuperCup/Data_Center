import React, { useState } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Tag, Space, Typography, Row, Col, Drawer, Descriptions, Tabs, Tooltip as AntTooltip } from 'antd';
import { SearchOutlined, DownloadOutlined, FilterOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// 活动数据接口
interface ActivityData {
  key: string;
  activityId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  budget: number;
  consumed: number;
  retailerCount: number; // 零售商数
  skuCount: number;      // SKU数
  usedCount: number;
  batchCount: number;
  discount: number;
  usageRate: number;
  zeroUsageRetailers?: string[]; // 0核销零售商名称列表
  salesAmount: number;   // 销售金额
  platforms: string[];   // 活动平台（微信、支付宝、抖音到店、美团到店、天猫校园）
  activityType: 'KA' | '小店'; // 活动类型
}

// 模拟全量活动数据
const mockAllActivities: ActivityData[] = [
  {
    key: '1',
    activityId: 'ACT001',
    name: '2025年9月康师傅红烧牛肉面秋季促销活动',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    status: '进行中',
    budget: 50000,
    consumed: 32000,
    retailerCount: 125,
    skuCount: 8,
    usedCount: 8500,
    batchCount: 8 * 15,
    discount: 32000,
    usageRate: 78.5,
    zeroUsageRetailers: ['华润万家(北京朝阳店)', '华润万家(北京海淀店)', '华润万家(北京西城店)'],
    salesAmount: 128000,
    platforms: ['微信', '支付宝', '抖音到店'],
    activityType: 'KA',
  },
  {
    key: '2',
    activityId: 'ACT002',
    name: '2025年8月康师傅老坛酸菜面夏日特惠活动',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    status: '已结束',
    budget: 40000,
    consumed: 26000,
    retailerCount: 98,
    skuCount: 5,
    usedCount: Math.round(8500 * 1.5),
    batchCount: 5 * 15,
    discount: 26000,
    usageRate: 82.3,
    zeroUsageRetailers: ['华润万家(北京东城店)', '华润万家(北京丰台店)'],
    salesAmount: 95000,
    platforms: ['微信', '美团到店', '天猫校园'],
    activityType: '小店',
  },
  {
    key: '3',
    activityId: 'ACT003',
    name: '2025年7月康师傅香辣牛肉面品牌推广活动',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    status: '已结束',
    budget: 30000,
    consumed: 24000,
    retailerCount: 76,
    skuCount: 6,
    usedCount: Math.round(9200 * 1.5),
    batchCount: 6 * 15,
    discount: 24000,
    usageRate: 85.1,
    zeroUsageRetailers: ['华润万家(北京石景山店)', '华润万家(北京通州店)', '华润万家(北京昌平店)', '华润万家(北京大兴店)'],
    salesAmount: 76000,
    platforms: ['支付宝', '抖音到店', '美团到店'],
    activityType: 'KA',
  },
  {
    key: '4',
    activityId: 'ACT004',
    name: '2025年10月国庆特惠活动',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: '待开始',
    budget: 60000,
    consumed: 0,
    retailerCount: 0,
    skuCount: 0,
    usedCount: 0,
    batchCount: 0,
    discount: 0,
    usageRate: 0,
    zeroUsageRetailers: [],
    salesAmount: 0,
    platforms: ['微信', '支付宝', '抖音到店', '美团到店'],
    activityType: '小店',
  },
  {
    key: '5',
    activityId: 'ACT005',
    name: '2025年11月双十一狂欢活动',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: '待开始',
    budget: 80000,
    consumed: 0,
    retailerCount: 0,
    skuCount: 0,
    usedCount: 0,
    batchCount: 0,
    discount: 0,
    usageRate: 0,
    zeroUsageRetailers: [],
    salesAmount: 0,
    platforms: ['微信', '支付宝', '天猫校园'],
    activityType: 'KA',
  },
  {
    key: '6',
    activityId: 'ACT006',
    name: '2025年6月儿童节特别活动',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: '已结束',
    budget: 25000,
    consumed: 22000,
    retailerCount: 54,
    skuCount: 4,
    usedCount: 6800,
    batchCount: 4 * 15,
    discount: 22000,
    usageRate: 88.0,
    zeroUsageRetailers: ['华润万家(北京房山店)', '华润万家(北京顺义店)'],
    salesAmount: 58000,
    platforms: ['微信', '抖音到店'],
    activityType: '小店',
  },
];

const AllActivities: React.FC = () => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<ActivityData[]>(mockAllActivities);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedActivityType, setSelectedActivityType] = useState<string | undefined>(undefined);
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
  const handleActivityAnalysis = (activityId: string) => {
    navigate(`/client/activity-analysis/${activityId}`);
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
    activityType: string | undefined,
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

    // 按活动类型筛选
    if (activityType) {
      filtered = filtered.filter(item => item.activityType === activityType);
    }

    // 按日期范围筛选
    if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
      const startDate = dateRangeValue[0];
      const endDate = dateRangeValue[1];
      filtered = filtered.filter(item => {
        const itemStartDate = dayjs(item.startDate);
        const itemEndDate = dayjs(item.endDate);
        return (
          (itemStartDate.isAfter(startDate) || itemStartDate.isSame(startDate)) && 
          (itemStartDate.isBefore(endDate) || itemStartDate.isSame(endDate)) ||
          (itemEndDate.isAfter(startDate) || itemEndDate.isSame(startDate)) && 
          (itemEndDate.isBefore(endDate) || itemEndDate.isSame(endDate)) ||
          (itemStartDate.isBefore(startDate) || itemStartDate.isSame(startDate)) && 
          (itemEndDate.isAfter(endDate) || itemEndDate.isSame(endDate))
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
      title: '活动类型',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'KA' ? 'blue' : 'orange'}>
          {type}
        </Tag>
      ),
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
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            onClick={() => handleActivityAnalysis(record.activityId)}
          >
            活动分析
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="all-activities-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>全量活动</Title>
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
                filterData(e.target.value, selectedStatus, selectedPlatforms, selectedActivityType, dateRange);
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
                filterData(searchText, value, selectedPlatforms, selectedActivityType, dateRange);
              }}
              allowClear
            >
              <Option value="进行中">进行中</Option>
              <Option value="已结束">已结束</Option>
              <Option value="待开始">待开始</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Select
              placeholder="活动类型"
              style={{ width: '100%' }}
              value={selectedActivityType}
              onChange={(value) => {
                setSelectedActivityType(value);
                filterData(searchText, selectedStatus, selectedPlatforms, value, dateRange);
              }}
              allowClear
            >
              <Option value="KA">KA</Option>
              <Option value="小店">小店</Option>
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
                filterData(searchText, selectedStatus, value, selectedActivityType, dateRange);
              }}
              allowClear
            >
              <Option value="微信">微信</Option>
              <Option value="支付宝">支付宝</Option>
              <Option value="抖音到店">抖音到店</Option>
              <Option value="美团到店">美团到店</Option>
              <Option value="天猫校园">天猫校园</Option>
            </Select>
          </Col>
          <Col span={5}>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                filterData(searchText, selectedStatus, selectedPlatforms, selectedActivityType, dates);
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