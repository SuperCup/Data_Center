import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Select, Typography, Button, Table, Pagination, Radio, Tag, Tooltip as AntTooltip, DatePicker, Modal } from 'antd';
import { ShoppingOutlined, DollarOutlined, TagOutlined, AppstoreOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { ScatterChart, Scatter, LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// 模拟活动数据
const mockActivities = [
  {
    id: '1',
    name: '2025年9-10月康师傅红烧牛肉面全国促销活动',
    startDate: '2025-09-01',
    endDate: '2025-10-31',
    mechanisms: [
      '满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5',
      '满18减1.8', '满20减2', '满22减2.2', '满25减2.5', '满28减2.8',
      '满30减3', '满32减3.2', '满35减3.5', '满38减3.8', '满40减4',
      '满42减4.2', '满45减4.5', '满48减4.8', '满50减5', '满60减6'
    ],
    budget: 50000,
    consumed: 32500,
    gmv: 142500,
    usedCount: Math.round(12500 * 1.5),
    batchCount: 8 * 15,
    discount: 32500,
    usageRate: 78.5,
    batches: [
      { id: 'b1', name: '指定品满5元减0.5元', gmv: 22500, discount: 1750 },
      { id: 'b2', name: '指定品满8元减0.8元', gmv: 19000, discount: 1400 },
      { id: 'b3', name: '指定品满10元减1元', gmv: 26000, discount: 2100 },
      { id: 'b4', name: '指定品满12元减1.2元', gmv: 16000, discount: 1250 },
      { id: 'b5', name: '指定品满15元减1.5元', gmv: 24000, discount: 1900 },
      { id: 'b6', name: '指定品满18元减1.8元', gmv: 14500, discount: 1100 },
      { id: 'b7', name: '指定品满20元减2元', gmv: 10500, discount: 800 },
      { id: 'b8', name: '指定品满22元减2.2元', gmv: 10000, discount: 750 }
    ]
  },
  {
    id: '2',
    name: '2025年8月康师傅老坛酸菜面夏日特惠活动',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    mechanisms: [
      '满4减0.4', '满6减0.6', '满8减0.8', '满10减1', '满12减1.2',
      '满14减1.4', '满16减1.6', '满18减1.8', '满20减2', '满22减2.2',
      '满24减2.4', '满26减2.6', '满28减2.8', '满30减3', '满32减3.2',
      '满34减3.4', '满36减3.6', '满38减3.8', '满40减4', '满50减5'
    ],
    budget: 40000,
    consumed: 26000,
    gmv: 97500,
    usedCount: Math.round(8500 * 1.5),
    batchCount: 5 * 15,
    discount: 26000,
    usageRate: 82.3,
    batches: [
      { id: 'b1', name: '指定品满4元减0.4元', gmv: 21000, discount: 1600 },
      { id: 'b2', name: '指定品满6元减0.6元', gmv: 19000, discount: 1400 },
      { id: 'b3', name: '指定品满8元减0.8元', gmv: 22500, discount: 1750 },
      { id: 'b4', name: '指定品满10元减1元', gmv: 17500, discount: 1300 },
      { id: 'b5', name: '指定品满12元减1.2元', gmv: 17500, discount: 1250 }
    ]
  },
  {
    id: '3',
    name: '2025年7月康师傅香辣牛肉面品牌推广活动',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    mechanisms: [
      '满3减0.3', '满5减0.5', '满6减0.6', '满8减0.8', '满9减0.9',
      '满10减1', '满12减1.2', '满14减1.4', '满15减1.5', '满16减1.6',
      '满18减1.8', '满20减2', '满21减2.1', '满24减2.4', '满25减2.5',
      '满27减2.7', '满30减3', '满32减3.2', '满35减3.5', '满40减4'
    ],
    budget: 30000,
    consumed: 24000,
    gmv: 82500,
    usedCount: Math.round(9200 * 1.5),
    batchCount: 6 * 15,
    discount: 24000,
    usageRate: 85.1,
    batches: [
      { id: 'b1', name: '指定品满3元减0.3元', gmv: 16000, discount: 1200 },
      { id: 'b2', name: '指定品满5元减0.5元', gmv: 14000, discount: 1050 },
      { id: 'b3', name: '指定品满6元减0.6元', gmv: 14500, discount: 1100 },
      { id: 'b4', name: '指定品满8元减0.8元', gmv: 12500, discount: 950 },
      { id: 'b5', name: '指定品满9元减0.9元', gmv: 13000, discount: 1000 },
      { id: 'b6', name: '指定品满10元减1元', gmv: 12500, discount: 900 }
    ]
  }
];

// 模拟零售商数据
const mockRetailers = [
  { id: '1', name: '华润万家', type: 'KA', gmv: 285000, discount: 12000, usedCount: 1250, avgPrice: 22.8, activeSku: 45, trend: { sales: [12, 15, 18, 22, 28], discount: [0.8, 1.0, 1.2, 1.5, 1.8] } },
  { id: '2', name: '永辉超市', type: 'KA', gmv: 268000, discount: 11000, usedCount: 1180, avgPrice: 22.7, activeSku: 42, trend: { sales: [10, 13, 16, 20, 26], discount: [0.7, 0.9, 1.1, 1.4, 1.7] } },
  { id: '3', name: '家乐福', type: 'KA', gmv: 245000, discount: 10000, usedCount: 1080, avgPrice: 22.7, activeSku: 38, trend: { sales: [9, 12, 15, 18, 24], discount: [0.6, 0.8, 1.0, 1.3, 1.6] } },
  { id: '4', name: '沃尔玛', type: 'KA', gmv: 232000, discount: 9500, usedCount: 1020, avgPrice: 22.7, activeSku: 36, trend: { sales: [8, 11, 14, 17, 23], discount: [0.5, 0.7, 0.9, 1.2, 1.5] } },
  { id: '5', name: '大润发', type: 'KA', gmv: 218000, discount: 8500, usedCount: 960, avgPrice: 22.7, activeSku: 34, trend: { sales: [7, 10, 13, 16, 21], discount: [0.4, 0.6, 0.8, 1.1, 1.4] } },
  { id: '6', name: '芙蓉兴盛', type: '小店', gmv: 125000, discount: 4500, usedCount: 580, avgPrice: 21.6, activeSku: 28, trend: { sales: [5, 7, 9, 11, 12], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '7', name: '怡福百货', type: '小店', gmv: 118000, discount: 4200, usedCount: 550, avgPrice: 21.5, activeSku: 26, trend: { sales: [4, 6, 8, 10, 11], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '8', name: '众和食杂', type: '小店', gmv: 112000, discount: 4000, usedCount: 520, avgPrice: 21.5, activeSku: 24, trend: { sales: [3, 5, 7, 9, 11], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '9', name: '浩林便利店', type: '小店', gmv: 108000, discount: 3800, usedCount: 500, avgPrice: 21.6, activeSku: 22, trend: { sales: [3, 4, 6, 8, 10], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '10', name: '一号门士多', type: '小店', gmv: 95000, discount: 3500, usedCount: 450, avgPrice: 21.1, activeSku: 20, trend: { sales: [2, 3, 5, 7, 9], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '11', name: '天虹超市', type: 'KA', gmv: 185000, discount: 7500, usedCount: 820, avgPrice: 22.6, activeSku: 32, trend: { sales: [6, 9, 12, 15, 18], discount: [0.4, 0.6, 0.8, 1.0, 1.2] } },
  { id: '12', name: '物美超市', type: 'KA', gmv: 175000, discount: 7000, usedCount: 780, avgPrice: 22.4, activeSku: 30, trend: { sales: [5, 8, 11, 14, 17], discount: [0.3, 0.5, 0.7, 0.9, 1.1] } },
  { id: '13', name: '文发士多', type: '小店', gmv: 88000, discount: 3200, usedCount: 420, avgPrice: 21.0, activeSku: 18, trend: { sales: [2, 3, 4, 6, 8], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '14', name: '嘉利烟酒店', type: '小店', gmv: 82000, discount: 3000, usedCount: 390, avgPrice: 21.0, activeSku: 16, trend: { sales: [1, 2, 3, 5, 7], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '15', name: '美惠佳', type: '小店', gmv: 78000, discount: 2800, usedCount: 370, avgPrice: 21.1, activeSku: 15, trend: { sales: [1, 2, 3, 4, 6], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '16', name: '好运来超市', type: '小店', gmv: 72000, discount: 2600, usedCount: 340, avgPrice: 21.2, activeSku: 14, trend: { sales: [1, 2, 3, 4, 5], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } }
];

// 模拟商品数据
const mockProducts = [
  { id: '1', name: '6923333422康师傅红烧牛肉面', gmv: 185000, discount: 7500, usedCount: 820, trend: { sales: [15, 18, 22, 25, 30], discount: [0.6, 0.7, 0.8, 0.9, 1.0] } },
  { id: '2', name: '6923333423康师傅香辣牛肉面', gmv: 175000, discount: 7200, usedCount: 780, trend: { sales: [14, 17, 20, 23, 28], discount: [0.5, 0.6, 0.7, 0.8, 0.9] } },
  { id: '3', name: '6923333424康师傅老坛酸菜面', gmv: 165000, discount: 6800, usedCount: 720, trend: { sales: [13, 16, 19, 22, 26], discount: [0.4, 0.5, 0.6, 0.7, 0.8] } },
  { id: '4', name: '6923333425康师傅鲜虾鱼板面', gmv: 155000, discount: 6500, usedCount: 680, trend: { sales: [12, 15, 18, 21, 24], discount: [0.4, 0.5, 0.6, 0.7, 0.8] } },
  { id: '5', name: '6923333426康师傅西红柿鸡蛋面', gmv: 145000, discount: 6200, usedCount: 640, trend: { sales: [11, 14, 17, 20, 23], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '6', name: '6923333427康师傅麻辣牛肉面', gmv: 135000, discount: 5800, usedCount: 600, trend: { sales: [10, 13, 16, 19, 22], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '7', name: '6923333428康师傅香菇炖鸡面', gmv: 125000, discount: 5500, usedCount: 560, trend: { sales: [9, 12, 15, 18, 20], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '8', name: '6923333429康师傅酸辣牛肉面', gmv: 115000, discount: 5200, usedCount: 520, trend: { sales: [8, 11, 14, 17, 19], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '9', name: '6923333430康师傅鲜虾面', gmv: 105000, discount: 4800, usedCount: 480, trend: { sales: [7, 10, 13, 16, 18], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '10', name: '6923333431康师傅排骨面', gmv: 95000, discount: 4500, usedCount: 440, trend: { sales: [6, 9, 12, 15, 17], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '11', name: '6923333432康师傅海鲜面', gmv: 85000, discount: 4200, usedCount: 400, trend: { sales: [5, 8, 11, 14, 16], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '12', name: '6923333433康师傅蘑菇面', gmv: 75000, discount: 3800, usedCount: 360, trend: { sales: [4, 7, 10, 13, 15], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } }
];

const ActivityAnalysis: React.FC = () => {
  const location = useLocation();
  const [selectedActivity, setSelectedActivity] = useState<string>('1');
  const [retailerType, setRetailerType] = useState<string>('all');
  const [retailerPage, setRetailerPage] = useState<number>(1);
  const [productPage, setProductPage] = useState<number>(1);
  const [showSmallStores, setShowSmallStores] = useState<boolean>(false);
  const [dateType, setDateType] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>([
    dayjs().subtract(1, 'month'),
    dayjs()
  ]);
  const [trendModalVisible, setTrendModalVisible] = useState<boolean>(false);
  const [selectedRetailerTrend, setSelectedRetailerTrend] = useState<any>(null);
  const [productTrendModalVisible, setProductTrendModalVisible] = useState<boolean>(false);
  const [selectedProductTrend, setSelectedProductTrend] = useState<any>(null);
  
  // 处理URL参数，设置默认选中的活动
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const activityId = searchParams.get('activityId');
    if (activityId) {
      // 根据activityId映射到对应的活动ID
      const activityMapping: { [key: string]: string } = {
        'ACT001': '1',
        'ACT002': '2', 
        'ACT003': '3',
        'ACT004': '1', // 待开始活动映射到第一个活动
        'ACT005': '1', // 待开始活动映射到第一个活动
        'ACT006': '3'  // 已结束活动映射到第三个活动
      };
      const mappedId = activityMapping[activityId] || '1';
      setSelectedActivity(mappedId);
    }
  }, [location.search]);
  
  // 折线图可见性状态
  const [visibleLines, setVisibleLines] = useState({
    gmv: true,
    usedCount: false,
    batchCount: false,
    discount: false,
    usageRate: false
  });

  // 获取当前选中的活动数据
  const currentActivity = mockActivities.find(activity => activity.id === selectedActivity) || mockActivities[0];
  
  // 模拟趋势数据
  const mockTrends = [
    { date: '2025-01-01', gmv: 120000, usedCount: 15000, batchCount: 80, discount: 25000, usageRate: 75.2 },
    { date: '2025-01-02', gmv: 135000, usedCount: 16500, batchCount: 85, discount: 28000, usageRate: 76.8 },
    { date: '2025-01-03', gmv: 142500, usedCount: 18750, batchCount: 120, discount: 32500, usageRate: 78.5 },
    { date: '2025-01-04', gmv: 138000, usedCount: 17200, batchCount: 95, discount: 30000, usageRate: 77.1 },
    { date: '2025-01-05', gmv: 145000, usedCount: 19000, batchCount: 110, discount: 33500, usageRate: 79.2 },
    { date: '2025-01-06', gmv: 152000, usedCount: 20500, batchCount: 125, discount: 35000, usageRate: 80.1 },
    { date: '2025-01-07', gmv: 148000, usedCount: 19800, batchCount: 115, discount: 34000, usageRate: 79.5 }
  ];

  // 零售商分页数据
  const filteredRetailers = showSmallStores 
    ? mockRetailers.filter(retailer => retailer.type === '小店')
    : mockRetailers;
  const retailerPageSize = 10;
  const retailerStartIndex = (retailerPage - 1) * retailerPageSize;
  const currentRetailers = filteredRetailers.slice(retailerStartIndex, retailerStartIndex + retailerPageSize);

  // 商品分页数据
  const productPageSize = 10;
  const productStartIndex = (productPage - 1) * productPageSize;
  const currentProducts = mockProducts.slice(productStartIndex, productStartIndex + productPageSize);

  // 零售商表格列定义
  const retailerColumns = [
    {
      title: '序号',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => retailerStartIndex + index + 1,
    },
    {
      title: '零售商名称',
      dataIndex: 'name',
      key: 'name',
      width: 140,
    },
    {
      title: '销售额(元)',
      dataIndex: 'gmv',
      key: 'gmv',
      width: 110,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '优惠金额(元)',
      dataIndex: 'discount',
      key: 'discount',
      width: 110,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '核销数',
      dataIndex: 'usedCount',
      key: 'usedCount',
      width: 90,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '单均价(元)',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 90,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '动销SKU数',
      dataIndex: 'activeSku',
      key: 'activeSku',
      width: 100,
    },
    {
      title: '趋势',
      key: 'trend',
      width: 70,
      render: (record: any) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            setSelectedRetailerTrend(record);
            setTrendModalVisible(true);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  // 商品表格列定义
  const productColumns = [
    {
      title: '序号',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => productStartIndex + index + 1,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '销售额(元)',
      dataIndex: 'gmv',
      key: 'gmv',
      width: 110,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '优惠金额(元)',
      dataIndex: 'discount',
      key: 'discount',
      width: 110,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '核销数',
      dataIndex: 'usedCount',
      key: 'usedCount',
      width: 90,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '趋势',
      key: 'trend',
      width: 70,
      render: (record: any) => (
        <Button 
          type="link" 
          size="small" 
          onClick={() => showProductTrendModal(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 时间筛选处理函数
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setDateRange(dates);
  };

  const handleDateTypeChange = (e: any) => {
    setDateType(e.target.value);
  };

  // 趋势弹窗处理函数
  const showTrendModal = (retailer: any) => {
    setSelectedRetailerTrend(retailer);
    setTrendModalVisible(true);
  };

  const closeTrendModal = () => {
    setTrendModalVisible(false);
    setSelectedRetailerTrend(null);
  };

  const showProductTrendModal = (product: any) => {
    setSelectedProductTrend(product);
    setProductTrendModalVisible(true);
  };

  const closeProductTrendModal = () => {
    setProductTrendModalVisible(false);
    setSelectedProductTrend(null);
  };

  return (
      <div className="activity-analysis-container">
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>活动分析</Title>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text>时间筛选：</Text>
                <Radio.Group value={dateType} onChange={handleDateTypeChange} size="small">
                  <Radio.Button value="day">日</Radio.Button>
                  <Radio.Button value="week">周</Radio.Button>
                  <Radio.Button value="month">月</Radio.Button>
                </Radio.Group>
                <RangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  picker={dateType as any}
                  style={{ width: 240 }}
                  size="small"
                />
              </div>
              <Select
                style={{ width: 400 }}
                placeholder="选择活动"
                value={selectedActivity}
                onChange={setSelectedActivity}
                showSearch
              >
                {mockActivities.map(activity => (
                  <Option key={activity.id} value={activity.id}>
                    {activity.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

      {/* 2. 活动详情 */}
      {currentActivity && (
        <Card title="活动详情" style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col span={16}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div>
                    <Text strong>活动名称：</Text>
                    <Text>{currentActivity.name}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动周期：</Text>
                    <Text>{currentActivity.startDate} 至 {currentActivity.endDate}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动机制：</Text>
                    <div style={{ marginTop: 8 }}>
                      {currentActivity.mechanisms.map((mechanism, index) => (
                        <Tag key={index} style={{ margin: '2px 4px 2px 0' }}>
                          {mechanism}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div>
                <Text strong>活动预算与消耗：</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text>预算：</Text>
                    <Text strong style={{ color: '#1890ff' }}>
                      ¥{(currentActivity.budget / 10000).toFixed(1)}万
                    </Text>
                  </div>
                  <div>
                    <Text>消耗：</Text>
                    <Text strong style={{ color: '#52c41a' }}>
                      ¥{(currentActivity.consumed / 10000).toFixed(1)}万
                    </Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Progress 
                      percent={Math.round((currentActivity.consumed / currentActivity.budget) * 100)}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* 3. 核心指标 */}
      <Card title="核心指标" style={{ marginBottom: 0, borderBottom: 'none' }}>
        <Row gutter={0} style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 活动销售额 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>活动销售额</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝平台：</strong></div>
                      <div style={{ marginBottom: 8 }}>所有订单的订单商品数量×商品价格之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.gmv}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
                suffix="元"
              />
            </Card>
          </Col>
          
          {/* 核券数 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>核券数</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>平台下载的正向账单数量之和（无账单活动，取活动详情中统计的核销数量）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.usedCount}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          {/* 活动数 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>活动数</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div>平台侧创建的活动数量之和</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.batchCount}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          {/* 优惠金额 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>优惠金额</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>账单中返回的优惠金额之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.discount}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
                suffix="元"
              />
            </Card>
          </Col>
          
          {/* 核销率 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>核销率</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>仅供参考</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>(未退款账单之和/平台活动详情中的领券数之和)×100%</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.usageRate}
                precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 3.5. 指标趋势 */}
      <Card style={{ marginBottom: 16, marginTop: 0, borderTop: 'none' }}>
        {/* 指标选择器 */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { key: 'gmv', label: '活动销售额', color: '#1890ff' },
        { key: 'usedCount', label: '核券数', color: '#40a9ff' },
        { key: 'batchCount', label: '活动数', color: '#096dd9' },
        { key: 'discount', label: '优惠金额', color: '#69c0ff' },
        { key: 'usageRate', label: '核销率', color: '#91d5ff' }
          ].map(metric => (
            <div 
              key={metric.key} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                backgroundColor: visibleLines[metric.key as keyof typeof visibleLines] ? 'rgba(0,0,0,0.02)' : 'transparent',
                 opacity: visibleLines[metric.key as keyof typeof visibleLines] ? 1 : 0.5
              }}
              onClick={() => setVisibleLines({
                gmv: false,
                usedCount: false,
                batchCount: false,
                discount: false,
                usageRate: false,
                [metric.key]: true
              })}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = visibleLines[metric.key as keyof typeof visibleLines] ? 'rgba(0,0,0,0.02)' : 'transparent';
               }}
            >
              <div 
                style={{ 
                  width: '12px', 
                  height: '2px', 
                  backgroundColor: visibleLines[metric.key as keyof typeof visibleLines] ? metric.color : '#ccc',
                  marginRight: '8px',
                  borderRadius: '1px',
                  transition: 'background-color 0.2s ease'
                }} 
              />
              <span style={{ 
                color: visibleLines[metric.key as keyof typeof visibleLines] ? '#333' : '#999',
                 fontSize: '14px',
                 fontWeight: visibleLines[metric.key as keyof typeof visibleLines] ? '500' : '400',
                transition: 'all 0.2s ease'
              }}>
                {metric.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* 折线图 */}
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                const metricLabels: {[key: string]: string} = {
                  'gmv': '活动销售额',
                  'usedCount': '核券数',
                  'batchCount': '活动数',
                  'discount': '优惠金额',
                  'usageRate': '核销率'
                };
                
                if (name === 'usageRate') {
                  return [`${value}%`, metricLabels[name as string]];
                } else if (name === 'gmv' || name === 'discount') {
                  return [`${(value as number).toLocaleString()} 元`, metricLabels[name as string]];
                } else {
                  return [(value as number).toLocaleString(), metricLabels[name as string]];
                }
              }} />
              <Legend />
              
              {/* 动态渲染所有可见的折线 */}
              {visibleLines.gmv && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="gmv"
                  stroke="#1890ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="活动销售额"
                />
              )}
              
              {visibleLines.usedCount && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="usedCount"
                  stroke="#40a9ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="核券数"
                />
              )}
              
              {visibleLines.batchCount && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="batchCount"
                  stroke="#096dd9"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="活动数"
                />
              )}
              
              {visibleLines.discount && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="discount"
                  stroke="#69c0ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="优惠金额"
                />
              )}
              
              {visibleLines.usageRate && (
                <RechartsLine
                  yAxisId="right"
                  type="monotone"
                  dataKey="usageRate"
                  stroke="#91d5ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="核销率"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. 批次对比 */}
      <Card title="批次对比" style={{ marginBottom: 16 }}>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              data={currentActivity?.batches || []}
              margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="gmv" 
                type="number" 
                name="销售额"
                unit="万元"
                tickFormatter={(value) => `${(value / 10000).toFixed(1)}`}
                label={{ value: '销售额', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis 
                dataKey="discount" 
                type="number" 
                name="优惠金额"
                unit="万元"
                tickFormatter={(value) => `${(value / 10000).toFixed(1)}`}
                label={{ value: '优惠金额', angle: 0, position: 'insideTopLeft', textAnchor: 'start', offset: 10, dx: -50 }}
              />
              <Tooltip 
                  formatter={(value, name, props) => {
                    if (name === 'discount') {
                      return [`${(Number(value) / 10000).toFixed(1)}万元`, '优惠金额'];
                    }
                    return [`${(Number(value) / 10000).toFixed(1)}万元`, '销售金额'];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.name;
                    }
                    return '';
                  }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ 
                          backgroundColor: 'white', 
                          padding: '8px 12px', 
                          border: '1px solid #ccc', 
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data.name}</div>
                          <div>优惠金额：{(data.discount / 10000).toFixed(1)}万元</div>
                          <div>销售额：{(data.gmv / 10000).toFixed(1)}万元</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              <Scatter dataKey="discount" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 5. 零售商 */}
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title="零售商" 
            extra={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={showSmallStores} 
                    onChange={(e) => setShowSmallStores(e.target.checked)}
                    style={{ marginRight: 4 }}
                  />
                  显示小店
                </label>
              </div>
            }
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={retailerColumns}
              dataSource={currentRetailers}
              pagination={false}
              size="small"
              rowKey="id"
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Pagination
                current={retailerPage}
                total={filteredRetailers.length}
                pageSize={retailerPageSize}
                onChange={setRetailerPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 6. 商品 */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="商品" style={{ marginBottom: 16 }}>
            <Table
              columns={productColumns}
              dataSource={currentProducts}
              pagination={false}
              size="small"
              rowKey="id"
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Pagination
                current={productPage}
                total={mockProducts.length}
                pageSize={productPageSize}
                onChange={setProductPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 趋势弹窗 */}
      <Modal
        title={`${selectedRetailerTrend?.name} - 趋势分析`}
        open={trendModalVisible}
        onCancel={closeTrendModal}
        footer={null}
        width={800}
      >
        {selectedRetailerTrend && dateRange && dateRange[0] && dateRange[1] && (
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={selectedRetailerTrend.trend.sales.map((sales: number, index: number) => {
                  const startDate = dateRange[0]!;
                  const endDate = dateRange[1]!;
                  const totalDays = endDate.diff(startDate, 'day');
                  const intervalDays = Math.floor(totalDays / (selectedRetailerTrend.trend.sales.length - 1));
                  const currentDate = startDate.add(index * intervalDays, 'day');
                  
                  return {
                    period: currentDate.format('MM-DD'),
                    sales: sales * 10000,
                    discount: selectedRetailerTrend.trend.discount[index] * 10000
                  };
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${(value / 10000).toFixed(1)}万元`,
                    name === 'sales' ? '销售额' : '优惠金额'
                  ]}
                />
                <Legend />
                <RechartsLine 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  name="销售额"
                  strokeWidth={2}
                />
                <RechartsLine 
                  type="monotone" 
                  dataKey="discount" 
                  stroke="#82ca9d" 
                  name="优惠金额"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>

      {/* 商品趋势弹窗 */}
      <Modal
        title={`${selectedProductTrend?.name} - 趋势分析`}
        open={productTrendModalVisible}
        onCancel={closeProductTrendModal}
        footer={null}
        width={800}
      >
        {selectedProductTrend && dateRange && dateRange[0] && dateRange[1] && (
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={selectedProductTrend.trend.sales.map((sales: number, index: number) => {
                  const startDate = dateRange[0]!;
                  const endDate = dateRange[1]!;
                  const totalDays = endDate.diff(startDate, 'day');
                  const intervalDays = Math.floor(totalDays / (selectedProductTrend.trend.sales.length - 1));
                  const currentDate = startDate.add(index * intervalDays, 'day');
                  
                  return {
                    period: currentDate.format('MM-DD'),
                    sales: sales * 10000,
                    discount: selectedProductTrend.trend.discount[index] * 10000
                  };
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${(value / 10000).toFixed(1)}万元`,
                    name === 'sales' ? '销售额' : '优惠金额'
                  ]}
                />
                <Legend />
                <RechartsLine 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  name="销售额"
                  strokeWidth={2}
                />
                <RechartsLine 
                  type="monotone" 
                  dataKey="discount" 
                  stroke="#82ca9d" 
                  name="优惠金额"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActivityAnalysis;