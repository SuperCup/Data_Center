import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Divider, DatePicker, Select, Tabs, Tooltip as AntTooltip, Radio, Tag, Typography, Button, Table } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingOutlined, DollarOutlined, TagOutlined, AppstoreOutlined, InfoCircleOutlined, QuestionCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { PieChart, Pie as RechartsPie, Cell, LineChart, Line as RechartsLine, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// 高级配色方案 - 调整为蓝色主题和灰黑文字
const COLORS = [
  '#1890ff',  // 主蓝色 - 图标图形主色
  '#40a9ff',  // 浅蓝色 - 图标图形辅色
  '#096dd9',  // 深蓝色 - 图标图形强调色
  '#69c0ff',  // 亮蓝色 - 图标图形补充色
  '#91d5ff',  // 淡蓝色 - 图标图形背景色
  '#bae7ff',  // 极淡蓝色 - 图标图形边框色
  '#e6f7ff',  // 蓝色背景 - 图标图形填充色
  '#d4edda',  // 成功色背景
  '#262626',  // 深灰色 - 主要文字色
  '#595959'   // 中灰色 - 次要文字色
];

const PLATFORM_COLORS = {
  '微信': '#07C160',     // 微信绿色
  '支付宝': '#1677FF',   // 支付宝蓝色
  '抖音到店': '#000000'  // 抖音黑色
};

// 渐变高亮配色 - 蓝色系为主
const HIGHLIGHT_COLORS = {
  first: '#1890ff',     // 主蓝色
  second: '#40a9ff',    // 浅蓝色
  third: '#096dd9',     // 深蓝色
  fourth: '#69c0ff',    // 亮蓝色
  fifth: '#91d5ff',     // 淡蓝色
  sixth: '#bae7ff',     // 极淡蓝色
  seventh: '#e6f7ff',   // 蓝色背景
  eighth: '#1890ff',    // 主蓝色（重复使用）
  ninth: '#40a9ff',     // 浅蓝色（重复使用）
  tenth: '#8c8c8c',     // 灰色 - 文字色
  normal: '#d9d9d9'     // 浅灰色
};

const Dashboard: React.FC = () => {
  // 状态管理
  const [dateType, setDateType] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[string, string]>(['2025-10-01', '2025-10-31']);
  const [platform, setPlatform] = useState<string>('all');
  const [trendMetric, setTrendMetric] = useState<string>('gmv');
  
  // 折线图显示状态管理
  const [visibleLines, setVisibleLines] = useState<{[key: string]: boolean}>({
    gmv: true,        // 默认显示活动销售额
    usedCount: false,
    batchCount: false,
    discount: false,
    usageRate: false
  });
  
  // 发券渠道状态 - 重新设计为平台视图
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('微信'); // 默认选中微信平台
  
  // 零售商/机制指标状态
  const [retailerMetric, setRetailerMetric] = useState<string>('usedCount');
  
  // SKU排序状态
  const [skuSortBy, setSkuSortBy] = useState<string>('gmv');
  
  // 平台发券数据 - 各平台发券占比
  const platformIssuanceData = [
    { 
      name: '微信', 
      issuedCount: 280000, 
      usedCount: 224000, 
      gmv: 3276000, 
      discount: 1310400,
      usageRate: 80.0
    },
    { 
      name: '支付宝', 
      issuedCount: 200000, 
      usedCount: 160000, 
      gmv: 2340000, 
      discount: 936000,
      usageRate: 80.0
    },
    { 
      name: '抖音到店', 
      issuedCount: 15000, 
      usedCount: 12000, 
      gmv: 175500, 
      discount: 70200,
      usageRate: 80.0
    },
  ];

  // 各平台下的渠道数据
  const platformChannelData = {
    '微信': [
      { name: '品牌小程序', issuedCount: 80000, usedCount: 72000, gmv: 1800000, discount: 720000, usageRate: 90.0 },
      { name: '支付有礼', issuedCount: 70000, usedCount: 60000, gmv: 1500000, discount: 600000, usageRate: 85.7 },
      { name: '立减与折扣', issuedCount: 30000, usedCount: 12000, gmv: 306000, discount: 121500, usageRate: 40.0 },
      { name: '零售商小程序', issuedCount: 25000, usedCount: 20000, gmv: 500000, discount: 200000, usageRate: 80.0 },
      { name: '扫码领券', issuedCount: 20000, usedCount: 16000, gmv: 400000, discount: 160000, usageRate: 80.0 },
      { name: '社群', issuedCount: 15000, usedCount: 12000, gmv: 300000, discount: 120000, usageRate: 80.0 },
      { name: '智能促销员', issuedCount: 12000, usedCount: 10000, gmv: 250000, discount: 100000, usageRate: 83.3 },
      { name: '扫码购', issuedCount: 10000, usedCount: 8000, gmv: 200000, discount: 80000, usageRate: 80.0 },
      { name: '碰一下', issuedCount: 8000, usedCount: 6000, gmv: 150000, discount: 60000, usageRate: 75.0 },
      { name: 'H5', issuedCount: 5000, usedCount: 4000, gmv: 100000, discount: 40000, usageRate: 80.0 },
    ],
    '支付宝': [
      { name: '支付有礼', issuedCount: 50000, usedCount: 40000, gmv: 800000, discount: 320000, usageRate: 80.0 },
      { name: '扫码领券', issuedCount: 30000, usedCount: 25000, gmv: 500000, discount: 200000, usageRate: 83.3 },
      { name: '零售商小程序', issuedCount: 20000, usedCount: 15000, gmv: 370000, discount: 147500, usageRate: 75.0 },
      { name: '品牌小程序', issuedCount: 18000, usedCount: 15000, gmv: 350000, discount: 140000, usageRate: 83.3 },
      { name: '立减与折扣', issuedCount: 15000, usedCount: 12000, gmv: 300000, discount: 120000, usageRate: 80.0 },
      { name: '社群', issuedCount: 12000, usedCount: 10000, gmv: 250000, discount: 100000, usageRate: 83.3 },
      { name: '智能促销员', issuedCount: 10000, usedCount: 8000, gmv: 200000, discount: 80000, usageRate: 80.0 },
      { name: '扫码购', issuedCount: 8000, usedCount: 6000, gmv: 150000, discount: 60000, usageRate: 75.0 },
      { name: '碰一下', issuedCount: 6000, usedCount: 5000, gmv: 120000, discount: 48000, usageRate: 83.3 },
      { name: 'H5', issuedCount: 3000, usedCount: 2500, gmv: 80000, discount: 32000, usageRate: 83.3 },
    ],
    '抖音到店': [
      { name: '社群', issuedCount: 80000, usedCount: 64000, gmv: 936000, discount: 374000, usageRate: 80.0 },
    ],
  };

  // 获取平台饼图数据
  const getPlatformPieData = () => {
    return platformIssuanceData.map(item => ({
      name: item.name,
      value: item.issuedCount
    }));
  };

  // 获取选中平台的渠道数据
  const getSelectedPlatformChannels = () => {
    if (!selectedPlatform) return [];
    return platformChannelData[selectedPlatform as keyof typeof platformChannelData] || [];
  };
  const issuedChannelRanking = [
    { name: '品牌小程序', issued: 180000 },
    { name: '支付有礼', issued: 150000 },
    { name: '零售商小程序', issued: 120000 },
    { name: '扫码领券', issued: 100000 },
    { name: '立减与折扣', issued: 80000 },
    { name: '社群', issued: 70000 },
    { name: '智能促销员', issued: 60000 },
    { name: '扫码购', issued: 50000 },
    { name: '碰一下', issued: 30000 },
    { name: 'H5', issued: 10000 },
  ];

  const usedChannelRanking = [
    { name: '品牌小程序', used: 72000 },
    { name: '支付有礼', used: 60000 },
    { name: '零售商小程序', used: 48000 },
    { name: '扫码领券', used: 40000 },
    { name: '立减与折扣', used: 32000 },
    { name: '社群', used: 28000 },
    { name: '智能促销员', used: 24000 },
    { name: '扫码购', used: 20000 },
    { name: '碰一下', used: 12000 },
    { name: 'H5', used: 4000 },
  ];

  // 分发渠道数据
  const distributionChannels = [
    { name: '品牌小程序', wechat: 80000, alipay: 50000, douyin_visitor: 30000, meituan_local: 20000 },
    { name: '支付有礼', wechat: 70000, alipay: 40000, douyin_visitor: 25000, meituan_local: 15000 },
    { name: '零售商小程序', wechat: 60000, alipay: 30000, douyin_visitor: 20000, meituan_local: 10000 },
    { name: '扫码领券', wechat: 50000, alipay: 25000, douyin_visitor: 15000, meituan_local: 10000 },
    { name: '立减与折扣', wechat: 40000, alipay: 20000, douyin_visitor: 10000, meituan_local: 10000 },
  ];

  // 模拟数据
  const stats = {
    // 分发渠道数据
    distributionChannels,
    // 核心指标数据
    overview: {
      gmv: 4680000,
      gmvYoY: 15.2, // 同比增长
      gmvMoM: 5.8,  // 环比增长
      usedCount: 320000,
      usedCountYoY: 12.5,
      usedCountMoM: 4.2,
      batchCount: 12,
      batchCountYoY: 20.0,
      batchCountMoM: 9.1,
      discount: 1870000,
      discountYoY: 18.3,
      discountMoM: 7.5,
      usageRate: 37.6, // 核销率
      usageRateYoY: 2.5,
      usageRateMoM: 1.2
    },
    // 预算数据
    budget: {
      total: 2800000,
      used: 1870000,
      usageRate: 66.8,
      updateTime: '2025-10-31 23:59:59'
    },
    // 平台数据
    platformData: [
      { name: '微信', value: 45, gmv: 2106000, discount: 841500, budget: 80, clientBudget: { total: 1000000, used: 800000 }, orders: 21060, usedCount: 144000 },
      { name: '支付宝', value: 25, gmv: 1170000, discount: 467500, budget: 70, clientBudget: { total: 800000, used: 560000 }, orders: 11700, usedCount: 80000 },
      { name: '抖音到店', value: 20, gmv: 936000, discount: 374000, budget: 65, clientBudget: { total: 600000, used: 390000 }, orders: 9360, usedCount: 64000 },
    ],
    // 趋势数据
    trends: [
      { date: '10-01', gmv: 156000, usedCount: 10667, batchCount: 12, discount: 62333, usageRate: 35.6 },
      { date: '10-02', gmv: 168000, usedCount: 11500, batchCount: 12, discount: 67200, usageRate: 36.2 },
      { date: '10-03', gmv: 180000, usedCount: 12333, batchCount: 12, discount: 72000, usageRate: 36.8 },
      { date: '10-04', gmv: 162000, usedCount: 11100, batchCount: 12, discount: 64800, usageRate: 37.0 },
      { date: '10-05', gmv: 150000, usedCount: 10267, batchCount: 12, discount: 60000, usageRate: 37.2 },
      { date: '10-06', gmv: 165000, usedCount: 11300, batchCount: 12, discount: 66000, usageRate: 37.4 },
      { date: '10-07', gmv: 175000, usedCount: 12000, batchCount: 12, discount: 70000, usageRate: 37.6 },
      { date: '10-08', gmv: 185000, usedCount: 12667, batchCount: 12, discount: 74000, usageRate: 37.8 },
      { date: '10-09', gmv: 190000, usedCount: 13000, batchCount: 12, discount: 76000, usageRate: 38.0 },
      { date: '10-10', gmv: 195000, usedCount: 13333, batchCount: 12, discount: 78000, usageRate: 38.2 },
    ],
    // 渠道数据
    channels: [
      { name: '品牌小程序', usedCount: 72000 },
      { name: '支付有礼', usedCount: 60000 },
      { name: '零售商小程序', usedCount: 48000 },
      { name: '扫码领券', usedCount: 40000 },
      { name: '立减与折扣', usedCount: 32000 },
      { name: '社群', usedCount: 28000 },
      { name: '智能促销员', usedCount: 24000 },
      { name: '扫码购', usedCount: 20000 },
      { name: '碰一下', usedCount: 12000 },
      { name: 'H5', usedCount: 4000 },
    ],
    // 零售商数据 - 支持5个指标
    retailers: [
      { name: '华润万家大卖场', usedCount: 65000, gmv: 1300000, batchCount: 5, discount: 130000, usageRate: 45.2 },
      { name: '沃尔玛', usedCount: 58000, gmv: 1160000, batchCount: 4, discount: 116000, usageRate: 42.8 },
      { name: '山姆', usedCount: 52000, gmv: 1040000, batchCount: 4, discount: 104000, usageRate: 41.5 },
      { name: '大润发', usedCount: 45000, gmv: 900000, batchCount: 3, discount: 90000, usageRate: 38.9 },
      { name: '永辉', usedCount: 38000, gmv: 760000, batchCount: 3, discount: 76000, usageRate: 36.2 },
      { name: '物美超市', usedCount: 32000, gmv: 640000, batchCount: 2, discount: 64000, usageRate: 34.8 },
      { name: '麦德龙', usedCount: 28000, gmv: 560000, batchCount: 2, discount: 56000, usageRate: 33.1 },
      { name: '大张盛德美', usedCount: 24000, gmv: 480000, batchCount: 2, discount: 48000, usageRate: 31.5 },
      { name: '永旺', usedCount: 20000, gmv: 400000, batchCount: 1, discount: 40000, usageRate: 29.8 },
      { name: '华润苏果便利店', usedCount: 18000, gmv: 360000, batchCount: 1, discount: 36000, usageRate: 28.2 },
    ],
    // 机制数据 - 支持5个指标
    mechanisms: [
      { name: '满200减30', usedCount: 85000, gmv: 1700000, batchCount: 6, discount: 170000, usageRate: 48.5 },
      { name: '满100减15', usedCount: 72000, gmv: 1440000, batchCount: 5, discount: 144000, usageRate: 45.8 },
      { name: '满50减8', usedCount: 58000, gmv: 1160000, batchCount: 4, discount: 116000, usageRate: 42.1 },
      { name: '满300减50', usedCount: 45000, gmv: 900000, batchCount: 3, discount: 90000, usageRate: 38.9 },
      { name: '满150减25', usedCount: 38000, gmv: 760000, batchCount: 3, discount: 76000, usageRate: 36.2 },
      { name: '满80减12', usedCount: 32000, gmv: 640000, batchCount: 2, discount: 64000, usageRate: 34.8 },
      { name: '满60减10', usedCount: 28000, gmv: 560000, batchCount: 2, discount: 56000, usageRate: 33.1 },
      { name: '满120减20', usedCount: 24000, gmv: 480000, batchCount: 2, discount: 48000, usageRate: 31.5 },
      { name: '满88减15', usedCount: 18000, gmv: 360000, batchCount: 1, discount: 36000, usageRate: 28.2 },
      { name: '满168减28', usedCount: 15000, gmv: 300000, batchCount: 1, discount: 30000, usageRate: 25.8 },
    ],
    // SKU数据
    skus: [
      { name: '康师傅红烧牛肉面', code69: '6901028089296', gmv: 240000, orderCount: 2400, discount: 24000, usedCount: 24000, salesVolume: 4800 },
      { name: '康师傅香辣牛肉面', code69: '6901028089302', gmv: 210000, orderCount: 2100, discount: 21000, usedCount: 21000, salesVolume: 4200 },
      { name: '康师傅老坛酸菜面', code69: '6901028089319', gmv: 190000, orderCount: 1900, discount: 19000, usedCount: 19000, salesVolume: 3800 },
      { name: '康师傅鲜虾鱼板面', code69: '6901028089326', gmv: 170000, orderCount: 1700, discount: 17000, usedCount: 17000, salesVolume: 3400 },
      { name: '康师傅西红柿鸡蛋面', code69: '6901028089333', gmv: 150000, orderCount: 1500, discount: 15000, usedCount: 15000, salesVolume: 3000 },
      { name: '康师傅麻辣牛肉面', code69: '6901028089340', gmv: 130000, orderCount: 1300, discount: 13000, usedCount: 13000, salesVolume: 2600 },
      { name: '康师傅香菇炖鸡面', code69: '6901028089357', gmv: 110000, orderCount: 1100, discount: 11000, usedCount: 11000, salesVolume: 2200 },
      { name: '康师傅酸辣牛肉面', code69: '6901028089364', gmv: 90000, orderCount: 900, discount: 9000, usedCount: 9000, salesVolume: 1800 },
      { name: '康师傅绿茶 500ml', code69: '6901028089371', gmv: 75000, orderCount: 750, discount: 7500, usedCount: 7500, salesVolume: 1500 },
      { name: '康师傅冰红茶 500ml', code69: '6901028089388', gmv: 60000, orderCount: 600, discount: 6000, usedCount: 6000, salesVolume: 1200 },
    ],
    // 购物行为时段数据 - 按图片样式显示销售金额
    shoppingHours: [
      { timeRange: '00:00', usedCount: 144700, gmv: 1447000, rank: 12 },
      { timeRange: '01:00', usedCount: 27560, gmv: 275600, rank: 24 },
      { timeRange: '02:30', usedCount: 13610, gmv: 136100, rank: 23 },
      { timeRange: '06:30', usedCount: 41400, gmv: 414000, rank: 22 },
      { timeRange: '07:30', usedCount: 47570, gmv: 475700, rank: 21 },
      { timeRange: '08:30', usedCount: 78280, gmv: 782800, rank: 20 },
      { timeRange: '09:30', usedCount: 86920, gmv: 869200, rank: 19 },
      { timeRange: '10:30', usedCount: 157270, gmv: 1572700, rank: 8 },
      { timeRange: '11:30', usedCount: 233270, gmv: 2332700, rank: 1 },
      { timeRange: '12:30', usedCount: 213700, gmv: 2137000, rank: 2 },
      { timeRange: '13:30', usedCount: 179870, gmv: 1798700, rank: 4 },
      { timeRange: '14:30', usedCount: 133970, gmv: 1339700, rank: 9 },
      { timeRange: '15:30', usedCount: 97380, gmv: 973800, rank: 17 },
      { timeRange: '16:30', usedCount: 97670, gmv: 976700, rank: 16 },
      { timeRange: '17:30', usedCount: 100370, gmv: 1003700, rank: 15 },
      { timeRange: '18:30', usedCount: 126370, gmv: 1263700, rank: 11 },
      { timeRange: '19:30', usedCount: 145370, gmv: 1453700, rank: 7 },
      { timeRange: '20:30', usedCount: 164170, gmv: 1641700, rank: 6 },
      { timeRange: '21:30', usedCount: 178870, gmv: 1788700, rank: 5 },
      { timeRange: '22:30', usedCount: 183370, gmv: 1833700, rank: 3 },
      { timeRange: '23:30', usedCount: 171970, gmv: 1719700, rank: 10 },
      { timeRange: '00:30', usedCount: 149700, gmv: 1497000, rank: 13 },
      { timeRange: '01:30', usedCount: 133770, gmv: 1337700, rank: 14 },
      { timeRange: '02:00', usedCount: 153670, gmv: 1536700, rank: 18 },
      { timeRange: '03:00', usedCount: 174570, gmv: 1745700, rank: 12 },
      { timeRange: '04:00', usedCount: 90740, gmv: 907400, rank: 25 },
      { timeRange: '05:00', usedCount: 35740, gmv: 357400, rank: 26 },
    ].sort((a, b) => {
      // 按时间顺序排序
      const timeA = a.timeRange.split(':').map(Number);
      const timeB = b.timeRange.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    }),
    // 档期数据
    periods: [
      { name: '双11预售', usedCount: 64000, batchCount: 3, budgetUsed: 256000 },
      { name: '国庆黄金周', usedCount: 57600, batchCount: 4, budgetUsed: 230400 },
      { name: '开学季', usedCount: 51200, batchCount: 2, budgetUsed: 204800 },
      { name: '夏季促销', usedCount: 44800, batchCount: 3, budgetUsed: 179200 },
      { name: '618大促', usedCount: 38400, batchCount: 5, budgetUsed: 153600 },
      { name: '五一小长假', usedCount: 32000, batchCount: 2, budgetUsed: 128000 },
      { name: '春节特惠', usedCount: 25600, batchCount: 4, budgetUsed: 102400 },
      { name: '情人节专题', usedCount: 19200, batchCount: 1, budgetUsed: 76800 },
      { name: '会员日', usedCount: 12800, batchCount: 2, budgetUsed: 51200 },
      { name: '周年庆', usedCount: 6400, batchCount: 1, budgetUsed: 25600 },
    ]
  };

  // 处理日期类型变更
  const handleDateTypeChange = (e: any) => {
    setDateType(e.target.value);
    // 根据日期类型设置默认日期范围
    switch(e.target.value) {
      case 'day':
        setDateRange(['2025-10-31', '2025-10-31']);
        break;
      case 'month':
        setDateRange(['2025-10-01', '2025-10-31']);
        break;
      case 'year':
        setDateRange(['2025-01-01', '2025-12-31']);
        break;
      default:
        break;
    }
  };

  // 处理日期范围变更
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };



  // 处理零售商/机制指标变更
  const handleRetailerMetricChange = (value: string) => {
    setRetailerMetric(value);
  };

  // 获取排序后的零售商数据
  const getSortedRetailers = () => {
    return [...stats.retailers].sort((a, b) => {
      const aValue = a[retailerMetric as keyof typeof a] as number;
      const bValue = b[retailerMetric as keyof typeof b] as number;
      return bValue - aValue;
    });
  };

  // 获取排序后的机制数据
  const getSortedMechanisms = () => {
    return [...stats.mechanisms].sort((a, b) => {
      const aValue = a[retailerMetric as keyof typeof a] as number;
      const bValue = b[retailerMetric as keyof typeof b] as number;
      return bValue - aValue;
    });
  };

  // 获取指标的显示信息
  const getMetricInfo = (metric: string) => {
    const metricMap = {
      gmv: { label: '活动销售额', unit: '元', formatter: (value: number) => `${(value / 10000).toFixed(1)}万` },
      usedCount: { label: '核券数', unit: '次', formatter: (value: number) => value.toLocaleString() },
      batchCount: { label: '活动数', unit: '个', formatter: (value: number) => value.toString() },
      discount: { label: '优惠金额', unit: '元', formatter: (value: number) => `${(value / 10000).toFixed(1)}万` },
      usageRate: { label: '核销率', unit: '%', formatter: (value: number) => `${value.toFixed(1)}%` }
    };
    return metricMap[metric as keyof typeof metricMap] || metricMap.usedCount;
  };



  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>销售分析</Title>
        <AntTooltip title="数据统计范围为平台对一个所选时间段下在进行的批次（活动）的汇总">
          <QuestionCircleOutlined style={{ color: '#999', cursor: 'help' }} />
        </AntTooltip>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text type="secondary">数据更新时间：{stats.budget.updateTime}</Text>
        </div>
      </div>
      
      {/* 1. 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Radio.Group value={dateType} onChange={handleDateTypeChange} style={{ marginRight: 16 }}>
              <Radio.Button value="day">日</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
              <Radio.Button value="year">年</Radio.Button>
              <Radio.Button value="custom">自定义</Radio.Button>
            </Radio.Group>
            <RangePicker 
              value={dateRange.map(date => date ? moment(date) : null) as any} 
              onChange={handleDateRangeChange} 
              style={{ marginLeft: 8 }}
            />
          </Col>
          <Col span={16}>
            <Radio.Group value={platform} onChange={(e) => setPlatform(e.target.value)} buttonStyle="solid">
              <Radio.Button value="all">全部</Radio.Button>
              <Radio.Button value="wechat">微信</Radio.Button>
              <Radio.Button value="alipay">支付宝</Radio.Button>
              <Radio.Button value="douyin">抖音到店</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
      
      {/* 2. 核心指标与活动效果趋势 */}
      <Card title="核心指标" style={{ marginBottom: 16 }}>
        <Row gutter={0} style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 活动销售额 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>活动销售额</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝平台：</strong></div>
                      <div style={{ marginBottom: 8 }}>所有订单的订单商品数量×商品价格之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.gmv}
                precision={0}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
                suffix="元"
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ 
                  color: stats.overview.gmvYoY >= 0 ? 'red' : 'green', 
                  marginRight: 8,
                  ...(stats.overview.gmvYoY < 0 && {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    fontSize: '13px'
                  })
                }}>
                  {stats.overview.gmvYoY < 0 && <ArrowDownOutlined style={{ marginRight: 4 }} />}
                  同比 {stats.overview.gmvYoY >= 0 ? '+' : ''}{stats.overview.gmvYoY}%
                </span>
                <span style={{ 
                  color: stats.overview.gmvMoM >= 0 ? 'red' : 'green',
                  ...(stats.overview.gmvMoM < 0 && {
                    fontStyle: 'italic',
                    border: '1px solid green',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  })
                }}>
                  {stats.overview.gmvMoM < 0 && '↓ '}
                  环比 {stats.overview.gmvMoM >= 0 ? '+' : ''}{stats.overview.gmvMoM}%
                </span>
              </div>
            </Card>
          </Col>
          
          {/* 核券数 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>核券数</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>平台下载的正向账单数量之和（无账单活动，取活动详情中统计的核销数量）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.usedCount}
                precision={0}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ 
                  color: stats.overview.usedCountYoY >= 0 ? 'red' : 'green', 
                  marginRight: 8,
                  ...(stats.overview.usedCountYoY < 0 && {
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,0,0.1) 50%, transparent 100%)',
                    padding: '2px 4px',
                    borderRadius: '3px'
                  })
                }}>
                  同比 {stats.overview.usedCountYoY >= 0 ? '+' : ''}{stats.overview.usedCountYoY}%
                  {stats.overview.usedCountYoY < 0 && ' ⬇'}
                </span>
                <span style={{ 
                  color: stats.overview.usedCountMoM >= 0 ? 'red' : 'green',
                  ...(stats.overview.usedCountMoM < 0 && {
                    textShadow: '1px 1px 2px rgba(0,128,0,0.3)',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  })
                }}>
                  {stats.overview.usedCountMoM < 0 && <ArrowDownOutlined style={{ marginRight: 4 }} />}
                  环比 {stats.overview.usedCountMoM >= 0 ? '+' : ''}{stats.overview.usedCountMoM}%
                </span>
              </div>
            </Card>
          </Col>
          
          {/* 活动数 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>活动数</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div>平台侧创建的活动数量之和</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.batchCount}
                precision={0}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ 
                  color: stats.overview.batchCountYoY >= 0 ? 'red' : 'green', 
                  marginRight: 8,
                  ...(stats.overview.batchCountYoY < 0 && {
                    position: 'relative'
                  })
                }}>
                  同比 {stats.overview.batchCountYoY >= 0 ? '+' : ''}{stats.overview.batchCountYoY}%
                  {stats.overview.batchCountYoY < 0 && ' 📉'}
                </span>
                <span style={{ 
                  color: stats.overview.batchCountMoM >= 0 ? 'red' : 'green',
                  ...(stats.overview.batchCountMoM < 0 && {
                    borderLeft: '3px solid green',
                    paddingLeft: '8px',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  })
                }}>
                  环比 {stats.overview.batchCountMoM >= 0 ? '+' : ''}{stats.overview.batchCountMoM}%
                </span>
              </div>
            </Card>
          </Col>
          
          {/* 优惠金额 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>优惠金额</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>账单中返回的优惠金额之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.discount}
                precision={0}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
                suffix="元"
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ color: stats.overview.discountYoY >= 0 ? 'red' : 'green', marginRight: 8 }}>
                  同比 {stats.overview.discountYoY >= 0 ? '+' : ''}{stats.overview.discountYoY}%
                </span>
                <span style={{ color: stats.overview.discountMoM >= 0 ? 'red' : 'green' }}>
                  环比 {stats.overview.discountMoM >= 0 ? '+' : ''}{stats.overview.discountMoM}%
                </span>
              </div>
            </Card>
          </Col>
          
          {/* 核销率 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>核销率</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>仅供参考</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>(未退款账单之和/平台活动详情中的领券数之和)×100%</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.usageRate}
                precision={1}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
                suffix="%"
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ color: stats.overview.usageRateYoY >= 0 ? 'red' : 'green', marginRight: 8 }}>
                  同比 {stats.overview.usageRateYoY >= 0 ? '+' : ''}{stats.overview.usageRateYoY}%
                </span>
                <span style={{ color: stats.overview.usageRateMoM >= 0 ? 'red' : 'green' }}>
                  环比 {stats.overview.usageRateMoM >= 0 ? '+' : ''}{stats.overview.usageRateMoM}%
                </span>
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* 指标趋势 */}
        <div style={{ marginBottom: 16, marginTop: 32 }}>
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
                  backgroundColor: visibleLines[metric.key] ? 'rgba(0,0,0,0.02)' : 'transparent',
                  opacity: visibleLines[metric.key] ? 1 : 0.5
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
                  e.currentTarget.style.backgroundColor = visibleLines[metric.key] ? 'rgba(0,0,0,0.02)' : 'transparent';
                }}
              >
                <div 
                  style={{ 
                    width: '12px', 
                    height: '2px', 
                    backgroundColor: visibleLines[metric.key] ? metric.color : '#ccc',
                    marginRight: '8px',
                    borderRadius: '1px',
                    transition: 'background-color 0.2s ease'
                  }} 
                />
                <span style={{ 
                  color: visibleLines[metric.key] ? '#333' : '#999',
                  fontSize: '14px',
                  fontWeight: visibleLines[metric.key] ? '500' : '400',
                  transition: 'all 0.2s ease'
                }}>
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.trends}
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
      
      {/* 发券渠道模块 - 重新设计为平台视图 */}
      <Card title="发券渠道" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          {/* 左侧：平台发券占比饼图 */}
          <Col span={10}>
            <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsPie
                    data={getPlatformPieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={(entry: any) => {
                      const { name, percent } = entry;
                      return `${name}\n${(percent * 100).toFixed(1)}%`;
                    }}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => setSelectedPlatform(data.name)}
                  >
                    {getPlatformPieData().map((entry, index) => {
                      const baseColor = PLATFORM_COLORS[entry.name as keyof typeof PLATFORM_COLORS] || COLORS[index % COLORS.length];
                      const isSelected = selectedPlatform === entry.name;
                      
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={baseColor}
                          style={{ 
                            cursor: 'pointer',
                            filter: isSelected ? 'brightness(1.2) drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      );
                    })}
                  </RechartsPie>
                  <Tooltip 
                    formatter={(value, name) => {
                      return [`${value.toLocaleString()}`, '发券数'];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                点击饼图查看形态渠道明细
              </Text>
            </div>
          </Col>
          
          {/* 右侧：选中平台的渠道数据明细 */}
          <Col span={14}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#fafafa', 
              borderRadius: '8px', 
              height: '400px',
              border: '1px solid #e8e8e8'
            }}>
              {selectedPlatform ? (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-start',
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: '2px solid #1890ff'
                  }}>
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                      {selectedPlatform}
                    </Title>
                  </div>
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    <Table
                      dataSource={getSelectedPlatformChannels()}
                      pagination={false}
                      size="small"
                      rowKey="name"
                      bordered
                      columns={[
                        {
                          title: '发券渠道',
                          dataIndex: 'name',
                          key: 'name',
                          width: 120,
                          render: (text) => (
                            <span style={{ 
                              fontWeight: 'bold',
                              color: '#262626'
                            }}>
                              {text}
                            </span>
                          )
                        },
                        {
                          title: '发券数',
                          dataIndex: 'issuedCount',
                          key: 'issuedCount',
                          width: 90,
                          align: 'right',
                          render: (value) => (
                            <span>
                              {value.toLocaleString()}
                            </span>
                          )
                        },
                        {
                          title: '核券数',
                          dataIndex: 'usedCount',
                          key: 'usedCount',
                          width: 90,
                          align: 'right',
                          render: (value) => (
                            <span>
                              {value.toLocaleString()}
                            </span>
                          )
                        },
                        {
                          title: '销售额',
                          dataIndex: 'gmv',
                          key: 'gmv',
                          width: 100,
                          align: 'right',
                          render: (value) => (
                            <span style={{ color: '#000000', fontWeight: 'bold' }}>
                              ¥{(value / 10000).toFixed(1)}万
                            </span>
                          )
                        },
                        {
                          title: '核销率',
                          dataIndex: 'usageRate',
                          key: 'usageRate',
                          width: 80,
                          align: 'center',
                          render: (value) => (
                            <span style={{ 
                              color: '#8c8c8c',
                              fontWeight: 'bold'
                            }}>
                              {value.toFixed(1)}%
                            </span>
                          )
                        }
                      ]}
                    />
                  </div>
                </>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#999',
                  fontSize: '16px'
                }}>
                  <div style={{ 
                    fontSize: '48px', 
                    marginBottom: '16px',
                    color: '#d9d9d9'
                  }}>
                    📊
                  </div>
                  <div>点击左侧饼图查看平台渠道数据明细</div>
                  <div style={{ fontSize: '12px', marginTop: '8px', color: '#bfbfbf' }}>
                    支持查看各平台下的具体渠道分布情况
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* 5. 零售商/机制 Top10 */}
      <Card title="零售商/机制 Top10" style={{ marginBottom: 16 }}>
        <Tabs 
          defaultActiveKey="retailers" 
          size="small"
          tabBarExtraContent={
            <Select
              value={retailerMetric}
              onChange={handleRetailerMetricChange}
              style={{ width: 150 }}
              size="small"
            >
              <Option value="gmv">活动销售额</Option>
              <Option value="usedCount">核券数</Option>
              <Option value="batchCount">活动数</Option>
              <Option value="discount">优惠金额</Option>
              <Option value="usageRate">核销率</Option>
            </Select>
          }
        >
          <TabPane tab="零售商" key="retailers">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={getSortedRetailers().slice(0, 10)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={({ y, payload }) => {
                      const sortedData = getSortedRetailers();
                      const index = sortedData.findIndex(item => item.name === payload.value);
                      return (
                        <text 
                          x={0} 
                          y={y} 
                          dy={4} 
                          textAnchor="start" 
                          fill={index < 3 ? HIGHLIGHT_COLORS[index === 0 ? 'first' : index === 1 ? 'second' : 'third'] : '#666'}
                          fontWeight={index < 3 ? 'bold' : 'normal'}
                          fontSize={11}
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                  />
                  <Tooltip formatter={(value) => [getMetricInfo(retailerMetric).formatter(value as number), getMetricInfo(retailerMetric).label]} />
                  <Bar dataKey={retailerMetric} name={getMetricInfo(retailerMetric).label}>
                    {getSortedRetailers().slice(0, 10).map((entry, index) => {
                      const colorKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
                      const color = index < 10 ? HIGHLIGHT_COLORS[colorKeys[index] as keyof typeof HIGHLIGHT_COLORS] : HIGHLIGHT_COLORS.normal;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabPane>
          <TabPane tab="机制" key="mechanisms">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={getSortedMechanisms().slice(0, 10)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={({ y, payload }) => {
                      const sortedData = getSortedMechanisms();
                      const index = sortedData.findIndex(item => item.name === payload.value);
                      return (
                        <text 
                          x={0} 
                          y={y} 
                          dy={4} 
                          textAnchor="start" 
                          fill={index < 3 ? HIGHLIGHT_COLORS[index === 0 ? 'first' : index === 1 ? 'second' : 'third'] : '#666'}
                          fontWeight={index < 3 ? 'bold' : 'normal'}
                          fontSize={11}
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                  />
                  <Tooltip formatter={(value) => [getMetricInfo(retailerMetric).formatter(value as number), getMetricInfo(retailerMetric).label]} />
                  <Bar dataKey={retailerMetric} name={getMetricInfo(retailerMetric).label}>
                    {getSortedMechanisms().slice(0, 10).map((entry, index) => {
                      const colorKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
                      const color = index < 10 ? HIGHLIGHT_COLORS[colorKeys[index] as keyof typeof HIGHLIGHT_COLORS] : HIGHLIGHT_COLORS.normal;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 6. SKU Top10 单独模块 */}
      <Card 
        title="SKU Top10" 
        style={{ marginBottom: 16 }}
        extra={
          <Select
            value={skuSortBy}
            onChange={setSkuSortBy}
            style={{ width: 120 }}
            size="small"
          >
            <Option value="gmv">销售额</Option>
            <Option value="orderCount">订单数</Option>
            <Option value="salesVolume">销售量</Option>
            <Option value="discount">优惠金额</Option>
          </Select>
        }
      >
        <Table
          dataSource={[...stats.skus]
            .sort((a, b) => (b as any)[skuSortBy] - (a as any)[skuSortBy])
            .slice(0, 10)
            .map((item, index) => ({
              key: index,
              rank: index + 1,
              name: item.name,
              code69: item.code69,
              gmv: item.gmv,
              orderCount: item.orderCount,
              discount: item.discount,
              salesVolume: item.salesVolume,
            }))}
          columns={[
            {
              title: '排名',
              dataIndex: 'rank',
              key: 'rank',
              width: '10%',
              render: (rank: number) => (
                <Tag color={rank <= 3 ? 'gold' : 'default'}>
                  {rank}
                </Tag>
              ),
            },
            {
              title: '69码&商品名称',
              dataIndex: 'name',
              key: 'name',
              width: '30%',
              ellipsis: true,
              render: (name: string, record: any) => (
                <div>
                  {record.code69}{name}
                </div>
              ),
            },
            {
              title: '销售额',
              dataIndex: 'gmv',
              key: 'gmv',
              width: '15%',
              render: (value: number) => `¥${(value / 10000).toFixed(1)}万`,
            },
            {
              title: '订单数',
              dataIndex: 'orderCount',
              key: 'orderCount',
              width: '15%',
              render: (value: number) => value.toLocaleString(),
            },
            {
              title: '销售量',
              dataIndex: 'salesVolume',
              key: 'salesVolume',
              width: '15%',
              render: (value: number) => value.toLocaleString(),
            },
            {
              title: '优惠金额',
              dataIndex: 'discount',
              key: 'discount',
              width: '15%',
              render: (value: number) => `¥${(value / 10000).toFixed(1)}万`,
            },
          ]}
          pagination={false}
          size="middle"
        />
      </Card>
      
      {/* 6. 购物行为（0~24时）*/}
      <Card title="时段分析" style={{ marginBottom: 16 }}>
        <div style={{ height: 400, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.shoppingHours}
              margin={{ top: 50, right: 30, left: 60, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timeRange" 
                tick={{ fontSize: 11, fill: '#8c8c8c' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: '#d9d9d9' }}
                tickLine={{ stroke: '#d9d9d9' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#8c8c8c' }}
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                axisLine={{ stroke: '#d9d9d9' }}
                tickLine={{ stroke: '#d9d9d9' }}
              />
              <Tooltip 
                formatter={(value) => [`¥${(value as number / 10000).toFixed(1)}万`, '销售金额 (元)']}
                labelFormatter={(label) => `时间: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="gmv" 
                name="销售金额 (元)" 
                fill="#5B8FF9"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* 渠道分布模块已删除 */}
    </div>
  );
};

export default Dashboard;