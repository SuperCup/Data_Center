import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Row, Col, Statistic, Typography, Space, Radio, Tooltip as AntTooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
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
  const [mapReady, setMapReady] = useState<boolean>(false);

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
  
  // 省份核销占比数据（全国地图数据）
  const provinceMapData = [
    { name: '山东', value: 577 },
    { name: '河南', value: 364 },
    { name: '天津', value: 327 },
    { name: '北京', value: 291 },
    { name: '广东', value: 185 },
    { name: '福建', value: 177 },
    { name: '江苏', value: 152 },
    { name: '浙江', value: 128 },
    { name: '湖北', value: 98 },
    { name: '宁夏', value: 82 },
    { name: '辽宁', value: 74 },
    { name: '四川', value: 72 },
    { name: '安徽', value: 48 },
    { name: '湖南', value: 42 },
    // 添加其他省份，即使没有数据也显示
    { name: '河北', value: 0 },
    { name: '山西', value: 0 },
    { name: '内蒙古', value: 0 },
    { name: '吉林', value: 0 },
    { name: '黑龙江', value: 0 },
    { name: '上海', value: 0 },
    { name: '江西', value: 0 },
    { name: '广西', value: 0 },
    { name: '海南', value: 0 },
    { name: '重庆', value: 0 },
    { name: '贵州', value: 0 },
    { name: '云南', value: 0 },
    { name: '西藏', value: 0 },
    { name: '陕西', value: 0 },
    { name: '甘肃', value: 0 },
    { name: '青海', value: 0 },
    { name: '新疆', value: 0 },
    { name: '台湾', value: 0 },
    { name: '香港', value: 0 },
    { name: '澳门', value: 0 }
  ];

  // 计算按核销占比排名前10的省份
  const getTop10ProvincesByUsage = () => {
    // 计算总核销数
    const totalUsage = provinceMapData.reduce((sum, item) => sum + item.value, 0);
    
    // 计算每个省份的占比并排序
    const provincesWithPercentage = provinceMapData
      .map(item => ({
        ...item,
        percentage: totalUsage > 0 ? (item.value / totalUsage * 100) : 0
      }))
      .filter(item => item.value > 0) // 只显示有数据的省份
      .sort((a, b) => b.value - a.value) // 按核销数降序排列
      .slice(0, 10); // 取前10名
    
    return provincesWithPercentage;
  };

  // 获取前10省份数据
  const top10Provinces = getTop10ProvincesByUsage();
  
  // 定义Top10省份的颜色映射 - 使用蓝色由深到浅
  const getProvinceColor = (provinceName: string, value: number) => {
    const rank = top10Provinces.findIndex(item => item.name === provinceName);
    if (rank === -1 || value === 0) {
      return '#e6f7ff'; // 非Top10或无数据的省份使用浅蓝色作为默认颜色
    }
    
    // 根据排名分配不同的蓝色深度（严格按Top10排名由深到浅）
    const colors = [
      '#0c4a6e', // 第1名 - 最深蓝
      '#075985', // 第2名
      '#0369a1', // 第3名
      '#0284c7', // 第4名
      '#0ea5e9', // 第5名
      '#38bdf8', // 第6名
      '#7dd3fc', // 第7名
      '#bae6fd', // 第8名
      '#e0f2fe', // 第9名
      '#f0f9ff'  // 第10名 - 最浅蓝
    ];
    
    return colors[rank] || '#e6f7ff';
  };
  
  // 注册中国地图
  useEffect(() => {
    // 使用fetch加载真实的中国地图数据
    fetch('/china-map.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((chinaGeoData) => {
        console.log('China map data loaded successfully:', chinaGeoData);
        echarts.registerMap('china', chinaGeoData);
        setMapReady(true);
      })
      .catch((error) => {
        console.error('Failed to load China map data:', error);
        // 如果加载失败，使用简化的地图数据
        const fallbackGeoData = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {name: "北京", cp: [116.4, 39.9]},
              geometry: {type: "Polygon", coordinates: [[[116.24, 39.26], [116.83, 39.26], [117.07, 39.69], [117.24, 40.22], [117.07, 40.48], [116.83, 40.22], [116.24, 40.22], [115.97, 39.69], [116.24, 39.26]]]}
            },
            {
              type: "Feature",
              properties: {name: "天津", cp: [117.2, 39.1]},
              geometry: {type: "Polygon", coordinates: [[[116.8, 38.74], [117.76, 38.74], [118.06, 39.52], [117.76, 40.12], [116.8, 40.12], [116.5, 39.52], [116.8, 38.74]]]}
            },
            {
              type: "Feature",
              properties: {name: "河北", cp: [114.5, 38.0]},
              geometry: {type: "Polygon", coordinates: [[[113.4, 36.05], [115.48, 36.05], [117.67, 36.23], [119.22, 37.15], [119.22, 39.52], [118.06, 40.12], [117.24, 40.22], [116.24, 40.22], [115.97, 39.69], [114.01, 39.61], [113.4, 38.37], [113.4, 36.05]]]}
            }
          ]
        };
        echarts.registerMap('china', fallbackGeoData);
        setMapReady(true);
      });
  }, []);

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

  // 柱状图配置选项
  const getBarChartOption = (data: any[], title: string) => {
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLabel: {
          rotate: 0,
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: '占比(%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: title,
          type: 'bar',
          data: data.map(item => item.value),
          itemStyle: {
            color: '#1890ff'
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            fontSize: 12
          }
        }
      ]
    };
  };
  
  // 中国地图配置选项
  const getMapChartOption = (data: any[]) => {
    // 确保数据存在且有效
    if (!data || data.length === 0) {
      return {
        title: {
          text: '消费者地图 - 核销占比前10省份',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        series: []
      };
    }

    // 获取前10省份名单
    const top10Names = top10Provinces.map(item => item.name);
    
    // 计算最大值和最小值，用于视觉映射
    const values = data.map(item => item.value || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    return {
      title: {
        text: '省份核销占比排名前10',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        },
        subtext: '请将前10省份按排序，使用颜色由深到浅展示，改提示仅给UI设计时提供说明，不在正式设计中显示',
        subtextStyle: {
          fontSize: 12,
          color: '#666',
          fontStyle: 'italic'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (!params || !params.data) {
            return `${params?.name || '未知'}<br/>核销数: 0<br/>占比: 0.00%<br/>排名: 未上榜`;
          }
          const { name, value } = params.data;
          const totalUsage = provinceMapData.reduce((sum, item) => sum + item.value, 0);
          const percentage = value && totalUsage > 0 ? ((value / totalUsage) * 100).toFixed(2) : '0.00';
          const rank = top10Provinces.findIndex(item => item.name === name) + 1;
          const rankText = rank > 0 ? `第${rank}名` : '未上榜';
          return `${name}<br/>核销数: ${value || 0}<br/>占比: ${percentage}%<br/>排名: ${rankText}`;
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        left: 'left',
        bottom: '5%',
        text: ['100%', '0%'],
        calculable: true,
        formatter: (value: number) => {
          const totalUsage = provinceMapData.reduce((sum, item) => sum + item.value, 0);
          if (totalUsage === 0) return '0%';
          const percentage = ((value / totalUsage) * 100).toFixed(0);
          return `${percentage}%`;
        },
        inRange: {
          color: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e']
        },
        // 确保没有数据的省份也显示
        outOfRange: {
          color: '#f5f5f5'
        }
      },
      series: [
        {
          name: '省份核销占比',
          type: 'map',
          map: 'china',
          roam: false,
          zoom: 1.2,
          center: [104, 35.5],
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold'
            },
            itemStyle: {
              areaColor: '#40a9ff',
              borderColor: '#1890ff',
              borderWidth: 2
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
            // 移除全局areaColor设置，让各省份使用自己的颜色
          },
          label: {
            show: false
          },
          data: data.map(item => ({
            name: item.name,
            value: item.value,
            // 为每个省份设置不同的颜色
            itemStyle: {
              borderColor: top10Names.includes(item.name) ? '#ff4d4f' : '#d9d9d9',
              borderWidth: top10Names.includes(item.name) ? 2 : 1,
              areaColor: getProvinceColor(item.name, item.value)
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
          <Col span={12}>
            {/* 筛选项已移除：活动名称和发券渠道 */}
          </Col>
        </Row>
      </Card>

      {/* 数据来源 */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '16px', color: '#1890ff' }}>数据来源</Title>
        <Row gutter={[24, 16]}>
          <Col span={8}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f0f8ff', 
              borderRadius: '8px',
              border: '1px solid #d6e4ff',
              height: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>应用平台</Text>
              <div>
                <Text style={{ fontSize: '14px', color: '#595959' }}>康师傅官方旗舰店</Text>
                <br />
                <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>（微信小程序）</Text>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#e6f7ff', 
              borderRadius: '8px',
              border: '1px solid #91d5ff',
              height: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>数据批次</Text>
              <div>
                <Text style={{ fontSize: '18px', color: '#1890ff', fontWeight: 'bold' }}>
                  {userAnalysisData.length}
                </Text>
                <Text style={{ fontSize: '14px', color: '#595959', marginLeft: '4px' }}>个批次</Text>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f0f8ff', 
              borderRadius: '8px',
              border: '1px solid #d6e4ff',
              height: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>活动机制</Text>
              <div>
                <Text style={{ fontSize: '14px', color: '#595959' }}>
                  {userAnalysisData.length > 0 && userAnalysisData[0].mechanisms 
                    ? userAnalysisData[0].mechanisms.slice(0, 2).join('、') + (userAnalysisData[0].mechanisms.length > 2 ? '等' : '')
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
            {/* 转化统计漏斗 */}
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
              <div style={{ 
                width: '100%', 
                height: '80px', 
                backgroundColor: '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div>访问用户数</div>
                  <div style={{ fontSize: '20px', marginTop: '4px' }}>7,708人</div>
                </div>
              </div>
              
              <div style={{ 
                width: '80%', 
                height: '80px', 
                backgroundColor: '#40a9ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
                marginTop: '20px',
                marginLeft: '10%'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div>领券用户数</div>
                  <div style={{ fontSize: '20px', marginTop: '4px' }}>7,252人</div>
                </div>
              </div>
              
              <div style={{ 
                width: '60%', 
                height: '80px', 
                backgroundColor: '#69c0ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)',
                marginTop: '20px',
                marginLeft: '20%'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div>核销用户数</div>
                  <div style={{ fontSize: '20px', marginTop: '4px' }}>7,167人</div>
                </div>
              </div>
              
              <div style={{ 
                width: '40%', 
                height: '80px', 
                backgroundColor: '#91d5ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)',
                marginTop: '20px',
                marginLeft: '30%'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div>复购用户数</div>
                  <div style={{ fontSize: '20px', marginTop: '4px' }}>1人</div>
                </div>
              </div>
              
              {/* 转化率引线 */}
              <div style={{
                position: 'absolute',
                right: '20px',
                top: '110px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '1px',
                  backgroundColor: '#666',
                  marginRight: '8px'
                }}></div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  whiteSpace: 'nowrap'
                }}>
                  转化率: 94.09%
                </div>
              </div>
              
              <div style={{
                position: 'absolute',
                right: '20px',
                top: '210px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '1px',
                  backgroundColor: '#666',
                  marginRight: '8px'
                }}></div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  whiteSpace: 'nowrap'
                }}>
                  转化率: 98.83%
                </div>
              </div>
              
              <div style={{
                position: 'absolute',
                right: '20px',
                top: '310px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '1px',
                  backgroundColor: '#666',
                  marginRight: '8px'
                }}></div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
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

      {/* 领券核销时间分布 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card>
            <div style={{ position: 'relative', height: '400px' }}>
              <ReactECharts 
                option={getBarChartOption(couponUsageIntervalData, '领券核销时间分布')} 
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


      
      {/* 省份核销占比地图展示 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={16}>
            <Card style={{ height: '540px' }}>
              <div style={{ position: 'relative', height: '500px' }}>
                {mapReady ? (
                  <ReactECharts 
                    option={getMapChartOption(provinceMapData)} 
                    style={{ height: '100%' }}
                  />
                ) : (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#999'
                  }}>
                    地图加载中...
                  </div>
                )}
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
                    value={provinceMapData.reduce((sum, item) => sum + item.value, 0)}
                    valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                    suffix="张"
                  />
                </div>
              </div>
            </Card>
        </Col>
        <Col span={8}>
           <Card title="Top10" style={{ height: '540px' }}>
             <div style={{ height: '490px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                   <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                     <th style={{ padding: '8px 4px', textAlign: 'left', fontSize: '12px', color: '#666' }}>序号</th>
                     <th style={{ padding: '8px 4px', textAlign: 'left', fontSize: '12px', color: '#666' }}>省份/城市</th>
                     <th style={{ padding: '8px 4px', textAlign: 'right', fontSize: '12px', color: '#666' }}>核销数</th>
                     <th style={{ padding: '8px 4px', textAlign: 'right', fontSize: '12px', color: '#666' }}>核销占比</th>
                   </tr>
                 </thead>
                 <tbody>
                   {top10Provinces.map((province, index) => {
                     const totalUsage = provinceMapData.reduce((sum, item) => sum + item.value, 0);
                     const percentage = totalUsage > 0 ? ((province.value / totalUsage) * 100).toFixed(1) : '0.0';
                     return (
                       <tr key={province.name} style={{ borderBottom: '1px solid #f8f8f8' }}>
                         <td style={{ 
                           padding: '8px 4px', 
                           fontSize: '14px', 
                           color: index < 3 ? '#1890ff' : '#333',
                           fontWeight: index < 3 ? 'bold' : 'normal'
                         }}>
                           {index + 1}
                         </td>
                         <td style={{ 
                           padding: '8px 4px', 
                           fontSize: '14px', 
                           color: index < 3 ? '#1890ff' : '#333',
                           fontWeight: index < 3 ? 'bold' : 'normal'
                         }}>
                           {province.name}
                         </td>
                         <td style={{ 
                           padding: '8px 4px', 
                           textAlign: 'right', 
                           fontSize: '14px', 
                           color: index < 3 ? '#1890ff' : '#333',
                           fontWeight: index < 3 ? 'bold' : 'normal'
                         }}>
                           {province.value}
                         </td>
                         <td style={{ 
                           padding: '8px 4px', 
                           textAlign: 'right', 
                           fontSize: '14px', 
                           color: index < 3 ? '#1890ff' : '#333',
                           fontWeight: index < 3 ? 'bold' : 'normal'
                         }}>
                           {percentage}%
                         </td>
                       </tr>
                     );
                   })}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 用户行为分析视图 */}
      <Row gutter={[24, 24]}>
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
    </div>
  );
};

export default UserAnalysis;