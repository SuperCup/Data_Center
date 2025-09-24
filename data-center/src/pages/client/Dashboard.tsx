import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Divider, DatePicker, Select, Tabs, Tooltip as AntTooltip, Radio, Tag, Typography, Button, Table } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingOutlined, DollarOutlined, TagOutlined, AppstoreOutlined, InfoCircleOutlined, QuestionCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { PieChart, Pie as RechartsPie, Cell, LineChart, Line as RechartsLine, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// 高级配色方案 - 参考蓝湖设计系统
const COLORS = [
  '#4A90E2',  // 主蓝色 - 科技感
  '#7ED321',  // 活力绿 - 成功状态
  '#F5A623',  // 温暖橙 - 警告提醒
  '#D0021B',  // 醒目红 - 重要数据
  '#9013FE',  // 优雅紫 - 高级感
  '#50E3C2',  // 清新青 - 辅助色
  '#BD10E0',  // 时尚粉 - 强调色
  '#B8E986',  // 柔和绿 - 自然色
  '#4A4A4A',  // 深灰色 - 文字色
  '#F8E71C'   // 明亮黄 - 突出色
];

const PLATFORM_COLORS = {
  '微信': '#7ED321',     // 活力绿 - 微信品牌色调
  '支付宝': '#4A90E2',   // 主蓝色 - 支付宝科技感
  '抖音来客': '#D0021B', // 醒目红 - 抖音活跃感
  '美团到店': '#F5A623'  // 温暖橙 - 美团品牌色
};

// 渐变高亮配色 - 提升视觉层次
const HIGHLIGHT_COLORS = {
  first: '#4A90E2',     // 主蓝色 - 科技感
  second: '#7ED321',    // 活力绿 - 成功状态
  third: '#9013FE',     // 优雅紫 - 高级感
  fourth: '#D0021B',    // 醒目红 - 重要数据
  fifth: '#F5A623',     // 温暖橙 - 警告提醒
  sixth: '#50E3C2',     // 清新青 - 辅助色
  seventh: '#BD10E0',   // 时尚粉 - 强调色
  eighth: '#B8E986',    // 柔和绿 - 自然色
  ninth: '#F8E71C',     // 明亮黄 - 突出色
  tenth: '#4A4A4A',     // 深灰色 - 文字色
  normal: '#E8E8E8'     // 浅灰色
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
  
  // 发券渠道状态
  const [channelMetric, setChannelMetric] = useState<string>('gmv');
  const [selectedChannel, setSelectedChannel] = useState<string | null>('品牌小程序'); // 默认选中占比最高的渠道
  
  // 零售商/机制指标状态
  const [retailerMetric, setRetailerMetric] = useState<string>('usedCount');
  
  // 发券渠道数据 - 支持5个指标切换
  const channelData = [
    { 
      name: '品牌小程序', 
      gmv: 1800000, 
      usedCount: 72000, 
      batchCount: 3, 
      discount: 720000, 
      usageRate: 40.0 
    },
    { 
      name: '支付有礼', 
      gmv: 1500000, 
      usedCount: 60000, 
      batchCount: 2, 
      discount: 600000, 
      usageRate: 40.0 
    },
    { 
      name: '零售商小程序', 
      gmv: 1200000, 
      usedCount: 48000, 
      batchCount: 2, 
      discount: 480000, 
      usageRate: 40.0 
    },
    { 
      name: '扫码领券', 
      gmv: 1000000, 
      usedCount: 40000, 
      batchCount: 2, 
      discount: 400000, 
      usageRate: 40.0 
    },
    { 
      name: '立减与折扣', 
      gmv: 800000, 
      usedCount: 32000, 
      batchCount: 1, 
      discount: 320000, 
      usageRate: 40.0 
    },
    { 
      name: '社群', 
      gmv: 700000, 
      usedCount: 28000, 
      batchCount: 1, 
      discount: 280000, 
      usageRate: 40.0 
    },
  ];

  // 根据选中的指标获取饼图数据
  const getPieData = () => {
    return channelData.map(item => ({
      name: item.name,
      value: item[channelMetric as keyof typeof item] as number
    }));
  };

  // 获取选中渠道的详细数据
  const getSelectedChannelData = () => {
    if (!selectedChannel) return null;
    return channelData.find(item => item.name === selectedChannel);
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
      { name: '抖音来客', value: 20, gmv: 936000, discount: 374000, budget: 65, clientBudget: { total: 600000, used: 390000 }, orders: 9360, usedCount: 64000 },
      { name: '美团到店', value: 10, gmv: 468000, discount: 187000, budget: 85, clientBudget: { total: 400000, used: 340000 }, orders: 4680, usedCount: 32000 },
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
      { name: '金典有机纯牛奶', code69: '6901028089296', gmv: 240000, orderCount: 2400, discount: 24000, usedCount: 24000 },
      { name: '安慕希希腊酸奶', code69: '6901028089302', gmv: 210000, orderCount: 2100, discount: 21000, usedCount: 21000 },
      { name: 'QQ星儿童成长牛奶', code69: '6901028089319', gmv: 190000, orderCount: 1900, discount: 19000, usedCount: 19000 },
      { name: '舒化无乳糖牛奶', code69: '6901028089326', gmv: 170000, orderCount: 1700, discount: 17000, usedCount: 17000 },
      { name: '畅轻酸奶', code69: '6901028089333', gmv: 150000, orderCount: 1500, discount: 15000, usedCount: 15000 },
      { name: '纯牛奶', code69: '6901028089340', gmv: 130000, orderCount: 1300, discount: 13000, usedCount: 13000 },
      { name: '优酸乳', code69: '6901028089357', gmv: 110000, orderCount: 1100, discount: 11000, usedCount: 11000 },
      { name: '巧乐兹冰淇淋', code69: '6901028089364', gmv: 90000, orderCount: 900, discount: 9000, usedCount: 9000 },
      { name: '每益添活性乳酸菌饮品', code69: '6901028089371', gmv: 75000, orderCount: 750, discount: 7500, usedCount: 7500 },
      { name: '味可滋', code69: '6901028089388', gmv: 60000, orderCount: 600, discount: 6000, usedCount: 6000 },
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

  // 处理平台变更
  const handlePlatformChange = (value: string) => {
    setPlatform(value);
  };

  // 处理趋势指标变更
  const handleTrendMetricChange = (value: string) => {
    setTrendMetric(value);
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

  // 获取排名样式
  const getRankStyle = (index: number) => {
    switch(index) {
      case 0: return { color: HIGHLIGHT_COLORS.first, fontWeight: 'bold' };
      case 1: return { color: HIGHLIGHT_COLORS.second, fontWeight: 'bold' };
      case 2: return { color: HIGHLIGHT_COLORS.third, fontWeight: 'bold' };
      default: return { color: HIGHLIGHT_COLORS.normal };
    }
  };

  // 获取时段排名样式
  const getHourRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return { color: HIGHLIGHT_COLORS.first, fontWeight: 'bold' };
      case 2: return { color: HIGHLIGHT_COLORS.second, fontWeight: 'bold' };
      case 3: return { color: HIGHLIGHT_COLORS.third, fontWeight: 'bold' };
      default: return { color: HIGHLIGHT_COLORS.normal };
    }
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>销售分析</Title>
        <AntTooltip title="数据统计范围为平台对一个所选时间段下在进行的批次（活动）的汇总">
          <QuestionCircleOutlined style={{ color: '#999', cursor: 'help' }} />
        </AntTooltip>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => {
              // 模拟下载功能
              const link = document.createElement('a');
              link.href = 'data:text/csv;charset=utf-8,账单明细数据...';
              link.download = '账单明细.csv';
              link.click();
            }}
          >
            下载账单明细
          </Button>
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
              <Radio.Button value="douyin">抖音来客</Radio.Button>
              <Radio.Button value="meituan">美团到店</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
      
      {/* 2. 核心指标与活动效果趋势 */}
      <Card title="核心指标" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} style={{ display: 'flex' }}>
          {/* 活动销售额 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>活动销售额</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝平台：</strong></div>
                      <div style={{ marginBottom: 8 }}>所有订单的订单商品数量×商品价格之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音来客/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.gmv}
                precision={0}
                valueStyle={{ color: '#4A90E2', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<ShoppingOutlined />}
                suffix="元"
              />
              <div style={{ marginTop: 8 }}>
                <Tag color={stats.overview.gmvYoY >= 0 ? 'green' : 'red'}>
                  同比 {stats.overview.gmvYoY >= 0 ? '+' : ''}{stats.overview.gmvYoY}%
                </Tag>
                <Tag color={stats.overview.gmvMoM >= 0 ? 'blue' : 'orange'}>
                  环比 {stats.overview.gmvMoM >= 0 ? '+' : ''}{stats.overview.gmvMoM}%
                </Tag>
              </div>
            </Card>
          </Col>
          
          {/* 核券数 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>核券数</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>平台下载的正向账单数量之和（无账单活动，取活动详情中统计的核销数量）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音来客/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.usedCount}
                precision={0}
                valueStyle={{ color: '#7ED321', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<TagOutlined />}
              />
              <div style={{ marginTop: 8 }}>
                <Tag color={stats.overview.usedCountYoY >= 0 ? 'green' : 'red'}>
                  同比 {stats.overview.usedCountYoY >= 0 ? '+' : ''}{stats.overview.usedCountYoY}%
                </Tag>
                <Tag color={stats.overview.usedCountMoM >= 0 ? 'blue' : 'orange'}>
                  环比 {stats.overview.usedCountMoM >= 0 ? '+' : ''}{stats.overview.usedCountMoM}%
                </Tag>
              </div>
            </Card>
          </Col>
          
          {/* 活动数 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>活动数</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div>平台侧创建的活动数量之和</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.batchCount}
                precision={0}
                valueStyle={{ color: '#9013FE', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<AppstoreOutlined />}
              />
              <div style={{ marginTop: 8 }}>
                <Tag color={stats.overview.batchCountYoY >= 0 ? 'green' : 'red'}>
                  同比 {stats.overview.batchCountYoY >= 0 ? '+' : ''}{stats.overview.batchCountYoY}%
                </Tag>
                <Tag color={stats.overview.batchCountMoM >= 0 ? 'blue' : 'orange'}>
                  环比 {stats.overview.batchCountMoM >= 0 ? '+' : ''}{stats.overview.batchCountMoM}%
                </Tag>
              </div>
            </Card>
          </Col>
          
          {/* 优惠金额 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>优惠金额</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>账单中返回的优惠金额之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音来客/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.discount}
                precision={0}
                valueStyle={{ color: '#D0021B', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
              <div style={{ marginTop: 8 }}>
                <Tag color={stats.overview.discountYoY >= 0 ? 'green' : 'red'}>
                  同比 {stats.overview.discountYoY >= 0 ? '+' : ''}{stats.overview.discountYoY}%
                </Tag>
                <Tag color={stats.overview.discountMoM >= 0 ? 'blue' : 'orange'}>
                  环比 {stats.overview.discountMoM >= 0 ? '+' : ''}{stats.overview.discountMoM}%
                </Tag>
              </div>
            </Card>
          </Col>
          
          {/* 核销率 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>核销率</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>仅供参考</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>(未退款账单之和/平台活动详情中的领券数之和)×100%</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音来客/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.usageRate}
                precision={1}
                valueStyle={{ color: '#F5A623', fontSize: '24px', fontWeight: 'bold' }}
                suffix="%"
              />
              <div style={{ marginTop: 8 }}>
                <Tag color={stats.overview.usageRateYoY >= 0 ? 'green' : 'red'}>
                  同比 {stats.overview.usageRateYoY >= 0 ? '+' : ''}{stats.overview.usageRateYoY}%
                </Tag>
                <Tag color={stats.overview.usageRateMoM >= 0 ? 'blue' : 'orange'}>
                  环比 {stats.overview.usageRateMoM >= 0 ? '+' : ''}{stats.overview.usageRateMoM}%
                </Tag>
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* 指标趋势 */}
        <div style={{ marginBottom: 16, marginTop: 32 }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { key: 'gmv', label: '活动销售额', color: '#4A90E2' },
              { key: 'usedCount', label: '核券数', color: '#7ED321' },
              { key: 'batchCount', label: '活动数', color: '#F5A623' },
              { key: 'discount', label: '优惠金额', color: '#D0021B' },
              { key: 'usageRate', label: '核销率', color: '#9013FE' }
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
                onClick={() => setVisibleLines(prev => ({
                  ...prev,
                  [metric.key]: !prev[metric.key]
                }))}
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
                  stroke="#4A90E2"
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
                  stroke="#7ED321"
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
                  stroke="#F5A623"
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
                  stroke="#D0021B"
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
                  stroke="#9013FE"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="核销率"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* 发券渠道模块 */}
      <Card title="发券渠道" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {/* 左侧：指标切换和饼图 */}
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <Select 
                value={channelMetric} 
                onChange={(value) => {
                  setChannelMetric(value);
                  // 切换指标时，自动选中当前指标下占比最高的渠道
                  const sortedData = channelData.sort((a, b) => (b[value as keyof typeof b] as number) - (a[value as keyof typeof a] as number));
                  setSelectedChannel(sortedData[0]?.name || null);
                }}
                style={{ width: 200 }}
                placeholder="选择指标"
              >
                <Option value="gmv">活动销售额</Option>
                <Option value="usedCount">核券数</Option>
                <Option value="batchCount">活动数</Option>
                <Option value="discount">优惠金额</Option>
                <Option value="usageRate">核销率</Option>
              </Select>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsPie
                    data={getPieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={(entry: any) => {
                      const { name, percent } = entry;
                      return `${name}: ${(percent * 100).toFixed(1)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => setSelectedChannel(data.name)}
                  >
                    {getPieData().map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={selectedChannel === entry.name ? '#FF6B6B' : COLORS[index % COLORS.length]}
                        stroke={selectedChannel === entry.name ? '#FF6B6B' : 'none'}
                        strokeWidth={selectedChannel === entry.name ? 3 : 0}
                      />
                    ))}
                  </RechartsPie>
                  <Tooltip 
                    formatter={(value, name) => {
                      const metricNames = {
                        gmv: '活动销售额',
                        usedCount: '核券数',
                        batchCount: '活动数',
                        discount: '优惠金额',
                        usageRate: '核销率'
                      };
                      const unit = channelMetric === 'usageRate' ? '%' : 
                                  channelMetric === 'batchCount' ? '个' :
                                  channelMetric === 'usedCount' ? '张' : '元';
                      return [`${value.toLocaleString()}${unit}`, metricNames[channelMetric as keyof typeof metricNames]];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
          
          {/* 右侧：选中渠道的详细数据 */}
          <Col span={12}>
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', height: '100%' }}>
              {selectedChannel ? (
                <>
                  <Title level={4} style={{ marginBottom: 20, color: '#1890ff' }}>
                    {selectedChannel} - 详细数据
                  </Title>
                  {(() => {
                    const data = getSelectedChannelData();
                    if (!data) return null;
                    return (
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card size="small" bordered={false}>
                            <Statistic
                              title="活动销售额"
                              value={data.gmv}
                              precision={0}
                              valueStyle={{ color: '#3f8600' }}
                              prefix="¥"
                              suffix="元"
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" bordered={false}>
                            <Statistic
                              title="核券数"
                              value={data.usedCount}
                              precision={0}
                              valueStyle={{ color: '#1890ff' }}
                              suffix="张"
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" bordered={false}>
                            <Statistic
                              title="活动数"
                              value={data.batchCount}
                              precision={0}
                              valueStyle={{ color: '#722ed1' }}
                              suffix="个"
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" bordered={false}>
                            <Statistic
                              title="优惠金额"
                              value={data.discount}
                              precision={0}
                              valueStyle={{ color: '#fa8c16' }}
                              prefix="¥"
                              suffix="元"
                            />
                          </Card>
                        </Col>
                        <Col span={24}>
                          <Card size="small" bordered={false}>
                            <Statistic
                              title="核销率"
                              value={data.usageRate}
                              precision={1}
                              valueStyle={{ color: '#eb2f96' }}
                              suffix="%"
                            />
                          </Card>
                        </Col>
                      </Row>
                    );
                  })()}
                </>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#999',
                  fontSize: '16px'
                }}>
                  点击左侧饼图查看渠道详细数据
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
      <Card title="SKU Top10" style={{ marginBottom: 16 }}>
        <Table
          dataSource={stats.skus.slice(0, 10).map((item, index) => ({
            key: index,
            rank: index + 1,
            name: item.name,
            code69: item.code69,
            gmv: item.gmv,
            orderCount: item.orderCount,
            discount: item.discount,
          }))}
          columns={[
            {
              title: '排名',
              dataIndex: 'rank',
              key: 'rank',
              width: 80,
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
              ellipsis: true,
              render: (name: string, record: any) => (
                <div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>{record.code69}</div>
                  <div>{name}</div>
                </div>
              ),
            },
            {
              title: '销售额',
              dataIndex: 'gmv',
              key: 'gmv',
              width: 120,
              render: (value: number) => `¥${(value / 10000).toFixed(1)}万`,
              sorter: (a: any, b: any) => a.gmv - b.gmv,
            },
            {
              title: '订单数',
              dataIndex: 'orderCount',
              key: 'orderCount',
              width: 100,
              render: (value: number) => value.toLocaleString(),
              sorter: (a: any, b: any) => a.orderCount - b.orderCount,
            },
            {
              title: '优惠金额',
              dataIndex: 'discount',
              key: 'discount',
              width: 120,
              render: (value: number) => `¥${(value / 10000).toFixed(1)}万`,
              sorter: (a: any, b: any) => a.discount - b.discount,
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
                tick={{ fontSize: 11, fill: '#666' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: '#d9d9d9' }}
                tickLine={{ stroke: '#d9d9d9' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#666' }}
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