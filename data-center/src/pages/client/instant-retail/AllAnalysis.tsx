import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Select, DatePicker, Button, Typography, Tooltip as AntTooltip, Switch, Empty, message, Radio, Checkbox, Modal } from 'antd';
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
  allPlatformGMV: number; // 全量GMV
  activityGMV: number; // 活动GMV
  subsidyAmount: number; // 补贴金额
  activityFeeRatio: number; // 活动费比（%）
  activityPercentage: number; // 活动占比（%）
  allPlatformFeeRatio: number; // 全量费比（%）
  allPlatformGMVMonthOnMonth: number; // 全量GMV月环比
  allPlatformGMVYearOnYear: number; // 全量GMV年同比
  activityGMVMonthOnMonth: number; // 活动GMV月环比
  activityGMVYearOnYear: number; // 活动GMV年同比
  subsidyAmountMonthOnMonth: number; // 补贴金额月环比
  subsidyAmountYearOnYear: number; // 补贴金额年同比
  activityFeeRatioMonthOnMonth: number; // 活动费比月环比
  activityFeeRatioYearOnYear: number; // 活动费比年同比
  activityPercentageMonthOnMonth: number; // 活动占比月环比
  activityPercentageYearOnYear: number; // 活动占比年同比
  allPlatformFeeRatioMonthOnMonth: number; // 全量费比月环比
  allPlatformFeeRatioYearOnYear: number; // 全量费比年同比
}

// 区域分布数据接口
interface RegionData {
  id: string;
  city: string; // 城市
  province: string; // 省份
  allPlatformGMV: number; // 全量GMV
  activityGMV: number; // 活动GMV
  subsidyAmount: number; // 补贴金额
  activityFeeRatio: number; // 活动费比（%）
  activityPercentage: number; // 活动占比（%）
  allPlatformFeeRatio: number; // 全量费比（%）
  allPlatformGMVMonthOnMonth: number; // 全量GMV月环比
  allPlatformGMVYearOnYear: number; // 全量GMV年同比
  activityGMVMonthOnMonth: number; // 活动GMV月环比
  activityGMVYearOnYear: number; // 活动GMV年同比
}

// 趋势数据接口
interface TrendData {
  date: string;
  allPlatformGMV: number;
  activityGMV: number;
  subsidyAmount: number;
  activityFeeRatio: number;
  activityPercentage: number;
  allPlatformFeeRatio: number;
}

// 零售商数据接口
interface RetailerData {
  id: string;
  retailerName: string; // 零售商名称
  region: string; // 区域
  allPlatformGMV: number; // 全量GMV
  activityGMV: number; // 活动GMV
  subsidyAmount: number; // 补贴金额
  activityContribution: number; // 活动贡献（%）
  trendData?: { // 趋势数据
    date: string;
    allPlatformGMV: number;
    activityContribution: number;
  }[];
}

