import React, { useState, useMemo } from 'react';
import { Card, DatePicker, Table, Tag, Typography, Tooltip, Empty, Radio, Statistic, Row, Col, Switch, Badge } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;

// 星期映射
const weekDayMap: { [key: number]: string } = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六'
};

// 平台类型
type Platform = '美团闪购' | '淘宝闪购' | '京东到家';

// 参与渠道类型
type Channel = '全渠道' | '部分渠道';

// 报名状态
type RegistrationStatus = '已报名' | '未报名';

// 活动状态
type ActivityStatus = '未开始' | '进行中' | '已结束';

// 优惠券详情（活动）
interface CouponDetail {
  id: string;
  name: string; // 优惠券名称，如 "零食下午茶满49减12_同享券"
  type?: '同享券' | '专享券' | '共补券'; // 券类型
  startDate: string; // 开始日期 YYYY-MM-DD（必填）
  endDate: string; // 结束日期 YYYY-MM-DD（必填）
}

// 活动日期数据
interface ActivityDateData {
  date: string; // YYYY-MM-DD
  coupons: CouponDetail[]; // 该日期的优惠券列表
  highlighted?: boolean; // 是否高亮显示
}

// 营销方案
interface MarketingPlan {
  id: string;
  planName: string; // 方案名称，如 "25年11月万店满减神券"
  platform: Platform;
  channel: Channel; // 参与渠道
  planId: string; // 方案编号（必填）
  submissionDeadline: string; // 提报截止时间（必填）
  registrationStatus: RegistrationStatus; // 报名状态
  dateData: ActivityDateData[]; // 日期数据数组
}

// 节假日列表（2025年）- 包含大促节点
const HOLIDAYS: { [key: string]: { name: string; isMajor: boolean } } = {
  '2025-01-01': { name: '元旦', isMajor: true },
  '2025-01-28': { name: '春节', isMajor: true },
  '2025-01-29': { name: '春节', isMajor: true },
  '2025-01-30': { name: '春节', isMajor: true },
  '2025-01-31': { name: '春节', isMajor: true },
  '2025-02-01': { name: '春节', isMajor: true },
  '2025-02-02': { name: '春节', isMajor: true },
  '2025-02-03': { name: '春节', isMajor: true },
  '2025-04-04': { name: '清明节', isMajor: true },
  '2025-04-05': { name: '清明节', isMajor: true },
  '2025-04-06': { name: '清明节', isMajor: true },
  '2025-05-01': { name: '劳动节', isMajor: true },
  '2025-05-02': { name: '劳动节', isMajor: true },
  '2025-05-03': { name: '劳动节', isMajor: true },
  '2025-05-04': { name: '劳动节', isMajor: true },
  '2025-05-05': { name: '劳动节', isMajor: true },
  '2025-06-10': { name: '端午节', isMajor: true },
  '2025-09-15': { name: '中秋节', isMajor: true },
  '2025-09-16': { name: '中秋节', isMajor: true },
  '2025-09-17': { name: '中秋节', isMajor: true },
  '2025-10-01': { name: '国庆节', isMajor: true },
  '2025-10-02': { name: '国庆节', isMajor: true },
  '2025-10-03': { name: '国庆节', isMajor: true },
  '2025-10-04': { name: '国庆节', isMajor: true },
  '2025-10-05': { name: '国庆节', isMajor: true },
  '2025-10-06': { name: '国庆节', isMajor: true },
  '2025-10-07': { name: '国庆节', isMajor: true },
  '2025-10-08': { name: '国庆节', isMajor: true },
  '2025-11-11': { name: '双11', isMajor: true },
  '2025-12-25': { name: '圣诞节', isMajor: false }
};

// 判断是否为节假日
const isHoliday = (date: Dayjs): { name: string; isMajor: boolean } | null => {
  const dateStr = date.format('YYYY-MM-DD');
  const holiday = HOLIDAYS[dateStr];
  return holiday ? holiday : null;
};

// 判断是否为大促节点
const isMajorPromotion = (date: Dayjs): boolean => {
  const holiday = isHoliday(date);
  if (holiday && holiday.isMajor) {
    return true;
  }
  // 周末也算大促节点
  const day = date.day();
  return day === 0 || day === 6;
};

