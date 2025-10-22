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
    mechanisms: ['满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满18减1.8', '满20减2', '满22减2.2', '满25减2.5', '满28减2.8', '满30减3', '满32减3.2', '满35减3.5', '满38减3.8', '满40减4']
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
    mechanisms: ['满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满18减1.8', '满20减2', '满22减2.2', '满25减2.5', '满28减2.8', '满30减3', '满32减3.2', '满35减3.5', '满38减3.8', '满40减4']
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
    mechanisms: ['满6减0.6', '满9减0.9', '满12减1.2', '满15减1.5', '满18减1.8', '满21减2.1', '满24减2.4', '满27减2.7', '满30减3', '满33减3.3', '满36减3.6', '满39减3.9', '满42减4.2', '满45减4.5', '满48减4.8', '满50减5']
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
    mechanisms: ['满4减0.4', '满6减0.6', '满8减0.8', '满10减1', '满12减1.2', '满14减1.4', '满16减1.6', '满18减1.8', '满20减2', '满22减2.2', '满24减2.4', '满26减2.6', '满28减2.8', '满30减3', '满32减3.2', '满35减3.5']
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
    mechanisms: ['满3减0.3', '满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满18减1.8', '满20减2', '满22减2.2', '满24减2.4', '满26减2.6', '满28减2.8', '满30减3', '满32减3.2', '满35减3.5', '满38减3.8']
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
    mechanisms: ['满3减0.3', '满5减0.5', '满6减0.6', '满8减0.8', '满9减0.9', '满10减1', '满12减1.2', '满14减1.4', '满15减1.5', '满16减1.6', '满18减1.8', '满20减2', '满21减2.1', '满24减2.4', '满25减2.5', '满27减2.7']
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

  // 省份数据类型定义
  interface ProvinceData {
    name: string;
    orderCount: number;    // 订单数
    salesAmount: number;   // 销售额
    discountAmount: number; // 优惠金额
  }

  // 省份订单占比数据（Top10）
  const provinceUsageData: ProvinceData[] = [
    { name: '广东', orderCount: 577, salesAmount: 156000, discountAmount: 12000 },
    { name: '江苏', orderCount: 364, salesAmount: 143000, discountAmount: 11000 },
    { name: '浙江', orderCount: 327, salesAmount: 130000, discountAmount: 10000 },
    { name: '山东', orderCount: 291, salesAmount: 117000, discountAmount: 9000 },
    { name: '河南', orderCount: 185, salesAmount: 110500, discountAmount: 8500 },
    { name: '四川', orderCount: 177, salesAmount: 104000, discountAmount: 8000 },
    { name: '湖北', orderCount: 152, salesAmount: 97500, discountAmount: 7500 },
    { name: '福建', orderCount: 128, salesAmount: 91000, discountAmount: 7000 },
    { name: '安徽', orderCount: 98, salesAmount: 84500, discountAmount: 6500 },
    { name: '湖南', orderCount: 82, salesAmount: 78000, discountAmount: 6000 }
  ];
  
  // 排名类型状态
  const [rankingType, setRankingType] = useState<'orderCount' | 'salesAmount' | 'discountAmount'>('orderCount');

  // 获取当前排名类型的值
  const getCurrentValue = (province: ProvinceData) => {
    switch (rankingType) {
      case 'orderCount':
        return province.orderCount;
      case 'salesAmount':
        return province.salesAmount;
      case 'discountAmount':
        return province.discountAmount;
      default:
        return province.orderCount;
    }
  };

  // 省份地图数据（根据排名类型动态生成）
  const getProvinceMapData = () => {
    // 根据当前排名类型生成基础地图数据
    const baseMapData = provinceUsageData.map(item => ({
      name: item.name,
      value: getCurrentValue(item)
    }));
    
    // 确保所有省份都在地图上显示（包括没有数据的省份）
    const allProvinces = [
      '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
      '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南',
      '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
      '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '台湾', '香港', '澳门'
    ];
    
    const existingProvinces = baseMapData.map(item => item.name);
    const missingProvinces = allProvinces.filter(name => !existingProvinces.includes(name));
    
    const missingData = missingProvinces.map(name => ({
      name,
      value: 0
    }));
    
    return [...baseMapData, ...missingData];
  };

  // 动态获取地图数据
  const provinceMapData = getProvinceMapData();

  // 计算按订单占比排名前10的省份
  const getTop10ProvincesByUsage = () => {
    // 计算总订单数
    const totalUsage = provinceMapData.reduce((sum, item) => sum + item.value, 0);
    
    // 计算每个省份的占比并排序
    const provincesWithPercentage = provinceMapData
      .map(item => ({
        ...item,
        percentage: totalUsage > 0 ? (item.value / totalUsage * 100) : 0
      }))
      .filter(item => item.value > 0) // 只显示有数据的省份
      .sort((a, b) => b.value - a.value) // 按订单数降序排列
      .slice(0, 10); // 取前10名
    
    return provincesWithPercentage;
  };

  // 获取排名标题
  const getRankingTitle = () => {
    switch (rankingType) {
      case 'orderCount':
        return '省份订单占比排名前10';
      case 'salesAmount':
        return '省份销售额占比排名前10';
      case 'discountAmount':
        return '省份优惠金额占比排名前10';
      default:
        return '省份订单占比排名前10';
    }
  };

  // 获取Top10省份数据（根据排名类型）
  const getTop10ProvincesByRanking = () => {
    const sortedData = [...provinceUsageData].sort((a, b) => {
      switch (rankingType) {
        case 'orderCount':
          return b.orderCount - a.orderCount;
        case 'salesAmount':
          return b.salesAmount - a.salesAmount;
        case 'discountAmount':
          return b.discountAmount - a.discountAmount;
        default:
          return b.orderCount - a.orderCount;
      }
    });
    return sortedData.slice(0, 10);
  };

  // 获取当前排名类型的总值
  const getTotalValue = () => {
    return provinceUsageData.reduce((sum, item) => {
      switch (rankingType) {
        case 'orderCount':
          return sum + item.orderCount;
        case 'salesAmount':
          return sum + item.salesAmount;
        case 'discountAmount':
          return sum + item.discountAmount;
        default:
          return sum + item.orderCount;
      }
    }, 0);
  };

  // 获取当前排名类型的单位
  const getCurrentUnit = () => {
    switch (rankingType) {
      case 'orderCount':
        return '张';
      case 'salesAmount':
        return '元';
      case 'discountAmount':
        return '元';
      default:
        return '张';
    }
  };

  // 获取前10省份数据
  const top10Provinces = getTop10ProvincesByRanking();
  
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
          text: getRankingTitle(),
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
        text: getRankingTitle(),
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (!params || !params.data) {
            return `${params?.name || '未知'}<br/>${rankingType === 'orderCount' ? '订单数' : rankingType === 'salesAmount' ? '销售额' : '优惠金额'}: 0<br/>占比: 0.00%<br/>排名: 未上榜`;
          }
          const { name, value } = params.data;
          const totalValue = getTotalValue();
          const percentage = value && totalValue > 0 ? ((value / totalValue) * 100).toFixed(2) : '0.00';
          const rank = top10Provinces.findIndex(item => item.name === name) + 1;
          const rankText = rank > 0 ? `第${rank}名` : '未上榜';
          const valueText = rankingType === 'salesAmount' || rankingType === 'discountAmount' 
            ? `¥${value?.toLocaleString() || 0}` 
            : (value?.toLocaleString() || 0);
          const unitText = rankingType === 'orderCount' ? '订单数' : rankingType === 'salesAmount' ? '销售额' : '优惠金额';
          return `${name}<br/>${unitText}: ${valueText}<br/>占比: ${percentage}%<br/>排名: ${rankText}`;
        }
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        left: 'left',
        bottom: '5%',
        text: [`${maxValue}`, `${minValue}`],
        calculable: true,
        formatter: (value: number) => {
          if (rankingType === 'salesAmount' || rankingType === 'discountAmount') {
            return `¥${value.toLocaleString()}`;
          }
          return value.toString();
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
          name: getRankingTitle(),
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
          select: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold'
            },
            itemStyle: {
              areaColor: '#40a9ff'
            }
          },
          data: data.map(item => ({
            name: item.name,
            value: item.value || 0,
            // 为前10省份设置特殊样式
            itemStyle: top10Names.includes(item.name) ? {
              areaColor: getProvinceColor(item.name, item.value || 0),
              borderColor: '#1890ff',
              borderWidth: 1
            } : {
              areaColor: '#f5f5f5',
              borderColor: '#e8e8e8',
              borderWidth: 0.5
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
        <Title level={4} style={{ marginBottom: '16px' }}>数据来源</Title>
        <Row gutter={[16, 10]}>
          <Col span={4}>
            <Text strong style={{ color: '#595959' }}>应用平台：</Text>
          </Col>
          <Col span={20}>
            <Text style={{ color: '#262626' }}>康师傅官方旗舰店（微信小程序）、康师傅会员福利官（微信小程序）</Text>
          </Col>
          <Col span={4}>
            <Text strong style={{ color: '#595959' }}>数据批次：</Text>
          </Col>
          <Col span={20}>
            <Text style={{ color: '#262626' }}>{userAnalysisData.length}个批次</Text>
          </Col>
          <Col span={4}>
            <Text strong style={{ color: '#595959' }}>活动机制：</Text>
          </Col>
          <Col span={20}>
            <Text style={{ color: '#262626' }}>
              {userAnalysisData.length > 0 && userAnalysisData[0].mechanisms 
                ? userAnalysisData[0].mechanisms.slice(0, 10).join('、') + (userAnalysisData[0].mechanisms.length > 3 ? '' : '')
                : '暂无机制'
              }
            </Text>
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
            
            {/* 销售额、订单数、人均订单金额与优惠金额显示在漏斗下方 */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="销售额（元）"
                    value={2580000}
                    precision={2}
                    valueStyle={{ color: '#000000', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="订单数"
                    value={16280}
                    valueStyle={{ color: '#000000', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="人均订单金额（元）"
                    value={158.5}
                    precision={2}
                    valueStyle={{ color: '#000000', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic
                    title="优惠金额（元）"
                    value={386000}
                    precision={2}
                    valueStyle={{ color: '#000000', fontSize: '24px' }}
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
                top: '16px', 
                right: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 12px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e8e8e8'
              }}>
                <Statistic
                  title="订单数"
                  value={15680}
                  valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                  suffix="张"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>


      
      {/* 省份订单占比地图展示 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={16}>
            <Card style={{ height: '540px' }}>
              <div style={{ position: 'relative', height: '500px' }}>
                {mapReady ? (
                  <ReactECharts 
                    option={getMapChartOption(getProvinceMapData())} 
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
                {/* 切换按钮 - 移动到地图左上角 */}
                <div style={{ 
                  position: 'absolute', 
                  top: '16px', 
                  left: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e8e8e8',
                  zIndex: 10
                }}>
                  <Select
                    value={rankingType}
                    onChange={(value) => setRankingType(value)}
                    style={{ width: 120 }}
                    size="small"
                  >
                    <Option value="orderCount">订单数</Option>
                    <Option value="salesAmount">销售额</Option>
                    <Option value="discountAmount">优惠金额</Option>
                  </Select>
                </div>
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
                    title={getCurrentUnit()}
                    value={getTotalValue()}
                    valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                    suffix={rankingType === 'orderCount' ? '张' : ''}
                    formatter={(value) => {
                      if (rankingType === 'salesAmount' || rankingType === 'discountAmount') {
                        return `¥${value.toLocaleString()}`;
                      }
                      return value.toLocaleString();
                    }}
                  />
                </div>
              </div>
            </Card>
        </Col>
        <Col span={8}>
           <Card 
             title={getRankingTitle()}
             style={{ height: '540px' }}
           >
             <div style={{ height: '490px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                   <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                     <th style={{ padding: '8px 4px', textAlign: 'left', fontSize: '12px', color: '#666' }}>序号</th>
                     <th style={{ padding: '8px 4px', textAlign: 'left', fontSize: '12px', color: '#666' }}>省份/城市</th>
                     <th style={{ padding: '8px 4px', textAlign: 'right', fontSize: '12px', color: '#666' }}>
                       {rankingType === 'orderCount' ? '订单数' : rankingType === 'salesAmount' ? '销售额' : '优惠金额'}
                     </th>
                     <th style={{ padding: '8px 4px', textAlign: 'right', fontSize: '12px', color: '#666' }}>占比（%）</th>
                   </tr>
                 </thead>
                 <tbody>
                   {top10Provinces.map((province, index) => {
                     const totalValue = getTotalValue();
                     const currentValue = getCurrentValue(province);
                     const percentage = totalValue > 0 ? ((currentValue / totalValue) * 100).toFixed(1) : '0.0';
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
                           {rankingType === 'salesAmount' || rankingType === 'discountAmount' 
                             ? `¥${currentValue.toLocaleString()}` 
                             : currentValue.toLocaleString()
                           }
                         </td>
                         <td style={{ 
                           padding: '8px 4px', 
                           textAlign: 'right', 
                           fontSize: '14px', 
                           color: index < 3 ? '#1890ff' : '#333',
                           fontWeight: index < 3 ? 'bold' : 'normal'
                         }}>
                           {percentage}
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