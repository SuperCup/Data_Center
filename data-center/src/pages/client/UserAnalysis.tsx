import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Row, Col, Statistic, Typography, Space, Radio, Tooltip as AntTooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

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
  mechanisms?: string[]; // 活动机制
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
    mechanisms: ['满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满18减1.8', '满20减2', '满25减2.5']
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
    mechanisms: ['满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满18减1.8', '满20减2', '满25减2.5']
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
    mechanisms: ['满6减0.6', '满9减0.9', '满12减1.2', '满15减1.5', '满18减1.8', '满21减2.1', '满24减2.4', '满30减3']
  },
  {
    key: '4',
    channel: 'H5',
    region: '华东',
    activity: '2025年8月夏日清凉活动',
    visitUsers: 4200,
    receiveUsers: 3800,
    usageUsers: 3650,
    conversionRate: 90.48,
    usageRate: 86.90,
    mechanisms: ['满4减0.4', '满6减0.6', '满8减0.8', '满10减1', '满12减1.2', '满16减1.6', '满20减2', '满24减2.4']
  },
  {
    key: '5',
    channel: 'H5',
    region: '华南',
    activity: '2025年9月中秋节活动',
    visitUsers: 3900,
    receiveUsers: 3500,
    usageUsers: 3300,
    conversionRate: 89.74,
    usageRate: 84.62,
    mechanisms: ['满3减0.3', '满5减0.5', '满8减0.8', '满10减1', '满15减1.5', '满18减1.8', '满22减2.2', '满28减2.8']
  },
  {
    key: '6',
    channel: 'H5',
    region: '华东',
    activity: '康师傅品牌专场活动',
    visitUsers: 2800,
    receiveUsers: 2400,
    usageUsers: 2200,
    conversionRate: 85.71,
    usageRate: 78.57,
    mechanisms: ['满3减0.3', '满5减0.5', '满6减0.6', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满20减2']
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
  }, [selectedRegion, selectedActivity, dateRange]);

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

  // 复购周期数据
  const repurchaseCycleData = [
    { name: '当天', value: 15 },
    { name: '3天内', value: 25 },
    { name: '3~7天', value: 30 },
    { name: '7~14天', value: 18 },
    { name: '14~30天', value: 8 },
    { name: '30天及以上', value: 4 }
  ];

  // 复购次数数据
  const repurchaseCountData = [
    { name: '1次', value: 45 },
    { name: '2次', value: 25 },
    { name: '3次', value: 15 },
    { name: '4次', value: 8 },
    { name: '5次以上', value: 7 }
  ];

  // 领券核销时间分布数据
  const couponUsageIntervalData = [
    { name: '6小时内', value: 35 },
    { name: '6~12小时', value: 25 },
    { name: '12~24小时', value: 20 },
    { name: '1~3天', value: 15 },
    { name: '3天以上', value: 5 }
  ];

  // 省份核销占比数据（Top10）
  const provinceUsageData = [
    { name: '广东', value: 18.5 },
    { name: '江苏', value: 15.2 },
    { name: '浙江', value: 12.8 },
    { name: '山东', value: 10.3 },
    { name: '河南', value: 8.7 },
    { name: '四川', value: 7.2 },
    { name: '湖北', value: 6.1 },
    { name: '福建', value: 5.4 },
    { name: '安徽', value: 4.8 },
    { name: '湖南', value: 4.2 }
  ];

  // 饼图配置选项
  const getPieChartOption = (data: any[], title: string) => {
    // 蓝色系配色方案
    const blueColors = [
      '#1890ff', // 主蓝色
      '#40a9ff', // 浅蓝色
      '#69c0ff', // 更浅蓝色
      '#91d5ff', // 淡蓝色
      '#bae7ff', // 极淡蓝色
      '#0050b3', // 深蓝色
      '#003a8c', // 更深蓝色
      '#002766', // 最深蓝色
      '#096dd9', // 中蓝色
      '#1677ff'  // 亮蓝色
    ];

    return {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {d}%',
            fontSize: 12
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: data.map((item, index) => ({
            ...item,
            itemStyle: {
              color: blueColors[index % blueColors.length]
            }
          }))
        }
      ]
    };
  };

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>用户分析</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Space size="middle" wrap>
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
                placeholder="选择发券渠道"
                style={{ width: 150 }}
                value={selectedChannel}
                onChange={(value) => {
                  setSelectedChannel(value);
                  filterUserAnalysisData(value, selectedRegion, selectedActivity, dateRange);
                }}
                allowClear
              >
                <Option value="品牌小程序">品牌小程序</Option>
                <Option value="H5">H5</Option>
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

      {/* 筛选结果显示 */}
      <Card style={{ marginBottom: '24px', backgroundColor: '#f8f9fa' }}>
        <Row gutter={24}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Text strong style={{ color: '#595959' }}>筛选结果：</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text style={{ color: '#595959' }}>批次数：</Text>
                <Text strong style={{ color: '#595959' }}>
                  {userAnalysisData.length}
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text style={{ color: '#595959' }}>机制：</Text>
                <Text strong style={{ color: '#595959' }}>
                  {userAnalysisData.length > 0 && userAnalysisData[0].mechanisms 
                    ? userAnalysisData[0].mechanisms.slice(0, 3).join('、') + (userAnalysisData[0].mechanisms.length > 3 ? '等' : '')
                    : '暂无机制'
                  }
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 转化漏斗图表 */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>转化统计</Title>
        <Row gutter={24}>
          <Col span={24}>
            {/* 转化漏斗图表区域 - 移除入群用户数 */}
            <div style={{ 
              height: '450px', 
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
                marginBottom: '20px',
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
                marginBottom: '20px',
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
                marginBottom: '20px',
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
                复购用户数: 1人
              </div>
              
              {/* 转化率引线显示 - 访问到领券 */}
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '125px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {/* 引线 */}
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: '#ff7a45',
                  marginRight: '8px'
                }}></div>
                {/* 转化率标签 */}
                <div style={{
                  fontSize: '12px',
                  color: '#ff7a45',
                  fontWeight: 'bold',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ff7a45',
                  whiteSpace: 'nowrap'
                }}>
                  转化率: 94.09%
                </div>
              </div>
              
              {/* 转化率引线显示 - 领券到核销 */}
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '235px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {/* 引线 */}
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: '#ff7a45',
                  marginRight: '8px'
                }}></div>
                {/* 转化率标签 */}
                <div style={{
                  fontSize: '12px',
                  color: '#ff7a45',
                  fontWeight: 'bold',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ff7a45',
                  whiteSpace: 'nowrap'
                }}>
                  转化率: 98.83%
                </div>
              </div>
              
              {/* 转化率引线显示 - 核销到复购 */}
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '345px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {/* 引线 */}
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: '#ff7a45',
                  marginRight: '8px'
                }}></div>
                {/* 转化率标签 */}
                <div style={{
                  fontSize: '12px',
                  color: '#ff7a45',
                  fontWeight: 'bold',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ff7a45',
                  whiteSpace: 'nowrap'
                }}>
                  转化率: 0.01%
                </div>
              </div>
            </div>
            
            {/* 销售额、优惠金额与人均订单金额显示在漏斗下方 */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="销售额"
                    value={2580000}
                    precision={2}
                    valueStyle={{ color: '#000000', fontSize: '24px' }}
                    suffix="元"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="优惠金额"
                    value={386000}
                    precision={2}
                    valueStyle={{ color: '#000000', fontSize: '24px' }}
                    suffix="元"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="人均订单金额"
                    value={158.5}
                    precision={2}
                    valueStyle={{ color: '#000000', fontSize: '24px' }}
                    suffix="元"
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 用户行为分析视图 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card>
            <div style={{ position: 'relative', height: '400px' }}>
              <ReactECharts 
                option={getPieChartOption(repurchaseCycleData, '复购周期分布')} 
                style={{ height: '100%' }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: '16px', 
                right: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 12px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e8e8e8'
              }}>
                <Statistic
                  title="复购总人数"
                  value={1250}
                  valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                  suffix="人"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <div style={{ position: 'relative', height: '400px' }}>
              <ReactECharts 
                option={getPieChartOption(repurchaseCountData, '复购次数分布')} 
                style={{ height: '100%' }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: '16px', 
                right: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 12px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e8e8e8'
              }}>
                <Statistic
                  title="复购总次数"
                  value={3680}
                  valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                  suffix="次"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 领券核销间隔与省份核销占比视图 */}
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card>
            <div style={{ position: 'relative', height: '400px' }}>
              <ReactECharts 
                option={getPieChartOption(couponUsageIntervalData, '领券核销时间分布')} 
                style={{ height: '100%' }}
              />
              <div style={{ 
                position: 'absolute', 
                bottom: '16px', 
                right: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 12px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e8e8e8'
              }}>
                <Statistic
                  title="核销总张数"
                  value={15680}
                  valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                  suffix="张"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
            <Card>
              <div style={{ position: 'relative', height: '400px' }}>
                <ReactECharts 
                  option={getPieChartOption(provinceUsageData, '省份核销占比')} 
                  style={{ height: '100%' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '16px', 
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e8e8e8'
                }}>
                  <Statistic
                    title="核销总张数"
                    value={15680}
                    valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                    suffix="张"
                  />
                </div>
              </div>
            </Card>
          </Col>
      </Row>
    </div>
  );
};

export default UserAnalysis;