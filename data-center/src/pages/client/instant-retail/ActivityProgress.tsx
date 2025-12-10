import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, DatePicker, Select, Typography, Row, Col, Progress, Button, Drawer, Checkbox, Space, Radio, Modal, Tag } from 'antd';
import { SettingOutlined, MenuOutlined, LockOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface ActivityData {
  id: string;
  planName: string; // 方案名称
  activityName: string; // 活动名称
  mechanismName: string; // 机制名称
  onlineDate: string; // 在线日期
  budget: number; // 预算
  budgetConsumption: number; // 预算消耗
  consumptionProgress: number; // 消耗进度（百分比）
  status: string; // 状态
  discountStrength: string; // 优惠力度
  channel: string; // 渠道
  subsidyThreshold: number; // 补贴门槛
  wallsContribution: number; // 和路雪出资
  subsidyAmount?: number; // 补贴金额
  discountRate: number; // 折扣力度（百分比）
  region?: string; // 区域（用于筛选）
  upc: number; // UPC
  remarks?: string; // 备注
  couponId?: string; // 券ID
  platform: string; // 平台（用于筛选）
  totalDays?: number; // 活动总天数
  remainingDays?: number; // 剩余活动天数
  activityProgress?: number; // 活动进度（百分比）
  salesAmount?: number; // 活动销售金额
  activityBudget?: number; // 活动预算（未税）
  usedBudget?: number; // 已使用预算（未税）
  remainingBudget?: number; // 剩余预算
  usedBudgetRatio?: number; // 已使用预算占比（百分比）
  costRatio?: number; // 活动费比（百分比）
  dailyConsumption?: number; // 日消耗
}

// 列配置接口
interface ColumnConfig {
  key: string;
  title: string;
  visible: boolean;
  order: number;
}

const ActivityProgress: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('美团闪购');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [columnConfigVisible, setColumnConfigVisible] = useState(false);
  // 付费开通状态
  const [customFilterEnabled, setCustomFilterEnabled] = useState<boolean>(false); // 自定义筛选（默认未开通）
  const [platformMetricsEnabled, setPlatformMetricsEnabled] = useState<boolean>(false); // 全平台GMV和ROI（默认未开通）
  // 方案汇总Drawer
  const [planSummaryVisible, setPlanSummaryVisible] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('');
  
  // 定义所有可配置的列（除了固定的三个：方案名称、活动名称、机制名称）
  const allConfigurableColumns: ColumnConfig[] = [
    { key: 'onlineDate', title: '在线日期', visible: true, order: 1 },
    { key: 'budget', title: '预算', visible: true, order: 2 },
    { key: 'budgetConsumption', title: '预算消耗', visible: true, order: 3 },
    { key: 'consumptionProgress', title: '消耗进度', visible: true, order: 4 },
    { key: 'status', title: '状态', visible: true, order: 5 },
    { key: 'discountStrength', title: '优惠力度', visible: true, order: 6 },
    { key: 'channel', title: '渠道', visible: true, order: 7 },
    { key: 'subsidyThreshold', title: '补贴门槛', visible: true, order: 8 },
    { key: 'subsidyAmount', title: '补贴金额', visible: true, order: 9 },
    { key: 'wallsContribution', title: '出资', visible: true, order: 10 },
    { key: 'discountRate', title: '折扣力度', visible: true, order: 11 },
    { key: 'upc', title: 'UPC', visible: true, order: 12 },
    { key: 'remarks', title: '备注', visible: true, order: 13 },
    { key: 'couponId', title: '券ID', visible: true, order: 14 },
    { key: 'totalDays', title: '活动总天数', visible: false, order: 15 },
    { key: 'remainingDays', title: '剩余活动天数', visible: false, order: 16 },
    { key: 'activityProgress', title: '活动进度', visible: false, order: 17 },
    { key: 'salesAmount', title: '活动销售金额', visible: false, order: 18 },
    { key: 'activityBudget', title: '活动预算（未税）', visible: false, order: 19 },
    { key: 'usedBudget', title: '已使用预算（未税）', visible: false, order: 20 },
    { key: 'remainingBudget', title: '剩余预算', visible: false, order: 21 },
    { key: 'usedBudgetRatio', title: '已使用预算占比', visible: false, order: 22 },
    { key: 'costRatio', title: '活动费比', visible: false, order: 23 },
    { key: 'dailyConsumption', title: '日消耗', visible: false, order: 24 }
  ];

  // 从localStorage加载列配置，并合并新增字段
  const loadColumnConfig = (): ColumnConfig[] => {
    const saved = localStorage.getItem('activityProgress_columnConfig');
    if (saved) {
      try {
        const savedConfigs: ColumnConfig[] = JSON.parse(saved);
        // 创建已保存配置的key映射
        const savedConfigMap = new Map(savedConfigs.map(config => [config.key, config]));
        
        // 合并配置：按照 allConfigurableColumns 的顺序，保留用户的 visible 设置，重新分配 order
        const mergedConfigs: ColumnConfig[] = allConfigurableColumns.map((defaultConfig, index) => {
          const savedConfig = savedConfigMap.get(defaultConfig.key);
          if (savedConfig) {
            // 如果已存在，保留用户的 visible 设置，但使用新的 order（按照 allConfigurableColumns 的顺序）
            return {
              ...savedConfig,
              order: index + 1,
              title: defaultConfig.title // 确保标题是最新的
            };
          } else {
            // 如果是新字段，使用默认配置
            return {
              ...defaultConfig,
              order: index + 1
            };
          }
        });
        
        return mergedConfigs;
      } catch (e) {
        return allConfigurableColumns;
      }
    }
    return allConfigurableColumns;
  };

  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(loadColumnConfig);

  // 在组件挂载时检查并更新配置，确保新字段被添加
  useEffect(() => {
    const currentKeys = new Set(columnConfigs.map(c => c.key));
    const allKeys = new Set(allConfigurableColumns.map(c => c.key));
    
    // 如果有新字段缺失，合并配置
    const hasNewFields = Array.from(allKeys).some(key => !currentKeys.has(key));
    if (hasNewFields) {
      const savedConfigMap = new Map(columnConfigs.map(config => [config.key, config]));
      
      // 按照 allConfigurableColumns 的顺序合并配置
      const mergedConfigs: ColumnConfig[] = allConfigurableColumns.map((defaultConfig, index) => {
        const savedConfig = savedConfigMap.get(defaultConfig.key);
        if (savedConfig) {
          return {
            ...savedConfig,
            order: index + 1,
            title: defaultConfig.title
          };
        } else {
          return {
            ...defaultConfig,
            order: index + 1
          };
        }
      });
      
      setColumnConfigs(mergedConfigs);
    }
  }, []); // 只在组件挂载时执行一次

  // 保存列配置到localStorage
  useEffect(() => {
    localStorage.setItem('activityProgress_columnConfig', JSON.stringify(columnConfigs));
  }, [columnConfigs]);

  // 模拟数据
  const [allActivities] = useState<ActivityData[]>([
    {
      id: '1',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '通用神券129减30',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4726,
      consumptionProgress: 95,
      status: '冻结中',
      discountStrength: '129-30',
      channel: '全渠道',
      subsidyThreshold: 129,
      wallsContribution: 30,
      subsidyAmount: 4726,
      discountRate: 77,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购',
      region: '华东',
      totalDays: 31,
      remainingDays: 5,
      activityProgress: 84,
      salesAmount: 152468.50,
      activityBudget: 50000.00,
      usedBudget: 47260.00,
      remainingBudget: 2740.00,
      usedBudgetRatio: 94.52,
      costRatio: 30.99,
      dailyConsumption: 1524.52
    },
    {
      id: '2',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '通用神券79减20',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4491,
      consumptionProgress: 90,
      status: '冻结中',
      discountStrength: '79-20',
      channel: '全渠道',
      subsidyThreshold: 79,
      wallsContribution: 20,
      discountRate: 75,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购',
      totalDays: 31,
      remainingDays: 5,
      activityProgress: 84,
      salesAmount: 179640.00,
      activityBudget: 50000.00,
      usedBudget: 44910.00,
      remainingBudget: 5090.00,
      usedBudgetRatio: 89.82,
      costRatio: 25.00,
      dailyConsumption: 1448.71
    },
    {
      id: '3',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '通用神券159减40',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4513,
      consumptionProgress: 90,
      status: '冻结中',
      discountStrength: '159-40',
      channel: '全渠道',
      subsidyThreshold: 159,
      wallsContribution: 40,
      discountRate: 75,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购',
      totalDays: 31,
      remainingDays: 5,
      activityProgress: 84,
      salesAmount: 180520.00,
      activityBudget: 50000.00,
      usedBudget: 45130.00,
      remainingBudget: 4870.00,
      usedBudgetRatio: 90.26,
      costRatio: 25.00,
      dailyConsumption: 1455.81
    },
    {
      id: '4',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '周末补货神券99减25',
      onlineDate: '10.10-10.31\n周五六日',
      budget: 5000,
      budgetConsumption: 5359,
      consumptionProgress: 107,
      status: '冻结中',
      discountStrength: '99-25',
      channel: '全渠道',
      subsidyThreshold: 99,
      wallsContribution: 25,
      discountRate: 75,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '5',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '通用神券39减8',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4487,
      consumptionProgress: 90,
      status: '冻结中',
      discountStrength: '39-8',
      channel: '全渠道',
      subsidyThreshold: 39,
      wallsContribution: 8,
      discountRate: 79,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '6',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '王牌券88减15',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4528,
      consumptionProgress: 91,
      status: '冻结中',
      discountStrength: '88-15',
      channel: '全渠道',
      subsidyThreshold: 88,
      wallsContribution: 15,
      discountRate: 83,
      upc: 1,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '7',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '通用神券59减15',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4530,
      consumptionProgress: 91,
      status: '冻结中',
      discountStrength: '59-15',
      channel: '全渠道',
      subsidyThreshold: 59,
      wallsContribution: 15,
      discountRate: 75,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '8',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '木食新客券满25减10【休食】',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4660,
      consumptionProgress: 93,
      status: '冻结中',
      discountStrength: '25-10',
      channel: '全渠道',
      subsidyThreshold: 25,
      wallsContribution: 10,
      discountRate: 60,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '9',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '新客券-满20减6',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4603,
      consumptionProgress: 92,
      status: '冻结中',
      discountStrength: '20-6',
      channel: '全渠道',
      subsidyThreshold: 20,
      wallsContribution: 6,
      discountRate: 70,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '10',
      planName: '2025年9月万店满减神券方案 67903619',
      activityName: '9月万店满减神券',
      mechanismName: '通用神券99减25',
      onlineDate: '9.1-9.30',
      budget: 5000,
      budgetConsumption: 4850,
      consumptionProgress: 97,
      status: '冻结中',
      discountStrength: '99-25',
      channel: '全渠道',
      subsidyThreshold: 99,
      wallsContribution: 25,
      discountRate: 75,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '11',
      planName: '2025年9月万店满减神券方案 67903619',
      activityName: '9月万店满减神券',
      mechanismName: '通用神券149减35',
      onlineDate: '9.1-9.30',
      budget: 5000,
      budgetConsumption: 4920,
      consumptionProgress: 98,
      status: '冻结中',
      discountStrength: '149-35',
      channel: '全渠道',
      subsidyThreshold: 149,
      wallsContribution: 35,
      discountRate: 77,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '12',
      planName: '2025年11月双十一大促方案 67903621',
      activityName: '11月双十一大促',
      mechanismName: '双十一专享券199减50',
      onlineDate: '11.1-11.11',
      budget: 8000,
      budgetConsumption: 1250,
      consumptionProgress: 16,
      status: '进行中',
      discountStrength: '199-50',
      channel: '全渠道',
      subsidyThreshold: 199,
      wallsContribution: 50,
      discountRate: 75,
      upc: 3,
      remarks: '双十一活动',
      couponId: 'COUPON20251101',
      platform: '美团闪购'
    },
    {
      id: '13',
      planName: '2025年11月双十一大促方案 67903621',
      activityName: '11月双十一大促',
      mechanismName: '双十一专享券299减80',
      onlineDate: '11.1-11.11',
      budget: 8000,
      budgetConsumption: 1380,
      consumptionProgress: 17,
      status: '进行中',
      discountStrength: '299-80',
      channel: '全渠道',
      subsidyThreshold: 299,
      wallsContribution: 80,
      discountRate: 73,
      upc: 3,
      remarks: '双十一活动',
      couponId: 'COUPON20251102',
      platform: '美团闪购'
    },
    {
      id: '14',
      planName: '2025年11月双十一大促方案 67903621',
      activityName: '11月双十一大促',
      mechanismName: '双十一专享券399减120',
      onlineDate: '11.1-11.11',
      budget: 8000,
      budgetConsumption: 1520,
      consumptionProgress: 19,
      status: '进行中',
      discountStrength: '399-120',
      channel: '全渠道',
      subsidyThreshold: 399,
      wallsContribution: 120,
      discountRate: 70,
      upc: 3,
      remarks: '双十一活动',
      couponId: 'COUPON20251103',
      platform: '美团闪购'
    },
    {
      id: '15',
      planName: '2025年10月淘宝闪购方案 67903622',
      activityName: '10月淘宝闪购活动',
      mechanismName: '淘宝专享券99减20',
      onlineDate: '10.1-10.31',
      budget: 6000,
      budgetConsumption: 5680,
      consumptionProgress: 95,
      status: '冻结中',
      discountStrength: '99-20',
      channel: '淘宝',
      subsidyThreshold: 99,
      wallsContribution: 20,
      discountRate: 80,
      upc: 2,
      remarks: '',
      couponId: 'TB20251001',
      platform: '淘宝闪购'
    },
    {
      id: '16',
      planName: '2025年10月淘宝闪购方案 67903622',
      activityName: '10月淘宝闪购活动',
      mechanismName: '淘宝专享券159减35',
      onlineDate: '10.1-10.31',
      budget: 6000,
      budgetConsumption: 5720,
      consumptionProgress: 95,
      status: '冻结中',
      discountStrength: '159-35',
      channel: '淘宝',
      subsidyThreshold: 159,
      wallsContribution: 35,
      discountRate: 78,
      upc: 2,
      remarks: '',
      couponId: 'TB20251002',
      platform: '淘宝闪购'
    },
    {
      id: '17',
      planName: '2025年10月淘宝闪购方案 67903622',
      activityName: '10月淘宝闪购活动',
      mechanismName: '淘宝新客专享券49减10',
      onlineDate: '10.1-10.31',
      budget: 6000,
      budgetConsumption: 5850,
      consumptionProgress: 98,
      status: '冻结中',
      discountStrength: '49-10',
      channel: '淘宝',
      subsidyThreshold: 49,
      wallsContribution: 10,
      discountRate: 80,
      upc: 2,
      remarks: '新客专享',
      couponId: 'TB20251003',
      platform: '淘宝闪购'
    },
    {
      id: '18',
      planName: '2025年11月京东到家方案 67903623',
      activityName: '11月京东到家活动',
      mechanismName: '京东专享券119减25',
      onlineDate: '11.1-11.30',
      budget: 7000,
      budgetConsumption: 850,
      consumptionProgress: 12,
      status: '进行中',
      discountStrength: '119-25',
      channel: '京东',
      subsidyThreshold: 119,
      wallsContribution: 25,
      discountRate: 79,
      upc: 2,
      remarks: '',
      couponId: 'JD20251101',
      platform: '京东到家'
    },
    {
      id: '19',
      planName: '2025年11月京东到家方案 67903623',
      activityName: '11月京东到家活动',
      mechanismName: '京东专享券179减40',
      onlineDate: '11.1-11.30',
      budget: 7000,
      budgetConsumption: 920,
      consumptionProgress: 13,
      status: '进行中',
      discountStrength: '179-40',
      channel: '京东',
      subsidyThreshold: 179,
      wallsContribution: 40,
      discountRate: 78,
      upc: 2,
      remarks: '',
      couponId: 'JD20251102',
      platform: '京东到家'
    },
    {
      id: '20',
      planName: '2025年11月京东到家方案 67903623',
      activityName: '11月京东到家活动',
      mechanismName: '京东PLUS会员专享券89减18',
      onlineDate: '11.1-11.30',
      budget: 7000,
      budgetConsumption: 1050,
      consumptionProgress: 15,
      status: '进行中',
      discountStrength: '89-18',
      channel: '京东',
      subsidyThreshold: 89,
      wallsContribution: 18,
      discountRate: 80,
      upc: 1,
      remarks: 'PLUS会员专享',
      couponId: 'JD20251103',
      platform: '京东到家'
    },
    {
      id: '21',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '通用神券199减45',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4780,
      consumptionProgress: 96,
      status: '冻结中',
      discountStrength: '199-45',
      channel: '全渠道',
      subsidyThreshold: 199,
      wallsContribution: 45,
      discountRate: 77,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '22',
      planName: '2025年10月万店满减神券方案 67903620',
      activityName: '10月万店满减神券',
      mechanismName: '通用神券119减28',
      onlineDate: '10.1-10.31',
      budget: 5000,
      budgetConsumption: 4650,
      consumptionProgress: 93,
      status: '冻结中',
      discountStrength: '119-28',
      channel: '全渠道',
      subsidyThreshold: 119,
      wallsContribution: 28,
      discountRate: 76,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '23',
      planName: '2025年9月万店满减神券方案 67903619',
      activityName: '9月万店满减神券',
      mechanismName: '通用神券69减18',
      onlineDate: '9.1-9.30',
      budget: 5000,
      budgetConsumption: 4980,
      consumptionProgress: 100,
      status: '已结束',
      discountStrength: '69-18',
      channel: '全渠道',
      subsidyThreshold: 69,
      wallsContribution: 18,
      discountRate: 74,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '24',
      planName: '2025年9月万店满减神券方案 67903619',
      activityName: '9月万店满减神券',
      mechanismName: '通用神券49减12',
      onlineDate: '9.1-9.30',
      budget: 5000,
      budgetConsumption: 5010,
      consumptionProgress: 100,
      status: '已结束',
      discountStrength: '49-12',
      channel: '全渠道',
      subsidyThreshold: 49,
      wallsContribution: 12,
      discountRate: 76,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购'
    },
    {
      id: '25',
      planName: '2025年11月双十一大促方案 67903621',
      activityName: '11月双十一大促',
      mechanismName: '双十一专享券149减40',
      onlineDate: '11.1-11.11',
      budget: 8000,
      budgetConsumption: 1100,
      consumptionProgress: 14,
      status: '进行中',
      discountStrength: '149-40',
      channel: '全渠道',
      subsidyThreshold: 149,
      wallsContribution: 40,
      discountRate: 73,
      upc: 3,
      remarks: '双十一活动',
      couponId: 'COUPON20251104',
      platform: '美团闪购'
    },
    {
      id: '26',
      planName: '2025年12月万店满减神券方案 67903624',
      activityName: '12月万店满减神券',
      mechanismName: '通用神券129减30',
      onlineDate: '12.1-12.31',
      budget: 5000,
      budgetConsumption: 1200,
      consumptionProgress: 24,
      status: '进行中',
      discountStrength: '129-30',
      channel: '全渠道',
      subsidyThreshold: 129,
      wallsContribution: 30,
      subsidyAmount: 1200,
      discountRate: 77,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购',
      region: '华东',
      totalDays: 31,
      remainingDays: 25,
      activityProgress: 6,
      salesAmount: 52173.91,
      activityBudget: 50000.00,
      usedBudget: 12000.00,
      remainingBudget: 38000.00,
      usedBudgetRatio: 24.00,
      costRatio: 23.00,
      dailyConsumption: 480.00
    },
    {
      id: '27',
      planName: '2025年12月万店满减神券方案 67903624',
      activityName: '12月万店满减神券',
      mechanismName: '通用神券79减20',
      onlineDate: '12.1-12.31',
      budget: 5000,
      budgetConsumption: 1150,
      consumptionProgress: 23,
      status: '进行中',
      discountStrength: '79-20',
      channel: '全渠道',
      subsidyThreshold: 79,
      wallsContribution: 20,
      subsidyAmount: 1150,
      discountRate: 75,
      upc: 2,
      remarks: '',
      couponId: '',
      platform: '美团闪购',
      region: '华南',
      totalDays: 31,
      remainingDays: 25,
      activityProgress: 6,
      salesAmount: 46000.00,
      activityBudget: 50000.00,
      usedBudget: 11500.00,
      remainingBudget: 38500.00,
      usedBudgetRatio: 23.00,
      costRatio: 25.00,
      dailyConsumption: 460.00
    },
    {
      id: '28',
      planName: '2025年12月双十二大促方案 67903625',
      activityName: '12月双十二大促',
      mechanismName: '双十二专享券199减50',
      onlineDate: '12.1-12.12',
      budget: 8000,
      budgetConsumption: 2100,
      consumptionProgress: 26,
      status: '进行中',
      discountStrength: '199-50',
      channel: '全渠道',
      subsidyThreshold: 199,
      wallsContribution: 50,
      subsidyAmount: 2100,
      discountRate: 75,
      upc: 3,
      remarks: '双十二活动',
      couponId: 'COUPON20251201',
      platform: '美团闪购',
      region: '华北',
      totalDays: 12,
      remainingDays: 6,
      activityProgress: 50,
      salesAmount: 84000.00,
      activityBudget: 80000.00,
      usedBudget: 21000.00,
      remainingBudget: 59000.00,
      usedBudgetRatio: 26.25,
      costRatio: 25.00,
      dailyConsumption: 1750.00
    },
    {
      id: '29',
      planName: '2025年12月双十二大促方案 67903625',
      activityName: '12月双十二大促',
      mechanismName: '双十二专享券299减80',
      onlineDate: '12.1-12.12',
      budget: 8000,
      budgetConsumption: 1980,
      consumptionProgress: 25,
      status: '进行中',
      discountStrength: '299-80',
      channel: '全渠道',
      subsidyThreshold: 299,
      wallsContribution: 80,
      subsidyAmount: 1980,
      discountRate: 73,
      upc: 3,
      remarks: '双十二活动',
      couponId: 'COUPON20251202',
      platform: '美团闪购',
      region: '华中',
      totalDays: 12,
      remainingDays: 6,
      activityProgress: 50,
      salesAmount: 73259.26,
      activityBudget: 80000.00,
      usedBudget: 19800.00,
      remainingBudget: 60200.00,
      usedBudgetRatio: 24.75,
      costRatio: 27.02,
      dailyConsumption: 1650.00
    },
    {
      id: '30',
      planName: '2025年12月淘宝闪购方案 67903626',
      activityName: '12月淘宝闪购活动',
      mechanismName: '淘宝专享券99减20',
      onlineDate: '12.1-12.31',
      budget: 6000,
      budgetConsumption: 1450,
      consumptionProgress: 24,
      status: '进行中',
      discountStrength: '99-20',
      channel: '淘宝',
      subsidyThreshold: 99,
      wallsContribution: 20,
      subsidyAmount: 1450,
      discountRate: 80,
      upc: 2,
      remarks: '',
      couponId: 'TB20251201',
      platform: '淘宝闪购',
      region: '华东',
      totalDays: 31,
      remainingDays: 25,
      activityProgress: 6,
      salesAmount: 72500.00,
      activityBudget: 60000.00,
      usedBudget: 14500.00,
      remainingBudget: 45500.00,
      usedBudgetRatio: 24.17,
      costRatio: 20.00,
      dailyConsumption: 580.00
    },
    {
      id: '31',
      planName: '2025年12月京东到家方案 67903627',
      activityName: '12月京东到家活动',
      mechanismName: '京东专享券119减25',
      onlineDate: '12.1-12.31',
      budget: 7000,
      budgetConsumption: 1680,
      consumptionProgress: 24,
      status: '进行中',
      discountStrength: '119-25',
      channel: '京东',
      subsidyThreshold: 119,
      wallsContribution: 25,
      subsidyAmount: 1680,
      discountRate: 79,
      upc: 2,
      remarks: '',
      couponId: 'JD20251201',
      platform: '京东到家',
      region: '西南',
      totalDays: 31,
      remainingDays: 25,
      activityProgress: 6,
      salesAmount: 80000.00,
      activityBudget: 70000.00,
      usedBudget: 16800.00,
      remainingBudget: 53200.00,
      usedBudgetRatio: 24.00,
      costRatio: 21.00,
      dailyConsumption: 672.00
    }
  ]);

  // 根据筛选条件过滤数据
  const filteredActivities = useMemo(() => {
    return allActivities.filter(activity => {
      // 平台筛选
      if (selectedPlatform && activity.platform !== selectedPlatform) {
        return false;
      }
      
      // 自定义筛选（支持多选）- 需要付费开通
      if (customFilterEnabled && selectedRegions && selectedRegions.length > 0 && activity.region && !selectedRegions.includes(activity.region)) {
        return false;
      }
      
      // 月份筛选：检查在线日期是否在选中的月份范围内
      const onlineDateParts = activity.onlineDate.split('-');
      if (onlineDateParts.length >= 2) {
        const startDateStr = onlineDateParts[0].trim();
        const endDateStr = onlineDateParts[1].split('\n')[0].trim();
        
        // 解析日期（格式：10.1 或 10.10）
        const [month, day] = startDateStr.split('.');
        const year = selectedMonth.year();
        const activityStart = dayjs(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        
        const [endMonth, endDay] = endDateStr.split('.');
        const activityEnd = dayjs(`${year}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`);
        
        const selectedMonthStart = selectedMonth.startOf('month');
        const selectedMonthEnd = selectedMonth.endOf('month');
        
        // 活动与选中月份有交集
        return activityStart.isBefore(selectedMonthEnd) && activityEnd.isAfter(selectedMonthStart);
      }
      
      return true;
    });
  }, [allActivities, selectedPlatform, selectedMonth, selectedRegions]);

  // 计算汇总数据
  const summaryData = useMemo(() => {
    const totalBudget = filteredActivities.reduce((sum, item) => sum + item.budget, 0);
    const totalUsedBudget = filteredActivities.reduce((sum, item) => sum + item.budgetConsumption, 0);
    const totalRemainingBudget = totalBudget - totalUsedBudget;
    const totalSalesAmount = filteredActivities.reduce((sum, item) => {
      // 优先使用salesAmount，如果没有则根据预算消耗和折扣力度估算
      return sum + (item.salesAmount || (item.budgetConsumption / (1 - item.discountRate / 100)));
    }, 0);
    
    const usedBudgetRatio = totalBudget > 0 ? (totalUsedBudget / totalBudget) * 100 : 0;
    const remainingRatio = totalBudget > 0 ? (totalRemainingBudget / totalBudget) * 100 : 0;
    const roi = totalUsedBudget > 0 ? Math.min(totalSalesAmount / totalUsedBudget, 10) : 0;
    
    // 计算全平台GMV和ROI（所有活动，不受筛选条件影响）
    const allPlatformGMV = allActivities.reduce((sum, item) => {
      return sum + (item.salesAmount || (item.budgetConsumption / (1 - item.discountRate / 100)));
    }, 0);
    const allPlatformUsedBudget = allActivities.reduce((sum, item) => sum + item.budgetConsumption, 0);
    const allPlatformROI = allPlatformUsedBudget > 0 ? Math.min(allPlatformGMV / allPlatformUsedBudget, 10) : 0;
    
    return {
      totalBudget,
      totalUsedBudget,
      totalRemainingBudget,
      totalSalesAmount,
      usedBudgetRatio,
      remainingRatio,
      roi,
      allPlatformGMV,
      allPlatformROI
    };
  }, [filteredActivities, allActivities]);

  // 计算单元格合并信息
  const getRowSpan = (dataIndex: string, index: number) => {
    const currentValue = filteredActivities[index][dataIndex as keyof ActivityData];
    let rowSpan = 1;
    
    // 向前查找相同值
    let startIndex = index;
    while (startIndex > 0 && filteredActivities[startIndex - 1][dataIndex as keyof ActivityData] === currentValue) {
      startIndex--;
    }
    
    // 向后查找相同值
    let endIndex = index;
    while (endIndex < filteredActivities.length - 1 && filteredActivities[endIndex + 1][dataIndex as keyof ActivityData] === currentValue) {
      endIndex++;
    }
    
    // 如果当前行不是第一行，返回0（不显示）
    if (startIndex !== index) {
      return 0;
    }
    
    // 返回合并的行数
    rowSpan = endIndex - startIndex + 1;
    return rowSpan;
  };

  // 列定义映射（所有列的完整定义）
  const columnDefinitions: { [key: string]: any } = {
    onlineDate: {
      title: '在线日期',
      dataIndex: 'onlineDate',
      key: 'onlineDate',
      width: 140,
      render: (text: string) => (
        <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
      )
    },
    budget: {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 100,
      align: 'right',
      render: (value: number) => value.toLocaleString('zh-CN')
    },
    budgetConsumption: {
      title: '预算消耗',
      dataIndex: 'budgetConsumption',
      key: 'budgetConsumption',
      width: 100,
      align: 'right',
      render: (value: number) => value.toLocaleString('zh-CN')
    },
    consumptionProgress: {
      title: '消耗进度',
      dataIndex: 'consumptionProgress',
      key: 'consumptionProgress',
      width: 100,
      align: 'right',
      render: (value: number) => {
        const color = value >= 100 ? '#ff4d4f' : value >= 90 ? '#faad14' : '#262626';
        return (
          <Text style={{ color, fontSize: '13px', fontWeight: value >= 100 ? 600 : 400 }}>
            {value}%
          </Text>
        );
      }
    },
    status: {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100
    },
    discountStrength: {
      title: '优惠力度',
      dataIndex: 'discountStrength',
      key: 'discountStrength',
      width: 100
    },
    channel: {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 100
    },
    subsidyThreshold: {
      title: '补贴门槛',
      dataIndex: 'subsidyThreshold',
      key: 'subsidyThreshold',
      width: 100,
      align: 'right',
      render: (value: number) => value.toLocaleString('zh-CN')
    },
    subsidyAmount: {
      title: '补贴金额',
      dataIndex: 'subsidyAmount',
      key: 'subsidyAmount',
      width: 120,
      align: 'right',
      render: (value: number) => value ? (
        <Text>
          ¥{value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      ) : '-'
    },
    wallsContribution: {
      title: '出资',
      dataIndex: 'wallsContribution',
      key: 'wallsContribution',
      width: 120,
      align: 'right',
      render: (value: number) => value.toLocaleString('zh-CN')
    },
    discountRate: {
      title: '折扣力度',
      dataIndex: 'discountRate',
      key: 'discountRate',
      width: 100,
      align: 'right',
      render: (value: number) => `${value}%`
    },
    upc: {
      title: 'UPC',
      dataIndex: 'upc',
      key: 'upc',
      width: 80,
      align: 'right'
    },
    remarks: {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
      render: (text: string) => text || ''
    },
    couponId: {
      title: '券ID',
      dataIndex: 'couponId',
      key: 'couponId',
      width: 120,
      render: (text: string) => text || ''
    },
    totalDays: {
      title: '活动总天数',
      dataIndex: 'totalDays',
      key: 'totalDays',
      width: 120,
      align: 'right',
      render: (value: number) => value ? `${value}天` : '-'
    },
    remainingDays: {
      title: '剩余活动天数',
      dataIndex: 'remainingDays',
      key: 'remainingDays',
      width: 130,
      align: 'right',
      render: (value: number, record: ActivityData) => {
        if (!value) return '-';
        const ratio = record.totalDays ? (value / record.totalDays) * 100 : 0;
        const color = ratio <= 10 ? '#ff4d4f' : '#262626';
        return (
          <Text style={{ color, fontSize: '13px', fontWeight: ratio <= 10 ? 600 : 400 }}>
            {value}天
          </Text>
        );
      }
    },
    activityProgress: {
      title: '活动进度',
      dataIndex: 'activityProgress',
      key: 'activityProgress',
      width: 140,
      align: 'center',
      render: (value: number) => {
        if (value === undefined || value === null) return '-';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Progress 
              percent={value} 
              size="small" 
              strokeColor={value >= 90 ? '#52c41a' : value >= 50 ? '#1890ff' : '#faad14'}
              showInfo={false}
              style={{ width: '80px' }}
            />
            <Text style={{ 
              color: '#262626',
              fontSize: '13px',
              fontWeight: 400
            }}>
              {value}%
            </Text>
          </div>
        );
      }
    },
    salesAmount: {
      title: '活动销售金额',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 150,
      align: 'right',
      render: (value: number) => value ? (
        <Text style={{ fontSize: '13px', fontWeight: 500 }}>
          ¥{value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      ) : '-'
    },
    activityBudget: {
      title: '活动预算（未税）',
      dataIndex: 'activityBudget',
      key: 'activityBudget',
      width: 150,
      align: 'right',
      render: (value: number) => value ? (
        <Text>
          ¥{value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      ) : '-'
    },
    usedBudget: {
      title: '已使用预算（未税）',
      dataIndex: 'usedBudget',
      key: 'usedBudget',
      width: 150,
      align: 'right',
      render: (value: number) => value ? (
        <Text>
          ¥{value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      ) : '-'
    },
    remainingBudget: {
      title: '剩余预算',
      dataIndex: 'remainingBudget',
      key: 'remainingBudget',
      width: 130,
      align: 'right',
      render: (value: number, record: ActivityData) => {
        if (!value && value !== 0) return '-';
        const ratio = record.activityBudget ? (value / record.activityBudget) * 100 : 0;
        const color = ratio <= 10 ? '#ff4d4f' : '#262626';
        return (
          <Text style={{ color, fontSize: '13px', fontWeight: ratio <= 10 ? 600 : 400 }}>
            ¥{value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        );
      }
    },
    usedBudgetRatio: {
      title: '已使用预算占比',
      dataIndex: 'usedBudgetRatio',
      key: 'usedBudgetRatio',
      width: 150,
      align: 'right',
      render: (value: number) => {
        if (value === undefined || value === null) return '-';
        const color = value >= 80 ? '#ff4d4f' : '#262626';
        return (
          <Text style={{ color, fontSize: '13px', fontWeight: value >= 80 ? 600 : 400 }}>
            {value.toFixed(2)}%
          </Text>
        );
      }
    },
    costRatio: {
      title: '活动费比',
      dataIndex: 'costRatio',
      key: 'costRatio',
      width: 130,
      align: 'right',
      render: (value: number) => {
        if (value === undefined || value === null) return '-';
        const isWarning = value >= 20;
        return (
          <span style={{ 
            backgroundColor: isWarning ? '#fff1f0' : '#fafafa',
            color: isWarning ? '#ff4d4f' : '#262626',
            padding: '3px 8px',
            borderRadius: '3px',
            fontWeight: isWarning ? 600 : 400,
            fontSize: '13px',
            border: isWarning ? '1px solid #ffccc7' : '1px solid #f0f0f0'
          }}>
            {value.toFixed(2)}%
          </span>
        );
      }
    },
    dailyConsumption: {
      title: '日消耗',
      dataIndex: 'dailyConsumption',
      key: 'dailyConsumption',
      width: 120,
      align: 'right',
      render: (value: number) => value ? (
        <Text>
          ¥{value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      ) : '-'
    }
  };

  // 根据配置动态生成表格列
  const columns: ColumnsType<ActivityData> = useMemo(() => {
    // 固定列（方案名称、活动名称、机制名称）
    const fixedColumns: ColumnsType<ActivityData> = [
      {
        title: '方案名称',
        dataIndex: 'planName',
        key: 'planName',
        width: 200,
        fixed: 'left' as const,
        onCell: (record, index) => {
          const rowSpan = index !== undefined ? getRowSpan('planName', index) : 1;
          return {
            rowSpan: rowSpan > 0 ? rowSpan : 0
          };
        },
        render: (text: string) => (
          <Button
            type="link"
            onClick={() => {
              setSelectedPlanName(text);
              setPlanSummaryVisible(true);
            }}
            style={{ padding: 0, height: 'auto', fontWeight: 500 }}
          >
            {text}
          </Button>
        )
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        width: 150,
        fixed: 'left' as const,
        onCell: (record, index) => {
          const rowSpan = index !== undefined ? getRowSpan('activityName', index) : 1;
          return {
            rowSpan: rowSpan > 0 ? rowSpan : 0
          };
        }
      },
      {
        title: '机制名称',
        dataIndex: 'mechanismName',
        key: 'mechanismName',
        width: 180,
        fixed: 'left' as const
      }
    ];

    // 根据配置生成可配置列
    const sortedConfigs = [...columnConfigs].sort((a, b) => a.order - b.order);
    const configurableColumns = sortedConfigs
      .filter(config => config.visible)
      .map(config => columnDefinitions[config.key])
      .filter(Boolean);

    return [...fixedColumns, ...configurableColumns];
  }, [columnConfigs]);

  // 列配置处理函数
  const handleColumnToggle = (key: string) => {
    setColumnConfigs(prev => 
      prev.map(config => 
        config.key === key ? { ...config, visible: !config.visible } : config
      )
    );
  };

  const handleColumnMove = (key: string, direction: 'up' | 'down') => {
    setColumnConfigs(prev => {
      const newConfigs = [...prev];
      const index = newConfigs.findIndex(c => c.key === key);
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        [newConfigs[index], newConfigs[index - 1]] = [newConfigs[index - 1], newConfigs[index]];
      } else if (direction === 'down' && index < newConfigs.length - 1) {
        [newConfigs[index], newConfigs[index + 1]] = [newConfigs[index + 1], newConfigs[index]];
      }
      
      // 重新分配order
      return newConfigs.map((config, idx) => ({ ...config, order: idx + 1 }));
    });
  };

  // 按方案汇总
  const planSummary = useMemo(() => {
    const planMap = new Map<string, {
      planName: string;
      budget: number;
      budgetConsumption: number;
      salesAmount: number;
      subsidyAmount: number;
      activityCount: number;
    }>();
    
    filteredActivities.forEach(activity => {
      const existing = planMap.get(activity.planName);
      if (existing) {
        existing.budget += activity.budget;
        existing.budgetConsumption += activity.budgetConsumption;
        existing.salesAmount += (activity.salesAmount || (activity.budgetConsumption / (1 - activity.discountRate / 100)));
        existing.subsidyAmount += (activity.subsidyAmount || 0);
        existing.activityCount += 1;
      } else {
        planMap.set(activity.planName, {
          planName: activity.planName,
          budget: activity.budget,
          budgetConsumption: activity.budgetConsumption,
          salesAmount: (activity.salesAmount || (activity.budgetConsumption / (1 - activity.discountRate / 100))),
          subsidyAmount: (activity.subsidyAmount || 0),
          activityCount: 1
        });
      }
    });
    
    return Array.from(planMap.values());
  }, [filteredActivities]);

  return (
    <div className="activity-progress-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>活动进度</Title>
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
            <Text strong style={{ width: '60px' }}>月份：</Text>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(date) => date && setSelectedMonth(date)}
              style={{ width: 160 }}
              format="YYYY年MM月"
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

      {/* 自定义筛选 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', flex: 1 }}>
            <Text strong style={{ fontSize: '14px' }}>自定义筛选：</Text>
            {!customFilterEnabled && (
              <Tag icon={<LockOutlined />} color="orange" style={{ cursor: 'pointer' }} onClick={() => {
                Modal.info({
                  title: '开通自定义筛选',
                  content: '自定义筛选功能需要付费开通，请联系管理员开通此功能。',
                  okText: '我知道了'
                });
              }}>
                未开通
              </Tag>
            )}
            <Checkbox.Group
              value={selectedRegions}
              onChange={(checkedValues) => {
                if (customFilterEnabled) {
                  setSelectedRegions(checkedValues as string[]);
                } else {
                  Modal.info({
                    title: '开通自定义筛选',
                    content: '自定义筛选功能需要付费开通，请联系管理员开通此功能。',
                    okText: '我知道了'
                  });
                }
              }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
              disabled={!customFilterEnabled}
            >
              <Button
                type={selectedRegions.length === 7 ? 'primary' : 'default'}
                size="small"
                onClick={() => {
                  if (!customFilterEnabled) {
                    Modal.info({
                      title: '开通自定义筛选',
                      content: '自定义筛选功能需要付费开通，请联系管理员开通此功能。',
                      okText: '我知道了'
                    });
                    return;
                  }
                  const allRegions = ['华东', '华南', '华北', '华中', '西南', '西北', '东北'];
                  setSelectedRegions(selectedRegions.length === 7 ? [] : allRegions);
                }}
                disabled={!customFilterEnabled}
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
        </div>
      </Card>

      {/* 汇总信息 - 表单形式 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          {/* 左侧：预算相关信息 */}
          <Col span={14}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>活动预算(未稅)</Text>
                  <Text style={{ fontSize: '16px', color: '#262626', fontWeight: 600 }}>
                    ¥{summaryData.totalBudget.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </div>
        </Col>
              <Col span={8}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>已使用(未稅)</Text>
                  <Text style={{ fontSize: '16px', color: '#262626', fontWeight: 600 }}>
                    ¥{summaryData.totalUsedBudget.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </div>
        </Col>
              <Col span={8}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>剩余</Text>
                  <Text style={{ fontSize: '16px', color: '#262626', fontWeight: 600 }}>
                    ¥{summaryData.totalRemainingBudget.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </div>
        </Col>
              <Col span={24}>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>预算使用情况</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        已用占比：<Text style={{ color: summaryData.usedBudgetRatio > 80 ? '#ff4d4f' : '#262626', fontWeight: summaryData.usedBudgetRatio > 80 ? 600 : 400 }}>
                          {summaryData.usedBudgetRatio.toFixed(2)}%
                        </Text>
                      </Text>
                      <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        剩余占比：<Text style={{ color: '#262626' }}>
                          {summaryData.remainingRatio.toFixed(2)}%
                        </Text>
                      </Text>
                    </div>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex'
                  }}>
                    <div style={{
                      width: `${summaryData.usedBudgetRatio}%`,
                      height: '100%',
                      backgroundColor: summaryData.usedBudgetRatio > 80 ? '#ff4d4f' : '#1890ff',
                      transition: 'all 0.3s'
                    }} />
                    <div style={{
                      width: `${summaryData.remainingRatio}%`,
                      height: '100%',
                      backgroundColor: '#52c41a',
                      transition: 'all 0.3s'
                    }} />
                  </div>
                </div>
        </Col>
      </Row>
          </Col>
          
          {/* 分割线 */}
          <Col span={1} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              width: '1px', 
              height: '100%', 
              backgroundColor: '#f0f0f0',
              margin: '0 12px'
            }} />
          </Col>
          
          {/* 右侧：销售和ROI */}
          <Col span={9}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>活动GMV</Text>
                  <Text strong style={{ fontSize: '18px', color: '#262626', fontWeight: 600 }}>
                    ¥{summaryData.totalSalesAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c' }}>全平台GMV</Text>
                    {!platformMetricsEnabled && (
                      <Tag icon={<LockOutlined />} color="orange" style={{ cursor: 'pointer', fontSize: '11px' }} onClick={() => {
                        Modal.info({
                          title: '开通全平台指标',
                          content: '全平台GMV和ROI功能需要付费开通，请联系管理员开通此功能。',
                          okText: '我知道了'
                        });
                      }}>
                        未开通
                      </Tag>
                    )}
                  </div>
                  {platformMetricsEnabled ? (
                    <Text strong style={{ fontSize: '18px', color: '#262626', fontWeight: 600 }}>
                      ¥{summaryData.allPlatformGMV.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  ) : (
                    <Text type="secondary" style={{ fontSize: '14px' }}>--</Text>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>活动ROI</Text>
                  <Text strong style={{ fontSize: '24px', color: '#262626', fontWeight: 600 }}>
                    {summaryData.roi.toFixed(1)}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c' }}>全平台ROI</Text>
                    {!platformMetricsEnabled && (
                      <Tag icon={<LockOutlined />} color="orange" style={{ cursor: 'pointer', fontSize: '11px' }} onClick={() => {
                        Modal.info({
                          title: '开通全平台指标',
                          content: '全平台GMV和ROI功能需要付费开通，请联系管理员开通此功能。',
                          okText: '我知道了'
                        });
                      }}>
                        未开通
                      </Tag>
                    )}
                  </div>
                  {platformMetricsEnabled ? (
                    <Text strong style={{ fontSize: '24px', color: '#262626', fontWeight: 600 }}>
                      {summaryData.allPlatformROI.toFixed(1)}
                    </Text>
                  ) : (
                    <Text type="secondary" style={{ fontSize: '14px' }}>--</Text>
                  )}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>


      {/* 活动表格 */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>活动进度列表</span>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setColumnConfigVisible(true)}
            >
              列设置
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredActivities}
          rowKey="id"
          pagination={false}
          bordered
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 列配置抽屉 */}
      <Drawer
        title="列设置"
        placement="right"
        onClose={() => setColumnConfigVisible(false)}
        open={columnConfigVisible}
        width={400}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Text type="secondary" style={{ marginBottom: 8 }}>
            拖拽调整顺序，勾选控制显示/隐藏
          </Text>
          {columnConfigs
            .sort((a, b) => a.order - b.order)
            .map((config, index) => (
              <div
                key={config.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  backgroundColor: '#fafafa'
                }}
              >
                <MenuOutlined style={{ color: '#8c8c8c', cursor: 'move' }} />
                <Checkbox
                  checked={config.visible}
                  onChange={() => handleColumnToggle(config.key)}
                >
                  {config.title}
                </Checkbox>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <Button
                    size="small"
                    disabled={index === 0}
                    onClick={() => handleColumnMove(config.key, 'up')}
                  >
                    上移
                  </Button>
                  <Button
                    size="small"
                    disabled={index === columnConfigs.length - 1}
                    onClick={() => handleColumnMove(config.key, 'down')}
                  >
                    下移
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </Drawer>

      {/* 方案汇总抽屉 */}
      <Drawer
        title={`方案汇总 - ${selectedPlanName}`}
        placement="right"
        onClose={() => {
          setPlanSummaryVisible(false);
          setSelectedPlanName('');
        }}
        open={planSummaryVisible}
        width={600}
      >
        {(() => {
          const selectedPlanSummary = planSummary.find(p => p.planName === selectedPlanName);
          if (!selectedPlanSummary) {
            return <Text type="secondary">暂无数据</Text>;
          }
          
          const progress = selectedPlanSummary.budget > 0 
            ? (selectedPlanSummary.budgetConsumption / selectedPlanSummary.budget) * 100 
            : 0;
          const roi = selectedPlanSummary.budgetConsumption > 0 
            ? Math.min(selectedPlanSummary.salesAmount / selectedPlanSummary.budgetConsumption, 10) 
            : 0;
          
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>活动数</Text>
                    <Text style={{ fontSize: '18px', color: '#262626', fontWeight: 600 }}>
                      {selectedPlanSummary.activityCount}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>预算</Text>
                    <Text style={{ fontSize: '18px', color: '#262626', fontWeight: 600 }}>
                      ¥{selectedPlanSummary.budget.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>预算消耗</Text>
                    <Text style={{ fontSize: '18px', color: '#262626', fontWeight: 600 }}>
                      ¥{selectedPlanSummary.budgetConsumption.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>销售金额</Text>
                    <Text style={{ fontSize: '18px', color: '#262626', fontWeight: 600 }}>
                      ¥{selectedPlanSummary.salesAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>补贴金额</Text>
                    <Text style={{ fontSize: '18px', color: '#262626', fontWeight: 600 }}>
                      ¥{selectedPlanSummary.subsidyAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: 4 }}>ROI</Text>
                    <Text style={{ fontSize: '18px', color: '#262626', fontWeight: 600 }}>
                      {roi.toFixed(1)}
                    </Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text strong style={{ fontSize: '13px', color: '#8c8c8c' }}>消耗进度</Text>
                      <Text style={{ fontSize: '13px', color: progress >= 100 ? '#ff4d4f' : progress >= 90 ? '#faad14' : '#262626', fontWeight: progress >= 100 ? 600 : 400 }}>
                        {progress.toFixed(1)}%
                      </Text>
                    </div>
                    <Progress
                      percent={progress}
                      strokeColor={progress >= 100 ? '#ff4d4f' : progress >= 90 ? '#faad14' : '#1890ff'}
                      showInfo={false}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          );
        })()}
      </Drawer>

      <style>{`
        .ant-table-thead > tr > th {
          background-color: #fafafa !important;
        }
      `}</style>
    </div>
  );
};

export default ActivityProgress;
