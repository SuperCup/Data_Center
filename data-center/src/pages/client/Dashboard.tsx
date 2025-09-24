import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Divider, DatePicker, Select, Tabs, Tooltip as AntTooltip, Radio, Tag, Typography, Button } from 'antd';
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
  
  // 渠道排行数据
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
    // 总览数据
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
    // 零售商数据
    retailers: [
      { name: '华润万家大卖场', usedCount: 65000 },
      { name: '沃尔玛', usedCount: 58000 },
      { name: '山姆', usedCount: 52000 },
      { name: '大润发', usedCount: 45000 },
      { name: '永辉', usedCount: 38000 },
      { name: '物美超市', usedCount: 32000 },
      { name: '麦德龙', usedCount: 28000 },
      { name: '大张盛德美', usedCount: 24000 },
      { name: '永旺', usedCount: 20000 },
      { name: '华润苏果便利店', usedCount: 18000 },
    ],
    // SKU数据
    skus: [
      { name: '金典有机纯牛奶', usedCount: 48000 },
      { name: '安慕希希腊酸奶', usedCount: 42000 },
      { name: 'QQ星儿童成长牛奶', usedCount: 38000 },
      { name: '舒化无乳糖牛奶', usedCount: 34000 },
      { name: '畅轻酸奶', usedCount: 30000 },
      { name: '纯牛奶', usedCount: 26000 },
      { name: '优酸乳', usedCount: 22000 },
      { name: '巧乐兹冰淇淋', usedCount: 18000 },
      { name: '每益添活性乳酸菌饮品', usedCount: 15000 },
      { name: '味可滋', usedCount: 12000 },
    ],
    // 购物行为时段数据
    shoppingHours: [
      { timeRange: '0-2', usedCount: 6400, rank: 12 },
      { timeRange: '2-4', usedCount: 3200, rank: 12 },
      { timeRange: '4-6', usedCount: 9600, rank: 11 },
      { timeRange: '6-8', usedCount: 16000, rank: 8 },
      { timeRange: '8-10', usedCount: 22400, rank: 7 },
      { timeRange: '10-12', usedCount: 32000, rank: 4 },
      { timeRange: '12-14', usedCount: 38400, rank: 2 },
      { timeRange: '14-16', usedCount: 28800, rank: 5 },
      { timeRange: '16-18', usedCount: 25600, rank: 6 },
      { timeRange: '18-20', usedCount: 41600, rank: 1 },
      { timeRange: '20-22', usedCount: 35200, rank: 3 },
      { timeRange: '22-24', usedCount: 12800, rank: 10 },
    ],
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
    ],
    // 机制数据
    mechanisms: [
      { name: '满100减30', usedCount: 70400 },
      { name: '满200减80', usedCount: 64000 },
      { name: '满300减100', usedCount: 57600 },
      { name: '第二件半价', usedCount: 51200 },
      { name: '满2件8折', usedCount: 44800 },
      { name: '满3件7折', usedCount: 38400 },
      { name: '直降50元', usedCount: 32000 },
      { name: '满减立减券', usedCount: 25600 },
      { name: '买赠活动', usedCount: 19200 },
      { name: '会员专享价', usedCount: 12800 },
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
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>到店营销</Title>
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
      
      {/* 2. 总览模块 */}
      <Card title="总览" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} style={{ display: 'flex' }}>
          {/* GMV */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="GMV"
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
          
          {/* 核销数 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="核销数"
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
          
          {/* 活动数（批次） */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <Statistic
                title="活动数（批次）"
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
              <Statistic
                title="优惠金额"
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
              <Statistic
                title="核销率"
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
      </Card>
      
      {/* 3. 活动预算使用情况 */}
      <Card title="活动预算使用情况" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={16}>
            <div style={{ padding: '20px 0' }}>
              <Progress
                percent={stats.budget.usageRate}
                status="active"
                strokeWidth={20}
                format={(percent?: number) => `${(percent || 0).toFixed(1)}%`}
              />
              <Row style={{ marginTop: 16 }}>
                <Col span={8}>
                  <Statistic 
                    title="充值预算" 
                    value={stats.budget.total} 
                    precision={0}
                    suffix="元"
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="已核销预算" 
                    value={stats.budget.used} 
                    precision={0}
                    suffix="元"
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="核销占比" 
                    value={stats.budget.usageRate} 
                    precision={1}
                    suffix="%"
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ padding: '20px', border: '1px dashed #d9d9d9', borderRadius: '4px', height: '100%' }}>
              <div>
                <ul style={{ paddingLeft: 20 }}>
                  <li><Text>充值预算：商家为活动充值的总预算金额</Text></li>
                  <li><Text>已核销预算：已被消费者使用的预算金额</Text></li>
                  <li><Text>核销占比：已核销预算占充值预算的百分比</Text></li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* 4. 活动效果趋势 */}
      <Card title="活动效果趋势" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Radio.Group value={trendMetric} onChange={(e) => setTrendMetric(e.target.value)} buttonStyle="solid">
            <Radio.Button value="gmv">GMV</Radio.Button>
            <Radio.Button value="usedCount">核销数</Radio.Button>
            <Radio.Button value="batchCount">活动数（批次）</Radio.Button>
            <Radio.Button value="discount">优惠金额</Radio.Button>
            <Radio.Button value="usageRate">核销率</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.trends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => {
                if (trendMetric === 'usageRate') {
                  return [`${value}%`, '核销率'];
                } else if (trendMetric === 'gmv' || trendMetric === 'discount') {
                  return [`${value.toLocaleString()} 元`, trendMetric === 'gmv' ? 'GMV' : '优惠金额'];
                } else {
                  return [value.toLocaleString(), trendMetric === 'usedCount' ? '核销数' : '活动数'];
                }
              }} />
              <Legend />
              <RechartsLine
                type="monotone"
                dataKey={trendMetric}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name={
                  trendMetric === 'gmv' ? 'GMV' :
                  trendMetric === 'usedCount' ? '核销数' :
                  trendMetric === 'batchCount' ? '活动数（批次）' :
                  trendMetric === 'discount' ? '优惠金额' : '核销率'
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* 5. 渠道、零售商、SKU Top10 */}
      <Card title="Top10排行榜" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {/* 渠道Top10 */}
          <Col span={8}>
            <Card title="渠道Top10" bordered={false}>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stats.channels.slice(0, 10)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={({ y, payload }) => {
                        const index = stats.channels.findIndex(item => item.name === payload.value);
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
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} 次`, '核销数']} />
                    <Bar dataKey="usedCount" name="核销数">
                      {stats.channels.slice(0, 10).map((entry, index) => {
                        const colorKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
                        const color = index < 10 ? HIGHLIGHT_COLORS[colorKeys[index] as keyof typeof HIGHLIGHT_COLORS] : HIGHLIGHT_COLORS.normal;
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          
          {/* 零售商Top10 */}
          <Col span={8}>
            <Card title="零售商Top10" bordered={false}>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stats.retailers.slice(0, 10)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={({ y, payload }) => {
                        const index = stats.retailers.findIndex(item => item.name === payload.value);
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
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} 次`, '核销数']} />
                    <Bar dataKey="usedCount" name="核销数">
                      {stats.retailers.slice(0, 10).map((entry, index) => {
                        const colorKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
                        const color = index < 10 ? HIGHLIGHT_COLORS[colorKeys[index] as keyof typeof HIGHLIGHT_COLORS] : HIGHLIGHT_COLORS.normal;
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          
          {/* SKU Top10 */}
          <Col span={8}>
            <Card title="SKU Top10" bordered={false}>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stats.skus.slice(0, 10)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={({ y, payload }) => {
                        const index = stats.skus.findIndex(item => item.name === payload.value);
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
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} 次`, '核销数']} />
                    <Bar dataKey="usedCount" name="核销数">
                      {stats.skus.slice(0, 10).map((entry, index) => {
                        const colorKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
                        const color = index < 10 ? HIGHLIGHT_COLORS[colorKeys[index] as keyof typeof HIGHLIGHT_COLORS] : HIGHLIGHT_COLORS.normal;
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
      
      {/* 6. 购物行为（0~24时）*/}
      <Card title="购物行为（0~24时）" style={{ marginBottom: 16 }}>
        <div style={{ height: 300, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.shoppingHours}
              margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeRange" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} 次`, '核销数']} />
              <Legend />
              <Bar dataKey="usedCount" name="核销数">
                {stats.shoppingHours.map((entry, index) => {
                  const rank = entry.rank;
                  const color = rank <= 3 ? HIGHLIGHT_COLORS[rank === 1 ? 'first' : rank === 2 ? 'second' : 'third'] : HIGHLIGHT_COLORS.normal;
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Top标签 */}
          {stats.shoppingHours.map((entry, index) => {
            if (entry.rank <= 3) {
              // 计算精确的柱状图位置 - 考虑图表边距和柱子宽度
              const chartWidth = 100; // 图表宽度百分比
              const leftMargin = 3; // 左边距百分比
              const rightMargin = 5; // 右边距百分比
              const effectiveWidth = chartWidth - leftMargin - rightMargin;
              const barWidth = effectiveWidth / stats.shoppingHours.length;
              const xPosition = leftMargin + (index + 0.5) * barWidth; // 柱子中心位置
              
              const topLabel = entry.rank === 1 ? 'TOP1' : entry.rank === 2 ? 'TOP2' : 'TOP3';
              const labelColor = entry.rank === 1 ? HIGHLIGHT_COLORS.first : entry.rank === 2 ? HIGHLIGHT_COLORS.second : HIGHLIGHT_COLORS.third;
              return (
                <div
                  key={`top-label-${index}`}
                  style={{
                    position: 'absolute',
                    left: `${xPosition}%`,
                    top: '8px',
                    transform: 'translateX(-50%)',
                    backgroundColor: labelColor,
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: '14px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {topLabel}
                </div>
              );
            }
            return null;
          })}
        </div>
      </Card>
      
      {/* 7. 档期Top10 */}
      <Card title="档期Top10" style={{ marginBottom: 16 }}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stats.periods.slice(0, 10)}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={({ y, payload }) => {
                  const index = stats.periods.findIndex(item => item.name === payload.value);
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
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                        <p><strong>{data.name}</strong></p>
                        <p>活动数: {data.batchCount}</p>
                        <p>核销数: {data.usedCount.toLocaleString()}</p>
                        <p>预算使用: {data.budgetUsed.toLocaleString()} 元</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="usedCount" name="核销数">
                {stats.periods.slice(0, 10).map((entry, index) => {
                  const colorKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
                  const color = index < 10 ? HIGHLIGHT_COLORS[colorKeys[index] as keyof typeof HIGHLIGHT_COLORS] : HIGHLIGHT_COLORS.normal;
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* 8. 机制Top10 */}
      <Card title="机制Top10" style={{ marginBottom: 16 }}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stats.mechanisms.slice(0, 10)}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={({ y, payload }) => {
                  const index = stats.mechanisms.findIndex(item => item.name === payload.value);
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
              <Tooltip formatter={(value) => [`${value.toLocaleString()} 次`, '核销数']} />
              <Bar dataKey="usedCount" name="核销数">
                {stats.mechanisms.slice(0, 10).map((entry, index) => {
                  const colorKeys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
                  const color = index < 10 ? HIGHLIGHT_COLORS[colorKeys[index] as keyof typeof HIGHLIGHT_COLORS] : HIGHLIGHT_COLORS.normal;
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* 渠道分布模块已删除 */}
    </div>
  );
};

export default Dashboard;