import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  DatePicker, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  Typography, 
  Space, 
  Tooltip,
  Button,
  Input,
  Select,
  Radio,
  Modal
} from 'antd';
import { 
  ShopOutlined, 
  ProductOutlined, 
  AlertOutlined, 
  BankOutlined,
  SearchOutlined,
  FilterOutlined,
  LineChartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import type { ColumnsType } from 'antd/es/table';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

// 任务详情接口
interface TaskDetail {
  taskName: string;
  taskPeriod: string;
  productCode: string;
  productNames: string;
  commodityCount: number;
  monitoringPlatform: string;
  status: string;
  collectionTypes: string[]; // 采集类型
  frequency: string; // 频次
  brokenPriceProductCount: number; // 破价产品数
  brokenPriceRate: number; // 破价率
}

// 核心指标接口
interface CoreMetrics {
  monitoredCommodities: number;
  priceBreakCommodities: number;
  monitoringCount: number; // 监测次数
  priceBreakCount: number; // 破价次数
  priceBreakRate: number; // 破价率
}

// 商品破价汇总接口
interface ProductSummary {
  key: string;
  date: string;
  commodityName: string;
  retailer: string;
  monitoringPlatform: string;
  isPriceBreak: boolean;
  priceBreakCount: number;
  guidePrice: number; // 渠道指导价
  lowestPrice: number; // 最低售价
  trend: 'up' | 'down' | 'stable'; // 趋势
}

// 破价产品明细列表接口
interface PriceBreakDetail {
  key: string;
  date: string;
  commodityName: string;
  specification: string;
  retailer: string;
  monitoringPlatform: string;
  province: string;
  city: string;
  isNewProduct: boolean;
  isValid: boolean;
  storeCode: string;
  storeName: string; // 门店名称
  guidePrice: number;
  finalPrice: number;
  isPriceBreak: boolean;
  monitorMethod: string;
  priceBreakCount: number;
}

const PriceMonitoringDashboard: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  
  // 时间筛选状态
  const [selectedDate, setSelectedDate] = useState(dayjs().subtract(1, 'day'));
  const [detailDateRange, setDetailDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(7, 'day'),
    dayjs()
  ]);
  const [dateType, setDateType] = useState<string>('day');
  const [dateRangeType, setDateRangeType] = useState<'yesterday' | 'last7days' | 'last30days' | 'custom'>('yesterday');
  
  // 详细列表筛选状态
  const [detailSearchText, setDetailSearchText] = useState('');
  const [filteredDetailData, setFilteredDetailData] = useState<PriceBreakDetail[]>([]);
  
  // 显示价格趋势图
  const showTrendChart = (product: ProductSummary) => {
    console.log('点击查看趋势图，商品信息：', product);
    setSelectedProduct(product);
    setTrendModalVisible(true);
    console.log('Modal状态已设置为显示');
  };

  // 生成价格趋势图配置
  const getTrendChartOption = (product: ProductSummary) => {
    console.log('生成趋势图配置，商品信息：', product);
    
    // 模拟7天的价格数据
    const dates = [];
    const guidePrices = [];
    const lowestPrices = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('MM-DD');
      dates.push(date);
      
      // 渠道指导价保持稳定
      guidePrices.push(product.guidePrice);
      
      // 最低售价有更明显的波动，确保图表有足够的视觉差异
      const basePrice = product.lowestPrice;
      const guidePrice = product.guidePrice;
      
      // 创建更大范围的价格波动，在指导价的70%-95%之间
      const minPrice = guidePrice * 0.7;
      const maxPrice = guidePrice * 0.95;
      const priceRange = maxPrice - minPrice;
      
      // 根据天数创建趋势性变化
      const trendFactor = (6 - i) / 6; // 0到1的趋势因子
      const randomFactor = (Math.random() - 0.5) * 0.3; // ±15%的随机波动
      
      const trendPrice = minPrice + (priceRange * (0.3 + trendFactor * 0.4 + randomFactor));
      lowestPrices.push(Number(trendPrice.toFixed(2)));
    }

    console.log('趋势图数据：', { dates, guidePrices, lowestPrices });

    const option = {
      title: {
        text: `${product.commodityName} - 趋势分析`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: (params: any) => {
          let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const color = param.color;
            result += `<div style="margin: 2px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; margin-right: 5px;"></span>
              ${param.seriesName}: ¥${param.value.toFixed(2)}
            </div>`;
          });
          return result;
        }
      },
      legend: {
        data: ['渠道指导价', '最低售价'],
        bottom: 15,
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '8%',
        right: '5%',
        bottom: '20%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        name: '日期',
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          fontSize: 12,
          fontWeight: 'bold'
        },
        axisLabel: {
          fontSize: 11,
          color: '#666'
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: '价格(元)',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontSize: 12,
          fontWeight: 'bold'
        },
        axisLabel: {
          formatter: '¥{value}',
          fontSize: 11,
          color: '#666'
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed'
          }
        },
        // 设置Y轴的最小值和最大值，确保有足够的显示空间
        min: function(value: any) {
          return Math.floor(value.min * 0.9);
        },
        max: function(value: any) {
          return Math.ceil(value.max * 1.1);
        }
      },
      series: [
        {
          name: '渠道指导价',
          type: 'line',
          data: guidePrices,
          lineStyle: {
            color: '#1890ff',
            width: 2,
            type: 'dashed' // 虚线显示渠道指导价
          },
          itemStyle: {
            color: '#1890ff',
            borderWidth: 2
          },
          symbol: 'circle',
          symbolSize: 6,
          smooth: false,
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: '最低售价',
          type: 'line',
          data: lowestPrices,
          lineStyle: {
            color: '#ff4d4f',
            width: 2,
            type: 'solid' // 实线显示最低售价
          },
          itemStyle: {
            color: '#ff4d4f',
            borderWidth: 2
          },
          symbol: 'circle',
          symbolSize: 6,
          smooth: false,
          emphasis: {
            focus: 'series'
          }
        }
      ]
    };

    console.log('生成的图表配置：', option);
    return option;
  };

  // 商品名称搜索状态
  const [productSearchText, setProductSearchText] = useState<string>('');

  // 价格趋势弹窗状态
   const [trendModalVisible, setTrendModalVisible] = useState<boolean>(false);
   const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
   
   // 模拟任务详情数据
   const taskDetail: TaskDetail = {
     taskName: '康师傅红烧牛肉面破价监测',
    taskPeriod: '2025-01-01 至 2025-01-31',
    productCode: '6901234567890,6901234567891,6901234567892',
    productNames: '康师傅红烧牛肉面(袋装), 康师傅红烧牛肉面(桶装), 康师傅红烧牛肉面(盒装)',
    commodityCount: 15,
    monitoringPlatform: '美团闪购、京东到家、饿了么',
    status: '监测中',
    collectionTypes: ['RPA抓取', '人工截图', '平台订单'],
    frequency: '2次/日',
    brokenPriceProductCount: 23,
    brokenPriceRate: 14.7
  };

  // 模拟核心指标数据
  const coreMetrics: CoreMetrics = {
    monitoredCommodities: 15,
    priceBreakCommodities: 8,
    monitoringCount: 156, // 监测次数
    priceBreakCount: 23, // 破价次数
    priceBreakRate: 14.7 // 破价率
  };

  // 模拟商品破价汇总数据 - 只包含破价产品
  const productSummaryData: ProductSummary[] = [
    {
      key: '1',
      date: '2025-01-15',
      commodityName: '康师傅红烧牛肉面 105g (6901234567890)',
      retailer: '华润万家',
      monitoringPlatform: '美团闪购',
      isPriceBreak: true,
      priceBreakCount: 8,
      guidePrice: 4.5,
      lowestPrice: 3.8,
      trend: 'down' as const
    },
    {
      key: '2',
      date: '2025-01-15',
      commodityName: '康师傅红烧牛肉面 120g (6901234567891)',
      retailer: '沃尔玛',
      monitoringPlatform: '京东到家',
      isPriceBreak: true,
      priceBreakCount: 6,
      guidePrice: 5.2,
      lowestPrice: 4.9,
      trend: 'stable' as const
    },
    {
      key: '3',
      date: '2025-01-15',
      commodityName: '康师傅红烧牛肉面 桶装 (6901234567892)',
      retailer: '永辉超市',
      monitoringPlatform: '饿了么',
      isPriceBreak: true,
      priceBreakCount: 5,
      guidePrice: 6.8,
      lowestPrice: 7.2,
      trend: 'up' as const
    },
    {
      key: '4',
      date: '2025-01-15',
      commodityName: '康师傅香菇炖鸡面 105g (6901234567893)',
      retailer: '家乐福',
      monitoringPlatform: '美团闪购',
      isPriceBreak: true,
      priceBreakCount: 4,
      guidePrice: 4.8,
      lowestPrice: 4.2,
      trend: 'down' as const
    },
    {
      key: '5',
      date: '2025-01-15',
      commodityName: '康师傅老坛酸菜面 120g (6901234567894)',
      retailer: '大润发',
      monitoringPlatform: '京东到家',
      isPriceBreak: true,
      priceBreakCount: 3,
      guidePrice: 5.5,
      lowestPrice: 5.0,
      trend: 'stable' as const
    }
  ].filter(item => item.isPriceBreak)
   .sort((a, b) => b.priceBreakCount - a.priceBreakCount); // 按破价次数从大到小排序

  // 模拟破价产品明细数据
  const priceBreakDetailData: PriceBreakDetail[] = [
    {
      key: '1',
      date: '2025-01-15',
      commodityName: '康师傅红烧牛肉面 105g (6901234567890)',
      specification: '105g/袋',
      retailer: '华润万家',
      monitoringPlatform: '美团闪购',
      province: '北京市',
      city: '北京市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'CR001',
      storeName: '华润万家北京朝阳门店',
      guidePrice: 4.5,
      finalPrice: 3.8,
      isPriceBreak: true,
      monitorMethod: 'manual',
      priceBreakCount: 3
    },
    {
      key: '2',
      date: '2025-01-15',
      commodityName: '康师傅红烧牛肉面 105g (6901234567890)',
      specification: '105g/袋',
      retailer: '华润万家',
      monitoringPlatform: '京东到家',
      province: '上海市',
      city: '上海市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'CR002',
      storeName: '华润万家上海徐家汇店',
      guidePrice: 4.5,
      finalPrice: 4.0,
      isPriceBreak: true,
      monitorMethod: 'RPA',
      priceBreakCount: 2
    },
    {
      key: '3',
      date: '2025-01-14',
      commodityName: '康师傅红烧牛肉面 120g (6901234567891)',
      specification: '120g/袋',
      retailer: '沃尔玛',
      monitoringPlatform: '饿了么',
      province: '广东省',
      city: '深圳市',
      isNewProduct: true,
      isValid: true,
      storeCode: 'WM001',
      storeName: '沃尔玛深圳南山店',
      guidePrice: 5.0,
      finalPrice: 4.2,
      isPriceBreak: true,
      monitorMethod: 'order',
      priceBreakCount: 5
    },
    {
      key: '4',
      date: '2025-01-14',
      commodityName: '康师傅老坛酸菜面 105g (6901234567892)',
      specification: '105g/袋',
      retailer: '永辉超市',
      monitoringPlatform: '美团闪购',
      province: '江苏省',
      city: '南京市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'YH001',
      storeName: '永辉超市南京新街口店',
      guidePrice: 4.8,
      finalPrice: 4.1,
      isPriceBreak: true,
      monitorMethod: 'RPA',
      priceBreakCount: 1
    },
    {
      key: '5',
      date: '2025-01-13',
      commodityName: '康师傅香辣牛肉面 105g (6901234567893)',
      specification: '105g/袋',
      retailer: '家乐福',
      monitoringPlatform: '美团闪购',
      province: '浙江省',
      city: '杭州市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'CF001',
      storeName: '家乐福杭州西湖店',
      guidePrice: 4.5,
      finalPrice: 3.9,
      isPriceBreak: true,
      monitorMethod: 'manual',
      priceBreakCount: 4
    },
    {
      key: '6',
      date: '2025-01-13',
      commodityName: '康师傅海鲜面 105g (6901234567894)',
      specification: '105g/袋',
      retailer: '大润发',
      monitoringPlatform: '京东到家',
      province: '山东省',
      city: '青岛市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'RT001',
      storeName: '大润发青岛市南店',
      guidePrice: 5.2,
      finalPrice: 4.5,
      isPriceBreak: true,
      monitorMethod: 'order',
      priceBreakCount: 2
    },
    {
      key: '7',
      date: '2025-01-12',
      commodityName: '康师傅鲜虾鱼板面 105g (6901234567895)',
      specification: '105g/袋',
      retailer: '物美',
      monitoringPlatform: '饿了么',
      province: '河南省',
      city: '郑州市',
      isNewProduct: true,
      isValid: true,
      storeCode: 'WM002',
      storeName: '物美郑州金水店',
      guidePrice: 4.8,
      finalPrice: 4.0,
      isPriceBreak: true,
      monitorMethod: 'RPA',
      priceBreakCount: 3
    },
    {
      key: '8',
      date: '2025-01-12',
      commodityName: '康师傅西红柿鸡蛋面 105g (6901234567896)',
      specification: '105g/袋',
      retailer: '华联',
      monitoringPlatform: '美团闪购',
      province: '四川省',
      city: '成都市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'HL001',
      storeName: '华联成都锦江店',
      guidePrice: 4.3,
      finalPrice: 3.7,
      isPriceBreak: true,
      monitorMethod: 'order',
      priceBreakCount: 1
    },
    {
      key: '9',
      date: '2025-01-15',
      commodityName: '康师傅红烧牛肉面 105g (6901234567890)',
      specification: '105g/袋',
      retailer: '欧亚商都',
      monitoringPlatform: '美团闪购',
      province: '吉林省',
      city: '长春市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'OY001',
      storeName: '欧亚商都长春中心店',
      guidePrice: 4.5,
      finalPrice: 3.6,
      isPriceBreak: true,
      monitorMethod: 'RPA',
      priceBreakCount: 6
    },
    {
      key: '10',
      date: '2025-01-14',
      commodityName: '康师傅老坛酸菜面 105g (6901234567892)',
      specification: '105g/袋',
      retailer: '重庆百货',
      monitoringPlatform: '京东到家',
      province: '吉林省',
      city: '吉林市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'CQ001',
      storeName: '重庆百货解放碑店',
      guidePrice: 4.8,
      finalPrice: 4.0,
      isPriceBreak: true,
      monitorMethod: 'manual',
      priceBreakCount: 4
    },
    {
      key: '11',
      date: '2025-01-13',
      commodityName: '康师傅香辣牛肉面 105g (6901234567893)',
      specification: '105g/袋',
      retailer: '吉林大润发',
      monitoringPlatform: '饿了么',
      province: '吉林省',
      city: '四平市',
      isNewProduct: true,
      isValid: true,
      storeCode: 'JL001',
      storeName: '吉林大润发四平中央店',
      guidePrice: 4.5,
      finalPrice: 3.8,
      isPriceBreak: true,
      monitorMethod: 'order',
      priceBreakCount: 3
    },
    {
      key: '12',
      date: '2025-01-12',
      commodityName: '康师傅海鲜面 105g (6901234567894)',
      specification: '105g/袋',
      retailer: '松原超市',
      monitoringPlatform: '美团闪购',
      province: '吉林省',
      city: '松原市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'SY001',
      storeName: '松原超市宁江区店',
      guidePrice: 5.2,
      finalPrice: 4.3,
      isPriceBreak: true,
      monitorMethod: 'RPA',
      priceBreakCount: 2
    },
    {
      key: '13',
      date: '2025-01-11',
      commodityName: '康师傅鲜虾鱼板面 105g (6901234567895)',
      specification: '105g/袋',
      retailer: '延边商场',
      monitoringPlatform: '京东到家',
      province: '吉林省',
      city: '延边朝鲜族自治州',
      isNewProduct: false,
      isValid: true,
      storeCode: 'YB001',
      storeName: '延边商场延吉中心店',
      guidePrice: 4.8,
      finalPrice: 4.1,
      isPriceBreak: true,
      monitorMethod: 'manual',
      priceBreakCount: 5
    },
    // 天津市数据
    {
      key: '14',
      date: '2025-01-15',
      commodityName: '康师傅红烧牛肉面 105g (6901234567890)',
      specification: '105g/袋',
      retailer: '天津华润万家',
      monitoringPlatform: '美团闪购',
      province: '天津市',
      city: '天津市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'TJ001',
      storeName: '天津华润万家和平店',
      guidePrice: 4.5,
      finalPrice: 3.7,
      isPriceBreak: true,
      monitorMethod: 'RPA',
      priceBreakCount: 4
    },
    {
      key: '15',
      date: '2025-01-14',
      commodityName: '康师傅老坛酸菜面 105g (6901234567892)',
      specification: '105g/袋',
      retailer: '天津永辉',
      monitoringPlatform: '京东到家',
      province: '天津市',
      city: '天津市',
      isNewProduct: false,
      isValid: true,
      storeCode: 'TJ002',
      storeName: '天津永辉河西店',
      guidePrice: 4.8,
      finalPrice: 4.0,
      isPriceBreak: true,
      monitorMethod: 'manual',
      priceBreakCount: 3
    },
    {
      key: '16',
      date: '2025-01-13',
      commodityName: '康师傅香辣牛肉面 105g (6901234567893)',
      specification: '105g/袋',
      retailer: '天津大润发',
      monitoringPlatform: '饿了么',
      province: '天津市',
      city: '天津市',
      isNewProduct: true,
      isValid: true,
      storeCode: 'TJ003',
      storeName: '天津大润发南开店',
      guidePrice: 4.5,
      finalPrice: 3.8,
      isPriceBreak: true,
      monitorMethod: 'order',
      priceBreakCount: 2
    }
  ].sort((a, b) => b.priceBreakCount - a.priceBreakCount); // 按破价次数从大到小排序

  // 初始化详细列表数据
  useEffect(() => {
    setFilteredDetailData(priceBreakDetailData);
  }, []);

  // 根据破价商品明细数据动态计算省份破价统计
  const calculateProvinceStats = () => {
    const provinceStats: { [key: string]: { value: number; retailerCount: number; commodityCount: number; retailers: Set<string>; commodities: Set<string> } } = {};
    
    // 省份名称映射表，确保与地图数据匹配
    const provinceNameMap: { [key: string]: string } = {
      '北京': '北京市',
      '天津': '天津市', 
      '河北': '河北省',
      '山西': '山西省',
      '内蒙古': '内蒙古自治区',
      '辽宁': '辽宁省',
      '吉林': '吉林省',
      '黑龙江': '黑龙江省',
      '上海': '上海市',
      '江苏': '江苏省',
      '浙江': '浙江省',
      '安徽': '安徽省',
      '福建': '福建省',
      '江西': '江西省',
      '山东': '山东省',
      '河南': '河南省',
      '湖北': '湖北省',
      '湖南': '湖南省',
      '广东': '广东省',
      '广西': '广西壮族自治区',
      '海南': '海南省',
      '重庆': '重庆市',
      '四川': '四川省',
      '贵州': '贵州省',
      '云南': '云南省',
      '西藏': '西藏自治区',
      '陕西': '陕西省',
      '甘肃': '甘肃省',
      '青海': '青海省',
      '宁夏': '宁夏回族自治区',
      '新疆': '新疆维吾尔自治区',
      '台湾': '台湾省',
      '香港': '香港特别行政区',
      '澳门': '澳门特别行政区'
    };
    
    // 为了演示效果，生成一些模拟数据，增加破价商品数量方便查看交互效果
    const mockProvinceData: { [key: string]: { value: number; retailerCount: number; commodityCount: number } } = {
      '北京': { value: 456, retailerCount: 45, commodityCount: 125 },
      '上海': { value: 398, retailerCount: 38, commodityCount: 108 },
      '广东': { value: 378, retailerCount: 52, commodityCount: 142 },
      '江苏': { value: 298, retailerCount: 35, commodityCount: 98 },
      '浙江': { value: 267, retailerCount: 32, commodityCount: 89 },
      '山东': { value: 246, retailerCount: 41, commodityCount: 115 },
      '河南': { value: 215, retailerCount: 28, commodityCount: 78 },
      '四川': { value: 194, retailerCount: 31, commodityCount: 85 },
      '湖北': { value: 173, retailerCount: 26, commodityCount: 72 },
      '福建': { value: 158, retailerCount: 24, commodityCount: 69 },
      '湖南': { value: 142, retailerCount: 22, commodityCount: 67 },
      '安徽': { value: 128, retailerCount: 19, commodityCount: 55 },
      '河北': { value: 115, retailerCount: 18, commodityCount: 54 },
      '江西': { value: 102, retailerCount: 17, commodityCount: 52 },
      '重庆': { value: 89, retailerCount: 16, commodityCount: 41 },
      '辽宁': { value: 76, retailerCount: 15, commodityCount: 39 },
      '陕西': { value: 64, retailerCount: 14, commodityCount: 38 },
      '天津': { value: 52, retailerCount: 13, commodityCount: 37 },
      '云南': { value: 48, retailerCount: 12, commodityCount: 36 },
      '山西': { value: 45, retailerCount: 11, commodityCount: 35 },
      '贵州': { value: 42, retailerCount: 10, commodityCount: 34 },
      '吉林': { value: 38, retailerCount: 9, commodityCount: 33 },
      '甘肃': { value: 35, retailerCount: 8, commodityCount: 32 },
      '黑龙江': { value: 32, retailerCount: 7, commodityCount: 31 },
      '广西': { value: 29, retailerCount: 6, commodityCount: 30 },
      '海南': { value: 26, retailerCount: 5, commodityCount: 28 },
      '内蒙古': { value: 23, retailerCount: 4, commodityCount: 26 },
      '宁夏': { value: 20, retailerCount: 3, commodityCount: 24 },
      '青海': { value: 18, retailerCount: 2, commodityCount: 22 },
      '西藏': { value: 15, retailerCount: 2, commodityCount: 20 },
      '新疆': { value: 12, retailerCount: 1, commodityCount: 18 }
    };
    
    // 遍历破价商品明细数据进行统计
    priceBreakDetailData.forEach(item => {
      // 标准化省份名称（去掉"省"、"市"等后缀）
      let provinceName = item.province.replace(/(省|市|自治区|特别行政区|壮族|回族|维吾尔)$/g, '');
      
      // 特殊处理
      if (provinceName === '内蒙古自治') provinceName = '内蒙古';
      if (provinceName === '广西壮族自治') provinceName = '广西';
      if (provinceName === '宁夏回族自治') provinceName = '宁夏';
      if (provinceName === '新疆维吾尔自治') provinceName = '新疆';
      
      if (!provinceStats[provinceName]) {
        provinceStats[provinceName] = {
          value: 0,
          retailerCount: 0,
          commodityCount: 0,
          retailers: new Set<string>(),
          commodities: new Set<string>()
        };
      }
      
      // 累加破价次数
      provinceStats[provinceName].value += item.priceBreakCount;
      // 记录零售商和商品（用于去重计数）
      provinceStats[provinceName].retailers.add(item.retailer);
      provinceStats[provinceName].commodities.add(item.commodityName);
    });
    
    // 转换为最终格式并添加所有省份，使用地图数据中的完整名称
    const allProvinces = Object.keys(provinceNameMap);
    
    return allProvinces.map(provinceName => {
      const stats = provinceStats[provinceName];
      const mockData = mockProvinceData[provinceName];
      
      // 优先使用真实数据，如果没有则使用模拟数据
      const priceBreakCount = stats ? stats.value : (mockData ? mockData.value : 0);
      const monitoredCommodityCount = stats ? stats.commodities.size : (mockData ? mockData.commodityCount : 0);
      const monitoringCount = monitoredCommodityCount * 30; // 假设每个商品监测30次
      const priceBreakRate = monitoringCount > 0 ? Number((priceBreakCount / monitoringCount * 100).toFixed(1)) : 0;
      
      return {
        name: provinceNameMap[provinceName], // 使用完整的省份名称匹配地图数据
        value: priceBreakCount, // 破价次数
        retailerCount: stats ? stats.retailers.size : (mockData ? mockData.retailerCount : 0),
        commodityCount: stats ? stats.commodities.size : (mockData ? mockData.commodityCount : 0), // 破价商品数
        monitoredCommodityCount: monitoredCommodityCount, // 监测商品数
        monitoringCount: monitoringCount, // 监测次数
        priceBreakRate: priceBreakRate // 破价率
      };
    });
  };

  // 动态计算城市破价统计数据
  const calculateCityStats = () => {
    const cityStats = new Map<string, {
      name: string;
      province: string;
      value: number;
      retailerCount: number;
      commodityCount: number;
    }>();

    priceBreakDetailData.forEach(item => {
      const cityKey = `${item.city}-${item.province}`;
      if (!cityStats.has(cityKey)) {
        cityStats.set(cityKey, {
          name: item.city,
          province: item.province,
          value: 0,
          retailerCount: 0,
          commodityCount: 0
        });
      }

      const cityData = cityStats.get(cityKey)!;
      cityData.value += item.priceBreakCount;
      
      // 统计零售商数量（去重）
      const retailers = new Set<string>();
      const commodities = new Set<string>();
      
      priceBreakDetailData
        .filter(d => d.city === item.city && d.province === item.province)
        .forEach(d => {
          retailers.add(d.retailer);
          commodities.add(d.commodityName);
        });
      
      cityData.retailerCount = retailers.size;
      cityData.commodityCount = commodities.size;
    });

    const realData = Array.from(cityStats.values());

    // 如果真实数据不足，添加模拟数据
    if (realData.length < 20) {
      const mockCityData = [
        { name: '北京', province: '北京市', value: 1250, retailerCount: 85, commodityCount: 120 },
        { name: '上海', province: '上海市', value: 1180, retailerCount: 78, commodityCount: 115 },
        { name: '深圳', province: '广东省', value: 980, retailerCount: 65, commodityCount: 95 },
        { name: '广州', province: '广东省', value: 920, retailerCount: 62, commodityCount: 88 },
        { name: '杭州', province: '浙江省', value: 850, retailerCount: 58, commodityCount: 82 },
        { name: '南京', province: '江苏省', value: 780, retailerCount: 52, commodityCount: 75 },
        { name: '成都', province: '四川省', value: 720, retailerCount: 48, commodityCount: 68 },
        { name: '武汉', province: '湖北省', value: 680, retailerCount: 45, commodityCount: 62 },
        { name: '西安', province: '陕西省', value: 620, retailerCount: 42, commodityCount: 58 },
        { name: '重庆', province: '重庆市', value: 580, retailerCount: 38, commodityCount: 55 },
        { name: '天津', province: '天津市', value: 520, retailerCount: 35, commodityCount: 48 },
        { name: '苏州', province: '江苏省', value: 480, retailerCount: 32, commodityCount: 45 },
        { name: '青岛', province: '山东省', value: 450, retailerCount: 30, commodityCount: 42 },
        { name: '长沙', province: '湖南省', value: 420, retailerCount: 28, commodityCount: 38 },
        { name: '宁波', province: '浙江省', value: 380, retailerCount: 25, commodityCount: 35 },
        { name: '郑州', province: '河南省', value: 350, retailerCount: 23, commodityCount: 32 },
        { name: '沈阳', province: '辽宁省', value: 320, retailerCount: 22, commodityCount: 28 },
        { name: '济南', province: '山东省', value: 290, retailerCount: 20, commodityCount: 25 },
        { name: '合肥', province: '安徽省', value: 260, retailerCount: 18, commodityCount: 22 },
        { name: '福州', province: '福建省', value: 230, retailerCount: 15, commodityCount: 18 },
        { name: '厦门', province: '福建省', value: 210, retailerCount: 14, commodityCount: 16 },
        { name: '大连', province: '辽宁省', value: 195, retailerCount: 13, commodityCount: 15 },
        { name: '昆明', province: '云南省', value: 180, retailerCount: 12, commodityCount: 14 },
        { name: '石家庄', province: '河北省', value: 165, retailerCount: 11, commodityCount: 13 },
        { name: '哈尔滨', province: '黑龙江省', value: 150, retailerCount: 10, commodityCount: 12 },
        { name: '长春', province: '吉林省', value: 135, retailerCount: 9, commodityCount: 11 },
        { name: '太原', province: '山西省', value: 120, retailerCount: 8, commodityCount: 10 },
        { name: '南昌', province: '江西省', value: 105, retailerCount: 7, commodityCount: 9 },
        { name: '贵阳', province: '贵州省', value: 90, retailerCount: 6, commodityCount: 8 },
        { name: '兰州', province: '甘肃省', value: 75, retailerCount: 5, commodityCount: 7 },
        { name: '银川', province: '宁夏回族自治区', value: 60, retailerCount: 4, commodityCount: 6 },
        { name: '西宁', province: '青海省', value: 45, retailerCount: 3, commodityCount: 5 },
        { name: '乌鲁木齐', province: '新疆维吾尔自治区', value: 30, retailerCount: 2, commodityCount: 4 },
        { name: '拉萨', province: '西藏自治区', value: 15, retailerCount: 1, commodityCount: 3 }
      ];

      // 合并真实数据和模拟数据，避免重复
      const existingCities = new Set(realData.map(city => `${city.name}-${city.province}`));
      const filteredMockData = mockCityData.filter(city => !existingCities.has(`${city.name}-${city.province}`));
      
      return [...realData, ...filteredMockData].sort((a, b) => b.value - a.value);
    }

    return realData.sort((a, b) => b.value - a.value);
  };

  // 动态计算商品破价统计数据
  const calculateCommodityStats = () => {
    const commodityStats = new Map<string, {
      name: string;
      value: number;
      retailerCount: number;
    }>();

    priceBreakDetailData.forEach(item => {
      if (!commodityStats.has(item.commodityName)) {
        commodityStats.set(item.commodityName, {
          name: item.commodityName,
          value: 0,
          retailerCount: 0
        });
      }

      const commodityData = commodityStats.get(item.commodityName)!;
      commodityData.value += item.priceBreakCount;
      
      // 统计零售商数量（去重）
      const retailers = new Set<string>();
      priceBreakDetailData
        .filter(d => d.commodityName === item.commodityName)
        .forEach(d => retailers.add(d.retailer));
      
      commodityData.retailerCount = retailers.size;
    });

    const realData = Array.from(commodityStats.values());

    // 如果真实数据不足，添加模拟数据
    if (realData.length < 20) {
      const mockCommodityData = [
        { name: 'iPhone 15 Pro Max', value: 2850, retailerCount: 125 },
        { name: '华为Mate 60 Pro', value: 2650, retailerCount: 118 },
        { name: '小米14 Ultra', value: 2420, retailerCount: 105 },
        { name: 'OPPO Find X7 Ultra', value: 2180, retailerCount: 98 },
        { name: 'vivo X100 Pro', value: 1950, retailerCount: 88 },
        { name: '三星Galaxy S24 Ultra', value: 1820, retailerCount: 82 },
        { name: 'MacBook Pro M3', value: 1680, retailerCount: 75 },
        { name: '戴尔XPS 13', value: 1520, retailerCount: 68 },
        { name: '联想ThinkPad X1', value: 1380, retailerCount: 62 },
        { name: '华硕ROG游戏本', value: 1250, retailerCount: 55 },
        { name: 'iPad Pro 12.9', value: 1120, retailerCount: 48 },
        { name: '华为MatePad Pro', value: 980, retailerCount: 42 },
        { name: '小米平板6', value: 850, retailerCount: 38 },
        { name: 'AirPods Pro 2', value: 720, retailerCount: 32 },
        { name: '索尼WH-1000XM5', value: 650, retailerCount: 28 },
        { name: 'Bose QuietComfort', value: 580, retailerCount: 25 },
        { name: 'Apple Watch Ultra 2', value: 520, retailerCount: 22 },
        { name: '华为Watch GT 4', value: 450, retailerCount: 18 },
        { name: '小米手环8', value: 380, retailerCount: 15 },
        { name: 'Kindle Oasis', value: 320, retailerCount: 12 },
        { name: '荣耀Magic 6 Pro', value: 290, retailerCount: 11 },
        { name: '一加12 Pro', value: 260, retailerCount: 10 },
        { name: '真我GT5 Pro', value: 235, retailerCount: 9 },
        { name: 'Nothing Phone 2', value: 210, retailerCount: 8 },
        { name: '红米K70 Pro', value: 185, retailerCount: 7 },
        { name: 'iQOO 12 Pro', value: 160, retailerCount: 6 },
        { name: '魅族21 Pro', value: 135, retailerCount: 5 },
        { name: 'Surface Pro 10', value: 110, retailerCount: 4 },
        { name: 'Google Pixel 8 Pro', value: 85, retailerCount: 3 },
        { name: 'Sony Xperia 1 V', value: 60, retailerCount: 2 },
        { name: 'Motorola Edge 50', value: 35, retailerCount: 1 },
        { name: 'TCL C845电视', value: 310, retailerCount: 14 },
        { name: '海信U7K电视', value: 285, retailerCount: 13 },
        { name: '小米电视ES 2022', value: 255, retailerCount: 12 },
        { name: '华为智慧屏V5 Pro', value: 225, retailerCount: 11 },
        { name: '创维A23电视', value: 195, retailerCount: 10 },
        { name: '长虹D8K电视', value: 165, retailerCount: 9 },
        { name: '康佳APHAEA电视', value: 135, retailerCount: 8 },
        { name: '飞利浦OLED电视', value: 105, retailerCount: 7 },
        { name: 'LG OLED C3电视', value: 75, retailerCount: 6 },
        { name: '索尼A95K电视', value: 45, retailerCount: 5 }
      ];

      // 合并真实数据和模拟数据，避免重复
      const existingCommodities = new Set(realData.map(commodity => commodity.name));
      const filteredMockData = mockCommodityData.filter(commodity => !existingCommodities.has(commodity.name));
      
      return [...realData, ...filteredMockData].sort((a, b) => b.value - a.value);
    }

    return realData.sort((a, b) => b.value - a.value);
  };

  // 地图看板数据
  const mapData = {
    provinces: calculateProvinceStats(),
    cities: calculateCityStats(),
    commodities: calculateCommodityStats()
  };

  // 筛选详细列表数据
  const filterDetailData = (
    search: string,
    dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    let filtered = priceBreakDetailData;

    if (search) {
      filtered = filtered.filter(item =>
        item.commodityName.toLowerCase().includes(search.toLowerCase()) ||
        item.retailer.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
      });
    }

    setFilteredDetailData(filtered);
  };

  // 跳转到详细列表
  const scrollToDetail = (commodityName: string) => {
    const detailElement = document.getElementById('detail-list');
    if (detailElement) {
      detailElement.scrollIntoView({ behavior: 'smooth' });
      // 筛选该产品的数据
      const filtered = priceBreakDetailData.filter(item => item.commodityName === commodityName);
      setFilteredDetailData(filtered);
    }
  };

  // 处理时间筛选类型变化（日周月）
  const handleDateTypeChange = (e: any) => {
    setDateType(e.target.value);
  };

  // 处理时间范围类型变化
  const handleDateRangeTypeChange = (value: 'yesterday' | 'last7days' | 'last30days' | 'custom') => {
    setDateRangeType(value);
    let newDateRange: [dayjs.Dayjs, dayjs.Dayjs] | null = null;

    switch (value) {
      case 'yesterday':
        const yesterday = dayjs().subtract(1, 'day');
        newDateRange = [yesterday, yesterday];
        break;
      case 'last7days':
        newDateRange = [dayjs().subtract(7, 'day'), dayjs()];
        break;
      case 'last30days':
        newDateRange = [dayjs().subtract(30, 'day'), dayjs()];
        break;
      case 'custom':
        newDateRange = null;
        break;
    }

    setDetailDateRange(newDateRange);
    filterDetailData(detailSearchText, newDateRange);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    const typedDates = dates as [dayjs.Dayjs, dayjs.Dayjs] | null;
    setDetailDateRange(typedDates);
    filterDetailData(detailSearchText, typedDates);
  };

  // 商品破价汇总表格列
  const summaryColumns: ColumnsType<ProductSummary> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
      width: 250,
      render: (text, record) => (
        <Tooltip title="点击查看详情">
          <Button 
            type="link" 
            onClick={() => scrollToDetail(record.commodityName)}
            style={{ padding: 0, height: 'auto', textAlign: 'left' }}
          >
            {text}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: '零售商',
      dataIndex: 'retailer',
      key: 'retailer',
      width: 100,
    },
    {
      title: '监测平台',
      dataIndex: 'monitoringPlatform',
      key: 'monitoringPlatform',
      width: 100,
    },
    {
      title: '渠道指导价',
      dataIndex: 'guidePrice',
      key: 'guidePrice',
      width: 100,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '最低售价',
      dataIndex: 'lowestPrice',
      key: 'lowestPrice',
      width: 100,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '是否破价',
      dataIndex: 'isPriceBreak',
      key: 'isPriceBreak',
      width: 80,
      render: (isPriceBreak: boolean) => (
        <Tag color={isPriceBreak ? 'red' : 'green'}>
          {isPriceBreak ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '破价次数',
      dataIndex: 'priceBreakCount',
      key: 'priceBreakCount',
      width: 80,
      render: (count: number, record) => (
        <Tooltip title="查看详情">
          <Button 
            type="link" 
            onClick={() => scrollToDetail(record.commodityName)}
            style={{ padding: 0, height: 'auto', color: '#ff4d4f', fontWeight: 'bold' }}
          >
            {count}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 80,
      render: (trend: 'up' | 'down' | 'stable', record) => {
        return (
          <Button 
            type="link" 
            size="small"
            onClick={() => showTrendChart(record)}
            style={{ padding: 0 }}
          >
            查看
          </Button>
        );
      },
    },
  ];

  // 地图看板状态管理
  const [mapViewType, setMapViewType] = useState<'province' | 'city' | 'commodity' | 'retailer'>('province');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [selectedProvinceData, setSelectedProvinceData] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('全国'); // 新增：区域筛选状态

  // 处理地图点击事件
  const handleMapClick = (params: any) => {
    if (params.componentType === 'series' && params.data) {
      const provinceName = params.data.name;
      
      // 创建省份名称映射，将完整省份名称转换为简化名称
      const provinceNameMapping: { [key: string]: string } = {
        '北京市': '北京',
        '天津市': '天津',
        '河北省': '河北',
        '山西省': '山西',
        '内蒙古自治区': '内蒙古',
        '辽宁省': '辽宁',
        '吉林省': '吉林',
        '黑龙江省': '黑龙江',
        '上海市': '上海',
        '江苏省': '江苏',
        '浙江省': '浙江',
        '安徽省': '安徽',
        '福建省': '福建',
        '江西省': '江西',
        '山东省': '山东',
        '河南省': '河南',
        '湖北省': '湖北',
        '湖南省': '湖南',
        '广东省': '广东',
        '广西壮族自治区': '广西',
        '海南省': '海南',
        '重庆市': '重庆',
        '四川省': '四川',
        '贵州省': '贵州',
        '云南省': '云南',
        '西藏自治区': '西藏',
        '陕西省': '陕西',
        '甘肃省': '甘肃',
        '青海省': '青海',
        '宁夏回族自治区': '宁夏',
        '新疆维吾尔自治区': '新疆',
        '台湾省': '台湾',
        '香港特别行政区': '香港',
        '澳门特别行政区': '澳门'
      };
      
      // 将地图返回的完整省份名称转换为区域筛选控件中的简化名称
      const simplifiedName = provinceNameMapping[provinceName] || provinceName;
      
      setSelectedProvince(simplifiedName);
      setSelectedRegion(simplifiedName); // 同步更新区域筛选下拉框
      
      // 不再自动切换视图类型，保持当前的mapViewType
      // 数据联动将通过getCurrentTop10Data函数自动处理
    }
  };

  // 注册中国地图
  useEffect(() => {
    console.log('开始加载地图数据...');
    
    // 直接异步加载完整地图数据，不使用备用地图
    fetch('/china-map.json')
      .then(response => {
        console.log('地图数据响应状态:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((chinaGeoData) => {
        console.log('China map data loaded successfully:', chinaGeoData);
        console.log('地图数据特征数量:', chinaGeoData.features?.length);
        
        // 验证数据结构
        if (chinaGeoData && chinaGeoData.type === 'FeatureCollection' && Array.isArray(chinaGeoData.features)) {
          try {
            // 处理地图数据，确保properties.name格式正确
            const processedGeoData = {
              ...chinaGeoData,
              features: chinaGeoData.features.map((feature: any) => ({
                ...feature,
                properties: {
                  ...feature.properties,
                  // 确保name属性存在且格式正确
                  name: feature.properties.name || feature.properties.NAME || '未知'
                }
              }))
            };
            
            echarts.registerMap('china', processedGeoData);
            console.log('完整地图注册完成');
            setMapReady(true);
          } catch (error) {
            console.error('完整地图注册失败:', error);
            setMapReady(false);
          }
        } else {
          console.error('地图数据格式不正确:', chinaGeoData);
          setMapReady(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load China map data:', error);
        setMapReady(false);
      });
  }, []);

  // 获取省份颜色
  const getProvinceColor = (name: string, value?: number) => {
    // 如果没有传入value，从mapData中查找对应省份的数据
    if (value === undefined) {
      // 处理省份名称匹配：去掉"省"、"市"、"自治区"等后缀
      const simpleName = name.replace(/(省|市|自治区|特别行政区|壮族|回族|维吾尔).*$/, '');
      const provinceData = mapData.provinces.find(p => {
        // 标准化省份名称进行匹配
        const pName = p.name.replace(/(省|市|自治区|特别行政区|壮族|回族|维吾尔).*$/, '');
        return pName === simpleName || 
               p.name === name ||
               name.includes(pName) ||
               pName.includes(simpleName);
      });
      value = provinceData ? provinceData.value : 0;
    }
    
    if (value === 0) return '#f5f5f5';
    if (value >= 40) return '#ff4d4f';
    if (value >= 30) return '#ff7875';
    if (value >= 20) return '#ffa39e';
    if (value >= 10) return '#ffccc7';
    return '#fff1f0';
  };

  // 中国地图配置选项
  const getMapChartOption = (data: any[]) => {
    console.log('getMapChartOption called with data:', data);
    console.log('mapReady status:', mapReady);
    
    // 如果地图还没准备好，返回一个简单的提示配置
    if (!mapReady) {
      console.log('Map not ready, returning loading config');
      return {
        title: {
          text: '地图加载中...',
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 16,
            color: '#999'
          }
        }
      };
    }
    
    // 如果没有数据，使用geo组件而不是空的series
    if (!data || data.length === 0) {
      console.log('No data provided, returning geo-based config');
      return {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return `${params?.name || '未知'}<br/>暂无数据`;
          }
        },
        geo: {
            map: 'china',
            roam: false,
            aspectScale: 0.75,
            zoom: 1.0,
            center: [104, 35],
            left: '10%',
            top: '5%',
            right: '10%',
            bottom: '5%',
            itemStyle: {
              borderColor: '#333',
              borderWidth: 0.5,
              areaColor: '#f5f5f5'
            },
            label: {
              show: false
            },
            emphasis: {
              itemStyle: {
                areaColor: '#e6f7ff',
                borderColor: '#1890ff',
                borderWidth: 2
              }
            }
          }
      };
    }

    // 获取前10省份名单
    const top10Names = data.slice(0, 10).map(item => item.name);
    console.log('Top 10 province names:', top10Names);
    
    // 计算最大值和最小值，用于视觉映射
    const values = data.map(item => item.value || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    console.log('Value range:', { minValue, maxValue });
    
    // 准备地图数据 - 确保数据结构正确，包含所有必要属性
    const mapSeriesData = data.map(item => {
      // 省份名称映射：简化名称 -> 完整名称
      const provinceNameMapping: { [key: string]: string } = {
        '北京': '北京市',
        '天津': '天津市', 
        '河北': '河北省',
        '山西': '山西省',
        '内蒙古': '内蒙古自治区',
        '辽宁': '辽宁省',
        '吉林': '吉林省',
        '黑龙江': '黑龙江省',
        '上海': '上海市',
        '江苏': '江苏省',
        '浙江': '浙江省',
        '安徽': '安徽省',
        '福建': '福建省',
        '江西': '江西省',
        '山东': '山东省',
        '河南': '河南省',
        '湖北': '湖北省',
        '湖南': '湖南省',
        '广东': '广东省',
        '广西': '广西壮族自治区',
        '海南': '海南省',
        '重庆': '重庆市',
        '四川': '四川省',
        '贵州': '贵州省',
        '云南': '云南省',
        '西藏': '西藏自治区',
        '陕西': '陕西省',
        '甘肃': '甘肃省',
        '青海': '青海省',
        '宁夏': '宁夏回族自治区',
        '新疆': '新疆维吾尔自治区',
        '台湾': '台湾省',
        '香港': '香港特别行政区',
        '澳门': '澳门特别行政区'
      };
      
      // 将简化名称转换为完整名称进行匹配
      const fullSelectedRegionName = provinceNameMapping[selectedRegion] || selectedRegion;
      
      const result = {
        name: item.name,
        value: item.value || 0,
        retailerCount: item.retailerCount || 0,
        commodityCount: item.commodityCount || 0,
        monitoredCommodityCount: item.monitoredCommodityCount || 0,
        monitoringCount: item.monitoringCount || 0,
        priceBreakRate: item.priceBreakRate || 0,
        // 根据选中状态设置样式
        itemStyle: selectedRegion !== '全国' && fullSelectedRegionName !== item.name ? {
          areaColor: '#e0e0e0', // 置灰其他省份
          borderColor: '#ccc',
          borderWidth: 0.5
        } : selectedRegion !== '全国' && fullSelectedRegionName === item.name ? {
          areaColor: '#1890ff', // 高亮选中省份
          borderColor: '#0050b3',
          borderWidth: 2
        } : undefined
      };
      console.log('Processed map data item:', result);
      return result;
    });
    
    console.log('Final mapSeriesData:', mapSeriesData);
    
    const config = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#ff4d4f',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        formatter: (params: any) => {
          console.log('Tooltip params:', params);
          if (!params || !params.data) {
            return `<div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px; color: #ff4d4f;">${params?.name || '未知'}</div>
              <div>监测商品数: <span style="color: #1890ff;">0</span></div>
              <div>破价商品数: <span style="color: #ffa940;">0</span></div>
              <div>监测次数: <span style="color: #52c41a;">0</span></div>
              <div>破价次数: <span style="color: #ff4d4f; font-weight: bold;">0</span></div>
              <div>破价率: <span style="color: #722ed1; font-weight: bold;">0%</span></div>
            </div>`;
          }
          const { name, value, commodityCount, monitoredCommodityCount, monitoringCount, priceBreakRate } = params.data;
          return `<div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px; color: #ff4d4f;">${name}</div>
            <div>监测商品数: <span style="color: #1890ff;">${monitoredCommodityCount || 0}</span></div>
            <div>破价商品数: <span style="color: #ffa940;">${commodityCount || 0}</span></div>
            <div>监测次数: <span style="color: #52c41a;">${monitoringCount || 0}</span></div>
            <div>破价次数: <span style="color: #ff4d4f; font-weight: bold;">${value || 0}</span></div>
            <div>破价率: <span style="color: #722ed1; font-weight: bold;">${priceBreakRate || 0}%</span></div>
          </div>`;
        }
      },
      // 添加visualMap来处理颜色映射
      visualMap: {
          show: false, // 隐藏色值显示组件
          type: 'continuous',
          min: 0,
          max: Math.max(...values, 1),
          inRange: {
            color: ['#f5f5f5', '#ffe1e1', '#ffcccc', '#ffb3b3', '#ff9999', '#ff7f7f', '#ff6666', '#ff4d4d', '#ff3333', '#ff1a1a', '#e60000', '#cc0000', '#b30000']
          },
          outOfRange: {
            color: '#f5f5f5' // 无数据时的颜色
          }
        },
      series: [
        {
          name: '破价次数',
          type: 'map',
          map: 'china',
          roam: false,
          aspectScale: 0.75,
          zoom: 1.0,
          center: [104, 35],
          left: '10%',
          top: '5%',
          right: '10%',
          bottom: '5%',
          data: mapSeriesData,
          label: {
            show: false, // 隐藏省份名称标签
            fontSize: 10,
            color: '#333'
          },
          emphasis: {
            label: {
              show: false, // 鼠标悬停时也不显示省份名称
              fontSize: 12,
              color: '#000'
            },
            itemStyle: {
              areaColor: '#ffa940', // 悬停时统一使用橙色高亮
              borderColor: '#ff7a45',
              borderWidth: 2
            }
          },
          select: {
            label: {
              show: false, // 选中状态也不显示省份名称
              color: '#fff'
            },
            itemStyle: {
              areaColor: '#ff9c6e'
            }
          },
          itemStyle: {
            borderColor: '#333',
            borderWidth: 0.5,
            areaColor: '#f5f5f5' // 默认背景色
          }
        }
      ]
    };
    
    console.log('Final map config:', config);
    return config;
  };

  // 根据选中区域和导航栏类型计算核心指标
  const calculateCoreMetrics = (): CoreMetrics => {
    // 省份名称映射表，确保与地图数据匹配
    const provinceNameMapping: { [key: string]: string } = {
      '北京': '北京市',
      '天津': '天津市', 
      '河北': '河北省',
      '山西': '山西省',
      '内蒙古': '内蒙古自治区',
      '辽宁': '辽宁省',
      '吉林': '吉林省',
      '黑龙江': '黑龙江省',
      '上海': '上海市',
      '江苏': '江苏省',
      '浙江': '浙江省',
      '安徽': '安徽省',
      '福建': '福建省',
      '江西': '江西省',
      '山东': '山东省',
      '河南': '河南省',
      '湖北': '湖北省',
      '湖南': '湖南省',
      '广东': '广东省',
      '广西': '广西壮族自治区',
      '海南': '海南省',
      '重庆': '重庆市',
      '四川': '四川省',
      '贵州': '贵州省',
      '云南': '云南省',
      '西藏': '西藏自治区',
      '陕西': '陕西省',
      '甘肃': '甘肃省',
      '青海': '青海省',
      '宁夏': '宁夏回族自治区',
      '新疆': '新疆维吾尔自治区',
      '台湾': '台湾省',
      '香港': '香港特别行政区',
      '澳门': '澳门特别行政区'
    };

    if (selectedRegion === '全国') {
      // 全国数据：基于实际数据计算汇总指标
      const allCommodities = new Set<string>();
      const priceBreakCommodities = new Set<string>();
      let totalPriceBreakCount = 0;
      let totalMonitoringCount = 0;

      // 遍历所有破价数据进行统计
      priceBreakDetailData.forEach(item => {
        allCommodities.add(item.commodityName);
        if (item.isPriceBreak) {
          priceBreakCommodities.add(item.commodityName);
          totalPriceBreakCount += 1; // 每条破价记录算作一次破价
        }
        totalMonitoringCount += 1; // 每条记录代表一次监测
      });

      // 确保数据关系合理：监测次数 >= 破价次数 >= 监测商品数 >= 破价商品数
      // 如果监测商品数大于监测次数，调整监测次数
      const monitoredCommodityCount = allCommodities.size;
      const priceBreakCommodityCount = priceBreakCommodities.size;
      
      // 监测次数应该至少等于监测商品数（假设每个商品至少监测一次）
      const adjustedMonitoringCount = Math.max(totalMonitoringCount, monitoredCommodityCount);
      // 破价次数不能超过监测次数
      const adjustedPriceBreakCount = Math.min(totalPriceBreakCount, adjustedMonitoringCount);

      // 如果没有实际数据，使用模拟数据
      if (allCommodities.size === 0) {
        return {
          monitoredCommodities: coreMetrics.monitoredCommodities,
          priceBreakCommodities: coreMetrics.priceBreakCommodities,
          monitoringCount: coreMetrics.monitoringCount,
          priceBreakCount: coreMetrics.priceBreakCount,
          priceBreakRate: coreMetrics.priceBreakRate
        };
      }

      return {
        monitoredCommodities: monitoredCommodityCount,
        priceBreakCommodities: priceBreakCommodityCount,
        monitoringCount: adjustedMonitoringCount,
        priceBreakCount: adjustedPriceBreakCount,
        priceBreakRate: adjustedMonitoringCount > 0 ? Number((adjustedPriceBreakCount / adjustedMonitoringCount * 100).toFixed(1)) : 0
      };
    } else {
      // 选中具体省份：显示该省份的数据
      const fullProvinceName = provinceNameMapping[selectedRegion] || selectedRegion;
      const provinceData = priceBreakDetailData.filter(item => item.province === fullProvinceName);

      if (provinceData.length === 0) {
        // 如果没有实际数据，尝试从地图数据中获取
        const selectedProvinceInfo = mapData.provinces.find(p => p.name === fullProvinceName);
        if (selectedProvinceInfo) {
          const monitoredCommodityCount = selectedProvinceInfo.monitoredCommodityCount || selectedProvinceInfo.commodityCount || 0;
          const priceBreakCommodityCount = selectedProvinceInfo.commodityCount || 0;
          const priceBreakCount = selectedProvinceInfo.value || 0;
          
          // 确保数据关系合理：监测次数 >= 破价次数 >= 监测商品数 >= 破价商品数
          // 监测次数应该至少等于监测商品数（假设每个商品至少监测一次）
          const baseMonitoringCount = Math.max(monitoredCommodityCount * 5, monitoredCommodityCount); // 假设每个商品监测5次
          // 破价次数不能超过监测次数，也不能小于破价商品数
          const adjustedPriceBreakCount = Math.min(Math.max(priceBreakCount, priceBreakCommodityCount), baseMonitoringCount);
          
          return {
            monitoredCommodities: monitoredCommodityCount,
            priceBreakCommodities: priceBreakCommodityCount,
            monitoringCount: baseMonitoringCount,
            priceBreakCount: adjustedPriceBreakCount,
            priceBreakRate: baseMonitoringCount > 0 ? Number((adjustedPriceBreakCount / baseMonitoringCount * 100).toFixed(1)) : 0
          };
        }
        // 如果都没有数据，返回0值
        return {
          monitoredCommodities: 0,
          priceBreakCommodities: 0,
          monitoringCount: 0,
          priceBreakCount: 0,
          priceBreakRate: 0
        };
      }

      // 基于实际省份数据计算
      const provinceCommodities = new Set<string>();
      const provincePriceBreakCommodities = new Set<string>();
      let provincePriceBreakCount = 0;
      let provinceMonitoringCount = 0;

      provinceData.forEach(item => {
        provinceCommodities.add(item.commodityName);
        if (item.isPriceBreak) {
          provincePriceBreakCommodities.add(item.commodityName);
          provincePriceBreakCount += 1; // 每条破价记录算作一次破价
        }
        provinceMonitoringCount += 1; // 每条记录代表一次监测
      });

      // 确保数据关系合理：监测次数 >= 破价次数 >= 监测商品数 >= 破价商品数
      const monitoredCommodityCount = provinceCommodities.size;
      const priceBreakCommodityCount = provincePriceBreakCommodities.size;
      
      // 监测次数应该至少等于监测商品数
      const adjustedMonitoringCount = Math.max(provinceMonitoringCount, monitoredCommodityCount);
      // 破价次数不能超过监测次数
      const adjustedPriceBreakCount = Math.min(provincePriceBreakCount, adjustedMonitoringCount);

      return {
        monitoredCommodities: monitoredCommodityCount,
        priceBreakCommodities: priceBreakCommodityCount,
        monitoringCount: adjustedMonitoringCount,
        priceBreakCount: adjustedPriceBreakCount,
        priceBreakRate: adjustedMonitoringCount > 0 ? Number((adjustedPriceBreakCount / adjustedMonitoringCount * 100).toFixed(1)) : 0
      };
    }
  };

  // 获取当前显示的Top10数据
  const getCurrentTop10Data = () => {
    // 根据selectedRegion筛选数据
    const filterDataByRegion = (data: any[]) => {
      if (selectedRegion === '全国') {
        return data;
      }
      // 根据选中的区域筛选数据
      return data.filter(item => {
        if (item.province) {
          return item.province === selectedRegion;
        }
        if (item.name && mapData.provinces.some(p => p.name === selectedRegion)) {
          // 如果是省份数据，只返回选中的省份
          return item.name === selectedRegion;
        }
        return true;
      });
    };

    switch (mapViewType) {
      case 'province':
        // 如果选择了具体省份，只显示该省份；否则显示全国top10
        if (selectedRegion !== '全国') {
          // 省份名称映射：简化名称 -> 完整名称
          const provinceNameMapping: { [key: string]: string } = {
            '北京': '北京市',
            '天津': '天津市', 
            '河北': '河北省',
            '山西': '山西省',
            '内蒙古': '内蒙古自治区',
            '辽宁': '辽宁省',
            '吉林': '吉林省',
            '黑龙江': '黑龙江省',
            '上海': '上海市',
            '江苏': '江苏省',
            '浙江': '浙江省',
            '安徽': '安徽省',
            '福建': '福建省',
            '江西': '江西省',
            '山东': '山东省',
            '河南': '河南省',
            '湖北': '湖北省',
            '湖南': '湖南省',
            '广东': '广东省',
            '广西': '广西壮族自治区',
            '海南': '海南省',
            '重庆': '重庆市',
            '四川': '四川省',
            '贵州': '贵州省',
            '云南': '云南省',
            '西藏': '西藏自治区',
            '陕西': '陕西省',
            '甘肃': '甘肃省',
            '青海': '青海省',
            '宁夏': '宁夏回族自治区',
            '新疆': '新疆维吾尔自治区',
            '台湾': '台湾省',
            '香港': '香港特别行政区',
            '澳门': '澳门特别行政区'
          };
          
          // 将简化名称转换为完整名称进行匹配
          const fullProvinceName = provinceNameMapping[selectedRegion] || selectedRegion;
          const selectedProvinceInfo = mapData.provinces.find(p => p.name === fullProvinceName);
          return selectedProvinceInfo ? [selectedProvinceInfo] : [];
        }
        return mapData.provinces.slice(0, 10);
      case 'city':
        if (selectedRegion !== '全国') {
          // 省份名称映射：简化名称 -> 完整名称
          const provinceNameMapping: { [key: string]: string } = {
            '北京': '北京市',
            '天津': '天津市', 
            '河北': '河北省',
            '山西': '山西省',
            '内蒙古': '内蒙古自治区',
            '辽宁': '辽宁省',
            '吉林': '吉林省',
            '黑龙江': '黑龙江省',
            '上海': '上海市',
            '江苏': '江苏省',
            '浙江': '浙江省',
            '安徽': '安徽省',
            '福建': '福建省',
            '江西': '江西省',
            '山东': '山东省',
            '河南': '河南省',
            '湖北': '湖北省',
            '湖南': '湖南省',
            '广东': '广东省',
            '广西': '广西壮族自治区',
            '海南': '海南省',
            '重庆': '重庆市',
            '四川': '四川省',
            '贵州': '贵州省',
            '云南': '云南省',
            '西藏': '西藏自治区',
            '陕西': '陕西省',
            '甘肃': '甘肃省',
            '青海': '青海省',
            '宁夏': '宁夏回族自治区',
            '新疆': '新疆维吾尔自治区',
            '台湾': '台湾省',
            '香港': '香港特别行政区',
            '澳门': '澳门特别行政区'
          };
          
          // 将简化名称转换为完整名称进行匹配
          const fullProvinceName = provinceNameMapping[selectedRegion] || selectedRegion;
          
          // 根据选中的省份筛选城市数据，并计算详细指标
          const provinceData = priceBreakDetailData.filter(item => item.province === fullProvinceName);
          
          // 按城市统计破价数据
          const cityStats: { [key: string]: { 
            name: string; 
            province: string; 
            retailerCount: number; 
            commodityCount: number; 
            priceBreakCount: number; 
            retailers: Set<string>; 
            commodities: Set<string>; 
            monitoringCount: number; 
            priceBreakRate: number;
          } } = {};
          
          provinceData.forEach(item => {
            if (!cityStats[item.city]) {
              cityStats[item.city] = {
                name: item.city,
                province: item.province,
                retailerCount: 0,
                commodityCount: 0,
                priceBreakCount: 0,
                retailers: new Set<string>(),
                commodities: new Set<string>(),
                monitoringCount: 0,
                priceBreakRate: 0
              };
            }
            cityStats[item.city].priceBreakCount += item.priceBreakCount;
            cityStats[item.city].retailers.add(item.retailer);
            cityStats[item.city].commodities.add(item.commodityName);
            cityStats[item.city].monitoringCount += 1; // 监测次数
          });
          
          // 计算每个城市的破价商品数
          Object.entries(cityStats).forEach(([cityName, stats]) => {
            const priceBreakCommodities = new Set<string>();
            provinceData.forEach(item => {
              if (item.city === cityName && item.isPriceBreak) {
                priceBreakCommodities.add(item.commodityName);
              }
            });
            (stats as any).priceBreakCommodities = priceBreakCommodities;
          });

          // 转换为数组并排序
          const result = Object.entries(cityStats).map(([cityName, stats]) => {
            const monitoredCommodityCount = stats.commodities.size;
            const priceBreakCommodityCount = ((stats as any).priceBreakCommodities as Set<string>).size;
            const priceBreakCount = stats.priceBreakCount;
            
            // 确保数据关系：监测次数 >= 破价次数 >= 监测商品数 >= 破价商品数
            const adjustedMonitoringCount = Math.max(stats.monitoringCount, monitoredCommodityCount);
            const adjustedPriceBreakCount = Math.min(priceBreakCount, adjustedMonitoringCount);
            
            return {
              name: cityName,
              province: stats.province,
              retailerCount: stats.retailers.size,
              commodityCount: stats.commodities.size,
              monitoredCommodities: monitoredCommodityCount, // 监测商品数
              priceBreakCommodities: priceBreakCommodityCount, // 破价商品数
              priceBreakCount: adjustedPriceBreakCount,
              monitoringCount: adjustedMonitoringCount,
              priceBreakRate: adjustedMonitoringCount > 0 ? (adjustedPriceBreakCount / adjustedMonitoringCount * 100) : 0,
              value: adjustedPriceBreakCount
            };
          }).sort((a, b) => b.priceBreakCount - a.priceBreakCount);
          
          return result.slice(0, 10);
        }
        
        // 全国城市数据，需要为每个城市计算详细指标
        const allCityStats: { [key: string]: { 
          name: string; 
          province: string; 
          retailerCount: number; 
          commodityCount: number; 
          priceBreakCount: number; 
          retailers: Set<string>; 
          commodities: Set<string>; 
          priceBreakCommodities: Set<string>;
          monitoringCount: number; 
          priceBreakRate: number;
        } } = {};
        
        priceBreakDetailData.forEach(item => {
          const cityKey = `${item.city}-${item.province}`;
          if (!allCityStats[cityKey]) {
            allCityStats[cityKey] = {
              name: item.city,
              province: item.province,
              retailerCount: 0,
              commodityCount: 0,
              priceBreakCount: 0,
              retailers: new Set<string>(),
              commodities: new Set<string>(),
              priceBreakCommodities: new Set<string>(),
              monitoringCount: 0,
              priceBreakRate: 0
            };
          }
          allCityStats[cityKey].priceBreakCount += 1; // 每条破价记录算作一次破价
          allCityStats[cityKey].retailers.add(item.retailer);
          allCityStats[cityKey].commodities.add(item.commodityName);
          if (item.isPriceBreak) {
            allCityStats[cityKey].priceBreakCommodities.add(item.commodityName);
          }
          allCityStats[cityKey].monitoringCount += 1;
        });
        
        // 转换为数组并排序，取前10
        const allCityResult = Object.entries(allCityStats).map(([cityKey, stats]) => {
          const monitoredCommodityCount = stats.commodities.size;
          const priceBreakCommodityCount = stats.priceBreakCommodities.size;
          const priceBreakCount = stats.priceBreakCount;
          
          // 确保数据关系：监测次数 >= 破价次数 >= 监测商品数 >= 破价商品数
          const adjustedMonitoringCount = Math.max(stats.monitoringCount, monitoredCommodityCount);
          const adjustedPriceBreakCount = Math.min(priceBreakCount, adjustedMonitoringCount);
          
          return {
            name: stats.name,
            province: stats.province,
            retailerCount: stats.retailers.size,
            commodityCount: stats.commodities.size,
            monitoredCommodities: monitoredCommodityCount, // 监测商品数
            priceBreakCommodities: priceBreakCommodityCount, // 破价商品数
            priceBreakCount: adjustedPriceBreakCount,
            monitoringCount: adjustedMonitoringCount,
            priceBreakRate: adjustedMonitoringCount > 0 ? (adjustedPriceBreakCount / adjustedMonitoringCount * 100) : 0,
            value: adjustedPriceBreakCount
          };
        }).sort((a, b) => b.priceBreakCount - a.priceBreakCount);
        
        return allCityResult.slice(0, 10);
      case 'commodity':
        // 根据选中区域筛选商品数据
        if (selectedRegion !== '全国') {
          // 省份名称映射：简化名称 -> 完整名称
          const provinceNameMapping: { [key: string]: string } = {
            '北京': '北京市',
            '天津': '天津市', 
            '河北': '河北省',
            '山西': '山西省',
            '内蒙古': '内蒙古自治区',
            '辽宁': '辽宁省',
            '吉林': '吉林省',
            '黑龙江': '黑龙江省',
            '上海': '上海市',
            '江苏': '江苏省',
            '浙江': '浙江省',
            '安徽': '安徽省',
            '福建': '福建省',
            '江西': '江西省',
            '山东': '山东省',
            '河南': '河南省',
            '湖北': '湖北省',
            '湖南': '湖南省',
            '广东': '广东省',
            '广西': '广西壮族自治区',
            '海南': '海南省',
            '重庆': '重庆市',
            '四川': '四川省',
            '贵州': '贵州省',
            '云南': '云南省',
            '西藏': '西藏自治区',
            '陕西': '陕西省',
            '甘肃': '甘肃省',
            '青海': '青海省',
            '宁夏': '宁夏回族自治区',
            '新疆': '新疆维吾尔自治区',
            '台湾': '台湾省',
            '香港': '香港特别行政区',
            '澳门': '澳门特别行政区'
          };
          
          // 将简化名称转换为完整名称进行匹配
          const fullProvinceName = provinceNameMapping[selectedRegion] || selectedRegion;
          
          // 筛选该省份的破价商品数据
          const provinceData = priceBreakDetailData.filter(item => item.province === fullProvinceName);
          
          // 按商品统计破价数据
          const commodityStats: { [key: string]: { 
            retailerCount: number; 
            priceBreakCount: number; 
            retailers: Set<string>; 
            monitoringCount: number; 
            priceBreakRate: number;
          } } = {};
          
          provinceData.forEach(item => {
            if (!commodityStats[item.commodityName]) {
              commodityStats[item.commodityName] = {
                retailerCount: 0,
                priceBreakCount: 0,
                retailers: new Set<string>(),
                monitoringCount: 0,
                priceBreakRate: 0
              };
            }
            commodityStats[item.commodityName].priceBreakCount += 1; // 每条破价记录算作一次破价
            commodityStats[item.commodityName].retailers.add(item.retailer);
            commodityStats[item.commodityName].monitoringCount += 1; // 监测次数
          });
          
          // 转换为数组并排序
          const result = Object.entries(commodityStats).map(([name, stats]) => {
            const priceBreakCount = stats.priceBreakCount;
            const monitoringCount = stats.monitoringCount;
            
            // 确保数据关系：监测次数 >= 破价次数
            const adjustedMonitoringCount = Math.max(monitoringCount, priceBreakCount);
            
            return {
              name,
              retailerCount: stats.retailers.size,
              priceBreakCount: priceBreakCount,
              monitoringCount: adjustedMonitoringCount,
              priceBreakRate: adjustedMonitoringCount > 0 ? (priceBreakCount / adjustedMonitoringCount * 100) : 0,
              value: priceBreakCount
            };
          }).sort((a, b) => b.priceBreakCount - a.priceBreakCount);
          
          return result.slice(0, 10);
        }
        
        // 全国商品数据，需要为每个商品计算详细指标
        const allCommodityStats: { [key: string]: { 
          retailerCount: number; 
          priceBreakCount: number; 
          retailers: Set<string>; 
          monitoringCount: number; 
          priceBreakRate: number;
        } } = {};
        
        priceBreakDetailData.forEach(item => {
          if (!allCommodityStats[item.commodityName]) {
            allCommodityStats[item.commodityName] = {
              retailerCount: 0,
              priceBreakCount: 0,
              retailers: new Set<string>(),
              monitoringCount: 0,
              priceBreakRate: 0
            };
          }
          allCommodityStats[item.commodityName].priceBreakCount += 1; // 每条破价记录算作一次破价
          allCommodityStats[item.commodityName].retailers.add(item.retailer);
          allCommodityStats[item.commodityName].monitoringCount += 1;
        });
        
        // 转换为数组并排序，取前10
        const allCommodityResult = Object.entries(allCommodityStats).map(([name, stats]) => {
          const priceBreakCount = stats.priceBreakCount;
          const monitoringCount = stats.monitoringCount;
          
          // 确保数据关系：监测次数 >= 破价次数
          const adjustedMonitoringCount = Math.max(monitoringCount, priceBreakCount);
          
          return {
            name,
            retailerCount: stats.retailers.size,
            priceBreakCount: priceBreakCount,
            monitoringCount: adjustedMonitoringCount,
            priceBreakRate: adjustedMonitoringCount > 0 ? (priceBreakCount / adjustedMonitoringCount * 100) : 0,
            value: priceBreakCount
          };
        }).sort((a, b) => b.priceBreakCount - a.priceBreakCount);
        
        return allCommodityResult.slice(0, 10);
      case 'retailer':
        // 根据选中区域筛选零售商数据
        let filteredData;
        if (selectedRegion !== '全国') {
          // 省份名称映射：简化名称 -> 完整名称
          const provinceNameMapping: { [key: string]: string } = {
            '北京': '北京市',
            '天津': '天津市', 
            '河北': '河北省',
            '山西': '山西省',
            '内蒙古': '内蒙古自治区',
            '辽宁': '辽宁省',
            '吉林': '吉林省',
            '黑龙江': '黑龙江省',
            '上海': '上海市',
            '江苏': '江苏省',
            '浙江': '浙江省',
            '安徽': '安徽省',
            '福建': '福建省',
            '江西': '江西省',
            '山东': '山东省',
            '河南': '河南省',
            '湖北': '湖北省',
            '湖南': '湖南省',
            '广东': '广东省',
            '广西': '广西壮族自治区',
            '海南': '海南省',
            '重庆': '重庆市',
            '四川': '四川省',
            '贵州': '贵州省',
            '云南': '云南省',
            '西藏': '西藏自治区',
            '陕西': '陕西省',
            '甘肃': '甘肃省',
            '青海': '青海省',
            '宁夏': '宁夏回族自治区',
            '新疆': '新疆维吾尔自治区',
            '台湾': '台湾省',
            '香港': '香港特别行政区',
            '澳门': '澳门特别行政区'
          };
          
          // 将简化名称转换为完整名称进行匹配
          const fullProvinceName = provinceNameMapping[selectedRegion] || selectedRegion;
          filteredData = priceBreakDetailData.filter(item => item.province === fullProvinceName);
        } else {
          filteredData = priceBreakDetailData;
        }
          
        // 统计零售商破价数据
        const retailerStats: { [key: string]: { 
          commodityCount: Set<string>; 
          priceBreakCommodityCount: Set<string>; 
          priceBreakCount: number; 
          provinces: Set<string>; 
          monitoringCount: number; 
          priceBreakRate: number 
        } } = {};
        
        filteredData.forEach(item => {
          if (!retailerStats[item.retailer]) {
            retailerStats[item.retailer] = {
              commodityCount: new Set<string>(),
              priceBreakCommodityCount: new Set<string>(),
              priceBreakCount: 0,
              provinces: new Set<string>(),
              monitoringCount: 0,
              priceBreakRate: 0
            };
          }
          
          // 添加商品到监测商品集合
          retailerStats[item.retailer].commodityCount.add(item.commodityName);
          
          // 如果是破价商品，添加到破价商品集合
          if (item.isPriceBreak) {
            retailerStats[item.retailer].priceBreakCommodityCount.add(item.commodityName);
            retailerStats[item.retailer].priceBreakCount += 1; // 每条破价记录算作一次破价
          }
          
          retailerStats[item.retailer].provinces.add(item.province);
          retailerStats[item.retailer].monitoringCount += 1; // 每条记录算作一次监测
        });
        
        // 转换为数组并排序
        const retailerData = Object.entries(retailerStats).map(([name, stats]) => {
          const monitoredCommodityCount = stats.commodityCount.size;
          const priceBreakCommodityCount = stats.priceBreakCommodityCount.size;
          const priceBreakCount = stats.priceBreakCount;
          const monitoringCount = stats.monitoringCount;
          
          // 确保数据关系：监测次数 >= 破价次数 >= 监测商品数 >= 破价商品数
          const adjustedMonitoringCount = Math.max(monitoringCount, monitoredCommodityCount);
          const adjustedPriceBreakCount = Math.min(priceBreakCount, adjustedMonitoringCount);
          
          return {
            name,
            monitoredCommodities: monitoredCommodityCount, // 监测商品数
            priceBreakCommodities: priceBreakCommodityCount, // 破价商品数
            commodityCount: monitoredCommodityCount, // 兼容原有字段
            priceBreakCount: adjustedPriceBreakCount, // 破价次数
            monitoringCount: adjustedMonitoringCount, // 监测次数
            priceBreakRate: adjustedMonitoringCount > 0 ? (adjustedPriceBreakCount / adjustedMonitoringCount * 100) : 0, // 破价率
            provinceCount: stats.provinces.size,
            value: adjustedPriceBreakCount
          };
        }).sort((a, b) => b.priceBreakCount - a.priceBreakCount);
        
        return retailerData.slice(0, 10);
      default:
        return [];
    }
  };

  // 破价产品明细列表表格列
  const detailColumns: ColumnsType<PriceBreakDetail> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
      width: 250,
      ellipsis: true,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 100,
    },
    {
      title: '零售商',
      dataIndex: 'retailer',
      key: 'retailer',
      width: 100,
    },
    {      
      title: '门店',
      dataIndex: 'storeName',
      key: 'storeName',
      width: 100,
    },
    {
      title: '监测平台',
      dataIndex: 'monitoringPlatform',
      key: 'monitoringPlatform',
      width: 100,
    },
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
      width: 80,
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 80,
    },
    {
      title: '是否新品',
      dataIndex: 'isNewProduct',
      key: 'isNewProduct',
      width: 80,
      render: (isNew: boolean) => (
        <Tag color={isNew ? 'blue' : 'default'}>
          {isNew ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '渠道指导价',
      dataIndex: 'guidePrice',
      key: 'guidePrice',
      width: 100,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '最低售价',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      width: 100,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '是否破价',
      dataIndex: 'isPriceBreak',
      key: 'isPriceBreak',
      width: 80,
      render: (isPriceBreak: boolean) => (
        <Tag color={isPriceBreak ? 'red' : 'green'}>
          {isPriceBreak ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '采集类型',
      dataIndex: 'monitorMethod',
      key: 'monitorMethod',
      width: 100,
      render: (method: string) => {
        const typeMap: { [key: string]: string } = {
          'RPA': 'RPA抓取',
          'manual': '人工截图',
          'order': '平台订单'
        };
        return typeMap[method] || method;
      },
    },
  ];

  return (
    <>
      {/* 页面标题 - 删除"监测看板"文案 */}
      <div style={{ marginBottom: '24px', padding: '24px 24px 0 24px' }}>
        <Title level={2}>{taskDetail.taskName}</Title>
      </div>

      {/* 时间筛选控件和搜索栏 */}
      <Card style={{ margin: '0 24px 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>时间筛选：</Text>
              <Radio.Group value={dateType} onChange={handleDateTypeChange} size="small">
                <Radio.Button value="day">日</Radio.Button>
                <Radio.Button value="week">周</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
              </Radio.Group>
              <RangePicker
                value={detailDateRange}
                onChange={handleDateRangeChange}
                picker={dateType as any}
                style={{ width: 240 }}
                size="small"
              />
            </div>
            {/* 新增商品名称搜索栏 */}
            <Input
              placeholder="搜索商品名称"
              prefix={<SearchOutlined />}
              value={productSearchText}
              onChange={(e) => setProductSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
              size="small"
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              数据更新时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </div>
        </div>
      </Card>

      {/* 任务详情 - 更新字段 */}
      <Card title="任务详情" style={{ margin: '0 24px 24px 24px' }}>
        <Row gutter={24}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div>
                  <Text strong>任务名称：</Text>
                  <Text>{taskDetail.taskName}</Text>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <Text strong>任务周期：</Text>
                  <Text>{taskDetail.taskPeriod}</Text>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <Text strong>采集类型：</Text>
                  <div style={{ marginTop: 8 }}>
                    {taskDetail.collectionTypes.map((type, index) => (
                      <Tag key={index} color="blue" style={{ margin: '2px 4px 2px 0' }}>
                        {type}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <Text strong>监测平台：</Text>
                  <div style={{ marginTop: 8 }}>
                    {taskDetail.monitoringPlatform.split('、').map((platform, index) => (
                      <Tag key={index} color="green" style={{ margin: '2px 4px 2px 0' }}>
                        {platform}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <Text strong>频次：</Text>
                  <Tag color="orange" style={{ margin: '2px 4px 2px 0' }}>
                    {taskDetail.frequency}
                  </Tag>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <div>
              <Text strong>任务状态与统计：</Text>
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: '14px', color: '#666' }}>任务状态</Text>
                    <Tag color="processing" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      {taskDetail.status}
                    </Tag>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: '14px', color: '#666' }}>监测商品总数</Text>
                    <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                      {taskDetail.commodityCount}
                    </Text>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: '14px', color: '#666' }}>破价产品数</Text>
                    <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
                      {taskDetail.brokenPriceProductCount}
                    </Text>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: '14px', color: '#666' }}>破价率</Text>
                    <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>
                      {taskDetail.brokenPriceRate}%
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 核心指标 */}
      <Card title="核心指标" style={{ margin: '0 24px 24px 24px' }}>
        <Row gutter={[24, 16]} justify="space-between" style={{ margin: 0 }}>
          <Col flex="1">
            <div style={{ 
              textAlign: 'center', 
              padding: '16px 12px',
              background: 'transparent',
              borderRadius: '8px',
              border: '1px solid #d9d9d9'
            }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>监测商品数</span>
                    <Tooltip title="任务中监测的商品数量">
                      <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c', cursor: 'pointer' }} />
                    </Tooltip>
                  </div>
                }
                value={calculateCoreMetrics().monitoredCommodities}
                prefix={<ProductOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
                formatter={(value) => `${value}`}
              />
            </div>
          </Col>
          <Col flex="1">
            <div style={{ 
              textAlign: 'center', 
              padding: '16px 12px',
              background: 'transparent',
              borderRadius: '8px',
              border: '1px solid #d9d9d9'
            }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>破价商品数</span>
                    <Tooltip title="任务中监测的商品中破价的商品数量">
                      <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c', cursor: 'pointer' }} />
                    </Tooltip>
                  </div>
                }
                value={calculateCoreMetrics().priceBreakCommodities}
                prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f', fontSize: '24px', fontWeight: 'bold' }}
                formatter={(value) => `${value}`}
              />
            </div>
          </Col>
          <Col flex="1">
            <div style={{ 
              textAlign: 'center', 
              padding: '16px 12px',
              background: 'transparent',
              borderRadius: '8px',
              border: '1px solid #d9d9d9'
            }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>监测次数</span>
                    <Tooltip title="任务中总的监测次数">
                      <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c', cursor: 'pointer' }} />
                    </Tooltip>
                  </div>
                }
                value={calculateCoreMetrics().monitoringCount}
                prefix={<BankOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                formatter={(value) => `${value}`}
              />
            </div>
          </Col>
          <Col flex="1">
            <div style={{ 
              textAlign: 'center', 
              padding: '16px 12px',
              background: 'transparent',
              borderRadius: '8px',
              border: '1px solid #d9d9d9'
            }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>破价次数</span>
                    <Tooltip title="任务中监测到的破价次数">
                      <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c', cursor: 'pointer' }} />
                    </Tooltip>
                  </div>
                }
                value={calculateCoreMetrics().priceBreakCount}
                prefix={<AlertOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }}
                formatter={(value) => `${value}`}
              />
            </div>
          </Col>
          <Col flex="1">
            <div style={{ 
              textAlign: 'center', 
              padding: '16px 12px',
              background: 'transparent',
              borderRadius: '8px',
              border: '1px solid #d9d9d9'
            }}>
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>破价率</span>
                    <Tooltip title="破价次数/监测次数">
                      <InfoCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c', cursor: 'pointer' }} />
                    </Tooltip>
                  </div>
                }
                value={calculateCoreMetrics().priceBreakRate}
                suffix="%"
                prefix={<AlertOutlined style={{ color: '#eb2f96' }} />}
                valueStyle={{ color: '#eb2f96', fontSize: '24px', fontWeight: 'bold' }}
                formatter={(value) => `${value}`}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 商品破价排行列表 */}
      <Card title="商品破价排行" style={{ margin: '0 24px 24px 24px' }}>
        <Table
          columns={summaryColumns}
          dataSource={productSummaryData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          size="small"
        />
      </Card>

      {/* 地图看板 */}
      <div style={{ margin: '0 24px 24px 24px' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Card title="破价区域分析" style={{ height: '500px' }}>
              {/* 区域筛选下拉框 - 移动到地图上方 */}
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <Select
                  value={selectedRegion}
                  onChange={(value) => {
                    setSelectedRegion(value);
                    if (value !== '全国') {
                      setSelectedProvince(value);
                    } else {
                      setSelectedProvince('');
                    }
                  }}
                  style={{ width: 120 }}
                  size="small"
                >
                  <Option value="全国">全国</Option>
                  <Option value="北京">北京</Option>
                  <Option value="上海">上海</Option>
                  <Option value="广东">广东</Option>
                  <Option value="江苏">江苏</Option>
                  <Option value="浙江">浙江</Option>
                  <Option value="山东">山东</Option>
                  <Option value="河南">河南</Option>
                  <Option value="四川">四川</Option>
                  <Option value="湖北">湖北</Option>
                  <Option value="福建">福建</Option>
                  <Option value="湖南">湖南</Option>
                  <Option value="安徽">安徽</Option>
                  <Option value="河北">河北</Option>
                  <Option value="江西">江西</Option>
                  <Option value="重庆">重庆</Option>
                  <Option value="辽宁">辽宁</Option>
                  <Option value="陕西">陕西</Option>
                  <Option value="天津">天津</Option>
                  <Option value="云南">云南</Option>
                  <Option value="山西">山西</Option>
                  <Option value="贵州">贵州</Option>
                  <Option value="吉林">吉林</Option>
                  <Option value="黑龙江">黑龙江</Option>
                  <Option value="内蒙古">内蒙古</Option>
                  <Option value="甘肃">甘肃</Option>
                  <Option value="青海">青海</Option>
                  <Option value="宁夏">宁夏</Option>
                  <Option value="新疆">新疆</Option>
                  <Option value="西藏">西藏</Option>
                  <Option value="海南">海南</Option>
                  <Option value="广西">广西</Option>
                </Select>
              </div>
              <div style={{ position: 'relative', height: '420px' }}>
                <ReactECharts 
                  option={mapReady ? getMapChartOption(mapData.provinces) : { title: { text: '地图加载中...', left: 'center', top: 'center', textStyle: { fontSize: 16, color: '#999' } } }} 
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'svg', width: 'auto', height: 'auto' }}
                  onEvents={{
                    click: handleMapClick
                  }}
                  key={`map-${selectedRegion}-${mapViewType}`} // 添加key确保selectedRegion变化时重新渲染
                />
                {!mapReady && (
                  <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#999'
                  }}>
                    地图加载中...
                  </div>
                )}
              </div>
            </Card>
          </Col>
        <Col span={12}>
          <Card style={{ height: '500px' }}>
            {/* 导航栏 */}
            <div style={{ marginBottom: '16px' }}>
              <Radio.Group
                value={mapViewType}
                onChange={(e) => {
                  setMapViewType(e.target.value);
                  if (e.target.value !== 'city') {
                    setSelectedProvince('');
                  }
                  if (e.target.value !== 'commodity') {
                    setSelectedProvinceData([]);
                  }
                }}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="province">省份</Radio.Button>
                <Radio.Button value="city">城市</Radio.Button>
                <Radio.Button value="commodity">商品</Radio.Button>
                <Radio.Button value="retailer">零售商</Radio.Button>
              </Radio.Group>
              {/* 移除城市和商品选择时的省份筛选控件 */}
              {false && (mapViewType === 'city' || mapViewType === 'commodity') && (
                <Select
                  value={selectedProvince}
                  onChange={(value) => {
                    setSelectedProvince(value || '');
                    // 如果是商品视图且选择了省份，重新生成该省份的商品数据
                    if (mapViewType === 'commodity' && value) {
                      const getProvinceProducts = (province: string) => {
                        // 标准化省份名称
                        let normalizedProvince = province.replace(/(省|市|自治区|特别行政区|壮族|回族|维吾尔)$/g, '');
                        if (normalizedProvince === '内蒙古自治') normalizedProvince = '内蒙古';
                        if (normalizedProvince === '广西壮族自治') normalizedProvince = '广西';
                        if (normalizedProvince === '宁夏回族自治') normalizedProvince = '宁夏';
                        if (normalizedProvince === '新疆维吾尔自治') normalizedProvince = '新疆';
                        
                        // 筛选该省份的破价数据
                        const provinceData = priceBreakDetailData.filter(item => {
                          let itemProvince = item.province.replace(/(省|市|自治区|特别行政区|壮族|回族|维吾尔)$/g, '');
                          if (itemProvince === '内蒙古自治') itemProvince = '内蒙古';
                          if (itemProvince === '广西壮族自治') itemProvince = '广西';
                          if (itemProvince === '宁夏回族自治') itemProvince = '宁夏';
                          if (itemProvince === '新疆维吾尔自治') itemProvince = '新疆';
                          return itemProvince === normalizedProvince;
                        });
                        
                        // 按商品统计破价数据
                        const commodityStats: { [key: string]: { retailerCount: number; priceBreakCount: number; retailers: Set<string> } } = {};
                        
                        provinceData.forEach(item => {
                          if (!commodityStats[item.commodityName]) {
                            commodityStats[item.commodityName] = {
                              retailerCount: 0,
                              priceBreakCount: 0,
                              retailers: new Set<string>()
                            };
                          }
                          commodityStats[item.commodityName].priceBreakCount += item.priceBreakCount;
                          commodityStats[item.commodityName].retailers.add(item.retailer);
                        });
                        
                        // 转换为数组并排序
                        const result = Object.entries(commodityStats).map(([name, stats]) => ({
                          name,
                          retailerCount: stats.retailers.size,
                          priceBreakCount: stats.priceBreakCount,
                          value: stats.priceBreakCount
                        })).sort((a, b) => b.priceBreakCount - a.priceBreakCount);
                        
                        // 如果数据不足10条，添加模拟数据
                        if (result.length < 10) {
                          const mockProducts = [
                            { name: '华为Mate50 Pro', retailerCount: 15, priceBreakCount: 45 },
                            { name: 'iPhone 14 Pro Max', retailerCount: 12, priceBreakCount: 38 },
                            { name: '小米13 Ultra', retailerCount: 18, priceBreakCount: 32 },
                            { name: 'OPPO Find X6 Pro', retailerCount: 10, priceBreakCount: 28 },
                            { name: 'vivo X90 Pro+', retailerCount: 14, priceBreakCount: 25 },
                            { name: '荣耀Magic5 Pro', retailerCount: 8, priceBreakCount: 22 },
                            { name: '一加11', retailerCount: 11, priceBreakCount: 19 },
                            { name: '真我GT Neo5', retailerCount: 9, priceBreakCount: 16 },
                            { name: '红米K60 Pro', retailerCount: 13, priceBreakCount: 14 },
                            { name: 'iQOO 11 Pro', retailerCount: 7, priceBreakCount: 12 }
                          ];
                          
                          // 添加不重复的模拟数据
                          const existingNames = new Set(result.map(item => item.name));
                          mockProducts.forEach(mock => {
                            if (!existingNames.has(mock.name) && result.length < 10) {
                              result.push({ ...mock, value: mock.priceBreakCount });
                            }
                          });
                        }
                        
                        return result.slice(0, 10);
                      };
                      
                      setSelectedProvinceData(getProvinceProducts(value));
                    } else if (mapViewType === 'commodity' && !value) {
                      // 如果清空省份选择，显示全国商品数据
                      setSelectedProvinceData([]);
                    }
                  }}
                  placeholder="选择省份（可选择全部）"
                  style={{ width: 160, marginLeft: 8 }}
                  allowClear
                  size="small"
                >
                  <Option value="">全部</Option>
                  {mapData.provinces.map(province => (
                    <Option key={province.name} value={province.name}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
            
            {/* TOP10列表 */}
            <div style={{ height: '400px', overflowY: 'auto' }}>
              {getCurrentTop10Data().map((item, index) => (
                <div 
                  key={item.name}
                  style={{
                    padding: '12px 0',
                    borderBottom: index < getCurrentTop10Data().length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: index < 3 ? '#ff4d4f' : '#f0f0f0',
                      color: index < 3 ? '#fff' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      {index + 1}
                    </div>
                    <span style={{ 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      maxWidth: mapViewType === 'commodity' ? '180px' : '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.name}
                    </span>
                    {mapViewType === 'city' && (item as any).province && (
                      <span style={{ 
                        fontSize: '12px',
                        color: '#666',
                        marginLeft: '8px'
                      }}>
                        ({(item as any).province})
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#666',
                    marginLeft: '36px'
                  }}>
                    {mapViewType === 'province' && (
                      <>
                        <span>监测商品数: {(item as any).monitoredCommodityCount || 0}</span>
                        <span>破价商品数: {(item as any).commodityCount || 0}</span>
                        <span>监测次数: {(item as any).monitoringCount || 0}</span>
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>破价次数: {(item as any).priceBreakCount || item.value}</span>
                        <span>破价率: {((item as any).priceBreakRate || 0).toFixed(1)}%</span>
                      </>
                    )}
                    {mapViewType === 'city' && (
                      <>
                        <span>监测商品数: {(item as any).monitoredCommodities || 0}</span>
                        <span>破价商品数: {(item as any).priceBreakCommodities || 0}</span>
                        <span>监测次数: {(item as any).monitoringCount || 0}</span>
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>破价次数: {(item as any).priceBreakCount || item.value}</span>
                        <span>破价率: {((item as any).priceBreakRate || 0).toFixed(1)}%</span>
                      </>
                    )}
                    {mapViewType === 'commodity' && (
                      <>
                        <span>监测次数: {(item as any).monitoringCount || 0}</span>
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>破价次数: {(item as any).priceBreakCount || item.value}</span>
                        <span>破价率: {((item as any).priceBreakRate || 0).toFixed(1)}%</span>
                      </>
                    )}
                    {mapViewType === 'retailer' && (
                      <>
                        <span>监测商品数: {(item as any).monitoredCommodities || 0}</span>
                        <span>破价商品数: {(item as any).priceBreakCommodities || 0}</span>
                        <span>监测次数: {(item as any).monitoringCount || 0}</span>
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>破价次数: {(item as any).priceBreakCount || item.value}</span>
                        <span>破价率: {((item as any).priceBreakRate || 0).toFixed(1)}%</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      </div>

      {/* 破价产品明细列表 */}
      <Card 
        id="detail-list"
        title="破价商品明细" 
        style={{ margin: '0 24px 24px 24px' }} 
        extra={
          <Space>
            <Input
              placeholder="搜索产品名称、69码或零售商"
              prefix={<SearchOutlined />}
              value={detailSearchText}
              onChange={(e) => {
                const value = e.target.value;
                setDetailSearchText(value);
                filterDetailData(value, detailDateRange);
              }}
              style={{ width: 250 }}
            />
            <RangePicker
              value={detailDateRange}
              onChange={(dates) => {
                setDetailDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null);
                filterDetailData(detailSearchText, dates as [dayjs.Dayjs, dayjs.Dayjs] | null);
              }}
              placeholder={['开始日期', '结束日期']}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setDetailSearchText('');
                setDetailDateRange(null);
                setFilteredDetailData(priceBreakDetailData);
              }}
            >
              重置
            </Button>
          </Space>
        }
      >
        <Table
          columns={detailColumns}
          dataSource={filteredDetailData}
          pagination={{
            total: filteredDetailData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1800 }}
          size="small"
        />
      </Card>

      {/* 价格趋势弹窗 */}
      <Modal
        title="价格趋势分析"
        open={trendModalVisible}
        onCancel={() => {
          console.log('关闭趋势图Modal');
          setTrendModalVisible(false);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedProduct ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>商品：</Text>
              <Text>{selectedProduct.commodityName}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>零售商：</Text>
              <Text>{selectedProduct.retailer}</Text>
              <Text strong style={{ marginLeft: 24 }}>监测平台：</Text>
              <Text>{selectedProduct.monitoringPlatform}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>渠道指导价：</Text>
              <Text style={{ color: '#1890ff' }}>¥{selectedProduct.guidePrice.toFixed(2)}</Text>
              <Text strong style={{ marginLeft: 24 }}>当前最低售价：</Text>
              <Text style={{ color: '#ff4d4f' }}>¥{selectedProduct.lowestPrice.toFixed(2)}</Text>
            </div>
            <div style={{ height: '450px', border: '1px solid #d9d9d9', borderRadius: '6px', padding: '12px' }}>
              <ReactECharts 
                option={getTrendChartOption(selectedProduct)} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                onChartReady={(chartInstance) => {
                  console.log('图表已准备就绪：', chartInstance);
                  // 确保图表正确渲染
                  setTimeout(() => {
                    chartInstance.resize();
                  }, 100);
                }}
                onEvents={{
                  'finished': () => {
                    console.log('图表渲染完成');
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">暂无数据</Text>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PriceMonitoringDashboard;