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

const SmalStoreDashboard: React.FC = () => {
  // 状态管理
  const [dateType, setDateType] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[string, string]>(['2025-10-01', '2025-10-31']);
  const [platform, setPlatform] = useState<string>('all');
  const [trendMetric, setTrendMetric] = useState<string>('gmv');
  
  // 折线图显示状态管理
  const [visibleLines, setVisibleLines] = useState<{[key: string]: boolean}>({
    registeredStores: true,  // 默认显示报名门店数
    activeStores: false,
    gmv: false,
    writeOffAmount: false,
    writeOffCount: false,
    avgDailyOutput: false
  });
  
  // 发券渠道状态 - 重新设计为平台视图
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('微信'); // 默认选中微信平台
  
  // 门店/机制指标状态
  const [retailerMetric, setRetailerMetric] = useState<string>('gmv');
  
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
      { name: '立减与折扣', issuedCount: '--', usedCount: 12000, gmv: 306000, discount: 121500, usageRate: '--' },
      { name: '零售商小程序', issuedCount: 25000, usedCount: 20000, gmv: 500000, discount: 200000, usageRate: 80.0 },
      { name: '扫码领券', issuedCount: 20000, usedCount: 16000, gmv: 400000, discount: 160000, usageRate: 80.0 },
      { name: '社群', issuedCount: 15000, usedCount: 12000, gmv: 300000, discount: 120000, usageRate: 80.0 },
      { name: '智能促销员', issuedCount: 12000, usedCount: 10000, gmv: 250000, discount: 100000, usageRate: 83.3 },
      { name: '扫码购', issuedCount: 10000, usedCount: 8000, gmv: 200000, discount: 80000, usageRate: 80.0 },
      { name: 'H5', issuedCount: 5000, usedCount: 4000, gmv: 100000, discount: 40000, usageRate: 80.0 },
    ],
    '支付宝': [
      { name: '支付有礼', issuedCount: 50000, usedCount: 40000, gmv: 800000, discount: 320000, usageRate: 80.0 },
      { name: '扫码领券', issuedCount: 30000, usedCount: 25000, gmv: 500000, discount: 200000, usageRate: 83.3 },
      { name: '零售商小程序', issuedCount: 20000, usedCount: 15000, gmv: 370000, discount: 147500, usageRate: 75.0 },
      { name: '品牌小程序', issuedCount: 18000, usedCount: 15000, gmv: 350000, discount: 140000, usageRate: 83.3 },
      { name: '立减与折扣', issuedCount: '--', usedCount: 12000, gmv: 300000, discount: 120000, usageRate: '--' },
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
      registeredStores: 156, // 报名门店数
      registeredStoresYoY: 15.2,
      registeredStoresMoM: 5.8,
      activeStores: 89, // 动销门店数
      activeStoresYoY: 12.5,
      activeStoresMoM: 4.2,
      gmv: 4680000, // 销售额
      gmvYoY: 15.2,
      gmvMoM: 5.8,
      writeOffAmount: 1870000, // 核销金额
      writeOffAmountYoY: 18.3,
      writeOffAmountMoM: 7.5,
      writeOffCount: 320000, // 核销份数
      writeOffCountYoY: 12.5,
      writeOffCountMoM: 4.2,
      avgDailyOutput: 30000, // 店均日产出
      avgDailyOutputYoY: 8.5,
      avgDailyOutputMoM: 3.2
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
      { date: '10-01', registeredStores: 150, activeStores: 85, gmv: 156000, writeOffAmount: 62333, writeOffCount: 10667, avgDailyOutput: 1837 },
      { date: '10-02', registeredStores: 152, activeStores: 86, gmv: 168000, writeOffAmount: 67200, writeOffCount: 11500, avgDailyOutput: 1953 },
      { date: '10-03', registeredStores: 154, activeStores: 87, gmv: 180000, writeOffAmount: 72000, writeOffCount: 12333, avgDailyOutput: 2069 },
      { date: '10-04', registeredStores: 155, activeStores: 88, gmv: 162000, writeOffAmount: 64800, writeOffCount: 11100, avgDailyOutput: 1841 },
      { date: '10-05', registeredStores: 155, activeStores: 87, gmv: 150000, writeOffAmount: 60000, writeOffCount: 10267, avgDailyOutput: 1724 },
      { date: '10-06', registeredStores: 156, activeStores: 88, gmv: 165000, writeOffAmount: 66000, writeOffCount: 11300, avgDailyOutput: 1875 },
      { date: '10-07', registeredStores: 156, activeStores: 89, gmv: 175000, writeOffAmount: 70000, writeOffCount: 12000, avgDailyOutput: 1966 },
      { date: '10-08', registeredStores: 156, activeStores: 89, gmv: 185000, writeOffAmount: 74000, writeOffCount: 12667, avgDailyOutput: 2079 },
      { date: '10-09', registeredStores: 156, activeStores: 89, gmv: 190000, writeOffAmount: 76000, writeOffCount: 13000, avgDailyOutput: 2135 },
      { date: '10-10', registeredStores: 156, activeStores: 89, gmv: 195000, writeOffAmount: 78000, writeOffCount: 13333, avgDailyOutput: 2191 },
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
    // 门店数据 - 支持5个指标
    retailers: [
      { name: '芙蓉兴盛', usedCount: 65000, gmv: 1300000, batchCount: 5, discount: 130000, roi: 10.0, orderCount: 13000, usageRate: 45.2 },
      { name: '怡福百货', usedCount: 58000, gmv: 1160000, batchCount: 4, discount: 116000, roi: 10.0, orderCount: 11600, usageRate: 42.8 },
      { name: '众和食杂', usedCount: 52000, gmv: 1040000, batchCount: 4, discount: 104000, roi: 10.0, orderCount: 10400, usageRate: 41.5 },
      { name: '浩林便利店', usedCount: 45000, gmv: 900000, batchCount: 3, discount: 90000, roi: 10.0, orderCount: 9000, usageRate: 38.9 },
      { name: '一号门士多', usedCount: 38000, gmv: 760000, batchCount: 3, discount: 76000, roi: 10.0, orderCount: 7600, usageRate: 36.2 },
      { name: '天虹超市', usedCount: 32000, gmv: 640000, batchCount: 2, discount: 64000, roi: 10.0, orderCount: 6400, usageRate: 34.8 },
      { name: '文发士多', usedCount: 28000, gmv: 560000, batchCount: 2, discount: 56000, roi: 10.0, orderCount: 5600, usageRate: 33.1 },
      { name: '嘉利烟酒店', usedCount: 24000, gmv: 480000, batchCount: 2, discount: 48000, roi: 10.0, orderCount: 4800, usageRate: 31.5 },
      { name: '好运来超市', usedCount: 20000, gmv: 400000, batchCount: 1, discount: 40000, roi: 10.0, orderCount: 4000, usageRate: 29.8 },
      { name: '喜乐惠多', usedCount: 18000, gmv: 360000, batchCount: 1, discount: 36000, roi: 10.0, orderCount: 3600, usageRate: 28.2 },
    ],
    // 机制数据 - 支持5个指标
    mechanisms: [
      { name: '30元乐享', usedCount: 85000, gmv: 1700000, batchCount: 6, discount: 170000, roi: 10.0, orderCount: 17000, usageRate: 48.5 },
      { name: '15元乐享', usedCount: 72000, gmv: 1440000, batchCount: 5, discount: 144000, roi: 10.0, orderCount: 14400, usageRate: 45.8 },
      { name: '8元乐享', usedCount: 58000, gmv: 1160000, batchCount: 4, discount: 116000, roi: 10.0, orderCount: 11600, usageRate: 42.1 },
      { name: '50元乐享', usedCount: 45000, gmv: 900000, batchCount: 3, discount: 90000, roi: 10.0, orderCount: 9000, usageRate: 38.9 },
      { name: '25元乐享', usedCount: 38000, gmv: 760000, batchCount: 3, discount: 76000, roi: 10.0, orderCount: 7600, usageRate: 36.2 },
      { name: '12元乐享', usedCount: 32000, gmv: 640000, batchCount: 2, discount: 64000, roi: 10.0, orderCount: 6400, usageRate: 34.8 },
      { name: '10元乐享', usedCount: 28000, gmv: 560000, batchCount: 2, discount: 56000, roi: 10.0, orderCount: 5600, usageRate: 33.1 },
      { name: '20元乐享', usedCount: 24000, gmv: 480000, batchCount: 2, discount: 48000, roi: 10.0, orderCount: 4800, usageRate: 31.5 },
      { name: '15元乐享', usedCount: 18000, gmv: 360000, batchCount: 1, discount: 36000, roi: 10.0, orderCount: 3600, usageRate: 28.2 },
      { name: '28元乐享', usedCount: 15000, gmv: 300000, batchCount: 1, discount: 30000, roi: 10.0, orderCount: 3000, usageRate: 25.8 },
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
    // 时段分析热力图数据 - 周一到周日，每天24小时
    timeAnalysisData: (() => {
      const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const data: Array<{ day: string; hour: number; gmv: number; dayIndex: number; hourIndex: number }> = [];
      
      // 生成模拟数据，工作日和周末有不同的销售模式
      weekdays.forEach((day, dayIndex) => {
        const isWeekend = dayIndex >= 5; // 周六周日
        hours.forEach((hour) => {
          let baseGmv = 50000; // 基础销售额
          
          // 根据时段调整销售额
          if (hour >= 9 && hour <= 12) {
            baseGmv *= isWeekend ? 2.4 : 2.2; // 上午高峰，周末更高
          } else if (hour >= 14 && hour <= 17) {
            baseGmv *= isWeekend ? 2.2 : 1.9; // 下午高峰，周末更高
          } else if (hour >= 19 && hour <= 22) {
            baseGmv *= isWeekend ? 2.8 : 2.5; // 晚上高峰，周末更高
          } else if (hour >= 0 && hour <= 6) {
            baseGmv *= 0.2; // 凌晨低谷
          } else {
            baseGmv *= isWeekend ? 1.6 : 1.0; // 其他时段，周末显著提高
          }
          
          // 周末整体销售额大幅提高
          if (isWeekend) {
            baseGmv *= 1.5; // 从1.1提高到1.5，增加50%的销售额
          }
          
          // 添加随机波动
          const randomFactor = 0.7 + Math.random() * 0.6; // 0.7-1.3的随机因子
          const gmv = Math.round(baseGmv * randomFactor);
          
          data.push({
            day,
            hour,
            gmv,
            dayIndex,
            hourIndex: hour
          });
        });
      });
      
      return data;
    })(),
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



  // 处理门店/机制指标变更
  const handleRetailerMetricChange = (value: string) => {
    setRetailerMetric(value);
  };

  // 获取排序后的门店数据
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
      gmv: { label: '销售额', unit: '元', formatter: (value: number) => value.toFixed(2) },
      discount: { label: '优惠金额', unit: '元', formatter: (value: number) => value.toFixed(2) },
      roi: { label: 'ROI', unit: '', formatter: (value: number) => value.toFixed(1) },
      orderCount: { label: '订单数', unit: '个', formatter: (value: number) => value.toLocaleString() },
      usageRate: { label: '核销率', unit: '%', formatter: (value: number) => `${value.toFixed(1)}%` }
    };
    return metricMap[metric as keyof typeof metricMap] || metricMap.gmv;
  };



  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>销售分析</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：{stats.budget.updateTime}</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>
      
      {/* 演示说明 */}
      <div style={{ 
        backgroundColor: '#fff7e6', 
        border: '1px solid #ffd591', 
        borderRadius: '6px', 
        padding: '12px 16px', 
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center'
      }}>
        <InfoCircleOutlined style={{ color: '#fa8c16', marginRight: 8, fontSize: '16px' }} />
        <Text style={{ color: '#d46b08', fontSize: '14px' }}>
          此页面为演示使用，正式发布不会有此过度，切换销售分析仅刷新页面内指标与图示。
        </Text>
      </div>
      
      {/* 1. 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={32} align="middle">
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
              <Radio.Group value={dateType} onChange={handleDateTypeChange} style={{ marginRight: 16, flexShrink: 0 }}>
                <Radio.Button value="day">日</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="year">年</Radio.Button>
                <Radio.Button value="custom">自定义</Radio.Button>
              </Radio.Group>
              <RangePicker 
                value={dateRange.map(date => date ? moment(date) : null) as any} 
                onChange={handleDateRangeChange} 
                style={{ minWidth: '240px', flexShrink: 0 }}
              />
            </div>
          </Col>
          <Col span={12} style={{ paddingLeft: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: '6px', 
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <InfoCircleOutlined style={{ color: '#52c41a', marginRight: 6, fontSize: '14px' }} />
              <Text style={{ color: '#389e0d', fontSize: '13px' }}>
                演示环境，请点击浏览器返回，回到销售分析主页面
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* 2. 核心指标与活动效果趋势 */}
      <Card title="核心指标" style={{ marginBottom: 16 }}>
        <Row gutter={0} style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 报名门店数 */}
          <Col style={{ width: 'calc(16.66% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>报名门店数（个）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div>参与活动报名的门店总数</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.registeredStores}
                precision={0}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ 
                  color: stats.overview.registeredStoresYoY >= 0 ? 'red' : 'green', 
                  marginRight: 8,
                  ...(stats.overview.registeredStoresYoY < 0 && {
                    position: 'relative'
                  })
                }}>
                  同比 {stats.overview.registeredStoresYoY >= 0 ? '+' : ''}{stats.overview.registeredStoresYoY}%
                  {stats.overview.registeredStoresYoY < 0 && ' 📉'}
                </span>
                <span style={{ 
                  color: stats.overview.registeredStoresMoM >= 0 ? 'red' : 'green',
                  ...(stats.overview.registeredStoresMoM < 0 && {
                    borderLeft: '3px solid green',
                    paddingLeft: '8px',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  })
                }}>
                  环比 {stats.overview.registeredStoresMoM >= 0 ? '+' : ''}{stats.overview.registeredStoresMoM}%
                </span>
              </div>
            </Card>
          </Col>
          
          {/* 动销门店数 */}
          <Col style={{ width: 'calc(16.66% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>动销门店数（个）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div>实际产生销售的门店数量</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.activeStores}
                precision={0}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ 
                  color: stats.overview.activeStoresYoY >= 0 ? 'red' : 'green', 
                  marginRight: 8,
                  ...(stats.overview.activeStoresYoY < 0 && {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    fontSize: '13px'
                  })
                }}>
                  {stats.overview.activeStoresYoY < 0 && <ArrowDownOutlined style={{ marginRight: 4 }} />}
                  同比 {stats.overview.activeStoresYoY >= 0 ? '+' : ''}{stats.overview.activeStoresYoY}%
                </span>
                <span style={{ 
                  color: stats.overview.activeStoresMoM >= 0 ? 'red' : 'green',
                  ...(stats.overview.activeStoresMoM < 0 && {
                    fontStyle: 'italic',
                    border: '1px solid green',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  })
                }}>
                  {stats.overview.activeStoresMoM < 0 && '↓ '}
                  环比 {stats.overview.activeStoresMoM >= 0 ? '+' : ''}{stats.overview.activeStoresMoM}%
                </span>
              </div>
            </Card>
          </Col>
          
          {/* 销售额 */}
          <Col style={{ width: 'calc(16.66% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>销售额（元）</span>
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
                precision={2}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
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
          
          {/* 核销金额 */}
          <Col style={{ width: 'calc(16.66% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>核销金额（元）</span>
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
                value={stats.overview.writeOffAmount}
                precision={2}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ color: stats.overview.writeOffAmountYoY >= 0 ? 'red' : 'green', marginRight: 8 }}>
                  同比 {stats.overview.writeOffAmountYoY >= 0 ? '+' : ''}{stats.overview.writeOffAmountYoY}%
                </span>
                <span style={{ color: stats.overview.writeOffAmountMoM >= 0 ? 'red' : 'green' }}>
                  环比 {stats.overview.writeOffAmountMoM >= 0 ? '+' : ''}{stats.overview.writeOffAmountMoM}%
                </span>
              </div>
            </Card>
          </Col>
          
          {/* 核销份数 */}
          <Col style={{ width: 'calc(16.66% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>核销份数（份）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>核销的优惠券份数总和（已扣除退款）</div>
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
                value={stats.overview.writeOffCount}
                precision={0}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ 
                  color: stats.overview.writeOffCountYoY >= 0 ? 'red' : 'green', 
                  marginRight: 8,
                  ...(stats.overview.writeOffCountYoY < 0 && {
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,0,0.1) 50%, transparent 100%)',
                    padding: '2px 4px',
                    borderRadius: '3px'
                  })
                }}>
                  同比 {stats.overview.writeOffCountYoY >= 0 ? '+' : ''}{stats.overview.writeOffCountYoY}%
                  {stats.overview.writeOffCountYoY < 0 && ' ⬇'}
                </span>
                <span style={{ 
                  color: stats.overview.writeOffCountMoM >= 0 ? 'red' : 'green',
                  ...(stats.overview.writeOffCountMoM < 0 && {
                    textShadow: '1px 1px 2px rgba(0,128,0,0.3)',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  })
                }}>
                  {stats.overview.writeOffCountMoM < 0 && <ArrowDownOutlined style={{ marginRight: 4 }} />}
                  环比 {stats.overview.writeOffCountMoM >= 0 ? '+' : ''}{stats.overview.writeOffCountMoM}%
                </span>
              </div>
            </Card>
          </Col>
          
          {/* 店均日产出 */}
          <Col style={{ width: 'calc(16.66% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#262626' }}>店均日产出（元）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>平均每个门店每日的销售产出</div>
                      <div>店均日产出 = 销售额 / 动销门店数 / 天数</div>
                      <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                        该指标反映门店的平均销售效率
                      </div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={stats.overview.avgDailyOutput}
                precision={0}
                valueStyle={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8 }}>
                <span style={{ color: stats.overview.avgDailyOutputYoY >= 0 ? 'red' : 'green', marginRight: 8 }}>
                  同比 {stats.overview.avgDailyOutputYoY >= 0 ? '+' : ''}{stats.overview.avgDailyOutputYoY}%
                </span>
                <span style={{ color: stats.overview.avgDailyOutputMoM >= 0 ? 'red' : 'green' }}>
                  环比 {stats.overview.avgDailyOutputMoM >= 0 ? '+' : ''}{stats.overview.avgDailyOutputMoM}%
                </span>
              </div>
            </Card>
          </Col>
        </Row>
        
        {/* 指标趋势 */}
        <div style={{ marginBottom: 16, marginTop: 32 }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { key: 'registeredStores', label: '报名门店数（个）', color: '#1890ff' },
              { key: 'activeStores', label: '动销门店数（个）', color: '#52c41a' },
              { key: 'gmv', label: '销售额（元）', color: '#faad14' },
              { key: 'writeOffAmount', label: '核销金额（元）', color: '#722ed1' },
              { key: 'writeOffCount', label: '核销份数（份）', color: '#f5222d' },
              { key: 'avgDailyOutput', label: '店均日产出（元）', color: '#13c2c2' }
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
                  registeredStores: false,
                  activeStores: false,
                  gmv: false,
                  writeOffAmount: false,
                  writeOffCount: false,
                  avgDailyOutput: false,
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
                  'registeredStores': '报名门店数（个）',
                  'activeStores': '动销门店数（个）',
                  'gmv': '销售额（元）',
                  'writeOffAmount': '核销金额（元）',
                  'writeOffCount': '核销份数（份）',
                  'avgDailyOutput': '店均日产出（元）'
                };
                
                if (name === 'registeredStores' || name === 'activeStores' || name === 'writeOffCount') {
                  return [(value as number).toLocaleString(), metricLabels[name as string]];
                } else if (name === 'gmv' || name === 'writeOffAmount' || name === 'avgDailyOutput') {
                  return [`${(value as number).toLocaleString()} 元`, metricLabels[name as string]];
                } else {
                  return [(value as number).toLocaleString(), metricLabels[name as string]];
                }
              }} />
              <Legend />
              
              {/* 动态渲染所有可见的折线 */}
              {visibleLines.registeredStores && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="registeredStores"
                  stroke="#1890ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="报名门店数（个）"
                />
              )}
              
              {visibleLines.activeStores && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="activeStores"
                  stroke="#52c41a"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="动销门店数（个）"
                />
              )}
              
              {visibleLines.gmv && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="gmv"
                  stroke="#faad14"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="销售额（元）"
                />
              )}
              
              {visibleLines.writeOffAmount && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="writeOffAmount"
                  stroke="#722ed1"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="核销金额（元）"
                />
              )}
              
              {visibleLines.writeOffCount && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="writeOffCount"
                  stroke="#f5222d"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="核销份数（份）"
                />
              )}
              
              {visibleLines.avgDailyOutput && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgDailyOutput"
                  stroke="#13c2c2"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="店均日产出（元）"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      


      
      {/* 5. 门店/机制 Top10 */}
        <Card title="门店/机制 Top10" style={{ marginBottom: 16 }}>
        <Tabs 
          defaultActiveKey="retailers" 
          size="small"
          tabBarExtraContent={
            <Select
              value={retailerMetric}
              onChange={handleRetailerMetricChange}
              style={{ width: 180 }}
              size="small"
            >
              <Option value="registeredStores">报名门店数</Option>
              <Option value="activeStores">动销门店数</Option>
              <Option value="gmv">销售额</Option>
              <Option value="writeOffAmount">核销金额</Option>
              <Option value="writeOffCount">核销份数</Option>
              <Option value="avgDailyOutput">店均日产出</Option>
            </Select>
          }
        >
          <TabPane tab="门店" key="retailers">
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
      

      
      {/* 6. 时段分析热力图 */}
      <Card title="时段分析" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: '20px', height: 500 }}>
          {/* 左侧热力图 */}
          <div style={{ flex: 1, position: 'relative', padding: '20px 0' }}>
          {/* 热力图容器 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '60px repeat(24, 1fr)', 
            gridTemplateRows: 'repeat(8, 1fr)', 
            gap: '2px',
            height: '100%',
            width: '100%'
          }}>
            {/* 空白角落 */}
            <div></div>
            
            {/* 小时标签 */}
            {Array.from({ length: 24 }, (_, i) => (
              <div 
                key={`hour-${i}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#8c8c8c',
                  fontWeight: '500'
                }}
              >
                {i}
              </div>
            ))}
            
            {/* 星期和数据点 */}
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, dayIndex) => {
              // 计算当天所有时段的销售额总和
              const dayTotalGmv = stats.timeAnalysisData
                .filter(item => item.dayIndex === dayIndex)
                .reduce((sum, item) => sum + item.gmv, 0);
              
              return (
                <React.Fragment key={day}>
                  {/* 星期标签 */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#262626',
                    fontWeight: '500'
                  }}>
                    {day}
                  </div>
                  
                  {/* 24小时数据点 */}
                  {Array.from({ length: 24 }, (_, hour) => {
                    const dataPoint = stats.timeAnalysisData.find(
                      item => item.dayIndex === dayIndex && item.hourIndex === hour
                    );
                    
                    if (!dataPoint) return <div key={`${day}-${hour}`}></div>;
                    
                    // 计算圆圈大小和颜色深度
                    const maxGmv = Math.max(...stats.timeAnalysisData.map(item => item.gmv));
                    const minGmv = Math.min(...stats.timeAnalysisData.map(item => item.gmv));
                    const normalizedValue = (dataPoint.gmv - minGmv) / (maxGmv - minGmv);
                    
                    // 圆圈大小：最小8px，最大28px
                    const circleSize = 8 + normalizedValue * 20;
                    
                    // 颜色深度：基于销售额比例
                    const opacity = 0.3 + normalizedValue * 0.7;
                    
                    // 计算该时段在当日的占比
                    const dayPercentage = ((dataPoint.gmv / dayTotalGmv) * 100).toFixed(1);
                    
                    return (
                       <AntTooltip
                         key={`${day}-${hour}`}
                         title={
                           <div style={{ textAlign: 'center' }}>
                             <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                               {day} {hour}:00
                             </div>
                             <div style={{ color: '#1890ff', fontSize: '14px', fontWeight: 'bold' }}>
                               销售额: ¥{dataPoint.gmv.toFixed(2)}
                             </div>
                             <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>
                               当日占比: {dayPercentage}%
                             </div>
                           </div>
                         }
                         placement="top"
                         overlayStyle={{
                           maxWidth: '200px'
                         }}
                       >
                         <div 
                           style={{ 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             position: 'relative',
                             cursor: 'pointer'
                           }}
                         >
                           <div
                             style={{
                               width: `${circleSize}px`,
                               height: `${circleSize}px`,
                               borderRadius: '50%',
                               backgroundColor: `rgba(24, 144, 255, ${opacity})`,
                               transition: 'all 0.2s ease',
                               border: '1px solid rgba(24, 144, 255, 0.3)'
                             }}
                             onMouseEnter={(e) => {
                               e.currentTarget.style.transform = 'scale(1.2)';
                               e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.4)';
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.transform = 'scale(1)';
                               e.currentTarget.style.boxShadow = 'none';
                             }}
                           />
                         </div>
                       </AntTooltip>
                     );
                  })}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* 图例 */}
          <div style={{ 
            position: 'absolute', 
            bottom: '10px', 
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#8c8c8c'
          }}>
            <span>销售额:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(24, 144, 255, 0.3)' 
              }}></div>
              <span>低</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(24, 144, 255, 0.6)' 
              }}></div>
              <span>中</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(24, 144, 255, 1)' 
              }}></div>
              <span>高</span>
            </div>
          </div>
          </div>
          
          {/* 右侧周销售额图表 */}
          <div style={{ width: '300px', padding: '20px 0' }}>
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid #f0f0f0',
              borderRadius: '6px',
              padding: '16px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#262626',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                销售额周内占比
              </div>
              
              {/* 周销售额柱状图 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, dayIndex) => {
                  // 计算当天所有时段的销售额总和
                  const dayTotalGmv = stats.timeAnalysisData
                    .filter(item => item.dayIndex === dayIndex)
                    .reduce((sum, item) => sum + item.gmv, 0);
                  
                  // 计算一周的销售额总和，用于占比计算
                  const weekTotalGmv = Array.from({ length: 7 }, (_, i) => 
                    stats.timeAnalysisData
                      .filter(item => item.dayIndex === i)
                      .reduce((sum, item) => sum + item.gmv, 0)
                  ).reduce((sum, dayGmv) => sum + dayGmv, 0);
                  
                  const percentage = weekTotalGmv > 0 ? (dayTotalGmv / weekTotalGmv) * 100 : 0;
                  const barWidth = Math.max(percentage, 5); // 最小宽度5%
                  
                  return (
                    <div key={day} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      height: '32px'
                    }}>
                      <div style={{ 
                        width: '32px', 
                        fontSize: '12px', 
                        color: '#595959',
                        textAlign: 'right'
                      }}>
                        {day}
                      </div>
                      
                      <div style={{ 
                        flex: 1, 
                        height: '20px', 
                        backgroundColor: '#f5f5f5',
                        borderRadius: '10px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${barWidth}%`,
                          height: '100%',
                          backgroundColor: dayIndex === 5 || dayIndex === 6 ? '#52c41a' : '#1890ff', // 周末用绿色
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        />
                      </div>
                      
                      <div style={{ 
                        width: '60px', 
                        fontSize: '11px', 
                        color: '#8c8c8c',
                        textAlign: 'right'
                      }}>
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* 图例说明 */}
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '12px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                fontSize: '11px',
                color: '#8c8c8c'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#1890ff',
                    borderRadius: '2px'
                  }}></div>
                  <span>工作日</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#52c41a',
                    borderRadius: '2px'
                  }}></div>
                  <span>周末</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* 渠道分布模块已删除 */}
    </div>
  );
};

export default SmalStoreDashboard;