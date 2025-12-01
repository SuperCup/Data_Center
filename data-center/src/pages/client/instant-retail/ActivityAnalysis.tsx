import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Select, DatePicker, Button, Typography, Tooltip as AntTooltip, Switch, Empty, message, Radio, Checkbox } from 'antd';
import { QuestionCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 核心指标数据接口
interface CoreMetrics {
  gmv: number; // GMV
  orderCount: number; // 订单数（张）
  salesVolume: number; // 销量（件）
  avgPrice: number; // 客单价（元）
  roi: number; // ROI
  gmvMonthOnMonth: number; // GMV月环比
  gmvYearOnYear: number; // GMV年同比
  orderCountMonthOnMonth: number; // 订单数月环比
  orderCountYearOnYear: number; // 订单数年同比
  salesVolumeMonthOnMonth: number; // 销量月环比
  salesVolumeYearOnYear: number; // 销量年同比
  avgPriceMonthOnMonth: number; // 客单价月环比
  avgPriceYearOnYear: number; // 客单价年同比
  roiMonthOnMonth: number; // ROI月环比
  roiYearOnYear: number; // ROI年同比
}

// 区域分布数据接口
interface RegionData {
  id: string;
  city: string; // 城市
  province: string; // 省份
  gmv: number; // GMV
  gmvPercentage: number; // GMV占比
  gmvMonthOnMonth: number; // GMV月环比
  gmvYearOnYear: number; // GMV年同比
  orderCount: number; // 订单数
  salesVolume: number; // 销量
  avgPrice: number; // 客单价
  originalPrice: number; // 商品原价
  roi: number; // 活动ROI
}

// 趋势数据接口
interface TrendData {
  date: string;
  gmv: number;
  orderCount: number;
  salesVolume: number;
  avgPrice: number;
  roi: number;
}

// 零售商数据接口
interface RetailerData {
  id: string;
  retailerName: string; // 零售商名称
  region: string; // 区域
  gmv: number; // GMV
  gmvPercentage: number; // GMV占比
  orderCount: number; // 订单数
  salesVolume: number; // 销量
  avgPrice: number; // 客单价
  roi: number; // ROI
}

const ActivityAnalysis: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('美团闪购');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('gmv'); // 选中的趋势指标
  const [showSecondaryMetric, setShowSecondaryMetric] = useState<boolean>(false); // 是否显示副指标
  const [secondaryMetric, setSecondaryMetric] = useState<string>('orderCount'); // 选中的副指标
  const [regionSortMetric, setRegionSortMetric] = useState<string>('gmv'); // 区域分布排序指标
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null); // 选中的省份，用于下钻
  const [mapView, setMapView] = useState<'province' | 'city'>('province'); // 地图视图：省份或城市
  const [highlightedProvince, setHighlightedProvince] = useState<string | null>(null); // 高亮的省份（省份视图）
  const [provinceMapReady, setProvinceMapReady] = useState<{ [key: string]: boolean }>({}); // 省份地图加载状态
  const [chinaMapData, setChinaMapData] = useState<any>(null); // 保存中国地图数据，用于提取省份地图

  // 当主指标改变时，如果副指标与主指标相同，自动切换副指标
  useEffect(() => {
    if (showSecondaryMetric && secondaryMetric === selectedMetric) {
      const availableMetrics = ['gmv', 'orderCount', 'salesVolume', 'avgPrice', 'roi'].filter(m => m !== selectedMetric);
      if (availableMetrics.length > 0) {
        setSecondaryMetric(availableMetrics[0]);
      }
    }
  }, [selectedMetric, showSecondaryMetric, secondaryMetric]);

  // 模拟核心指标数据（活动）
  const [coreMetrics] = useState<CoreMetrics>({
    gmv: 2580000,
      orderCount: 15420,
    salesVolume: 45600,
    avgPrice: 56.6,
      roi: 4.2,
    gmvMonthOnMonth: 12.5,
    gmvYearOnYear: 28.3,
    orderCountMonthOnMonth: 8.7,
    orderCountYearOnYear: 22.1,
    salesVolumeMonthOnMonth: 15.2,
    salesVolumeYearOnYear: 35.6,
    avgPriceMonthOnMonth: -2.3,
    avgPriceYearOnYear: 5.8,
    roiMonthOnMonth: 10.5,
    roiYearOnYear: 18.9
  });


  // 模拟区域分布数据
  const [regionData] = useState<RegionData[]>([
    // 北京
    { id: '1', city: '北京', province: '北京', gmv: 485000, gmvPercentage: 18.8, gmvMonthOnMonth: 15.2, gmvYearOnYear: 32.5, orderCount: 2850, salesVolume: 8560, avgPrice: 58.2, originalPrice: 65.0, roi: 4.5 },
    { id: '11', city: '朝阳区', province: '北京', gmv: 185000, gmvPercentage: 7.2, gmvMonthOnMonth: 14.5, gmvYearOnYear: 30.2, orderCount: 1080, salesVolume: 3240, avgPrice: 57.8, originalPrice: 64.5, roi: 4.3 },
    { id: '12', city: '海淀区', province: '北京', gmv: 165000, gmvPercentage: 6.4, gmvMonthOnMonth: 16.8, gmvYearOnYear: 33.1, orderCount: 980, salesVolume: 2940, avgPrice: 58.1, originalPrice: 65.0, roi: 4.4 },
    { id: '13', city: '丰台区', province: '北京', gmv: 135000, gmvPercentage: 5.2, gmvMonthOnMonth: 13.2, gmvYearOnYear: 28.5, orderCount: 790, salesVolume: 2370, avgPrice: 57.5, originalPrice: 64.2, roi: 4.2 },
    
    // 上海
    { id: '2', city: '上海', province: '上海', gmv: 420000, gmvPercentage: 16.3, gmvMonthOnMonth: 12.8, gmvYearOnYear: 28.9, orderCount: 2450, salesVolume: 7350, avgPrice: 57.1, originalPrice: 64.0, roi: 4.3 },
    { id: '14', city: '浦东新区', province: '上海', gmv: 195000, gmvPercentage: 7.6, gmvMonthOnMonth: 13.5, gmvYearOnYear: 29.8, orderCount: 1150, salesVolume: 3450, avgPrice: 57.2, originalPrice: 64.1, roi: 4.3 },
    { id: '15', city: '黄浦区', province: '上海', gmv: 125000, gmvPercentage: 4.8, gmvMonthOnMonth: 11.2, gmvYearOnYear: 26.5, orderCount: 740, salesVolume: 2220, avgPrice: 57.0, originalPrice: 63.8, roi: 4.2 },
    { id: '16', city: '徐汇区', province: '上海', gmv: 100000, gmvPercentage: 3.9, gmvMonthOnMonth: 10.8, gmvYearOnYear: 25.3, orderCount: 590, salesVolume: 1770, avgPrice: 56.9, originalPrice: 63.7, roi: 4.1 },
    
    // 广东
    { id: '3', city: '广州', province: '广东', gmv: 380000, gmvPercentage: 14.7, gmvMonthOnMonth: 18.5, gmvYearOnYear: 35.2, orderCount: 2250, salesVolume: 6750, avgPrice: 56.3, originalPrice: 63.0, roi: 4.1 },
    { id: '4', city: '深圳', province: '广东', gmv: 350000, gmvPercentage: 13.6, gmvMonthOnMonth: 20.1, gmvYearOnYear: 38.7, orderCount: 2050, salesVolume: 6150, avgPrice: 56.9, originalPrice: 63.5, roi: 4.2 },
    { id: '17', city: '佛山', province: '广东', gmv: 145000, gmvPercentage: 5.6, gmvMonthOnMonth: 15.3, gmvYearOnYear: 32.1, orderCount: 860, salesVolume: 2580, avgPrice: 56.2, originalPrice: 62.8, roi: 4.0 },
    { id: '18', city: '东莞', province: '广东', gmv: 125000, gmvPercentage: 4.8, gmvMonthOnMonth: 14.8, gmvYearOnYear: 30.5, orderCount: 740, salesVolume: 2220, avgPrice: 56.1, originalPrice: 62.7, roi: 3.9 },
    
    // 浙江
    { id: '5', city: '杭州', province: '浙江', gmv: 285000, gmvPercentage: 11.0, gmvMonthOnMonth: 14.3, gmvYearOnYear: 29.6, orderCount: 1680, salesVolume: 5040, avgPrice: 55.8, originalPrice: 62.5, roi: 4.0 },
    { id: '19', city: '宁波', province: '浙江', gmv: 135000, gmvPercentage: 5.2, gmvMonthOnMonth: 13.5, gmvYearOnYear: 28.2, orderCount: 790, salesVolume: 2370, avgPrice: 55.6, originalPrice: 62.3, roi: 3.9 },
    { id: '20', city: '温州', province: '浙江', gmv: 115000, gmvPercentage: 4.5, gmvMonthOnMonth: 12.8, gmvYearOnYear: 27.1, orderCount: 680, salesVolume: 2040, avgPrice: 55.5, originalPrice: 62.2, roi: 3.8 },
    
    // 四川
    { id: '6', city: '成都', province: '四川', gmv: 240000, gmvPercentage: 9.3, gmvMonthOnMonth: 16.7, gmvYearOnYear: 31.2, orderCount: 1420, salesVolume: 4260, avgPrice: 56.3, originalPrice: 63.0, roi: 3.9 },
    { id: '21', city: '绵阳', province: '四川', gmv: 85000, gmvPercentage: 3.3, gmvMonthOnMonth: 12.5, gmvYearOnYear: 25.8, orderCount: 500, salesVolume: 1500, avgPrice: 56.0, originalPrice: 62.7, roi: 3.7 },
    { id: '22', city: '德阳', province: '四川', gmv: 65000, gmvPercentage: 2.5, gmvMonthOnMonth: 11.8, gmvYearOnYear: 24.2, orderCount: 380, salesVolume: 1140, avgPrice: 55.9, originalPrice: 62.6, roi: 3.6 },
    
    // 湖北
    { id: '7', city: '武汉', province: '湖北', gmv: 195000, gmvPercentage: 7.6, gmvMonthOnMonth: 11.9, gmvYearOnYear: 26.8, orderCount: 1150, salesVolume: 3450, avgPrice: 56.5, originalPrice: 63.2, roi: 3.8 },
    { id: '23', city: '宜昌', province: '湖北', gmv: 75000, gmvPercentage: 2.9, gmvMonthOnMonth: 10.5, gmvYearOnYear: 23.5, orderCount: 440, salesVolume: 1320, avgPrice: 56.2, originalPrice: 62.9, roi: 3.7 },
    { id: '24', city: '襄阳', province: '湖北', gmv: 65000, gmvPercentage: 2.5, gmvMonthOnMonth: 9.8, gmvYearOnYear: 22.1, orderCount: 380, salesVolume: 1140, avgPrice: 56.1, originalPrice: 62.8, roi: 3.6 },
    
    // 陕西
    { id: '8', city: '西安', province: '陕西', gmv: 165000, gmvPercentage: 6.4, gmvMonthOnMonth: 13.4, gmvYearOnYear: 27.5, orderCount: 980, salesVolume: 2940, avgPrice: 56.1, originalPrice: 62.8, roi: 3.7 },
    { id: '25', city: '宝鸡', province: '陕西', gmv: 55000, gmvPercentage: 2.1, gmvMonthOnMonth: 9.2, gmvYearOnYear: 20.8, orderCount: 320, salesVolume: 960, avgPrice: 56.0, originalPrice: 62.7, roi: 3.6 },
    { id: '26', city: '咸阳', province: '陕西', gmv: 45000, gmvPercentage: 1.7, gmvMonthOnMonth: 8.5, gmvYearOnYear: 19.5, orderCount: 260, salesVolume: 780, avgPrice: 55.9, originalPrice: 62.6, roi: 3.5 },
    
    // 江苏
    { id: '9', city: '南京', province: '江苏', gmv: 145000, gmvPercentage: 5.6, gmvMonthOnMonth: 9.8, gmvYearOnYear: 24.3, orderCount: 860, salesVolume: 2580, avgPrice: 56.4, originalPrice: 63.1, roi: 3.6 },
    { id: '27', city: '苏州', province: '江苏', gmv: 155000, gmvPercentage: 6.0, gmvMonthOnMonth: 14.2, gmvYearOnYear: 28.9, orderCount: 920, salesVolume: 2760, avgPrice: 56.5, originalPrice: 63.2, roi: 3.7 },
    { id: '28', city: '无锡', province: '江苏', gmv: 105000, gmvPercentage: 4.1, gmvMonthOnMonth: 12.5, gmvYearOnYear: 26.2, orderCount: 620, salesVolume: 1860, avgPrice: 56.3, originalPrice: 63.0, roi: 3.6 },
    
    // 重庆
    { id: '10', city: '重庆', province: '重庆', gmv: 125000, gmvPercentage: 4.8, gmvMonthOnMonth: 10.5, gmvYearOnYear: 25.1, orderCount: 740, salesVolume: 2220, avgPrice: 56.2, originalPrice: 62.9, roi: 3.5 },
    { id: '29', city: '万州区', province: '重庆', gmv: 55000, gmvPercentage: 2.1, gmvMonthOnMonth: 9.8, gmvYearOnYear: 22.5, orderCount: 320, salesVolume: 960, avgPrice: 56.1, originalPrice: 62.8, roi: 3.5 },
    { id: '30', city: '涪陵区', province: '重庆', gmv: 45000, gmvPercentage: 1.7, gmvMonthOnMonth: 8.9, gmvYearOnYear: 21.2, orderCount: 260, salesVolume: 780, avgPrice: 56.0, originalPrice: 62.7, roi: 3.4 }
  ]);

  // 模拟零售商Top10数据
  const [retailerData] = useState<RetailerData[]>([
    { id: '1', retailerName: '永辉超市', region: '华东', gmv: 485000, gmvPercentage: 18.8, orderCount: 2850, salesVolume: 8560, avgPrice: 58.2, roi: 4.5 },
    { id: '2', retailerName: '盒马鲜生', region: '华东', gmv: 420000, gmvPercentage: 16.3, orderCount: 2450, salesVolume: 7350, avgPrice: 57.1, roi: 4.3 },
    { id: '3', retailerName: '沃尔玛', region: '华南', gmv: 380000, gmvPercentage: 14.7, orderCount: 2250, salesVolume: 6750, avgPrice: 56.3, roi: 4.1 },
    { id: '4', retailerName: '大润发', region: '华南', gmv: 350000, gmvPercentage: 13.6, orderCount: 2050, salesVolume: 6150, avgPrice: 56.9, roi: 4.2 },
    { id: '5', retailerName: '家乐福', region: '华东', gmv: 285000, gmvPercentage: 11.0, orderCount: 1680, salesVolume: 5040, avgPrice: 55.8, roi: 4.0 },
    { id: '6', retailerName: '华润万家', region: '西南', gmv: 240000, gmvPercentage: 9.3, orderCount: 1420, salesVolume: 4260, avgPrice: 56.3, roi: 3.9 },
    { id: '7', retailerName: '物美超市', region: '华北', gmv: 195000, gmvPercentage: 7.6, orderCount: 1150, salesVolume: 3450, avgPrice: 56.5, roi: 3.8 },
    { id: '8', retailerName: '人人乐', region: '华中', gmv: 165000, gmvPercentage: 6.4, orderCount: 980, salesVolume: 2940, avgPrice: 56.1, roi: 3.7 },
    { id: '9', retailerName: '世纪联华', region: '华东', gmv: 145000, gmvPercentage: 5.6, orderCount: 860, salesVolume: 2580, avgPrice: 56.4, roi: 3.6 },
    { id: '10', retailerName: '麦德龙', region: '华东', gmv: 125000, gmvPercentage: 4.8, orderCount: 740, salesVolume: 2220, avgPrice: 56.2, roi: 3.5 }
  ]);

  // 模拟趋势数据
  const [trendData] = useState<TrendData[]>([
    { date: '2024-11-01', gmv: 125000, orderCount: 850, salesVolume: 2550, avgPrice: 55.2, roi: 3.8 },
    { date: '2024-11-02', gmv: 145000, orderCount: 920, salesVolume: 2760, avgPrice: 56.1, roi: 3.9 },
    { date: '2024-11-03', gmv: 168000, orderCount: 1050, salesVolume: 3150, avgPrice: 56.5, roi: 4.0 },
    { date: '2024-11-04', gmv: 189000, orderCount: 1180, salesVolume: 3540, avgPrice: 56.8, roi: 4.1 },
    { date: '2024-11-05', gmv: 210000, orderCount: 1320, salesVolume: 3960, avgPrice: 57.0, roi: 4.2 },
    { date: '2024-11-06', gmv: 195000, orderCount: 1250, salesVolume: 3750, avgPrice: 56.9, roi: 4.1 },
    { date: '2024-11-07', gmv: 178000, orderCount: 1100, salesVolume: 3300, avgPrice: 56.7, roi: 4.0 },
    { date: '2024-11-08', gmv: 156000, orderCount: 980, salesVolume: 2940, avgPrice: 56.4, roi: 3.9 },
    { date: '2024-11-09', gmv: 142000, orderCount: 890, salesVolume: 2670, avgPrice: 56.2, roi: 3.8 },
    { date: '2024-11-10', gmv: 235000, orderCount: 1580, salesVolume: 4740, avgPrice: 57.5, roi: 4.3 },
    { date: '2024-11-11', gmv: 385000, orderCount: 2450, salesVolume: 7350, avgPrice: 58.2, roi: 4.5 },
    { date: '2024-11-12', gmv: 298000, orderCount: 1890, salesVolume: 5670, avgPrice: 57.8, roi: 4.4 },
    { date: '2024-11-13', gmv: 215000, orderCount: 1350, salesVolume: 4050, avgPrice: 57.2, roi: 4.2 },
    { date: '2024-11-14', gmv: 178000, orderCount: 1120, salesVolume: 3360, avgPrice: 56.8, roi: 4.0 },
    { date: '2024-11-15', gmv: 156000, orderCount: 985, salesVolume: 2955, avgPrice: 56.5, roi: 3.9 }
  ]);

  // 省份名称到地图文件名的映射
  const provinceMapFileMapping: { [key: string]: string } = {
    '北京': 'beijing',
    '上海': 'shanghai',
    '广东': 'guangdong',
    '浙江': 'zhejiang',
    '四川': 'sichuan',
    '湖北': 'hubei',
    '陕西': 'shanxi',
    '江苏': 'jiangsu',
    '重庆': 'chongqing'
  };

  // 注册中国地图
  useEffect(() => {
    fetch('/china-map.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((chinaGeoData) => {
        const processedGeoData = {
          ...chinaGeoData,
          features: chinaGeoData.features.map((feature: any) => ({
            ...feature,
            properties: {
              ...feature.properties,
              name: feature.properties.name || feature.properties.NAME || '未知'
            }
          }))
        };
        echarts.registerMap('china', processedGeoData);
        setChinaMapData(processedGeoData); // 保存地图数据
        setMapReady(true);
      })
      .catch((error) => {
        console.error('Failed to load China map data:', error);
        setMapReady(false);
    });
  }, []);

  // 省份完整名称映射
  const provinceFullNameMap: { [key: string]: string } = {
    '北京': '北京市',
    '上海': '上海市',
    '广东': '广东省',
    '浙江': '浙江省',
    '四川': '四川省',
    '湖北': '湖北省',
    '陕西': '陕西省',
    '江苏': '江苏省',
    '重庆': '重庆市'
  };

  // 从中国地图数据中提取省份地图
  const extractProvinceMap = (provinceName: string) => {
    if (!chinaMapData) return null;
    
    const fullProvinceName = provinceFullNameMap[provinceName] || provinceName;
    
    // 从中国地图数据中提取该省份的feature
    const provinceFeatures = chinaMapData.features.filter((feature: any) => {
      const featureName = feature.properties?.name || feature.properties?.NAME || '';
      return featureName === fullProvinceName || featureName === provinceName;
    });
    
    if (provinceFeatures.length === 0) {
      return null;
    }
    
    // 创建省份地图数据
    return {
      type: 'FeatureCollection',
      features: provinceFeatures
    };
  };

  // 加载或创建省份地图数据
  useEffect(() => {
    if (mapView === 'city' && selectedProvince && chinaMapData) {
      if (provinceMapReady[selectedProvince] === undefined) {
        const mapFileName = provinceMapFileMapping[selectedProvince];
        
        // 首先尝试加载独立的省份地图文件
        if (mapFileName) {
          fetch(`/${mapFileName}-map.json`)
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              return null;
            })
            .then((provinceGeoData) => {
              if (provinceGeoData) {
                const processedGeoData = {
                  ...provinceGeoData,
                  features: provinceGeoData.features.map((feature: any) => ({
                    ...feature,
                    properties: {
                      ...feature.properties,
                      name: feature.properties.name || feature.properties.NAME || '未知'
                    }
                  }))
                };
                echarts.registerMap(selectedProvince, processedGeoData);
                setProvinceMapReady(prev => ({ ...prev, [selectedProvince]: true }));
              } else {
                // 如果省份地图文件不存在，从中国地图中提取
                const extractedMap = extractProvinceMap(selectedProvince);
                if (extractedMap) {
                  echarts.registerMap(selectedProvince, extractedMap);
                  setProvinceMapReady(prev => ({ ...prev, [selectedProvince]: true }));
                } else {
                  setProvinceMapReady(prev => ({ ...prev, [selectedProvince]: false }));
                }
              }
            })
            .catch((error) => {
              console.error(`Failed to load ${selectedProvince} map data:`, error);
              // 尝试从中国地图中提取
              const extractedMap = extractProvinceMap(selectedProvince);
              if (extractedMap) {
                echarts.registerMap(selectedProvince, extractedMap);
                setProvinceMapReady(prev => ({ ...prev, [selectedProvince]: true }));
              } else {
                setProvinceMapReady(prev => ({ ...prev, [selectedProvince]: false }));
              }
            });
        } else {
          // 没有映射文件名，直接从中国地图中提取
          const extractedMap = extractProvinceMap(selectedProvince);
          if (extractedMap) {
            echarts.registerMap(selectedProvince, extractedMap);
            setProvinceMapReady(prev => ({ ...prev, [selectedProvince]: true }));
          } else {
            setProvinceMapReady(prev => ({ ...prev, [selectedProvince]: false }));
          }
        }
      }
    }
  }, [mapView, selectedProvince, chinaMapData]);

  // 渲染环比/同比指标
  const renderComparison = (monthOnMonth: number, yearOnYear: number) => {
    const renderValue = (value: number) => {
      const isPositive = value >= 0;
      // 上升用红色，下降用绿色
      return (
        <span style={{ color: isPositive ? '#ff4d4f' : '#52c41a' }}>
          {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(value)}%
        </span>
      );
    };

    return (
      <div style={{ marginTop: '8px', fontSize: '12px' }}>
        <div>
          <Text type="secondary">月环比：</Text>
          {renderValue(monthOnMonth)}
        </div>
        <div>
          <Text type="secondary">年同比：</Text>
          {renderValue(yearOnYear)}
        </div>
      </div>
    );
  };

  // 区域分布表格列定义 - 根据视图动态生成
  const regionColumns: ColumnsType<RegionData> = useMemo(() => [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1
    },
    // 只在城市视图显示城市字段
    ...(mapView === 'city' && selectedProvince ? [{
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 100
    }] : []),
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
      width: 100
    },
    {
      title: 'GMV（元）',
      dataIndex: 'gmv',
      key: 'gmv',
      width: 120,
      render: (value: number) => value.toLocaleString()
    },
    {
      title: 'GMV占比（%）',
      dataIndex: 'gmvPercentage',
      key: 'gmvPercentage',
      width: 100,
      render: (value: number) => `${value}%`
    },
    {
      title: 'GMV月环比（%）',
      dataIndex: 'gmvMonthOnMonth',
      key: 'gmvMonthOnMonth',
      width: 110,
      render: (value: number) => {
        const isPositive = value >= 0;
        // 上升用红色，下降用绿色
        return (
          <span style={{ color: isPositive ? '#ff4d4f' : '#52c41a' }}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(value)}%
          </span>
        );
      }
    },
    {
      title: 'GMV年同比（%）',
      dataIndex: 'gmvYearOnYear',
      key: 'gmvYearOnYear',
      width: 110,
      render: (value: number) => {
        const isPositive = value >= 0;
        // 上升用红色，下降用绿色
        return (
          <span style={{ color: isPositive ? '#ff4d4f' : '#52c41a' }}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(value)}%
          </span>
        );
      }
    },
    {
      title: '订单数（张）',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      render: (value: number) => value.toLocaleString()
    },
    {
      title: '销量（件）',
      dataIndex: 'salesVolume',
      key: 'salesVolume',
      width: 100,
      render: (value: number) => value.toLocaleString()
    },
    {
      title: '客单价（元）',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 100,
      render: (value: number) => value.toFixed(2)
    },
    {
      title: '商品原价（元）',
      dataIndex: 'originalPrice',
      key: 'originalPrice',
      width: 100,
      render: (value: number) => value.toFixed(2)
    },
    {
      title: '活动ROI（x）',
      dataIndex: 'roi',
      key: 'roi',
      width: 100,
      render: (value: number) => (
        <span style={{ color: value >= 3 ? '#52c41a' : value >= 2 ? '#faad14' : '#ff4d4f' }}>
          {value.toFixed(1)}
        </span>
      )
    }
  ], [mapView, selectedProvince]);

  // 根据排序指标获取排序后的区域数据
  const getSortedRegionData = () => {
    const currentData = getCurrentViewData();
    return [...currentData].sort((a, b) => getSortValue(b, regionSortMetric) - getSortValue(a, regionSortMetric));
  };

  // 地图配置
  const getMapOption = () => {
    const currentData = getCurrentViewData();
    // 根据选择的排序指标对区域数据进行排序，只取前10名
    const sortedRegions = getSortedRegionData().slice(0, 10);
    
    // 获取指标数值用于地图显示
    const getMetricNumberValue = (item: RegionData, metric: string): number => {
      switch (metric) {
        case 'gmv':
          return item.gmv;
        case 'orderCount':
          return item.orderCount;
        case 'salesVolume':
          return item.salesVolume;
        case 'avgPrice':
          return item.avgPrice;
        case 'roi':
          return item.roi;
        default:
          return item.gmv;
      }
    };

    // 根据视图类型生成地图数据
    let mapData: any[];
    if (mapView === 'city' && selectedProvince) {
      // 城市视图：显示该省份的城市
      mapData = currentData.map(item => {
        const rank = sortedRegions.findIndex(r => r.city === item.city);
        return {
          name: item.city,
          value: getMetricNumberValue(item, regionSortMetric),
          rank: rank >= 0 ? rank : -1
        };
      });
    } else {
      // 省份视图：显示省份
      // 按省份聚合数据
      const provinceMap = new Map<string, RegionData>();
      regionData.forEach(item => {
        const existing = provinceMap.get(item.province);
        if (!existing || getSortValue(item, regionSortMetric) > getSortValue(existing, regionSortMetric)) {
          provinceMap.set(item.province, item);
        }
      });
      
      // 省份名称到完整名称的映射（用于地图显示）
      const provinceToFullName: { [key: string]: string } = {
        '北京': '北京市',
        '上海': '上海市',
        '广东': '广东省',
        '浙江': '浙江省',
        '四川': '四川省',
        '湖北': '湖北省',
        '陕西': '陕西省',
        '江苏': '江苏省',
        '重庆': '重庆市'
      };
      
      mapData = Array.from(provinceMap.values()).map(item => {
        const rank = sortedRegions.findIndex(r => r.province === item.province);
        // 使用完整省份名称用于地图匹配
        const fullProvinceName = provinceToFullName[item.province] || item.province;
        return {
          name: fullProvinceName, // 使用完整名称
          value: getMetricNumberValue(item, regionSortMetric),
          rank: rank >= 0 ? rank : -1,
          isHighlighted: highlightedProvince === item.province,
          originalProvince: item.province // 保存原始省份名称
        };
      });
    }

    // 定义颜色：前10名由深到浅的蓝色（初始化时颜色加深）
    const getProvinceColor = (rank: number) => {
      if (rank < 0) return '#e6f7ff'; // 未排名的使用浅蓝色
      const colors = [
        '#002c8c', // 第1名 - 最深蓝（加深）
        '#003a8c', // 第2名（加深）
        '#0050b3', // 第3名（加深）
        '#096dd9', // 第4名
        '#1890ff', // 第5名
        '#40a9ff', // 第6名
        '#69c0ff', // 第7名
        '#91d5ff', // 第8名
        '#bae7ff', // 第9名
        '#d6f4ff'  // 第10名
      ];
      return colors[rank] || '#e6f7ff';
    };

    // 获取指标显示值
    const getMetricValue = (region: RegionData, metric: string): string => {
      switch (metric) {
        case 'gmv':
          return region.gmv.toLocaleString();
        case 'orderCount':
          return region.orderCount.toLocaleString();
        case 'salesVolume':
          return region.salesVolume.toLocaleString();
        case 'avgPrice':
          return region.avgPrice.toFixed(2);
        case 'roi':
          return region.roi.toFixed(1);
        default:
          return region.gmv.toLocaleString();
      }
    };

    const metricLabels: { [key: string]: string } = {
      gmv: 'GMV',
      orderCount: '订单数',
      salesVolume: '销量',
      avgPrice: '客单价',
      roi: 'ROI'
    };

    // 城市坐标映射（主要城市的大致经纬度）
    const cityCoordinates: { [key: string]: [number, number] } = {
      '北京': [116.4, 39.9],
      '朝阳区': [116.45, 39.92],
      '海淀区': [116.3, 39.95],
      '丰台区': [116.28, 39.85],
      '上海': [121.5, 31.2],
      '浦东新区': [121.6, 31.22],
      '黄浦区': [121.48, 31.23],
      '徐汇区': [121.43, 31.18],
      '广州': [113.3, 23.1],
      '深圳': [114.1, 22.5],
      '佛山': [113.1, 23.0],
      '东莞': [113.75, 23.05],
      '杭州': [120.2, 30.3],
      '宁波': [121.55, 29.88],
      '温州': [120.7, 28.0],
      '成都': [104.1, 30.7],
      '绵阳': [104.73, 31.48],
      '德阳': [104.4, 31.13],
      '武汉': [114.3, 30.6],
      '宜昌': [111.3, 30.7],
      '襄阳': [112.15, 32.0],
      '西安': [108.9, 34.3],
      '宝鸡': [107.15, 34.37],
      '咸阳': [108.7, 34.33],
      '南京': [118.8, 32.1],
      '苏州': [120.6, 31.3],
      '无锡': [120.3, 31.59],
      '重庆': [106.5, 29.6],
      '万州区': [108.4, 30.8],
      '涪陵区': [107.4, 29.7]
    };

    // 如果是城市视图，使用散点图叠加在地图上，只显示当前省份
    if (mapView === 'city' && selectedProvince) {
      // 检查是否有城市数据
      if (currentData.length === 0) {
        return {
    tooltip: {
            show: false
          },
          geo: {
            map: 'china',
            roam: false,
            zoom: 1.2,
            center: [116.4, 39.9],
            itemStyle: {
              areaColor: '#f5f5f5',
              borderColor: '#d9d9d9'
            }
          },
          graphic: [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                text: '当前省份无活动',
                fontSize: 20,
                fill: '#999',
                fontWeight: 'bold'
              }
            }
          ]
        };
      }

      const scatterData = currentData.map(item => {
        const coords = cityCoordinates[item.city] || [116.4, 39.9]; // 默认北京坐标
        const rank = sortedRegions.findIndex(r => r.city === item.city);
        return {
          name: item.city,
          value: [...coords, getMetricNumberValue(item, regionSortMetric)],
          rank: rank >= 0 ? rank : -1
        };
      });

      // 获取省份中心坐标
      const getProvinceCenter = (province: string): [number, number] => {
        const centerMap: { [key: string]: [number, number] } = {
          '北京': [116.4, 39.9],
          '广东': [113.3, 23.1],
          '上海': [121.5, 31.2],
          '浙江': [120.2, 30.3],
          '四川': [104.1, 30.7],
          '湖北': [114.3, 30.6],
          '陕西': [108.9, 34.3],
          '江苏': [118.8, 32.1],
          '重庆': [106.5, 29.6]
        };
        return centerMap[province] || [116.4, 39.9];
      };

      // 确定使用的地图类型 - 必须使用省份地图，如果不存在则从中国地图提取
      const hasProvinceMap = provinceMapReady[selectedProvince] === true;
      const mapType = hasProvinceMap ? selectedProvince : 'china'; // 如果省份地图未准备好，暂时使用china，但会通过regions只显示该省份
      
      const provinceFullName = provinceFullNameMap[selectedProvince] || selectedProvince;

      return {
    tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.seriesType === 'scatter') {
              const region = regionData.find(r => r.city === params.name && r.province === selectedProvince);
              if (region) {
                return `
                  <div style="padding: 8px;">
                    <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
                    <div>${metricLabels[regionSortMetric]}: ${getMetricValue(region, regionSortMetric)}</div>
                    <div>GMV: ${region.gmv.toLocaleString()}</div>
                    <div>订单数: ${region.orderCount.toLocaleString()}</div>
                    <div>销量: ${region.salesVolume.toLocaleString()}</div>
                    <div>ROI: ${region.roi.toFixed(1)}</div>
                  </div>
                `;
              }
            }
            return `${params.name}: ${params.value?.[2]?.toLocaleString() || 0}`;
          }
        },
        geo: {
          map: mapType,
          roam: false,
          zoom: hasProvinceMap ? 1.0 : 1.0, // 省份地图使用正常缩放
          center: hasProvinceMap ? undefined : getProvinceCenter(selectedProvince), // 省份地图不需要设置center
          itemStyle: {
            areaColor: '#e6f7ff', // 省份地图所有区域显示蓝色
            borderColor: '#91d5ff',
            borderWidth: 1
          },
          label: {
            show: true, // 显示城市/区域名称
            fontSize: 12
          },
          // 如果省份地图未准备好，使用中国地图但只显示当前省份
          ...(hasProvinceMap ? {} : {
            regions: (() => {
              // 获取所有省份名称
              const allProvinces = [
                '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
                '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
                '浙江省', '安徽省', '福建省', '江西省', '山东省',
                '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
                '海南省', '重庆市', '四川省', '贵州省', '云南省',
                '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
                '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'
              ];
              
              // 为所有省份设置样式：当前省份显示，其他省份完全隐藏（透明且无边框）
              return allProvinces.map(province => ({
                name: province,
                itemStyle: {
                  areaColor: (province === provinceFullName || province === selectedProvince) ? '#e6f7ff' : 'rgba(0,0,0,0)', // 其他省份完全透明
                  borderColor: (province === provinceFullName || province === selectedProvince) ? '#91d5ff' : 'rgba(0,0,0,0)',
                  borderWidth: (province === provinceFullName || province === selectedProvince) ? 2 : 0
                },
                label: {
                  show: false // 隐藏所有标签，只显示当前省份的散点图标签
                },
                emphasis: {
                  itemStyle: {
                    areaColor: '#bae7ff'
                  }
                }
              }));
            })()
          }),
          emphasis: {
            itemStyle: {
              areaColor: '#bae7ff'
            }
          }
        },
        series: [
          {
            name: '城市数据',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: scatterData,
            symbolSize: (val: number[]) => {
              const value = val[2];
              const maxValue = Math.max(...scatterData.map(d => d.value[2]));
              return Math.max(10, Math.min(30, (value / maxValue) * 30));
            },
            itemStyle: {
              color: (params: any) => {
                const rank = params.data.rank;
                return getProvinceColor(rank);
              },
              opacity: 0.8
            },
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
              fontSize: 12
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14
              },
              itemStyle: {
                borderColor: '#1890ff',
                borderWidth: 2
              }
            }
          }
        ]
      };
    }
    
    // 省份视图：使用地图
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          // 省份视图：查找该省份的代表数据（取GMV最大的城市）
          let provinceName = params.name;
          // 转换省份名称
          const reverseMapping: { [key: string]: string } = {
            '北京市': '北京',
            '上海市': '上海',
            '广东省': '广东',
            '浙江省': '浙江',
            '四川省': '四川',
            '湖北省': '湖北',
            '陕西省': '陕西',
            '江苏省': '江苏',
            '重庆市': '重庆'
          };
          provinceName = reverseMapping[provinceName] || provinceName;
          const provinceRegions = regionData.filter(r => r.province === provinceName);
          const region = provinceRegions.sort((a, b) => b.gmv - a.gmv)[0];
          
          if (region) {
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
                <div>${metricLabels[regionSortMetric]}: ${getMetricValue(region, regionSortMetric)}</div>
                <div>GMV: ${region.gmv.toLocaleString()}</div>
                <div>订单数: ${region.orderCount.toLocaleString()}</div>
                <div>销量: ${region.salesVolume.toLocaleString()}</div>
                <div>ROI: ${region.roi.toFixed(1)}</div>
              </div>
            `;
          }
          return `${params.name}: ${params.value?.toLocaleString() || 0}`;
        }
      },
      visualMap: {
        show: false
      },
      series: [
        {
          name: 'GMV',
          type: 'map',
          map: 'china',
          roam: false,
    label: {
            show: false // 默认不显示名称
          },
          itemStyle: {
            areaColor: '#e6f7ff' // 默认蓝色
          },
          data: mapData.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              // 如果被高亮，显示蓝色；否则使用排名颜色
              areaColor: item.isHighlighted ? '#1890ff' : getProvinceColor(item.rank),
              borderColor: item.isHighlighted ? '#0050b3' : undefined,
              borderWidth: item.isHighlighted ? 2 : 0
            }
          })),
          emphasis: {
            label: {
              show: true // 鼠标移入时显示名称
            },
            itemStyle: {
              areaColor: '#1890ff' // 鼠标移入时高亮
            }
          }
        }
      ]
    };
  };

  // 趋势图配置
  const getTrendOption = () => {
    const metricLabels: { [key: string]: string } = {
      gmv: 'GMV',
      orderCount: '订单数',
      salesVolume: '销量',
      avgPrice: '客单价',
      roi: 'ROI'
    };

    const metricColors: { [key: string]: string } = {
      gmv: '#1890ff',
      orderCount: '#52c41a',
      salesVolume: '#722ed1',
      avgPrice: '#faad14',
      roi: '#f5222d'
    };

    const getYAxisFormatter = (metric: string) => {
      if (metric === 'gmv') {
        return (value: number) => `${(value / 10000).toFixed(0)}万`;
      } else if (metric === 'orderCount' || metric === 'salesVolume') {
        return (value: number) => value.toLocaleString();
      } else if (metric === 'avgPrice') {
        return (value: number) => value.toFixed(2);
      } else {
        return (value: number) => value.toFixed(1);
      }
    };

    const formatTooltipValue = (value: number, metric: string) => {
      if (metric === 'gmv') {
        return value.toLocaleString();
      } else if (metric === 'avgPrice') {
        return value.toFixed(2);
      } else if (metric === 'roi') {
        return value.toFixed(1);
      } else {
        return value.toLocaleString();
      }
    };

    const series: any[] = [
      {
        name: metricLabels[selectedMetric],
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: trendData.map(item => item[selectedMetric as keyof TrendData]),
        itemStyle: {
          color: metricColors[selectedMetric]
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: metricColors[selectedMetric] + '80' },
              { offset: 1, color: metricColors[selectedMetric] + '10' }
            ]
          }
        }
      }
    ];

    // 如果开启了副指标，添加副指标系列
    if (showSecondaryMetric && secondaryMetric !== selectedMetric) {
      series.push({
        name: metricLabels[secondaryMetric],
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: trendData.map(item => item[secondaryMetric as keyof TrendData]),
        itemStyle: {
          color: metricColors[secondaryMetric]
        }
      });
    }

    return {
    tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `${params[0].name}<br/>`;
          params.forEach((param: any) => {
            const value = formatTooltipValue(param.value, param.seriesName === metricLabels[selectedMetric] ? selectedMetric : secondaryMetric);
            result += `${param.marker}${param.seriesName}: ${value}<br/>`;
          });
          return result;
        }
      },
      grid: {
        left: '3%',
        right: showSecondaryMetric ? '8%' : '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trendData.map(item => item.date)
      },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          axisLabel: {
            formatter: getYAxisFormatter(selectedMetric)
          }
        },
        ...(showSecondaryMetric && secondaryMetric !== selectedMetric ? [{
          type: 'value',
          position: 'right',
          axisLabel: {
            formatter: getYAxisFormatter(secondaryMetric)
          }
        }] : [])
      ],
      series
    };
  };

  // 省份名称映射（将地图返回的名称转换为数据中的名称）
  const provinceNameMapping: { [key: string]: string } = {
    '北京市': '北京',
    '北京': '北京',
    '上海市': '上海',
    '上海': '上海',
    '广东省': '广东',
    '广东': '广东',
    '浙江省': '浙江',
    '浙江': '浙江',
    '四川省': '四川',
    '四川': '四川',
    '湖北省': '湖北',
    '湖北': '湖北',
    '陕西省': '陕西',
    '陕西': '陕西',
    '江苏省': '江苏',
    '江苏': '江苏',
    '重庆市': '重庆',
    '重庆': '重庆',
    // 添加更多可能的变体
    '广东省（含深圳）': '广东',
    '广东省（含广州）': '广东',
    '广东（含深圳）': '广东',
    '广东（含广州）': '广东'
  };

  // 处理地图点击事件 - 支持下钻到城市
  const handleMapClick = (params: any) => {
    if (params.componentType === 'series' && params.data) {
      let provinceName = params.data.name;
      
      // 转换省份名称（处理地图可能返回的各种格式）
      const normalizedName = provinceNameMapping[provinceName] || provinceName;
      
      // 如果当前是省份视图，点击后下钻到城市
      if (mapView === 'province') {
        // 检查该省份是否有城市数据（尝试多种匹配方式）
        let provinceCities = regionData.filter(item => item.province === normalizedName);
        
        // 如果没找到，尝试反向匹配（数据中的省份名称可能包含"省"字）
        if (provinceCities.length === 0) {
          provinceCities = regionData.filter(item => 
            item.province === normalizedName || 
            item.province === normalizedName + '省' ||
            normalizedName === item.province + '省' ||
            item.province.includes(normalizedName) ||
            normalizedName.includes(item.province)
          );
        }
        
        if (provinceCities.length > 0) {
          // 使用找到的第一个城市的省份名称（确保一致性）
          const actualProvinceName = provinceCities[0].province;
          // 设置高亮（使用数据中的省份名称）
          setHighlightedProvince(actualProvinceName);
          setSelectedProvince(actualProvinceName);
          setMapView('city');
        } else {
          // 如果没有城市数据，显示提示
          message.warning('当前省份无活动');
          // 即使无活动，也设置高亮以便用户看到点击效果
          setHighlightedProvince(normalizedName);
        }
      } else if (mapView === 'city') {
        // 城市视图下点击，不做任何操作（或者可以添加城市详情功能）
        // 如果需要切换省份，需要先返回省份视图
      }
    }
  };

  // 获取当前视图的区域数据（省份或城市）
  const getCurrentViewData = () => {
    let filteredData = regionData;
    
    // 区域筛选
    if (selectedRegions && selectedRegions.length > 0) {
      // 需要根据省份映射到区域
      const provinceToRegion: { [key: string]: string } = {
        '北京': '华北',
        '上海': '华东',
        '广东': '华南',
        '浙江': '华东',
        '四川': '西南',
        '湖北': '华中',
        '陕西': '西北',
        '江苏': '华东',
        '重庆': '西南'
      };
      filteredData = filteredData.filter(item => {
        const region = provinceToRegion[item.province] || '';
        return selectedRegions.includes(region);
      });
    }
    
    if (mapView === 'city' && selectedProvince) {
      // 城市视图：只显示选中省份的城市
      return filteredData.filter(item => item.province === selectedProvince);
    } else {
      // 省份视图：按省份聚合数据
      const provinceMap = new Map<string, RegionData>();
      filteredData.forEach(item => {
        const existing = provinceMap.get(item.province);
        if (!existing || getSortValue(item, regionSortMetric) > getSortValue(existing, regionSortMetric)) {
          provinceMap.set(item.province, item);
        }
      });
      return Array.from(provinceMap.values());
    }
  };

  // 获取筛选后的零售商数据
  const getFilteredRetailerData = () => {
    let filtered = retailerData;
    
    // 区域筛选
    if (selectedRegions && selectedRegions.length > 0) {
      filtered = filtered.filter(item => selectedRegions.includes(item.region));
    }
    
    // 按GMV排序，取Top10
    return [...filtered].sort((a, b) => b.gmv - a.gmv).slice(0, 10);
  };

  // 获取排序值（用于排序函数）
  const getSortValue = (item: RegionData, metric: string): number => {
    switch (metric) {
      case 'gmv':
        return item.gmv;
      case 'orderCount':
        return item.orderCount;
      case 'salesVolume':
        return item.salesVolume;
      case 'avgPrice':
        return item.avgPrice;
      case 'roi':
        return item.roi;
      default:
        return item.gmv;
    }
  };

  return (
    <div className="activity-analysis-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>活动分析</Title>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            数据更新时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text strong style={{ width: '60px' }}>时间：</Text>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              style={{ width: 320 }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio.Group value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} buttonStyle="solid">
              <Radio.Button value="美团闪购">美团闪购</Radio.Button>
              <Radio.Button value="淘宝闪购">淘宝闪购</Radio.Button>
              <Radio.Button value="京东到家">京东到家</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </Card>

      {/* 区域筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Text strong style={{ fontSize: '14px' }}>区域筛选：</Text>
          <Checkbox.Group
            value={selectedRegions}
            onChange={(checkedValues) => setSelectedRegions(checkedValues as string[])}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <Button
              type={selectedRegions.length === 7 ? 'primary' : 'default'}
              size="small"
              onClick={() => {
                const allRegions = ['华东', '华南', '华北', '华中', '西南', '西北', '东北'];
                setSelectedRegions(selectedRegions.length === 7 ? [] : allRegions);
              }}
              style={{ marginRight: 8 }}
            >
              全部
            </Button>
            <Checkbox value="华东">华东</Checkbox>
            <Checkbox value="华南">华南</Checkbox>
            <Checkbox value="华北">华北</Checkbox>
            <Checkbox value="华中">华中</Checkbox>
            <Checkbox value="西南">西南</Checkbox>
            <Checkbox value="西北">西北</Checkbox>
            <Checkbox value="东北">东北</Checkbox>
          </Checkbox.Group>
        </div>
      </Card>

      {/* 核心指标 */}
      <Card title="核心指标" style={{ marginBottom: 0, borderBottom: 'none' }}>
        <Row gutter={0} style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* GMV */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>GMV（元）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.gmv}
              precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
            />
              {renderComparison(coreMetrics.gmvMonthOnMonth, coreMetrics.gmvYearOnYear)}
          </Card>
        </Col>

          {/* 订单数 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>订单数（张）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.orderCount}
              precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
            />
              {renderComparison(coreMetrics.orderCountMonthOnMonth, coreMetrics.orderCountYearOnYear)}
          </Card>
        </Col>

          {/* 销量 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>销量（件）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.salesVolume}
              precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
            />
              {renderComparison(coreMetrics.salesVolumeMonthOnMonth, coreMetrics.salesVolumeYearOnYear)}
          </Card>
        </Col>

          {/* 客单价 */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>客单价（元）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.avgPrice}
                precision={2}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              {renderComparison(coreMetrics.avgPriceMonthOnMonth, coreMetrics.avgPriceYearOnYear)}
          </Card>
        </Col>

          {/* ROI */}
          <Col style={{ width: 'calc(20% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>ROI（x）</span>
                <AntTooltip 
                  title="GMV ÷ 优惠金额"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.roi}
              precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              {renderComparison(coreMetrics.roiMonthOnMonth, coreMetrics.roiYearOnYear)}
          </Card>
        </Col>
      </Row>
              </Card>

      {/* 趋势图 */}
      <Card style={{ marginBottom: 16, marginTop: 0, borderTop: 'none' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* 主指标选择器 - 使用销售分析样式 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { key: 'gmv', label: 'GMV', color: '#1890ff' },
              { key: 'orderCount', label: '订单数', color: '#52c41a' },
              { key: 'salesVolume', label: '销量', color: '#722ed1' },
              { key: 'avgPrice', label: '客单价', color: '#faad14' },
              { key: 'roi', label: 'ROI', color: '#f5222d' }
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
                  backgroundColor: selectedMetric === metric.key ? 'rgba(0,0,0,0.02)' : 'transparent',
                  opacity: selectedMetric === metric.key ? 1 : 0.5
                }}
                onClick={() => setSelectedMetric(metric.key)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedMetric === metric.key ? 'rgba(0,0,0,0.02)' : 'transparent';
                }}
              >
                <div 
                  style={{ 
                    width: '12px', 
                    height: '2px', 
                    backgroundColor: selectedMetric === metric.key ? metric.color : '#ccc',
                    marginRight: '8px',
                    borderRadius: '1px',
                    transition: 'background-color 0.2s ease'
                  }} 
                />
                <span style={{ 
                  color: selectedMetric === metric.key ? '#333' : '#999',
                  fontSize: '14px',
                  fontWeight: selectedMetric === metric.key ? '500' : '400',
                  transition: 'all 0.2s ease'
                }}>
                  {metric.label}
                        </span>
                    </div>
                  ))}
                </div>
          {/* 副指标开关和选择 - 右对齐 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch checked={showSecondaryMetric} onChange={setShowSecondaryMetric} />
            <Text>开启副指标</Text>
            {showSecondaryMetric && (
              <Select
                value={secondaryMetric}
                onChange={setSecondaryMetric}
                style={{ width: 120 }}
                disabled={!showSecondaryMetric}
              >
                <Option value="gmv" disabled={selectedMetric === 'gmv'}>GMV</Option>
                <Option value="orderCount" disabled={selectedMetric === 'orderCount'}>订单数</Option>
                <Option value="salesVolume" disabled={selectedMetric === 'salesVolume'}>销量</Option>
                <Option value="avgPrice" disabled={selectedMetric === 'avgPrice'}>客单价</Option>
                <Option value="roi" disabled={selectedMetric === 'roi'}>ROI</Option>
              </Select>
            )}
          </div>
        </div>
        {mapReady && (
          <ReactECharts
            option={getTrendOption()}
            style={{ height: '400px' }}
          />
        )}
              </Card>

      {/* 活动区域分布 */}
      <Card 
        title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>活动区域分布</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: '14px' }}>排序指标：</Text>
              <Select
                value={regionSortMetric}
                onChange={setRegionSortMetric}
                style={{ width: 120 }}
                size="small"
              >
                <Option value="gmv">GMV</Option>
                <Option value="orderCount">订单数</Option>
                <Option value="salesVolume">销量</Option>
                <Option value="avgPrice">客单价</Option>
                <Option value="roi">ROI</Option>
              </Select>
                          </div>
                          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          {/* 左侧地图 */}
          <Col span={14}>
            <div style={{ position: 'relative' }}>
              {mapView === 'city' && selectedProvince && (
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Button 
                          size="small" 
                    onClick={() => {
                      setMapView('province');
                      setSelectedProvince(null);
                      setHighlightedProvince(null); // 清除高亮
                    }}
                  >
                    返回省份视图
                  </Button>
                  <Text>当前查看：{selectedProvince}</Text>
                </div>
              )}
              {mapReady ? (
                <ReactECharts
                  option={getMapOption()}
                  style={{ height: '500px' }}
                  onEvents={{
                    click: handleMapClick
                  }}
                />
              ) : (
                <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                  <Text type="secondary">地图加载中...</Text>
                      </div>
              )}
                </div>
            </Col>

          {/* 右侧统计明细 */}
          <Col span={10}>
            {(() => {
              const sortedData = getSortedRegionData();
              if (mapView === 'city' && selectedProvince && sortedData.length === 0) {
                return (
                  <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Empty description="当前省份无活动" />
                  </div>
                );
              }
              return (
            <Table
                  columns={regionColumns}
                  dataSource={sortedData}
              rowKey="id"
                  pagination={false}
                  size="small"
                  scroll={{ y: 500 }}
                  bordered
                />
              );
            })()}
          </Col>
        </Row>
          </Card>

      {/* 零售商Top10 */}
      <Card 
        title="零售商Top10"
        style={{ marginBottom: 16 }}
      >
        <Table
          columns={[
            {
              title: '排名',
              key: 'rank',
              width: 60,
              render: (_: any, __: any, index: number) => index + 1
            },
            {
              title: '零售商名称',
              dataIndex: 'retailerName',
              key: 'retailerName',
              width: 150
            },
            {
              title: '区域',
              dataIndex: 'region',
              key: 'region',
              width: 100
            },
            {
              title: 'GMV（元）',
              dataIndex: 'gmv',
              key: 'gmv',
              width: 120,
              align: 'right',
              render: (value: number) => value.toLocaleString()
            },
            {
              title: 'GMV占比（%）',
              dataIndex: 'gmvPercentage',
              key: 'gmvPercentage',
              width: 100,
              render: (value: number) => `${value}%`
            },
            {
              title: '订单数（张）',
              dataIndex: 'orderCount',
              key: 'orderCount',
              width: 100,
              align: 'right',
              render: (value: number) => value.toLocaleString()
            },
            {
              title: '销量（件）',
              dataIndex: 'salesVolume',
              key: 'salesVolume',
              width: 100,
              align: 'right',
              render: (value: number) => value.toLocaleString()
            },
            {
              title: '客单价（元）',
              dataIndex: 'avgPrice',
              key: 'avgPrice',
              width: 100,
              align: 'right',
              render: (value: number) => value.toFixed(2)
            },
            {
              title: 'ROI（x）',
              dataIndex: 'roi',
              key: 'roi',
              width: 100,
              align: 'right',
              render: (value: number) => (
                <span style={{ color: value >= 3 ? '#52c41a' : value >= 2 ? '#faad14' : '#ff4d4f' }}>
                  {value.toFixed(1)}
                </span>
              )
            }
          ]}
          dataSource={getFilteredRetailerData()}
          rowKey="id"
          pagination={false}
          size="small"
          bordered
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default ActivityAnalysis;