const AllAnalysis: React.FC = () => {
  const [dateType, setDateType] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('美团闪购');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('allPlatformGMV'); // 选中的趋势指标
  const [showSecondaryMetric, setShowSecondaryMetric] = useState<boolean>(false); // 是否显示副指标
  const [secondaryMetric, setSecondaryMetric] = useState<string>('activityGMV'); // 选中的副指标
  const [regionSortMetric, setRegionSortMetric] = useState<string>('allPlatformGMV'); // 区域分布排序指标
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null); // 选中的省份，用于下钻
  const [mapView, setMapView] = useState<'province' | 'city'>('province'); // 地图视图：省份或城市
  const [highlightedProvince, setHighlightedProvince] = useState<string | null>(null); // 高亮的省份（省份视图）
  const [provinceMapReady, setProvinceMapReady] = useState<{ [key: string]: boolean }>({}); // 省份地图加载状态
  const [chinaMapData, setChinaMapData] = useState<any>(null); // 保存中国地图数据，用于提取省份地图
  const [retailerTrendVisible, setRetailerTrendVisible] = useState(false); // 零售商趋势图Modal显示状态
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerData | null>(null); // 选中的零售商

  // 当主指标改变时，如果副指标与主指标相同，自动切换副指标
  useEffect(() => {
    if (showSecondaryMetric && secondaryMetric === selectedMetric) {
      const availableMetrics = ['allPlatformGMV', 'activityGMV', 'subsidyAmount', 'activityFeeRatio', 'activityPercentage', 'allPlatformFeeRatio'].filter(m => m !== selectedMetric);
      if (availableMetrics.length > 0) {
        setSecondaryMetric(availableMetrics[0]);
      }
    }
  }, [selectedMetric, showSecondaryMetric, secondaryMetric]);

  // 模拟核心指标数据（全量）
  const [coreMetrics] = useState<CoreMetrics>({
    allPlatformGMV: 3580000, // 全量GMV
    activityGMV: 2580000, // 活动GMV
    subsidyAmount: 620000, // 补贴金额
    activityFeeRatio: 24.0, // 活动费比（%）
    activityPercentage: 72.1, // 活动占比（%）
    allPlatformFeeRatio: 17.3, // 全量费比（%）
    allPlatformGMVMonthOnMonth: 15.2,
    allPlatformGMVYearOnYear: 32.5,
    activityGMVMonthOnMonth: 12.5,
    activityGMVYearOnYear: 28.3,
    subsidyAmountMonthOnMonth: 10.8,
    subsidyAmountYearOnYear: 25.6,
    activityFeeRatioMonthOnMonth: -1.2,
    activityFeeRatioYearOnYear: 2.3,
    activityPercentageMonthOnMonth: 0.5,
    activityPercentageYearOnYear: 1.8,
    allPlatformFeeRatioMonthOnMonth: -0.8,
    allPlatformFeeRatioYearOnYear: 1.5
  });


  // 模拟区域分布数据
  const [regionData] = useState<RegionData[]>([
    // 北京
    { id: '1', city: '北京', province: '北京', allPlatformGMV: 685000, activityGMV: 485000, subsidyAmount: 115000, activityFeeRatio: 23.7, activityPercentage: 70.8, allPlatformFeeRatio: 16.8, allPlatformGMVMonthOnMonth: 15.2, allPlatformGMVYearOnYear: 32.5, activityGMVMonthOnMonth: 14.5, activityGMVYearOnYear: 30.2 },
    { id: '11', city: '朝阳区', province: '北京', allPlatformGMV: 265000, activityGMV: 185000, subsidyAmount: 42000, activityFeeRatio: 22.7, activityPercentage: 69.8, allPlatformFeeRatio: 15.8, allPlatformGMVMonthOnMonth: 14.5, allPlatformGMVYearOnYear: 30.2, activityGMVMonthOnMonth: 13.5, activityGMVYearOnYear: 28.2 },
    { id: '12', city: '海淀区', province: '北京', allPlatformGMV: 235000, activityGMV: 165000, subsidyAmount: 38000, activityFeeRatio: 23.0, activityPercentage: 70.2, allPlatformFeeRatio: 16.2, allPlatformGMVMonthOnMonth: 16.8, allPlatformGMVYearOnYear: 33.1, activityGMVMonthOnMonth: 15.8, activityGMVYearOnYear: 31.1 },
    { id: '13', city: '丰台区', province: '北京', allPlatformGMV: 195000, activityGMV: 135000, subsidyAmount: 31000, activityFeeRatio: 23.0, activityPercentage: 69.2, allPlatformFeeRatio: 15.9, allPlatformGMVMonthOnMonth: 13.2, allPlatformGMVYearOnYear: 28.5, activityGMVMonthOnMonth: 12.2, activityGMVYearOnYear: 26.5 },
    
    // 上海
    { id: '2', city: '上海', province: '上海', allPlatformGMV: 590000, activityGMV: 420000, subsidyAmount: 98000, activityFeeRatio: 23.3, activityPercentage: 71.2, allPlatformFeeRatio: 16.6, allPlatformGMVMonthOnMonth: 12.8, allPlatformGMVYearOnYear: 28.9, activityGMVMonthOnMonth: 11.8, activityGMVYearOnYear: 26.9 },
    { id: '14', city: '浦东新区', province: '上海', allPlatformGMV: 275000, activityGMV: 195000, subsidyAmount: 45000, activityFeeRatio: 23.1, activityPercentage: 70.9, allPlatformFeeRatio: 16.4, allPlatformGMVMonthOnMonth: 13.5, allPlatformGMVYearOnYear: 29.8, activityGMVMonthOnMonth: 12.5, activityGMVYearOnYear: 27.8 },
    { id: '15', city: '黄浦区', province: '上海', allPlatformGMV: 175000, activityGMV: 125000, subsidyAmount: 29000, activityFeeRatio: 23.2, activityPercentage: 71.4, allPlatformFeeRatio: 16.6, allPlatformGMVMonthOnMonth: 11.2, allPlatformGMVYearOnYear: 26.5, activityGMVMonthOnMonth: 10.2, activityGMVYearOnYear: 24.5 },
    { id: '16', city: '徐汇区', province: '上海', allPlatformGMV: 140000, activityGMV: 100000, subsidyAmount: 23000, activityFeeRatio: 23.0, activityPercentage: 71.4, allPlatformFeeRatio: 16.4, allPlatformGMVMonthOnMonth: 10.8, allPlatformGMVYearOnYear: 25.3, activityGMVMonthOnMonth: 9.8, activityGMVYearOnYear: 23.3 },
    
    // 广东
    { id: '3', city: '广州', province: '广东', allPlatformGMV: 535000, activityGMV: 380000, subsidyAmount: 88000, activityFeeRatio: 23.2, activityPercentage: 71.0, allPlatformFeeRatio: 16.4, allPlatformGMVMonthOnMonth: 18.5, allPlatformGMVYearOnYear: 35.2, activityGMVMonthOnMonth: 17.5, activityGMVYearOnYear: 33.2 },
    { id: '4', city: '深圳', province: '广东', allPlatformGMV: 495000, activityGMV: 350000, subsidyAmount: 81000, activityFeeRatio: 23.1, activityPercentage: 70.7, allPlatformFeeRatio: 16.4, allPlatformGMVMonthOnMonth: 20.1, allPlatformGMVYearOnYear: 38.7, activityGMVMonthOnMonth: 19.1, activityGMVYearOnYear: 36.7 },
    { id: '17', city: '佛山', province: '广东', allPlatformGMV: 205000, activityGMV: 145000, subsidyAmount: 33500, activityFeeRatio: 23.1, activityPercentage: 70.7, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 15.3, allPlatformGMVYearOnYear: 32.1, activityGMVMonthOnMonth: 14.3, activityGMVYearOnYear: 30.1 },
    { id: '18', city: '东莞', province: '广东', allPlatformGMV: 175000, activityGMV: 125000, subsidyAmount: 29000, activityFeeRatio: 23.2, activityPercentage: 71.4, allPlatformFeeRatio: 16.6, allPlatformGMVMonthOnMonth: 14.8, allPlatformGMVYearOnYear: 30.5, activityGMVMonthOnMonth: 13.8, activityGMVYearOnYear: 28.5 },
    
    // 浙江
    { id: '5', city: '杭州', province: '浙江', allPlatformGMV: 400000, activityGMV: 285000, subsidyAmount: 66000, activityFeeRatio: 23.2, activityPercentage: 71.3, allPlatformFeeRatio: 16.5, allPlatformGMVMonthOnMonth: 14.3, allPlatformGMVYearOnYear: 29.6, activityGMVMonthOnMonth: 13.3, activityGMVYearOnYear: 27.6 },
    { id: '19', city: '宁波', province: '浙江', allPlatformGMV: 190000, activityGMV: 135000, subsidyAmount: 31000, activityFeeRatio: 23.0, activityPercentage: 71.1, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 13.5, allPlatformGMVYearOnYear: 28.2, activityGMVMonthOnMonth: 12.5, activityGMVYearOnYear: 26.2 },
    { id: '20', city: '温州', province: '浙江', allPlatformGMV: 162000, activityGMV: 115000, subsidyAmount: 26500, activityFeeRatio: 23.0, activityPercentage: 71.0, allPlatformFeeRatio: 16.4, allPlatformGMVMonthOnMonth: 12.8, allPlatformGMVYearOnYear: 27.1, activityGMVMonthOnMonth: 11.8, activityGMVYearOnYear: 25.1 },
    
    // 四川
    { id: '6', city: '成都', province: '四川', allPlatformGMV: 338000, activityGMV: 240000, subsidyAmount: 55600, activityFeeRatio: 23.2, activityPercentage: 71.0, allPlatformFeeRatio: 16.5, allPlatformGMVMonthOnMonth: 16.7, allPlatformGMVYearOnYear: 31.2, activityGMVMonthOnMonth: 15.7, activityGMVYearOnYear: 29.2 },
    { id: '21', city: '绵阳', province: '四川', allPlatformGMV: 120000, activityGMV: 85000, subsidyAmount: 19600, activityFeeRatio: 23.1, activityPercentage: 70.8, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 12.5, allPlatformGMVYearOnYear: 25.8, activityGMVMonthOnMonth: 11.5, activityGMVYearOnYear: 23.8 },
    { id: '22', city: '德阳', province: '四川', allPlatformGMV: 92000, activityGMV: 65000, subsidyAmount: 15000, activityFeeRatio: 23.1, activityPercentage: 70.7, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 11.8, allPlatformGMVYearOnYear: 24.2, activityGMVMonthOnMonth: 10.8, activityGMVYearOnYear: 22.2 },
    
    // 湖北
    { id: '7', city: '武汉', province: '湖北', allPlatformGMV: 275000, activityGMV: 195000, subsidyAmount: 45000, activityFeeRatio: 23.1, activityPercentage: 70.9, allPlatformFeeRatio: 16.4, allPlatformGMVMonthOnMonth: 11.9, allPlatformGMVYearOnYear: 26.8, activityGMVMonthOnMonth: 10.9, activityGMVYearOnYear: 24.8 },
    { id: '23', city: '宜昌', province: '湖北', allPlatformGMV: 106000, activityGMV: 75000, subsidyAmount: 17300, activityFeeRatio: 23.1, activityPercentage: 70.8, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 10.5, allPlatformGMVYearOnYear: 23.5, activityGMVMonthOnMonth: 9.5, activityGMVYearOnYear: 21.5 },
    { id: '24', city: '襄阳', province: '湖北', allPlatformGMV: 92000, activityGMV: 65000, subsidyAmount: 15000, activityFeeRatio: 23.1, activityPercentage: 70.7, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 9.8, allPlatformGMVYearOnYear: 22.1, activityGMVMonthOnMonth: 8.8, activityGMVYearOnYear: 20.1 },
    
    // 陕西
    { id: '8', city: '西安', province: '陕西', allPlatformGMV: 233000, activityGMV: 165000, subsidyAmount: 38000, activityFeeRatio: 23.0, activityPercentage: 70.8, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 13.4, allPlatformGMVYearOnYear: 27.5, activityGMVMonthOnMonth: 12.4, activityGMVYearOnYear: 25.5 },
    { id: '25', city: '宝鸡', province: '陕西', allPlatformGMV: 78000, activityGMV: 55000, subsidyAmount: 12700, activityFeeRatio: 23.1, activityPercentage: 70.5, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 9.2, allPlatformGMVYearOnYear: 20.8, activityGMVMonthOnMonth: 8.2, activityGMVYearOnYear: 18.8 },
    { id: '26', city: '咸阳', province: '陕西', allPlatformGMV: 64000, activityGMV: 45000, subsidyAmount: 10400, activityFeeRatio: 23.1, activityPercentage: 70.3, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 8.5, allPlatformGMVYearOnYear: 19.5, activityGMVMonthOnMonth: 7.5, activityGMVYearOnYear: 17.5 },
    
    // 江苏
    { id: '9', city: '南京', province: '江苏', allPlatformGMV: 205000, activityGMV: 145000, subsidyAmount: 33500, activityFeeRatio: 23.1, activityPercentage: 70.7, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 9.8, allPlatformGMVYearOnYear: 24.3, activityGMVMonthOnMonth: 8.8, activityGMVYearOnYear: 22.3 },
    { id: '27', city: '苏州', province: '江苏', allPlatformGMV: 219000, activityGMV: 155000, subsidyAmount: 35800, activityFeeRatio: 23.1, activityPercentage: 70.8, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 14.2, allPlatformGMVYearOnYear: 28.9, activityGMVMonthOnMonth: 13.2, activityGMVYearOnYear: 26.9 },
    { id: '28', city: '无锡', province: '江苏', allPlatformGMV: 148000, activityGMV: 105000, subsidyAmount: 24200, activityFeeRatio: 23.0, activityPercentage: 70.9, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 12.5, allPlatformGMVYearOnYear: 26.2, activityGMVMonthOnMonth: 11.5, activityGMVYearOnYear: 24.2 },
    
    // 重庆
    { id: '10', city: '重庆', province: '重庆', allPlatformGMV: 176000, activityGMV: 125000, subsidyAmount: 29000, activityFeeRatio: 23.2, activityPercentage: 71.0, allPlatformFeeRatio: 16.5, allPlatformGMVMonthOnMonth: 10.5, allPlatformGMVYearOnYear: 25.1, activityGMVMonthOnMonth: 9.5, activityGMVYearOnYear: 23.1 },
    { id: '29', city: '万州区', province: '重庆', allPlatformGMV: 78000, activityGMV: 55000, subsidyAmount: 12700, activityFeeRatio: 23.1, activityPercentage: 70.5, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 9.8, allPlatformGMVYearOnYear: 22.5, activityGMVMonthOnMonth: 8.8, activityGMVYearOnYear: 20.5 },
    { id: '30', city: '涪陵区', province: '重庆', allPlatformGMV: 64000, activityGMV: 45000, subsidyAmount: 10400, activityFeeRatio: 23.1, activityPercentage: 70.3, allPlatformFeeRatio: 16.3, allPlatformGMVMonthOnMonth: 8.9, allPlatformGMVYearOnYear: 21.2, activityGMVMonthOnMonth: 7.9, activityGMVYearOnYear: 19.2 }
  ]);

  // 模拟零售商Top10数据
  const [retailerData] = useState<RetailerData[]>([
    { 
      id: '1', 
      retailerName: '永辉超市', 
      region: '华东', 
      allPlatformGMV: 685000, 
      activityGMV: 485000, 
      subsidyAmount: 112000, 
      activityContribution: 70.8,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 175000, activityContribution: 70.5 },
        { date: '2024-11-02', allPlatformGMV: 203000, activityContribution: 71.0 },
        { date: '2024-11-03', allPlatformGMV: 235000, activityContribution: 71.5 },
        { date: '2024-11-04', allPlatformGMV: 265000, activityContribution: 71.3 },
        { date: '2024-11-05', allPlatformGMV: 295000, activityContribution: 71.2 },
        { date: '2024-11-06', allPlatformGMV: 275000, activityContribution: 70.9 },
        { date: '2024-11-07', allPlatformGMV: 250000, activityContribution: 71.2 },
        { date: '2024-11-08', allPlatformGMV: 220000, activityContribution: 70.9 },
        { date: '2024-11-09', allPlatformGMV: 200000, activityContribution: 71.0 },
        { date: '2024-11-10', allPlatformGMV: 330000, activityContribution: 71.2 },
        { date: '2024-11-11', allPlatformGMV: 540000, activityContribution: 71.3 },
        { date: '2024-11-12', allPlatformGMV: 418000, activityContribution: 71.3 },
        { date: '2024-11-13', allPlatformGMV: 302000, activityContribution: 71.2 },
        { date: '2024-11-14', allPlatformGMV: 250000, activityContribution: 71.2 },
        { date: '2024-11-15', allPlatformGMV: 220000, activityContribution: 70.9 }
      ]
    },
    { 
      id: '2', 
      retailerName: '盒马鲜生', 
      region: '华东', 
      allPlatformGMV: 590000, 
      activityGMV: 420000, 
      subsidyAmount: 97000, 
      activityContribution: 71.2,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 150000, activityContribution: 71.0 },
        { date: '2024-11-02', allPlatformGMV: 175000, activityContribution: 71.4 },
        { date: '2024-11-03', allPlatformGMV: 203000, activityContribution: 71.5 },
        { date: '2024-11-04', allPlatformGMV: 228000, activityContribution: 71.3 },
        { date: '2024-11-05', allPlatformGMV: 253000, activityContribution: 71.2 },
        { date: '2024-11-06', allPlatformGMV: 235000, activityContribution: 70.9 },
        { date: '2024-11-07', allPlatformGMV: 215000, activityContribution: 71.2 },
        { date: '2024-11-08', allPlatformGMV: 188000, activityContribution: 70.9 },
        { date: '2024-11-09', allPlatformGMV: 172000, activityContribution: 71.0 },
        { date: '2024-11-10', allPlatformGMV: 283000, activityContribution: 71.2 },
        { date: '2024-11-11', allPlatformGMV: 465000, activityContribution: 71.3 },
        { date: '2024-11-12', allPlatformGMV: 360000, activityContribution: 71.3 },
        { date: '2024-11-13', allPlatformGMV: 260000, activityContribution: 71.2 },
        { date: '2024-11-14', allPlatformGMV: 215000, activityContribution: 71.2 },
        { date: '2024-11-15', allPlatformGMV: 188000, activityContribution: 70.9 }
      ]
    },
    { 
      id: '3', 
      retailerName: '沃尔玛', 
      region: '华南', 
      allPlatformGMV: 535000, 
      activityGMV: 380000, 
      subsidyAmount: 88000, 
      activityContribution: 71.0,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 136000, activityContribution: 70.8 },
        { date: '2024-11-02', allPlatformGMV: 158000, activityContribution: 71.2 },
        { date: '2024-11-03', allPlatformGMV: 183000, activityContribution: 71.3 },
        { date: '2024-11-04', allPlatformGMV: 206000, activityContribution: 71.1 },
        { date: '2024-11-05', allPlatformGMV: 229000, activityContribution: 71.0 },
        { date: '2024-11-06', allPlatformGMV: 213000, activityContribution: 70.7 },
        { date: '2024-11-07', allPlatformGMV: 194000, activityContribution: 71.0 },
        { date: '2024-11-08', allPlatformGMV: 170000, activityContribution: 70.7 },
        { date: '2024-11-09', allPlatformGMV: 155000, activityContribution: 70.8 },
        { date: '2024-11-10', allPlatformGMV: 256000, activityContribution: 71.0 },
        { date: '2024-11-11', allPlatformGMV: 420000, activityContribution: 71.1 },
        { date: '2024-11-12', allPlatformGMV: 325000, activityContribution: 71.1 },
        { date: '2024-11-13', allPlatformGMV: 235000, activityContribution: 71.0 },
        { date: '2024-11-14', allPlatformGMV: 194000, activityContribution: 71.0 },
        { date: '2024-11-15', allPlatformGMV: 170000, activityContribution: 70.7 }
      ]
    },
    { 
      id: '4', 
      retailerName: '大润发', 
      region: '华南', 
      allPlatformGMV: 495000, 
      activityGMV: 350000, 
      subsidyAmount: 81000, 
      activityContribution: 70.7,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 126000, activityContribution: 70.5 },
        { date: '2024-11-02', allPlatformGMV: 146000, activityContribution: 70.9 },
        { date: '2024-11-03', allPlatformGMV: 169000, activityContribution: 71.0 },
        { date: '2024-11-04', allPlatformGMV: 190000, activityContribution: 70.8 },
        { date: '2024-11-05', allPlatformGMV: 211000, activityContribution: 70.7 },
        { date: '2024-11-06', allPlatformGMV: 197000, activityContribution: 70.4 },
        { date: '2024-11-07', allPlatformGMV: 180000, activityContribution: 70.7 },
        { date: '2024-11-08', allPlatformGMV: 158000, activityContribution: 70.4 },
        { date: '2024-11-09', allPlatformGMV: 144000, activityContribution: 70.5 },
        { date: '2024-11-10', allPlatformGMV: 237000, activityContribution: 70.7 },
        { date: '2024-11-11', allPlatformGMV: 389000, activityContribution: 70.8 },
        { date: '2024-11-12', allPlatformGMV: 301000, activityContribution: 70.8 },
        { date: '2024-11-13', allPlatformGMV: 218000, activityContribution: 70.7 },
        { date: '2024-11-14', allPlatformGMV: 180000, activityContribution: 70.7 },
        { date: '2024-11-15', allPlatformGMV: 158000, activityContribution: 70.4 }
      ]
    },
    { 
      id: '5', 
      retailerName: '家乐福', 
      region: '华东', 
      allPlatformGMV: 400000, 
      activityGMV: 285000, 
      subsidyAmount: 66000, 
      activityContribution: 71.3,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 102000, activityContribution: 71.1 },
        { date: '2024-11-02', allPlatformGMV: 118000, activityContribution: 71.5 },
        { date: '2024-11-03', allPlatformGMV: 137000, activityContribution: 71.6 },
        { date: '2024-11-04', allPlatformGMV: 154000, activityContribution: 71.4 },
        { date: '2024-11-05', allPlatformGMV: 171000, activityContribution: 71.3 },
        { date: '2024-11-06', allPlatformGMV: 159000, activityContribution: 71.0 },
        { date: '2024-11-07', allPlatformGMV: 145000, activityContribution: 71.3 },
        { date: '2024-11-08', allPlatformGMV: 127000, activityContribution: 71.0 },
        { date: '2024-11-09', allPlatformGMV: 116000, activityContribution: 71.1 },
        { date: '2024-11-10', allPlatformGMV: 191000, activityContribution: 71.3 },
        { date: '2024-11-11', allPlatformGMV: 314000, activityContribution: 71.4 },
        { date: '2024-11-12', allPlatformGMV: 243000, activityContribution: 71.4 },
        { date: '2024-11-13', allPlatformGMV: 176000, activityContribution: 71.3 },
        { date: '2024-11-14', allPlatformGMV: 145000, activityContribution: 71.3 },
        { date: '2024-11-15', allPlatformGMV: 127000, activityContribution: 71.0 }
      ]
    },
    { 
      id: '6', 
      retailerName: '华润万家', 
      region: '西南', 
      allPlatformGMV: 338000, 
      activityGMV: 240000, 
      subsidyAmount: 55600, 
      activityContribution: 71.0,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 86000, activityContribution: 70.8 },
        { date: '2024-11-02', allPlatformGMV: 100000, activityContribution: 71.2 },
        { date: '2024-11-03', allPlatformGMV: 116000, activityContribution: 71.3 },
        { date: '2024-11-04', allPlatformGMV: 130000, activityContribution: 71.1 },
        { date: '2024-11-05', allPlatformGMV: 144000, activityContribution: 71.0 },
        { date: '2024-11-06', allPlatformGMV: 134000, activityContribution: 70.7 },
        { date: '2024-11-07', allPlatformGMV: 122000, activityContribution: 71.0 },
        { date: '2024-11-08', allPlatformGMV: 107000, activityContribution: 70.7 },
        { date: '2024-11-09', allPlatformGMV: 98000, activityContribution: 70.8 },
        { date: '2024-11-10', allPlatformGMV: 161000, activityContribution: 71.0 },
        { date: '2024-11-11', allPlatformGMV: 264000, activityContribution: 71.1 },
        { date: '2024-11-12', allPlatformGMV: 204000, activityContribution: 71.1 },
        { date: '2024-11-13', allPlatformGMV: 148000, activityContribution: 71.0 },
        { date: '2024-11-14', allPlatformGMV: 122000, activityContribution: 71.0 },
        { date: '2024-11-15', allPlatformGMV: 107000, activityContribution: 70.7 }
      ]
    },
    { 
      id: '7', 
      retailerName: '物美超市', 
      region: '华北', 
      allPlatformGMV: 275000, 
      activityGMV: 195000, 
      subsidyAmount: 45000, 
      activityContribution: 70.9,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 70000, activityContribution: 70.7 },
        { date: '2024-11-02', allPlatformGMV: 81000, activityContribution: 71.1 },
        { date: '2024-11-03', allPlatformGMV: 94000, activityContribution: 71.2 },
        { date: '2024-11-04', allPlatformGMV: 106000, activityContribution: 71.0 },
        { date: '2024-11-05', allPlatformGMV: 117000, activityContribution: 70.9 },
        { date: '2024-11-06', allPlatformGMV: 109000, activityContribution: 70.6 },
        { date: '2024-11-07', allPlatformGMV: 99000, activityContribution: 70.9 },
        { date: '2024-11-08', allPlatformGMV: 87000, activityContribution: 70.6 },
        { date: '2024-11-09', allPlatformGMV: 79000, activityContribution: 70.7 },
        { date: '2024-11-10', allPlatformGMV: 130000, activityContribution: 70.9 },
        { date: '2024-11-11', allPlatformGMV: 214000, activityContribution: 71.0 },
        { date: '2024-11-12', allPlatformGMV: 165000, activityContribution: 71.0 },
        { date: '2024-11-13', allPlatformGMV: 120000, activityContribution: 70.9 },
        { date: '2024-11-14', allPlatformGMV: 99000, activityContribution: 70.9 },
        { date: '2024-11-15', allPlatformGMV: 87000, activityContribution: 70.6 }
      ]
    },
    { 
      id: '8', 
      retailerName: '人人乐', 
      region: '华中', 
      allPlatformGMV: 233000, 
      activityGMV: 165000, 
      subsidyAmount: 38000, 
      activityContribution: 70.8,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 59000, activityContribution: 70.6 },
        { date: '2024-11-02', allPlatformGMV: 69000, activityContribution: 71.0 },
        { date: '2024-11-03', allPlatformGMV: 80000, activityContribution: 71.1 },
        { date: '2024-11-04', allPlatformGMV: 90000, activityContribution: 70.9 },
        { date: '2024-11-05', allPlatformGMV: 100000, activityContribution: 70.8 },
        { date: '2024-11-06', allPlatformGMV: 93000, activityContribution: 70.5 },
        { date: '2024-11-07', allPlatformGMV: 85000, activityContribution: 70.8 },
        { date: '2024-11-08', allPlatformGMV: 74000, activityContribution: 70.5 },
        { date: '2024-11-09', allPlatformGMV: 68000, activityContribution: 70.6 },
        { date: '2024-11-10', allPlatformGMV: 112000, activityContribution: 70.8 },
        { date: '2024-11-11', allPlatformGMV: 184000, activityContribution: 70.9 },
        { date: '2024-11-12', allPlatformGMV: 142000, activityContribution: 70.9 },
        { date: '2024-11-13', allPlatformGMV: 103000, activityContribution: 70.8 },
        { date: '2024-11-14', allPlatformGMV: 85000, activityContribution: 70.8 },
        { date: '2024-11-15', allPlatformGMV: 74000, activityContribution: 70.5 }
      ]
    },
    { 
      id: '9', 
      retailerName: '世纪联华', 
      region: '华东', 
      allPlatformGMV: 205000, 
      activityGMV: 145000, 
      subsidyAmount: 33500, 
      activityContribution: 70.7,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 52000, activityContribution: 70.5 },
        { date: '2024-11-02', allPlatformGMV: 60000, activityContribution: 70.9 },
        { date: '2024-11-03', allPlatformGMV: 70000, activityContribution: 71.0 },
        { date: '2024-11-04', allPlatformGMV: 79000, activityContribution: 70.8 },
        { date: '2024-11-05', allPlatformGMV: 87000, activityContribution: 70.7 },
        { date: '2024-11-06', allPlatformGMV: 81000, activityContribution: 70.4 },
        { date: '2024-11-07', allPlatformGMV: 74000, activityContribution: 70.7 },
        { date: '2024-11-08', allPlatformGMV: 65000, activityContribution: 70.4 },
        { date: '2024-11-09', allPlatformGMV: 59000, activityContribution: 70.5 },
        { date: '2024-11-10', allPlatformGMV: 98000, activityContribution: 70.7 },
        { date: '2024-11-11', allPlatformGMV: 161000, activityContribution: 70.8 },
        { date: '2024-11-12', allPlatformGMV: 124000, activityContribution: 70.8 },
        { date: '2024-11-13', allPlatformGMV: 90000, activityContribution: 70.7 },
        { date: '2024-11-14', allPlatformGMV: 74000, activityContribution: 70.7 },
        { date: '2024-11-15', allPlatformGMV: 65000, activityContribution: 70.4 }
      ]
    },
    { 
      id: '10', 
      retailerName: '麦德龙', 
      region: '华东', 
      allPlatformGMV: 176000, 
      activityGMV: 125000, 
      subsidyAmount: 29000, 
      activityContribution: 71.0,
      trendData: [
        { date: '2024-11-01', allPlatformGMV: 45000, activityContribution: 70.8 },
        { date: '2024-11-02', allPlatformGMV: 52000, activityContribution: 71.2 },
        { date: '2024-11-03', allPlatformGMV: 60000, activityContribution: 71.3 },
        { date: '2024-11-04', allPlatformGMV: 68000, activityContribution: 71.1 },
        { date: '2024-11-05', allPlatformGMV: 75000, activityContribution: 71.0 },
        { date: '2024-11-06', allPlatformGMV: 70000, activityContribution: 70.7 },
        { date: '2024-11-07', allPlatformGMV: 64000, activityContribution: 71.0 },
        { date: '2024-11-08', allPlatformGMV: 56000, activityContribution: 70.7 },
        { date: '2024-11-09', allPlatformGMV: 51000, activityContribution: 70.8 },
        { date: '2024-11-10', allPlatformGMV: 84000, activityContribution: 71.0 },
        { date: '2024-11-11', allPlatformGMV: 138000, activityContribution: 71.1 },
        { date: '2024-11-12', allPlatformGMV: 107000, activityContribution: 71.1 },
        { date: '2024-11-13', allPlatformGMV: 77000, activityContribution: 71.0 },
        { date: '2024-11-14', allPlatformGMV: 64000, activityContribution: 71.0 },
        { date: '2024-11-15', allPlatformGMV: 56000, activityContribution: 70.7 }
      ]
    }
  ]);

  // 模拟趋势数据
  const [trendData] = useState<TrendData[]>([
    { date: '2024-11-01', allPlatformGMV: 175000, activityGMV: 125000, subsidyAmount: 29000, activityFeeRatio: 23.2, activityPercentage: 71.4, allPlatformFeeRatio: 16.6 },
    { date: '2024-11-02', allPlatformGMV: 203000, activityGMV: 145000, subsidyAmount: 33600, activityFeeRatio: 23.2, activityPercentage: 71.4, allPlatformFeeRatio: 16.6 },
    { date: '2024-11-03', allPlatformGMV: 235000, activityGMV: 168000, subsidyAmount: 38900, activityFeeRatio: 23.2, activityPercentage: 71.5, allPlatformFeeRatio: 16.6 },
    { date: '2024-11-04', allPlatformGMV: 265000, activityGMV: 189000, subsidyAmount: 43800, activityFeeRatio: 23.2, activityPercentage: 71.3, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-05', allPlatformGMV: 295000, activityGMV: 210000, subsidyAmount: 48700, activityFeeRatio: 23.2, activityPercentage: 71.2, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-06', allPlatformGMV: 275000, activityGMV: 195000, subsidyAmount: 45200, activityFeeRatio: 23.2, activityPercentage: 70.9, allPlatformFeeRatio: 16.4 },
    { date: '2024-11-07', allPlatformGMV: 250000, activityGMV: 178000, subsidyAmount: 41200, activityFeeRatio: 23.1, activityPercentage: 71.2, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-08', allPlatformGMV: 220000, activityGMV: 156000, subsidyAmount: 36100, activityFeeRatio: 23.1, activityPercentage: 70.9, allPlatformFeeRatio: 16.4 },
    { date: '2024-11-09', allPlatformGMV: 200000, activityGMV: 142000, subsidyAmount: 32900, activityFeeRatio: 23.2, activityPercentage: 71.0, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-10', allPlatformGMV: 330000, activityGMV: 235000, subsidyAmount: 54500, activityFeeRatio: 23.2, activityPercentage: 71.2, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-11', allPlatformGMV: 540000, activityGMV: 385000, subsidyAmount: 89300, activityFeeRatio: 23.2, activityPercentage: 71.3, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-12', allPlatformGMV: 418000, activityGMV: 298000, subsidyAmount: 69100, activityFeeRatio: 23.2, activityPercentage: 71.3, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-13', allPlatformGMV: 302000, activityGMV: 215000, subsidyAmount: 49800, activityFeeRatio: 23.2, activityPercentage: 71.2, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-14', allPlatformGMV: 250000, activityGMV: 178000, subsidyAmount: 41200, activityFeeRatio: 23.1, activityPercentage: 71.2, allPlatformFeeRatio: 16.5 },
    { date: '2024-11-15', allPlatformGMV: 220000, activityGMV: 156000, subsidyAmount: 36100, activityFeeRatio: 23.1, activityPercentage: 70.9, allPlatformFeeRatio: 16.4 }
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
      title: '全量GMV（元）',
      dataIndex: 'allPlatformGMV',
      key: 'allPlatformGMV',
      width: 120,
      render: (value: number) => value.toLocaleString()
    },
    {
      title: '活动GMV（元）',
      dataIndex: 'activityGMV',
      key: 'activityGMV',
      width: 120,
      render: (value: number) => value.toLocaleString()
    },
    {
      title: '补贴金额（元）',
      dataIndex: 'subsidyAmount',
      key: 'subsidyAmount',
      width: 120,
      render: (value: number) => value.toLocaleString()
    },
    {
      title: '活动费比（%）',
      dataIndex: 'activityFeeRatio',
      key: 'activityFeeRatio',
      width: 110,
      render: (value: number) => `${value.toFixed(1)}%`
    },
    {
      title: '活动占比（%）',
      dataIndex: 'activityPercentage',
      key: 'activityPercentage',
      width: 110,
      render: (value: number) => `${value.toFixed(1)}%`
    },
    {
      title: '全量费比（%）',
      dataIndex: 'allPlatformFeeRatio',
      key: 'allPlatformFeeRatio',
      width: 110,
      render: (value: number) => `${value.toFixed(1)}%`
    },
    {
      title: '全量GMV月环比（%）',
      dataIndex: 'allPlatformGMVMonthOnMonth',
      key: 'allPlatformGMVMonthOnMonth',
      width: 130,
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
      title: '全量GMV年同比（%）',
      dataIndex: 'allPlatformGMVYearOnYear',
      key: 'allPlatformGMVYearOnYear',
      width: 130,
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
      title: '活动GMV月环比（%）',
      dataIndex: 'activityGMVMonthOnMonth',
      key: 'activityGMVMonthOnMonth',
      width: 130,
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
      title: '活动GMV年同比（%）',
      dataIndex: 'activityGMVYearOnYear',
      key: 'activityGMVYearOnYear',
      width: 130,
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
        case 'allPlatformGMV':
          return item.allPlatformGMV;
        case 'activityGMV':
          return item.activityGMV;
        case 'subsidyAmount':
          return item.subsidyAmount;
        case 'activityFeeRatio':
          return item.activityFeeRatio;
        case 'activityPercentage':
          return item.activityPercentage;
        case 'allPlatformFeeRatio':
          return item.allPlatformFeeRatio;
        default:
          return item.allPlatformGMV;
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
        case 'allPlatformGMV':
          return region.allPlatformGMV.toLocaleString();
        case 'activityGMV':
          return region.activityGMV.toLocaleString();
        case 'subsidyAmount':
          return region.subsidyAmount.toLocaleString();
        case 'activityFeeRatio':
          return region.activityFeeRatio.toFixed(1) + '%';
        case 'activityPercentage':
          return region.activityPercentage.toFixed(1) + '%';
        case 'allPlatformFeeRatio':
          return region.allPlatformFeeRatio.toFixed(1) + '%';
        default:
          return region.allPlatformGMV.toLocaleString();
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
                    <div>全量GMV: ${region.allPlatformGMV.toLocaleString()}</div>
                    <div>活动GMV: ${region.activityGMV.toLocaleString()}</div>
                    <div>补贴金额: ${region.subsidyAmount.toLocaleString()}</div>
                    <div>活动费比: ${region.activityFeeRatio.toFixed(1)}%</div>
                    <div>活动占比: ${region.activityPercentage.toFixed(1)}%</div>
                    <div>全量费比: ${region.allPlatformFeeRatio.toFixed(1)}%</div>
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
          const region = provinceRegions.sort((a, b) => b.allPlatformGMV - a.allPlatformGMV)[0];
          
          if (region) {
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
                <div>${metricLabels[regionSortMetric]}: ${getMetricValue(region, regionSortMetric)}</div>
                <div>全量GMV: ${region.allPlatformGMV.toLocaleString()}</div>
                <div>活动GMV: ${region.activityGMV.toLocaleString()}</div>
                <div>补贴金额: ${region.subsidyAmount.toLocaleString()}</div>
                <div>活动费比: ${region.activityFeeRatio.toFixed(1)}%</div>
                <div>活动占比: ${region.activityPercentage.toFixed(1)}%</div>
                <div>全量费比: ${region.allPlatformFeeRatio.toFixed(1)}%</div>
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
      allPlatformGMV: '全量GMV',
      activityGMV: '活动GMV',
      subsidyAmount: '补贴金额',
      activityFeeRatio: '活动费比',
      activityPercentage: '活动占比',
      allPlatformFeeRatio: '全量费比'
    };

    const metricColors: { [key: string]: string } = {
      allPlatformGMV: '#1890ff',
      activityGMV: '#52c41a',
      subsidyAmount: '#722ed1',
      activityFeeRatio: '#faad14',
      activityPercentage: '#f5222d',
      allPlatformFeeRatio: '#13c2c2'
    };

    const getYAxisFormatter = (metric: string) => {
      if (metric === 'allPlatformGMV' || metric === 'activityGMV' || metric === 'subsidyAmount') {
        return (value: number) => `${(value / 10000).toFixed(0)}万`;
      } else {
        return (value: number) => value.toFixed(1) + '%';
      }
    };

    const formatTooltipValue = (value: number, metric: string) => {
      if (metric === 'allPlatformGMV' || metric === 'activityGMV' || metric === 'subsidyAmount') {
        return value.toLocaleString();
      } else {
        return value.toFixed(1) + '%';
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
    
    // 按全量GMV排序，取Top10
    return [...filtered].sort((a, b) => b.allPlatformGMV - a.allPlatformGMV).slice(0, 10);
  };

  // 获取零售商趋势图配置
  const getRetailerTrendOption = (retailer: RetailerData | null) => {
    if (!retailer || !retailer.trendData || retailer.trendData.length === 0) {
      return {};
    }

    // 根据日期范围筛选数据
    let filteredTrendData = retailer.trendData;
    if (dateRange && dateRange[0] && dateRange[1]) {
      filteredTrendData = retailer.trendData.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isAfter(dateRange[0]!.subtract(1, 'day')) && itemDate.isBefore(dateRange[1]!.add(1, 'day'));
      });
    }

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `${params[0].name}<br/>`;
          params.forEach((param: any) => {
            if (param.seriesName === '全量GMV') {
              result += `${param.marker}${param.seriesName}: ${param.value.toLocaleString()}<br/>`;
            } else {
              result += `${param.marker}${param.seriesName}: ${param.value.toFixed(1)}%<br/>`;
            }
          });
          return result;
        }
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: filteredTrendData.map(item => item.date)
      },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          name: '全量GMV（元）',
          axisLabel: {
            formatter: (value: number) => `${(value / 10000).toFixed(0)}万`
          }
        },
        {
          type: 'value',
          position: 'right',
          name: '活动贡献率（%）',
          axisLabel: {
            formatter: (value: number) => `${value.toFixed(1)}%`
          }
        }
      ],
      series: [
        {
          name: '全量GMV',
          type: 'line',
          smooth: true,
          yAxisIndex: 0,
          data: filteredTrendData.map(item => item.allPlatformGMV),
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#1890ff80' },
                { offset: 1, color: '#1890ff10' }
              ]
            }
          }
        },
        {
          name: '活动贡献率',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: filteredTrendData.map(item => item.activityContribution),
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    };
  };

  // 打开零售商趋势图
  const handleShowRetailerTrend = (retailer: RetailerData) => {
    setSelectedRetailer(retailer);
    setRetailerTrendVisible(true);
  };

  // 处理日期类型变更
  const handleDateTypeChange = (e: any) => {
    setDateType(e.target.value);
    // 根据日期类型设置默认日期范围
    switch(e.target.value) {
      case 'day':
        setDateRange([dayjs(), dayjs()]);
        break;
      case 'month':
        setDateRange([dayjs().startOf('month'), dayjs().endOf('month')]);
        break;
      case 'year':
        setDateRange([dayjs().startOf('year'), dayjs().endOf('year')]);
        break;
      case 'custom':
        // 自定义模式不自动设置日期范围
        break;
      default:
        break;
    }
  };

  // 处理日期范围变更
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setDateRange(dates);
  };

  // 获取排序值（用于排序函数）
  const getSortValue = (item: RegionData, metric: string): number => {
    switch (metric) {
      case 'allPlatformGMV':
        return item.allPlatformGMV;
      case 'activityGMV':
        return item.activityGMV;
      case 'subsidyAmount':
        return item.subsidyAmount;
      case 'activityFeeRatio':
        return item.activityFeeRatio;
      case 'activityPercentage':
        return item.activityPercentage;
      case 'allPlatformFeeRatio':
        return item.allPlatformFeeRatio;
      default:
        return item.allPlatformGMV;
    }
  };

  return (
    <div className="activity-analysis-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>全量分析</Title>
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
        <Row gutter={32} align="middle">
          <Col span={8}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
              <Radio.Group value={dateType} onChange={handleDateTypeChange} style={{ marginRight: 16, flexShrink: 0 }}>
                <Radio.Button value="day">日</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="year">年</Radio.Button>
                <Radio.Button value="custom">自定义</Radio.Button>
              </Radio.Group>
              <RangePicker 
                value={dateRange} 
                onChange={handleDateRangeChange} 
                style={{ minWidth: '240px', flexShrink: 0 }}
                format="YYYY-MM-DD"
              />
            </div>
          </Col>
          <Col span={16} style={{ paddingLeft: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <Radio.Group value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} buttonStyle="solid">
              <Radio.Button value="美团闪购">美团闪购</Radio.Button>
              <Radio.Button value="淘宝闪购">淘宝闪购</Radio.Button>
              <Radio.Button value="京东到家">京东到家</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
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
          {/* 全量GMV */}
          <Col style={{ width: 'calc(16.67% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>全量GMV（元）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.allPlatformGMV}
              precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
            />
              {renderComparison(coreMetrics.allPlatformGMVMonthOnMonth, coreMetrics.allPlatformGMVYearOnYear)}
          </Card>
        </Col>

          {/* 活动GMV */}
          <Col style={{ width: 'calc(16.67% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>活动GMV（元）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.activityGMV}
              precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
            />
              {renderComparison(coreMetrics.activityGMVMonthOnMonth, coreMetrics.activityGMVYearOnYear)}
          </Card>
        </Col>

          {/* 补贴金额 */}
          <Col style={{ width: 'calc(16.67% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>补贴金额（元）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.subsidyAmount}
              precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
            />
              {renderComparison(coreMetrics.subsidyAmountMonthOnMonth, coreMetrics.subsidyAmountYearOnYear)}
          </Card>
        </Col>

          {/* 活动费比 */}
          <Col style={{ width: 'calc(16.67% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>活动费比（%）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.activityFeeRatio}
                precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              {renderComparison(coreMetrics.activityFeeRatioMonthOnMonth, coreMetrics.activityFeeRatioYearOnYear)}
          </Card>
        </Col>

          {/* 活动占比 */}
          <Col style={{ width: 'calc(16.67% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>活动占比（%）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.activityPercentage}
                precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              {renderComparison(coreMetrics.activityPercentageMonthOnMonth, coreMetrics.activityPercentageYearOnYear)}
          </Card>
        </Col>

          {/* 全量费比 */}
          <Col style={{ width: 'calc(16.67% - 8px)' }}>
          <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>全量费比（%）</span>
                <AntTooltip 
                  title="该数据仅供参考，不作为最终结算依据"
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
            <Statistic
                title=""
                value={coreMetrics.allPlatformFeeRatio}
              precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              {renderComparison(coreMetrics.allPlatformFeeRatioMonthOnMonth, coreMetrics.allPlatformFeeRatioYearOnYear)}
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
              { key: 'allPlatformGMV', label: '全量GMV', color: '#1890ff' },
              { key: 'activityGMV', label: '活动GMV', color: '#52c41a' },
              { key: 'subsidyAmount', label: '补贴金额', color: '#722ed1' },
              { key: 'activityFeeRatio', label: '活动费比', color: '#faad14' },
              { key: 'activityPercentage', label: '活动占比', color: '#f5222d' },
              { key: 'allPlatformFeeRatio', label: '全量费比', color: '#13c2c2' }
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
                <Option value="allPlatformGMV" disabled={selectedMetric === 'allPlatformGMV'}>全量GMV</Option>
                <Option value="activityGMV" disabled={selectedMetric === 'activityGMV'}>活动GMV</Option>
                <Option value="subsidyAmount" disabled={selectedMetric === 'subsidyAmount'}>补贴金额</Option>
                <Option value="activityFeeRatio" disabled={selectedMetric === 'activityFeeRatio'}>活动费比</Option>
                <Option value="activityPercentage" disabled={selectedMetric === 'activityPercentage'}>活动占比</Option>
                <Option value="allPlatformFeeRatio" disabled={selectedMetric === 'allPlatformFeeRatio'}>全量费比</Option>
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
                <Option value="allPlatformGMV">全量GMV</Option>
                <Option value="activityGMV">活动GMV</Option>
                <Option value="subsidyAmount">补贴金额</Option>
                <Option value="activityFeeRatio">活动费比</Option>
                <Option value="activityPercentage">活动占比</Option>
                <Option value="allPlatformFeeRatio">全量费比</Option>
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
              title: '全量GMV（元）',
              dataIndex: 'allPlatformGMV',
              key: 'allPlatformGMV',
              width: 120,
              align: 'right',
              render: (value: number) => value.toLocaleString()
            },
            {
              title: '活动GMV（元）',
              dataIndex: 'activityGMV',
              key: 'activityGMV',
              width: 120,
              align: 'right',
              render: (value: number) => value.toLocaleString()
            },
            {
              title: '补贴金额（元）',
              dataIndex: 'subsidyAmount',
              key: 'subsidyAmount',
              width: 120,
              align: 'right',
              render: (value: number) => value.toLocaleString()
            },
            {
              title: '活动贡献（%）',
              dataIndex: 'activityContribution',
              key: 'activityContribution',
              width: 120,
              align: 'right',
              render: (value: number) => `${value.toFixed(1)}%`
            },
            {
              title: '操作',
              key: 'action',
              width: 100,
              fixed: 'right' as const,
              render: (_: any, record: RetailerData) => (
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => handleShowRetailerTrend(record)}
                >
                  趋势
                </Button>
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
        
        {/* 零售商趋势图Modal */}
        <Modal
          title={selectedRetailer ? `${selectedRetailer.retailerName} - 趋势分析` : '趋势分析'}
          open={retailerTrendVisible}
          onCancel={() => setRetailerTrendVisible(false)}
          footer={null}
          width={800}
        >
          {selectedRetailer && (
            <ReactECharts
              option={getRetailerTrendOption(selectedRetailer)}
              style={{ height: '400px' }}
            />
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default AllAnalysis;