const MarketingCalendar: React.FC = () => {
  // 筛选状态
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('美团闪购');
  const [showUnregistered, setShowUnregistered] = useState<boolean>(false); // 是否显示未报名方案
  const [expandedPlanIds, setExpandedPlanIds] = useState<Set<string>>(new Set()); // 展开的方案ID集合
  const [expandedActivityIds, setExpandedActivityIds] = useState<Set<string>>(new Set()); // 展开的活动ID集合
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // 选中的日期（用于筛选）

  // 模拟数据 - 根据图片示例，添加报名状态
  const [plans] = useState<MarketingPlan[]>([
    {
      id: '1',
      planName: '25年11月万店满减神券',
      platform: '美团闪购',
      channel: '全渠道',
      planId: '1970692819795308620',
      submissionDeadline: '2025-10-20 23:59:59',
      registrationStatus: '已报名',
      dateData: [
        {
          date: '2025-11-14',
          highlighted: true,
          coupons: [
            { id: '1', name: '零食下午茶满49减12_同享券', type: '同享券', startDate: '2025-11-01', endDate: '2025-11-30' },
            { id: '2', name: '夜宵解馋满49减12_同享券', type: '同享券', startDate: '2025-11-10', endDate: '2025-11-25' },
            { id: '3', name: '通用运费券59减8', type: '同享券', startDate: '2025-11-14', endDate: '2025-11-28' }
          ]
        },
        {
          date: '2025-11-15',
          highlighted: true,
          coupons: [
            { id: '4', name: '零食下午茶满29减7_同享券', type: '同享券', startDate: '2025-11-05', endDate: '2025-11-20' },
            { id: '5', name: '夜宵解馋满99减25_同享券', type: '同享券', startDate: '2025-11-15', endDate: '2025-11-30' }
          ]
        },
        {
          date: '2025-11-16',
          highlighted: true,
          coupons: [
            { id: '6', name: '夜间置物满39减10_专享券', type: '专享券', startDate: '2025-11-01', endDate: '2025-11-20' }
          ]
        }
      ]
    },
    {
      id: '2',
      planName: '25年11月新供给渠道加强',
      platform: '美团闪购',
      channel: '全渠道',
      planId: '1970692819795308621',
      submissionDeadline: '2025-10-25 23:59:59',
      registrationStatus: '已报名',
      dateData: [
        {
          date: '2025-11-07',
          highlighted: true,
          coupons: [
            { id: '7', name: '11月全品类-共补券59-30(品牌15)', type: '共补券', startDate: '2025-11-01', endDate: '2025-11-20' }
          ]
        },
        {
          date: '2025-11-08',
          highlighted: true,
          coupons: [
            { id: '8', name: '11月全品类-共补券夜间18点-6点69-35(品牌17元5)', type: '共补券', startDate: '2025-11-05', endDate: '2025-11-25' }
          ]
        },
        {
          date: '2025-11-09',
          highlighted: true,
          coupons: [
            { id: '9', name: '11月全品类-共补券39-20(品牌10)', type: '共补券', startDate: '2025-11-09', endDate: '2025-11-30' }
          ]
        }
      ]
    },
    {
      id: '3',
      planName: '11月万店满减神券',
      platform: '淘宝闪购',
      channel: '全渠道',
      planId: '68199417',
      submissionDeadline: '2025-10-15 23:59:59',
      registrationStatus: '已报名',
      dateData: [
        {
          date: '2025-11-01',
          highlighted: true,
          coupons: [
            { id: '10', name: '通用神券79减20', type: '同享券', startDate: '2025-11-01', endDate: '2025-11-20' },
            { id: '11', name: '通用神券59减15', type: '同享券', startDate: '2025-11-01', endDate: '2025-11-18' }
          ]
        },
        {
          date: '2025-11-02',
          highlighted: true,
          coupons: [
            { id: '12', name: '王牌券88减15', type: '同享券', startDate: '2025-11-02', endDate: '2025-11-22' },
            { id: '13', name: '通用神券129减30', type: '同享券', startDate: '2025-11-02', endDate: '2025-11-25' }
          ]
        },
        {
          date: '2025-11-11',
          highlighted: true,
          coupons: [
            { id: '14', name: '双11通用运费券59减8', type: '同享券', startDate: '2025-11-05', endDate: '2025-11-25' },
            { id: '15', name: '双11通用神券159减40', type: '同享券', startDate: '2025-11-11', endDate: '2025-11-30' }
          ]
        },
        {
          date: '2025-11-21',
          highlighted: true,
          coupons: [
            { id: '16', name: '通用运费券59减8', type: '同享券', startDate: '2025-11-15', endDate: '2025-11-30' },
            { id: '17', name: '通用神券159减40', type: '同享券', startDate: '2025-11-21', endDate: '2025-12-10' }
          ]
        },
        {
          date: '2025-11-22',
          highlighted: true,
          coupons: [
            { id: '18', name: '通用神券39减8', type: '同享券', startDate: '2025-11-20', endDate: '2025-12-05' }
          ]
        }
      ]
    },
    {
      id: '4',
      planName: '12月促销活动方案',
      platform: '美团闪购',
      channel: '部分渠道',
      planId: '1970692819795308622',
      submissionDeadline: '2025-11-20 23:59:59',
      registrationStatus: '未报名',
      dateData: [
        {
          date: '2025-12-01',
          highlighted: true,
          coupons: [
            { id: '19', name: '12月通用券99减30', type: '同享券', startDate: '2025-12-01', endDate: '2025-12-15' }
          ]
        }
      ]
    },
    {
      id: '5',
      planName: '双12大促项目',
      platform: '淘宝闪购',
      channel: '全渠道',
      planId: '68199418',
      submissionDeadline: '2025-11-25 23:59:59',
      registrationStatus: '未报名',
      dateData: [
        {
          date: '2025-12-12',
          highlighted: true,
          coupons: [
            { id: '20', name: '双12超级神券199减50', type: '同享券', startDate: '2025-12-10', endDate: '2025-12-15' }
          ]
        }
      ]
    },
    {
      id: '6',
      planName: '元旦促销计划',
      platform: '京东到家',
      channel: '全渠道',
      planId: 'JD20250101',
      submissionDeadline: '2025-12-20 23:59:59',
      registrationStatus: '已报名',
      dateData: [
        {
          date: '2025-12-28',
          highlighted: true,
          coupons: [
            { id: '21', name: '元旦特惠券88减20', type: '专享券', startDate: '2025-12-28', endDate: '2026-01-03' }
          ]
        }
      ]
    }
  ]);

  // 获取选中月份的所有日期
  const monthDates = useMemo(() => {
    const startDate = selectedMonth.startOf('month');
    const endDate = selectedMonth.endOf('month');
    const dates: Dayjs[] = [];
    let current = startDate;
    while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
      dates.push(current);
      current = current.add(1, 'day');
    }
    return dates;
  }, [selectedMonth]);

  // 获取平台对应的名称
  const getPlatformName = (platform: Platform): string => {
    const nameMap: { [key in Platform]: string } = {
      '美团闪购': '方案',
      '淘宝闪购': '项目',
      '京东到家': '计划'
    };
    return nameMap[platform];
  };

  // 计算活动状态
  const getActivityStatus = (coupon: CouponDetail): ActivityStatus => {
    if (!coupon || !coupon.startDate || !coupon.endDate) {
      return '未开始';
    }
    
    try {
      const now = dayjs();
      const start = dayjs(coupon.startDate);
      const end = dayjs(coupon.endDate);
      
      if (!start.isValid() || !end.isValid()) {
        return '未开始';
      }
      
      if (now.isBefore(start, 'day')) {
        return '未开始';
      } else if (now.isAfter(end, 'day')) {
        return '已结束';
      } else {
        return '进行中';
      }
    } catch (e) {
      return '未开始';
    }
  };

  // 获取方案的所有活动（优惠券）
  const getAllActivities = (plan: MarketingPlan): CouponDetail[] => {
    if (!plan || !plan.dateData || plan.dateData.length === 0) {
      return [];
    }
    const activityMap = new Map<string, CouponDetail>();
    plan.dateData.forEach(dateData => {
      if (dateData && dateData.coupons && Array.isArray(dateData.coupons)) {
        dateData.coupons.forEach(coupon => {
          if (coupon && coupon.id && !activityMap.has(coupon.id)) {
            activityMap.set(coupon.id, coupon);
          }
        });
      }
    });
    return Array.from(activityMap.values());
  };

  // 计算方案进度（活动最早开始与最晚结束的并集）
  const getPlanProgress = (plan: MarketingPlan): { startDate: string; endDate: string } | null => {
    if (!plan) {
      return null;
    }
    
    const allActivities = getAllActivities(plan);
    if (allActivities.length === 0) {
      return null;
    }
    
    let earliestStart: Dayjs | null = null;
    let latestEnd: Dayjs | null = null;
    
    allActivities.forEach(activity => {
      if (!activity || !activity.startDate || !activity.endDate) {
        return;
      }
      
      try {
        const start = dayjs(activity.startDate);
        const end = dayjs(activity.endDate);
        
        if (!start.isValid() || !end.isValid()) {
          return;
        }
        
        if (earliestStart === null || start.isBefore(earliestStart)) {
          earliestStart = start;
        }
        if (latestEnd === null || end.isAfter(latestEnd)) {
          latestEnd = end;
        }
      } catch (e) {
        // 忽略无效日期
      }
    });
    
    if (earliestStart !== null && latestEnd !== null) {
      const start = earliestStart as Dayjs;
      const end = latestEnd as Dayjs;
      if (start.isValid() && end.isValid()) {
        return {
          startDate: start.format('YYYY-MM-DD'),
          endDate: end.format('YYYY-MM-DD')
        };
      }
    }
    
    return null;
  };

  // 统计：按平台和报名状态统计方案数量
  const planStatistics = useMemo(() => {
    const stats: {
      [platform in Platform]: {
        已报名: number;
        未报名: number;
      };
    } = {
      '美团闪购': { 已报名: 0, 未报名: 0 },
      '淘宝闪购': { 已报名: 0, 未报名: 0 },
      '京东到家': { 已报名: 0, 未报名: 0 }
    };
    
    plans.forEach(plan => {
      if (plan.platform === selectedPlatform) {
        if (plan.registrationStatus === '已报名') {
          stats[plan.platform].已报名++;
        } else {
          stats[plan.platform].未报名++;
        }
      }
    });
    
    return stats[selectedPlatform];
  }, [plans, selectedPlatform]);

  // 统计：活动状态统计
  const activityStatistics = useMemo(() => {
    let 未开始 = 0;
    let 进行中 = 0;
    let 已结束 = 0;
    
    plans.forEach(plan => {
      if (plan.platform === selectedPlatform) {
        const activities = getAllActivities(plan);
        activities.forEach(activity => {
          const status = getActivityStatus(activity);
          if (status === '未开始') {
            未开始++;
          } else if (status === '进行中') {
            进行中++;
          } else {
            已结束++;
          }
        });
      }
    });
    
    return { 未开始, 进行中, 已结束 };
  }, [plans, selectedPlatform]);

  // 获取方案中所有唯一的机制（优惠券），并确定它们的行位置
  const getPlanAllCoupons = (plan: MarketingPlan): { coupon: CouponDetail; rowIndex: number }[] => {
    if (!plan || !plan.dateData) {
      return [];
    }
    
    const couponMap = new Map<string, CouponDetail>();
    
    // 收集所有唯一的优惠券
    plan.dateData.forEach(dateData => {
      if (!dateData || !dateData.coupons) {
        return;
      }
      
      dateData.coupons.forEach(coupon => {
        if (!coupon) {
          return;
        }
        
        // 如果优惠券有明确的时间跨度，使用它
        if (coupon.startDate && coupon.endDate) {
          if (!couponMap.has(coupon.id)) {
            couponMap.set(coupon.id, coupon);
          }
        } else {
          // 如果优惠券没有时间跨度，使用它所在的事件日期作为单日优惠券
          const couponWithSpan: CouponDetail = {
            ...coupon,
            startDate: dateData.date,
            endDate: dateData.date
          };
          if (!couponMap.has(coupon.id)) {
            couponMap.set(coupon.id, couponWithSpan);
          }
        }
      });
    });
    
    // 按ID排序，确保顺序一致
    const sortedCoupons = Array.from(couponMap.values()).sort((a, b) => {
      if (a.startDate && b.startDate) {
        return a.startDate.localeCompare(b.startDate);
      }
      return (a.id || '').localeCompare(b.id || '');
    });
    
    // 为每个优惠券分配行位置
    return sortedCoupons.map((coupon, index) => ({
      coupon,
      rowIndex: index
    }));
  };

  // 筛选后的方案（默认只显示已报名，支持切换显示未报名，支持按选中日期筛选）
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      if (plan.platform !== selectedPlatform) {
        return false;
      }
      
      // 根据showUnregistered筛选
      if (!showUnregistered && plan.registrationStatus === '未报名') {
        return false;
      }
      if (showUnregistered && plan.registrationStatus === '已报名') {
        return false;
      }
      
      // 如果选中了日期，只显示该日正在进行的方案
      if (selectedDate) {
        const activities = getAllActivities(plan);
        const hasActiveOnDate = activities.some(activity => {
          if (!activity || !activity.startDate || !activity.endDate) return false;
          try {
            const start = dayjs(activity.startDate);
            const end = dayjs(activity.endDate);
            if (!start.isValid() || !end.isValid()) return false;
            return selectedDate.isSameOrAfter(start, 'day') && selectedDate.isSameOrBefore(end, 'day');
          } catch (e) {
            return false;
          }
        });
        return hasActiveOnDate;
      }
      
      // 检查方案是否有数据在当前选中月份
      const hasDataInMonth = plan.dateData.some(dateData => {
        const date = dayjs(dateData.date);
        return date.isSame(selectedMonth, 'month');
      });
      
      // 或者检查方案的进度范围是否包含当前月份
      const progress = getPlanProgress(plan);
      if (progress) {
        const progressStart = dayjs(progress.startDate);
        const progressEnd = dayjs(progress.endDate);
        const monthStart = selectedMonth.startOf('month');
        const monthEnd = selectedMonth.endOf('month');
        
        // 如果方案进度与当前月份有交集，也显示
        if (progressEnd.isSameOrAfter(monthStart, 'day') && progressStart.isSameOrBefore(monthEnd, 'day')) {
          return true;
        }
      }
      
      return hasDataInMonth;
    });
  }, [plans, selectedMonth, selectedPlatform, showUnregistered, selectedDate]);

  // 方案级别的数据（用于折叠状态显示方案进度）
  const planLevelData = useMemo(() => {
    return filteredPlans.map(plan => ({
      id: plan.id,
      planId: plan.id,
      planName: plan.planName,
      channel: plan.channel,
      planIdNumber: plan.planId,
      submissionDeadline: plan.submissionDeadline,
      registrationStatus: plan.registrationStatus,
      platform: plan.platform,
      plan: plan,
      isPlanRow: true // 标记这是方案行
    }));
  }, [filteredPlans]);

  // 机制级别的数据（用于展开状态显示机制进度）
  const getMechanismData = (plan: MarketingPlan) => {
    const allCoupons = getPlanAllCoupons(plan);
    return allCoupons.map(({ coupon, rowIndex }) => ({
      id: `${plan.id}-${coupon.id}`,
      planId: plan.id,
      planName: plan.planName,
      channel: plan.channel,
      planIdNumber: plan.planId,
      submissionDeadline: plan.submissionDeadline,
      coupon,
      rowIndex,
      isPlanRow: false // 标记这是机制行
    }));
  };

  // 获取某个方案在某个日期的优惠券数据（包括跨日期的）
  const getPlanDateCoupons = (plan: MarketingPlan, date: Dayjs): CouponDetail[] => {
    if (!date || !plan || !plan.dateData) {
      return [];
    }
    
    const allCoupons: CouponDetail[] = [];
    const allPlanCoupons = getPlanAllCoupons(plan);
    
    // 查找包含当前日期的优惠券
    allPlanCoupons.forEach(({ coupon }) => {
      if (coupon.startDate && coupon.endDate) {
        const start = dayjs(coupon.startDate);
        const end = dayjs(coupon.endDate);
        
        // 验证日期有效性
        if (start.isValid() && end.isValid() && date.isValid()) {
          // 如果当前日期在优惠券的时间范围内，添加它
          if (date.isSameOrAfter(start, 'day') && date.isSameOrBefore(end, 'day')) {
            allCoupons.push(coupon);
          }
        }
      }
    });
    
    return allCoupons;
  };

  // 检查日期是否高亮
  const isDateHighlighted = (plan: MarketingPlan, date: Dayjs): boolean => {
    const dateStr = date.format('YYYY-MM-DD');
    const dateData = plan.dateData.find(d => d.date === dateStr);
    return dateData?.highlighted || false;
  };

  // 计算优惠券在当前日期的时间跨度位置（用于甘特图显示）
  const getCouponTimeSpan = (coupon: CouponDetail, currentDate: Dayjs): { start: number; width: number; isStart: boolean; isEnd: boolean } | null => {
    if (!coupon || !coupon.startDate || !coupon.endDate || !currentDate) {
      return null;
    }
    
    const start = dayjs(coupon.startDate);
    const end = dayjs(coupon.endDate);
    const current = currentDate;
    
    // 验证日期有效性
    if (!start.isValid() || !end.isValid() || !current.isValid()) {
      return null;
    }
    
    // 如果当前日期不在优惠券的时间范围内，返回null
    if (current.isBefore(start, 'day') || current.isAfter(end, 'day')) {
      return null;
    }
    
    // 计算在当前日期单元格中的位置
    const isStart = current.isSame(start, 'day');
    const isEnd = current.isSame(end, 'day');
    
    // 如果是单日优惠券，显示完整宽度
    if (isStart && isEnd) {
      return {
        start: 0,
        width: 100,
        isStart: true,
        isEnd: true
      };
    }
    
    // 如果是开始日期，从左侧开始显示
    if (isStart) {
      return {
        start: 0,
        width: 100,
        isStart: true,
        isEnd: false
      };
    }
    
    // 如果是结束日期，显示到右侧
    if (isEnd) {
      return {
        start: 0,
        width: 100,
        isStart: false,
        isEnd: true
      };
    }
    
    // 如果是中间日期，显示完整宽度（无圆角）
    return {
      start: 0,
      width: 100,
      isStart: false,
      isEnd: false
    };
  };

  // 渲染日期单元格内容（甘特图样式 - 连续横条）
  // rowData 可以是方案行或机制行
  const renderDateCell = (rowData: any, date: Dayjs, visibleDateRange?: { start: Dayjs; end: Dayjs }, isPlanRow: boolean = false) => {
    if (!rowData || !date) {
      return <div style={{ minHeight: '40px', position: 'relative' }}></div>;
    }
    
    // 如果是方案行，显示方案进度
    if (isPlanRow && rowData.plan) {
      const plan = rowData.plan;
      const progress = getPlanProgress(plan);
      if (!progress) {
        return <div style={{ minHeight: '40px', position: 'relative' }}></div>;
      }
      
      const start = dayjs(progress.startDate);
      const end = dayjs(progress.endDate);
      const current = date;
      
      if (!start.isValid() || !end.isValid() || !current.isValid()) {
        return <div style={{ minHeight: '40px', position: 'relative' }}></div>;
      }
      
      const isStart = current.isSame(start, 'day');
      const isEnd = current.isSame(end, 'day');
      const isInRange = current.isSameOrAfter(start, 'day') && current.isSameOrBefore(end, 'day');
      
      if (!isInRange) {
        return <div style={{ minHeight: '40px', position: 'relative' }}></div>;
      }
      
      // 方案进度使用灰色（已结束状态的颜色）
      const color = '#999';
      
      return (
        <Tooltip 
          title={
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{plan.planName}</div>
              <div>方案周期：{progress.startDate} ~ {progress.endDate}</div>
            </div>
          }
        >
          <div
            style={{
              position: 'absolute',
              left: isStart ? '0' : '-1px',
              right: isEnd ? '0' : '-1px',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '20px',
              backgroundColor: color,
              borderRadius: isStart && isEnd ? '2px' : isStart ? '2px 0 0 2px' : isEnd ? '0 2px 2px 0' : '0',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              padding: '0 4px',
              fontSize: '10px',
              color: '#fff',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              margin: '0',
              zIndex: 1
            }}
          />
        </Tooltip>
      );
    }
    
    // 如果是机制行，显示机制进度
    const coupon = rowData.coupon;
    if (!coupon || !coupon.startDate || !coupon.endDate) {
      return <div style={{ minHeight: '40px', position: 'relative' }}></div>;
    }
    
    const start = dayjs(coupon.startDate);
    const end = dayjs(coupon.endDate);
    const current = date;
    
    // 验证日期有效性
    if (!start.isValid() || !end.isValid() || !current.isValid()) {
      return <div style={{ minHeight: '40px', position: 'relative' }}></div>;
    }
    
    // 计算在当前日期单元格中的位置
    const isStart = current.isSame(start, 'day');
    const isEnd = current.isSame(end, 'day');
    const isInRange = current.isSameOrAfter(start, 'day') && current.isSameOrBefore(end, 'day');
    
    // 如果当前日期不在优惠券的时间范围内，检查是否需要显示箭头指引
    if (!isInRange) {
      // 检查是否在视野范围外
      if (visibleDateRange) {
        const isBeforeVisible = end.isBefore(visibleDateRange.start, 'day');
        const isAfterVisible = start.isAfter(visibleDateRange.end, 'day');
        
        // 如果机制在视野范围外，显示箭头指引
        if (isBeforeVisible && current.isSame(visibleDateRange.start, 'day')) {
          // 在可见范围开始处显示左箭头，表示往前滚动可以查看
          return (
            <Tooltip 
              title={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{coupon.name}</div>
                  <div>周期：{coupon.startDate} ~ {coupon.endDate}</div>
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#ccc' }}>往前滚动查看</div>
                </div>
              }
            >
              <div
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 5,
                  cursor: 'pointer',
                  padding: '0 4px',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: '2px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
              >
                <span style={{ fontSize: '14px', color: '#1890ff', fontWeight: 'bold' }}>←</span>
              </div>
            </Tooltip>
          );
        } else if (isAfterVisible && current.isSame(visibleDateRange.end, 'day')) {
          // 在可见范围结束处显示右箭头，表示往后滚动可以查看
          return (
            <Tooltip 
              title={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{coupon.name}</div>
                  <div>周期：{coupon.startDate} ~ {coupon.endDate}</div>
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#ccc' }}>往后滚动查看</div>
                </div>
              }
            >
              <div
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 5,
                  cursor: 'pointer',
                  padding: '0 4px',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: '2px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
                }}
              >
                <span style={{ fontSize: '14px', color: '#1890ff', fontWeight: 'bold' }}>→</span>
              </div>
            </Tooltip>
          );
        }
      }
      return <div style={{ minHeight: '40px', position: 'relative' }}></div>;
    }
    
    // 根据活动状态设置颜色：进行中蓝色、未开始黄色、已结束灰色
    const activityStatus = getActivityStatus(coupon);
    let color = '#999'; // 默认灰色（已结束）
    if (activityStatus === '进行中') {
      color = '#1890ff'; // 蓝色
    } else if (activityStatus === '未开始') {
      color = '#faad14'; // 黄色
    }
    
    // 计算是否显示箭头（结束日期且不是单日）
    const showArrow = isEnd && !isStart;
    
    return (
      <Tooltip 
        title={
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{coupon.name}</div>
            <div>周期：{coupon.startDate} ~ {coupon.endDate}</div>
          </div>
        }
      >
        <div
          style={{
            position: 'absolute',
            left: isStart ? '0' : '0', // 所有日期都从0开始，消除间隙
            right: isEnd ? '0' : '0', // 所有日期都到0结束，消除间隙
            top: '50%',
            transform: 'translateY(-50%)',
            height: '18px',
            backgroundColor: color,
            borderRadius: isStart && isEnd ? '2px' : isStart ? '2px 0 0 2px' : isEnd ? '0 2px 2px 0' : '0',
            opacity: 0.85,
            display: 'flex',
            alignItems: 'center',
            padding: '0 4px',
            fontSize: '10px',
            color: '#fff',
            overflow: 'hidden', // 改为hidden，防止内容溢出到固定列
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            margin: '0',
            zIndex: 1 // 降低z-index，确保不会覆盖固定列
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(-50%) scaleY(1.1)';
            e.currentTarget.style.zIndex = '10';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.85';
            e.currentTarget.style.transform = 'translateY(-50%) scaleY(1)';
            e.currentTarget.style.zIndex = '1';
          }}
        >
          {showArrow && (
            <span style={{ marginLeft: 'auto', fontSize: '8px' }}>→</span>
          )}
        </div>
      </Tooltip>
    );
  };

  // 切换方案展开/折叠状态
  const togglePlanExpand = (planId: string) => {
    const newExpanded = new Set(expandedPlanIds);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
      // 折叠方案时，同时折叠该方案下的所有活动
      const plan = filteredPlans.find(p => p.id === planId);
      if (plan) {
        const activities = getAllActivities(plan);
        const newActivityExpanded = new Set(expandedActivityIds);
        activities.forEach(activity => {
          newActivityExpanded.delete(activity.id);
        });
        setExpandedActivityIds(newActivityExpanded);
      }
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlanIds(newExpanded);
  };

  // 切换活动展开/折叠状态
  const toggleActivityExpand = (activityId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setExpandedActivityIds(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(activityId)) {
        newExpanded.delete(activityId);
      } else {
        newExpanded.add(activityId);
      }
      return newExpanded;
    });
  };

  // 获取某日正在进行的方案和活动
  const getActivePlansAndActivities = (date: Dayjs) => {
    if (!date || !date.isValid()) {
      return { activePlans: [], activeActivities: [] };
    }
    
    const activePlans: MarketingPlan[] = [];
    const activeActivities: { plan: MarketingPlan; activity: CouponDetail }[] = [];
    
    if (!filteredPlans || filteredPlans.length === 0) {
      return { activePlans, activeActivities };
    }
    
    filteredPlans.forEach(plan => {
      if (!plan) return;
      
      const activities = getAllActivities(plan);
      if (activities.length === 0) return;
      
      const hasActiveActivity = activities.some(activity => {
        if (!activity || !activity.startDate || !activity.endDate) return false;
        try {
          const start = dayjs(activity.startDate);
          const end = dayjs(activity.endDate);
          if (!start.isValid() || !end.isValid()) return false;
          return date.isSameOrAfter(start, 'day') && date.isSameOrBefore(end, 'day');
        } catch (e) {
          return false;
        }
      });
      
      if (hasActiveActivity) {
        activePlans.push(plan);
        activities.forEach(activity => {
          if (!activity || !activity.startDate || !activity.endDate) return;
          try {
            const start = dayjs(activity.startDate);
            const end = dayjs(activity.endDate);
            if (start.isValid() && end.isValid() && date.isSameOrAfter(start, 'day') && date.isSameOrBefore(end, 'day')) {
              activeActivities.push({ plan, activity });
            }
          } catch (e) {
            // 忽略无效日期
          }
        });
      }
    });
    
    return { activePlans, activeActivities };
  };

  // 表格列定义
  const columns = [
    {
      title: '方案',
      key: 'plan',
      width: 200,
      fixed: 'left' as const,
      onCell: () => ({
        style: {
          backgroundColor: '#fff',
          zIndex: 10,
          position: 'relative' as React.CSSProperties['position']
        } as React.CSSProperties
      }),
      render: (_: any, record: typeof planLevelData[0]) => {
        const plan = record.plan;
        const registrationTag = plan.registrationStatus === '已报名' 
          ? <Tag color="green" style={{ fontSize: '12px', marginTop: '4px' }}>已报名</Tag>
          : <Tag color="default" style={{ fontSize: '12px', marginTop: '4px' }}>未报名</Tag>;
        
        const progress = getPlanProgress(plan);
        
        return (
          <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#fff' }}>
            <Text strong style={{ fontSize: '14px' }}>{record.planName}</Text>
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {getPlatformName(plan.platform)}编号: {record.planIdNumber}
              </Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                提报截止: {record.submissionDeadline}
              </Text>
            </div>
            {progress && (
              <div style={{ marginTop: '4px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>方案周期：</Text>
                <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#1890ff' }}>
                  {progress.startDate} ~ {progress.endDate}
                </Text>
              </div>
            )}
            <div style={{ marginTop: '4px' }}>
              <Tag color="blue" style={{ fontSize: '12px' }}>{record.channel}</Tag>
              {registrationTag}
            </div>
          </div>
        );
      }
    },
    {
      title: '活动',
      key: 'activity',
      width: 300,
      fixed: 'left' as const,
      onCell: () => ({
        style: {
          backgroundColor: '#fff',
          zIndex: 10,
          position: 'relative' as React.CSSProperties['position']
        } as React.CSSProperties
      }),
      render: (_: any, record: any) => {
        // 如果是方案行，显示方案概览（活动统计）
        if (record.isPlanRow) {
          const plan = record.plan;
          const allActivities = getAllActivities(plan);
          const activityStats = {
            未开始: 0,
            进行中: 0,
            已结束: 0
          };
          
          allActivities.forEach(activity => {
            const status = getActivityStatus(activity);
            activityStats[status]++;
          });
          
          return (
            <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#fff' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>活动统计：</Text>
                <div style={{ marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {activityStats.未开始 > 0 && (
                    <Tag color="default" style={{ fontSize: '11px' }}>未开始 {activityStats.未开始}</Tag>
                  )}
                  {activityStats.进行中 > 0 && (
                    <Tag color="processing" style={{ fontSize: '11px' }}>进行中 {activityStats.进行中}</Tag>
                  )}
                  {activityStats.已结束 > 0 && (
                    <Tag color="default" style={{ fontSize: '11px' }}>已结束 {activityStats.已结束}</Tag>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <Text style={{ fontSize: '11px', color: '#666' }}>
                  共 {allActivities.length} 个活动
                </Text>
              </div>
            </div>
          );
        }
        
        // 如果是活动行，显示活动信息和展开/折叠功能
        const activity = record.coupon;
        if (!activity) return null;
        
        const activityStatus = getActivityStatus(activity);
        const isExpanded = expandedActivityIds.has(activity.id);
        
        // 状态颜色
        let statusColor = '#999'; // 默认灰色（已结束）
        if (activityStatus === '进行中') {
          statusColor = '#1890ff'; // 蓝色
        } else if (activityStatus === '未开始') {
          statusColor = '#faad14'; // 黄色
        }
        
        return (
          <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#fff' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                cursor: 'pointer',
                padding: '4px 0',
                userSelect: 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleActivityExpand(activity.id, e);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span 
                style={{ 
                  marginRight: '8px', 
                  fontSize: '12px',
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  display: 'inline-block',
                  userSelect: 'none'
                }}
              >
                ▶
              </span>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: '14px' }}>{activity.name}</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {activity.startDate} ~ {activity.endDate}
                  </Text>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <Tag 
                    color={activityStatus === '进行中' ? 'processing' : activityStatus === '未开始' ? 'warning' : 'default'} 
                    style={{ fontSize: '11px' }}
                  >
                    {activityStatus}
                  </Tag>
                  {activity.type && (
                    <Tag color="blue" style={{ fontSize: '11px', marginLeft: '4px' }}>
                      {activity.type}
                    </Tag>
                  )}
                </div>
              </div>
            </div>
            
            {/* 活动展开后的详细信息 */}
            {isExpanded && (
              <div style={{ 
                marginTop: '8px', 
                padding: '8px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                borderLeft: `3px solid ${statusColor}`
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ fontSize: '12px' }}>活动概览</Text>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>活动名称：</Text>
                  <Text style={{ fontSize: '11px' }}>{activity.name}</Text>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>活动周期：</Text>
                  <Text style={{ fontSize: '11px', fontWeight: 'bold' }}>
                    {activity.startDate} ~ {activity.endDate}
                  </Text>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>活动状态：</Text>
                  <Tag 
                    color={activityStatus === '进行中' ? 'processing' : activityStatus === '未开始' ? 'warning' : 'default'} 
                    style={{ fontSize: '11px' }}
                  >
                    {activityStatus}
                  </Tag>
                </div>
                {activity.type && (
                  <div style={{ marginBottom: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}>活动类型：</Text>
                    <Tag color="blue" style={{ fontSize: '11px' }}>{activity.type}</Tag>
                  </div>
                )}
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #d9d9d9' }}>
                  <Text strong style={{ fontSize: '12px' }}>活动明细</Text>
                  <div style={{ marginTop: '4px', fontSize: '11px', color: '#666' }}>
                    <div>活动ID: {activity.id}</div>
                    <div style={{ marginTop: '4px' }}>
                      活动持续时间: {dayjs(activity.endDate).diff(dayjs(activity.startDate), 'day') + 1} 天
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
    },
    ...monthDates.map(date => {
      const holiday = isHoliday(date);
      const isWeekend = date.day() === 0 || date.day() === 6; // 0是周日，6是周六
      const isMajor = isMajorPromotion(date);
      const { activePlans, activeActivities } = getActivePlansAndActivities(date);
      
      return {
        title: (
          <Tooltip 
            title={
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{date.format('YYYY年MM月DD日')}</div>
                <div style={{ marginBottom: '8px', color: '#1890ff', cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>
                  点击查看该日进行中的方案和活动
                </div>
                {activePlans.length > 0 && (
                  <div>
                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>进行中的{getPlatformName(selectedPlatform)}：{activePlans.length}个</div>
                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>进行中的活动：{activeActivities.length}个</div>
                    <div style={{ fontSize: '11px', color: '#ccc', marginTop: '8px' }}>
                      {activePlans.slice(0, 3).map(plan => (
                        <div key={plan.id} style={{ marginBottom: '2px' }}>{plan.planName}</div>
                      ))}
                      {activePlans.length > 3 && <div>...</div>}
                    </div>
                  </div>
                )}
                {activePlans.length === 0 && <div style={{ color: '#999' }}>暂无进行中的方案和活动</div>}
              </div>
            }
          >
            <div 
              style={{ 
                textAlign: 'center',
                backgroundColor: selectedDate && selectedDate.isSame(date, 'day') 
                  ? '#e6f7ff' 
                  : (isMajor ? (holiday?.isMajor ? '#fff1f0' : '#f0f5ff') : (isWeekend ? '#f5f5f5' : 'transparent')),
                padding: '4px',
                position: 'relative',
                border: selectedDate && selectedDate.isSame(date, 'day')
                  ? '2px solid #1890ff'
                  : (isMajor && holiday?.isMajor ? '2px solid #ff4d4f' : (isMajor ? '2px solid #1890ff' : 'none')),
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedDate && selectedDate.isSame(date, 'day')) {
                  setSelectedDate(null); // 再次点击取消选中
                } else {
                  setSelectedDate(date); // 点击选中日期
                }
              }}
              onMouseEnter={(e) => {
                if (!selectedDate || !selectedDate.isSame(date, 'day')) {
                  e.currentTarget.style.backgroundColor = '#f0f5ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedDate || !selectedDate.isSame(date, 'day')) {
                  e.currentTarget.style.backgroundColor = isMajor ? (holiday?.isMajor ? '#fff1f0' : '#f0f5ff') : (isWeekend ? '#f5f5f5' : 'transparent');
                }
              }}
            >
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 'bold',
                color: holiday?.isMajor ? '#ff4d4f' : (isMajor ? '#1890ff' : '#000'),
                backgroundColor: holiday?.isMajor ? '#fff1f0' : (isMajor ? '#e6f7ff' : 'transparent'),
                padding: (holiday?.isMajor || isMajor) ? '2px 4px' : '0',
                borderRadius: (holiday?.isMajor || isMajor) ? '2px' : '0',
                display: 'inline-block'
              }}>
                {date.format('MM.DD')}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: holiday?.isMajor ? '#ff4d4f' : (isMajor ? '#1890ff' : (isWeekend ? '#999' : '#666')),
                fontWeight: (holiday?.isMajor || isMajor) ? 'bold' : 'normal',
                marginTop: '2px'
              }}>
                {holiday?.name || weekDayMap[date.day()]}
              </div>
            </div>
          </Tooltip>
        ),
        key: date.format('YYYY-MM-DD'),
        width: 120,
        align: 'center' as const,
        onCell: () => ({
          style: {
            padding: 0,
            borderRight: 'none',
            borderLeft: 'none'
          }
        }),
        render: (_: any, record: any) => {
          // 计算可见日期范围（当前月份的第一天和最后一天）
          const visibleStart = selectedMonth.startOf('month');
          const visibleEnd = selectedMonth.endOf('month');
          const visibleDateRange = { start: visibleStart, end: visibleEnd };
          
          const isPlanRow = record.isPlanRow || false;
          const cellContent = renderDateCell(record, date, visibleDateRange, isPlanRow);
          const { activePlans, activeActivities } = getActivePlansAndActivities(date);
          
          return (
            <Tooltip
              title={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{date.format('YYYY年MM月DD日')}</div>
                  {activePlans.length > 0 ? (
                    <div>
                      <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                        进行中的{getPlatformName(selectedPlatform)}：{activePlans.length}个
                      </div>
                      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                        进行中的活动：{activeActivities.length}个
                      </div>
                      <div style={{ fontSize: '11px', color: '#ccc' }}>
                        {activePlans.slice(0, 5).map(plan => (
                          <div key={plan.id} style={{ marginBottom: '4px' }}>
                            <div style={{ fontWeight: 'bold' }}>{plan.planName}</div>
                            {activeActivities
                              .filter(item => item.plan.id === plan.id)
                              .map(item => (
                                <div key={item.activity.id} style={{ marginLeft: '8px', fontSize: '10px' }}>
                                  • {item.activity.name}
                                </div>
                              ))}
                          </div>
                        ))}
                        {activePlans.length > 5 && <div>...</div>}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#999' }}>暂无进行中的方案和活动</div>
                  )}
                </div>
              }
            >
              <div 
                style={{
                  position: 'relative',
                  backgroundColor: selectedDate && selectedDate.isSame(date, 'day')
                    ? '#e6f7ff'
                    : (isMajor ? (holiday?.isMajor ? '#fff1f0' : '#f0f5ff') : (isWeekend && !holiday ? '#fafafa' : 'transparent')),
                  borderRight: 'none',
                  borderLeft: 'none',
                  minHeight: '40px',
                  border: selectedDate && selectedDate.isSame(date, 'day')
                    ? '1px solid #1890ff'
                    : (isMajor && holiday?.isMajor ? '1px solid #ff4d4f' : (isMajor ? '1px solid #1890ff' : 'none')),
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  overflow: 'visible' // 允许甘特图横条溢出到相邻单元格
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedDate && selectedDate.isSame(date, 'day')) {
                    setSelectedDate(null); // 再次点击取消选中
                  } else {
                    setSelectedDate(date); // 点击选中日期
                  }
                }}
                onMouseEnter={(e) => {
                  if (!selectedDate || !selectedDate.isSame(date, 'day')) {
                    e.currentTarget.style.backgroundColor = '#f0f5ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedDate || !selectedDate.isSame(date, 'day')) {
                    e.currentTarget.style.backgroundColor = isMajor ? (holiday?.isMajor ? '#fff1f0' : '#f0f5ff') : (isWeekend && !holiday ? '#fafafa' : 'transparent');
                  }
                }}
              >
                {cellContent}
                {isWeekend && !holiday && !isMajor && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.03) 4px, rgba(0,0,0,0.03) 8px)',
                    pointerEvents: 'none',
                    zIndex: 0
                  }} />
                )}
              </div>
            </Tooltip>
          );
        }
      };
    })
  ];

  return (
    <div className="marketing-calendar-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>营销日历</Title>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            数据更新时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title={`已报名${getPlatformName(selectedPlatform)}`}
              value={planStatistics.已报名}
              valueStyle={{ color: '#3f8600' }}
              prefix={<span style={{ fontSize: '20px' }}>✓</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={`未报名${getPlatformName(selectedPlatform)}`}
              value={planStatistics.未报名}
              valueStyle={{ color: '#999' }}
              prefix={<span style={{ fontSize: '20px' }}>○</span>}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="未开始活动"
              value={activityStatistics.未开始}
              valueStyle={{ color: '#999' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="进行中活动"
              value={activityStatistics.进行中}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已结束活动"
              value={activityStatistics.已结束}
              valueStyle={{ color: '#999' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
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
              <Text strong style={{ width: '80px' }}>平台：</Text>
              <Radio.Group value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value as Platform)} buttonStyle="solid">
                <Radio.Button value="美团闪购">美团闪购</Radio.Button>
                <Radio.Button value="淘宝闪购">淘宝闪购</Radio.Button>
                <Radio.Button value="京东到家">京东到家</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text strong style={{ width: '100px' }}>显示未报名：</Text>
            <Switch
              checked={showUnregistered}
              onChange={setShowUnregistered}
              checkedChildren="是"
              unCheckedChildren="否"
            />
            <Text type="secondary" style={{ fontSize: '12px', marginLeft: 8 }}>
              {showUnregistered ? '当前显示未报名' : '当前显示已报名'}
            </Text>
          </div>
        </div>
      </Card>

      {/* 表格展示 */}
      <Card>
        {filteredPlans.length === 0 ? (
          <Empty description="暂无数据" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table
              columns={columns}
              dataSource={planLevelData}
              rowKey="id"
              pagination={false}
              bordered={false}
              size="small"
              scroll={{ x: 'max-content' }}
              style={{
                fontSize: '12px'
              }}
              expandable={{
                expandedRowKeys: Array.from(expandedPlanIds),
                onExpand: (expanded, record) => {
                  togglePlanExpand(record.planId);
                },
                expandedRowRender: (record) => {
                  const mechanismData = getMechanismData(record.plan);
                  // 创建活动行的列定义（排除方案列），保持与主表格相同的列宽
                  const activityColumns = columns.filter((col: any) => col.key !== 'plan').map((col: any) => ({
                    ...col,
                    // 保持列宽一致
                    width: col.width,
                    // 活动列保持原有渲染逻辑
                    render: col.key === 'activity' ? col.render : col.render
                  }));
                  
                  return (
                    <div style={{ margin: 0, padding: 0 }}>
                      <Table
                        columns={activityColumns as any}
                        dataSource={mechanismData}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        showHeader={false}
                        style={{ margin: 0 }}
                        scroll={{ x: 'max-content' }}
                        onRow={(record) => ({
                          onClick: (e) => {
                            // 阻止行点击事件，让活动列的点击事件生效
                            e.stopPropagation();
                          },
                          style: { cursor: 'default' }
                        })}
                        components={{
                          body: {
                            cell: (props: any) => {
                              if (props.columnKey && props.columnKey.includes('2025-')) {
                                return <td {...props} style={{ ...props.style, borderRight: 'none', borderLeft: 'none', padding: 0, borderTop: 'none', borderBottom: 'none', position: 'relative', overflow: 'visible' }} />;
                              }
                              if (props.columnKey === 'activity') {
                                return <td {...props} style={{ ...props.style, backgroundColor: '#fff', zIndex: 10, position: 'relative' }} />;
                              }
                              return <td {...props} />;
                            }
                          }
                        }}
                      />
                    </div>
                  );
                }
              }}
              components={{
                body: {
                  cell: (props: any) => {
                    // 如果是日期列，去掉所有边框和padding，让甘特图更连贯
                    if (props.columnKey && props.columnKey.includes('2025-')) {
                      return <td {...props} style={{ ...props.style, borderRight: 'none', borderLeft: 'none', padding: 0, borderTop: 'none', borderBottom: 'none', position: 'relative', overflow: 'visible' }} />;
                    }
                    // 固定列设置更高的z-index和背景色
                    if (props.columnKey === 'plan' || props.columnKey === 'activity') {
                      return <td {...props} style={{ ...props.style, backgroundColor: '#fff', zIndex: 10, position: 'relative' }} />;
                    }
                    return <td {...props} />;
                  }
                }
              }}
            />
          </div>
        )}
        </Card>
    </div>
  );
};

export default MarketingCalendar;
