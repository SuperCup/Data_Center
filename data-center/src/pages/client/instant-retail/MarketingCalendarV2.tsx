import React, { useState, useMemo } from 'react';
import { Card, DatePicker, Tag, Typography, Radio, Statistic, Row, Col, Modal, Button, Table, Switch, Tabs, Alert, Empty } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { CalendarOutlined, RightOutlined } from '@ant-design/icons';

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

// 报名状态（提报状态）
type RegistrationStatus = '已提报' | '未提报';

// 活动状态
type ActivityStatus = '待开始' | '进行中' | '已结束';

// 优惠券详情（活动）
interface CouponDetail {
  id: string;
  name: string; // 优惠券名称
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
  planName: string; // 方案名称
  platform: Platform;
  channel: Channel; // 参与渠道
  planId: string; // 方案编号（必填）
  submissionDeadline: string; // 提报截止时间（必填）
  registrationStatus: RegistrationStatus; // 报名状态
  dateData: ActivityDateData[]; // 日期数据数组
}

// 营销节点类型
type MarketingNodeType = 'holiday' | 'anniversary' | 'sports' | 'shopping';

// 营销节点
interface MarketingNode {
  date: string; // YYYY-MM-DD
  name: string; // 节点名称
  type: MarketingNodeType; // 节点类型
  isMajor: boolean; // 是否为大促节点
}

// 营销节点列表（2025年）- 包含节假日、纪念日、重大赛事、购物节等
const MARKETING_NODES: { [key: string]: MarketingNode } = {
  // 节假日
  '2025-01-01': { date: '2025-01-01', name: '元旦', type: 'holiday', isMajor: true },
  '2025-01-28': { date: '2025-01-28', name: '春节', type: 'holiday', isMajor: true },
  '2025-01-29': { date: '2025-01-29', name: '春节', type: 'holiday', isMajor: true },
  '2025-01-30': { date: '2025-01-30', name: '春节', type: 'holiday', isMajor: true },
  '2025-01-31': { date: '2025-01-31', name: '春节', type: 'holiday', isMajor: true },
  '2025-02-01': { date: '2025-02-01', name: '春节', type: 'holiday', isMajor: true },
  '2025-02-02': { date: '2025-02-02', name: '春节', type: 'holiday', isMajor: true },
  '2025-02-03': { date: '2025-02-03', name: '春节', type: 'holiday', isMajor: true },
  '2025-02-14': { date: '2025-02-14', name: '情人节', type: 'anniversary', isMajor: true },
  '2025-03-08': { date: '2025-03-08', name: '妇女节', type: 'anniversary', isMajor: false },
  '2025-04-04': { date: '2025-04-04', name: '清明节', type: 'holiday', isMajor: true },
  '2025-04-05': { date: '2025-04-05', name: '清明节', type: 'holiday', isMajor: true },
  '2025-04-06': { date: '2025-04-06', name: '清明节', type: 'holiday', isMajor: true },
  '2025-05-01': { date: '2025-05-01', name: '劳动节', type: 'holiday', isMajor: true },
  '2025-05-02': { date: '2025-05-02', name: '劳动节', type: 'holiday', isMajor: true },
  '2025-05-03': { date: '2025-05-03', name: '劳动节', type: 'holiday', isMajor: true },
  '2025-05-04': { date: '2025-05-04', name: '劳动节', type: 'holiday', isMajor: true },
  '2025-05-05': { date: '2025-05-05', name: '劳动节', type: 'holiday', isMajor: true },
  '2025-05-18': { date: '2025-05-18', name: '618购物节', type: 'shopping', isMajor: true },
  '2025-06-01': { date: '2025-06-01', name: '儿童节', type: 'anniversary', isMajor: false },
  '2025-06-10': { date: '2025-06-10', name: '端午节', type: 'holiday', isMajor: true },
  '2025-06-18': { date: '2025-06-18', name: '618购物节', type: 'shopping', isMajor: true },
  '2025-08-01': { date: '2025-08-01', name: '建军节', type: 'anniversary', isMajor: false },
  '2025-09-10': { date: '2025-09-10', name: '教师节', type: 'anniversary', isMajor: false },
  '2025-09-15': { date: '2025-09-15', name: '中秋节', type: 'holiday', isMajor: true },
  '2025-09-16': { date: '2025-09-16', name: '中秋节', type: 'holiday', isMajor: true },
  '2025-09-17': { date: '2025-09-17', name: '中秋节', type: 'holiday', isMajor: true },
  '2025-10-01': { date: '2025-10-01', name: '国庆节', type: 'holiday', isMajor: true },
  '2025-10-02': { date: '2025-10-02', name: '国庆节', type: 'holiday', isMajor: true },
  '2025-10-03': { date: '2025-10-03', name: '国庆节', type: 'holiday', isMajor: true },
  '2025-10-04': { date: '2025-10-04', name: '国庆节', type: 'holiday', isMajor: true },
  '2025-10-05': { date: '2025-10-05', name: '国庆节', type: 'holiday', isMajor: true },
  '2025-10-06': { date: '2025-10-06', name: '国庆节', type: 'holiday', isMajor: true },
  '2025-10-07': { date: '2025-10-07', name: '国庆节', type: 'holiday', isMajor: true },
  '2025-10-08': { date: '2025-10-08', name: '国庆节', type: 'holiday', isMajor: true },
  '2025-11-11': { date: '2025-11-11', name: '双11', type: 'shopping', isMajor: true },
  '2025-12-12': { date: '2025-12-12', name: '双12', type: 'shopping', isMajor: true },
  '2025-12-25': { date: '2025-12-25', name: '圣诞节', type: 'holiday', isMajor: false }
};

// 获取营销节点
const getMarketingNode = (date: Dayjs): MarketingNode | null => {
  const dateStr = date.format('YYYY-MM-DD');
  return MARKETING_NODES[dateStr] || null;
};

// 判断是否为大促节点
const isMajorPromotion = (date: Dayjs): boolean => {
  const node = getMarketingNode(date);
  if (node && node.isMajor) {
    return true;
  }
  // 周末也算大促节点
  const day = date.day();
  return day === 0 || day === 6;
};

const MarketingCalendarV2: React.FC = () => {
  // 筛选状态
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('美团闪购');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // 选中的日期（用于查看详情）
  const [selectedPlan, setSelectedPlan] = useState<MarketingPlan | null>(null); // 选中的方案（用于弹窗）
  const [planModalVisible, setPlanModalVisible] = useState<boolean>(false); // 方案详情弹窗
  const [dateModalVisible, setDateModalVisible] = useState<boolean>(false); // 日期详情弹窗
  const [planViewMode, setPlanViewMode] = useState<'simple' | 'detail'>('simple'); // 方案显示模式：简洁/详细
  const [planStatusTab, setPlanStatusTab] = useState<'已提报' | '可提报'>('已提报'); // 方案状态Tab：已提报/可提报

  // 模拟数据
  const [plans] = useState<MarketingPlan[]>([
    {
      id: '1',
      planName: '25年11月万店满减神券',
      platform: '美团闪购',
      channel: '全渠道',
      planId: '1970692819795308620',
      submissionDeadline: '2025-10-20 23:59:59',
      registrationStatus: '已提报',
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
      registrationStatus: '已提报',
      dateData: [
        {
          date: '2025-11-07',
          highlighted: true,
          coupons: [
            { id: '7', name: '11月全品类-共补券59-30(品牌15)', type: '共补券', startDate: '2025-11-01', endDate: '2025-11-20' }
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
      registrationStatus: '未提报',
      dateData: [
        {
          date: '2025-11-11',
          highlighted: true,
          coupons: [
            { id: '14', name: '双11通用运费券59减8', type: '同享券', startDate: '2025-11-05', endDate: '2025-11-25' },
            { id: '15', name: '双11通用神券159减40', type: '同享券', startDate: '2025-11-11', endDate: '2025-11-30' }
          ]
        }
      ]
    },
    {
      id: '4',
      planName: '25年12月万店满减神券',
      platform: '美团闪购',
      channel: '全渠道',
      planId: '1970692819795308622',
      submissionDeadline: '2025-11-20 23:59:59',
      registrationStatus: '已提报',
      dateData: [
        {
          date: '2025-12-12',
          highlighted: true,
          coupons: [
            { id: '16', name: '双12零食下午茶满49减12_同享券', type: '同享券', startDate: '2025-12-01', endDate: '2025-12-31' },
            { id: '17', name: '双12夜宵解馋满49减12_同享券', type: '同享券', startDate: '2025-12-10', endDate: '2025-12-25' },
            { id: '18', name: '双12通用运费券59减8', type: '同享券', startDate: '2025-12-12', endDate: '2025-12-28' }
          ]
        },
        {
          date: '2025-12-25',
          highlighted: true,
          coupons: [
            { id: '19', name: '圣诞节零食下午茶满29减7_同享券', type: '同享券', startDate: '2025-12-20', endDate: '2025-12-31' },
            { id: '20', name: '圣诞节夜宵解馋满99减25_同享券', type: '同享券', startDate: '2025-12-25', endDate: '2025-12-31' }
          ]
        }
      ]
    },
    {
      id: '5',
      planName: '25年12月新供给渠道加强',
      platform: '美团闪购',
      channel: '全渠道',
      planId: '1970692819795308623',
      submissionDeadline: '2025-11-25 23:59:59',
      registrationStatus: '已提报',
      dateData: [
        {
          date: '2025-12-07',
          highlighted: true,
          coupons: [
            { id: '21', name: '12月全品类-共补券59-30(品牌15)', type: '共补券', startDate: '2025-12-01', endDate: '2025-12-20' }
          ]
        }
      ]
    },
    {
      id: '6',
      planName: '12月万店满减神券',
      platform: '淘宝闪购',
      channel: '全渠道',
      planId: '68199418',
      submissionDeadline: '2025-11-15 23:59:59',
      registrationStatus: '未提报',
      dateData: [
        {
          date: '2025-12-12',
          highlighted: true,
          coupons: [
            { id: '22', name: '双12通用运费券59减8', type: '同享券', startDate: '2025-12-05', endDate: '2025-12-25' },
            { id: '23', name: '双12通用神券159减40', type: '同享券', startDate: '2025-12-12', endDate: '2025-12-31' }
          ]
        }
      ]
    },
    {
      id: '7',
      planName: '12月年终大促活动',
      platform: '京东到家',
      channel: '部分渠道',
      planId: 'JD202512001',
      submissionDeadline: '2025-11-30 23:59:59',
      registrationStatus: '已提报',
      dateData: [
        {
          date: '2025-12-12',
          highlighted: true,
          coupons: [
            { id: '24', name: '双12年终大促满199减50', type: '专享券', startDate: '2025-12-10', endDate: '2025-12-20' },
            { id: '25', name: '双12年终大促满299减80', type: '专享券', startDate: '2025-12-12', endDate: '2025-12-22' }
          ]
        },
        {
          date: '2025-12-25',
          highlighted: true,
          coupons: [
            { id: '26', name: '圣诞节特惠满99减30', type: '同享券', startDate: '2025-12-23', endDate: '2025-12-31' }
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
      return '待开始';
    }
    
    try {
      const now = dayjs();
      const start = dayjs(coupon.startDate);
      const end = dayjs(coupon.endDate);
      
      if (!start.isValid() || !end.isValid()) {
        return '待开始';
      }
      
      if (now.isBefore(start, 'day')) {
        return '待开始';
      } else if (now.isAfter(end, 'day')) {
        return '已结束';
      } else {
        return '进行中';
      }
    } catch (e) {
      return '待开始';
    }
  };

  // 获取方案的所有活动
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
      const start: Dayjs = earliestStart;
      const end: Dayjs = latestEnd;
      if (start.isValid() && end.isValid()) {
        return {
          startDate: start.format('YYYY-MM-DD'),
          endDate: end.format('YYYY-MM-DD')
        };
      }
    }
    
    return null;
  };

  // 筛选后的方案（根据Tab显示已提报或可提报的方案）
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      if (plan.platform !== selectedPlatform) {
        return false;
      }
      
      // 根据Tab筛选已提报或可提报的方案
      if (planStatusTab === '已提报') {
        if (plan.registrationStatus !== '已提报') {
          return false;
        }
      } else {
        // 可提报（未提报）
        if (plan.registrationStatus !== '未提报') {
          return false;
        }
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
        
        if (progressEnd.isSameOrAfter(monthStart, 'day') && progressStart.isSameOrBefore(monthEnd, 'day')) {
          return true;
        }
      }
      
      return hasDataInMonth;
    });
  }, [plans, selectedMonth, selectedPlatform, planStatusTab]);

  // 统计：已提报/可提报方案数
  const planStatistics = useMemo(() => {
    let 已提报 = 0;
    let 可提报 = 0;
    
    plans.forEach(plan => {
      if (plan.platform === selectedPlatform) {
        // 检查方案是否在当前月份有活动
        const progress = getPlanProgress(plan);
        if (progress) {
          const progressStart = dayjs(progress.startDate);
          const progressEnd = dayjs(progress.endDate);
          const monthStart = selectedMonth.startOf('month');
          const monthEnd = selectedMonth.endOf('month');
          
          if (progressEnd.isSameOrAfter(monthStart, 'day') && progressStart.isSameOrBefore(monthEnd, 'day')) {
            if (plan.registrationStatus === '已提报') {
              已提报++;
            } else {
              可提报++;
            }
          }
        }
      }
    });
    
    return { 已提报, 可提报 };
  }, [plans, selectedMonth, selectedPlatform]);

  // 统计：活动状态统计
  const activityStatistics = useMemo(() => {
    let 待开始 = 0;
    let 进行中 = 0;
    let 已结束 = 0;
    let 总数 = 0;
    
    plans.forEach(plan => {
      if (plan.platform === selectedPlatform) {
        const activities = getAllActivities(plan);
        总数 += activities.length;
        activities.forEach(activity => {
          const status = getActivityStatus(activity);
          if (status === '待开始') {
            待开始++;
          } else if (status === '进行中') {
            进行中++;
          } else {
            已结束++;
          }
        });
      }
    });
    
    return { 待开始, 进行中, 已结束, 总数 };
  }, [plans, selectedPlatform]);

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
      
      const hasActiveOnDate = activities.some(activity => {
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
      
      if (hasActiveOnDate) {
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

  return (
    <div className="marketing-calendar-v2-container" style={{ width: '100%', minWidth: '0' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>活动日历 V2</Title>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
              <Radio.Group value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value as Platform)} buttonStyle="solid">
                <Radio.Button value="美团闪购">美团闪购</Radio.Button>
                <Radio.Button value="淘宝闪购">淘宝闪购</Radio.Button>
                <Radio.Button value="京东到家">京东到家</Radio.Button>
              </Radio.Group>
            </div>
        </div>
      </Card>

      {/* 页面交互说明 */}
      <Alert
        message="页面交互说明"
        description="点击方案，可查看选中方案下已提报活动明细；点击日历中具体日期，可查看当前日期在进行的方案与活动明细。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        closable
      />


      {/* 方案统计模块和日历模块 - 左右结构 */}
      <Row gutter={16} style={{ alignItems: 'stretch' }}>
        <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* 方案统计模块 - 时间轴形式 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Tabs
                  activeKey={planStatusTab}
                  onChange={(key) => setPlanStatusTab(key as '已提报' | '可提报')}
                  size="small"
                  items={[
                    {
                      key: '已提报',
                      label: `已提报（${planStatistics.已提报}）`
                    },
                    {
                      key: '可提报',
                      label: `可提报（${planStatistics.可提报}）`
                    }
                  ]}
                />
                {/* 模式切换 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text style={{ fontSize: '12px' }}>简洁</Text>
                  <Switch
                    checked={planViewMode === 'detail'}
                    onChange={(checked) => setPlanViewMode(checked ? 'detail' : 'simple')}
                    size="small"
                  />
                  <Text style={{ fontSize: '12px' }}>详细</Text>
                </div>
              </div>
            }
            style={{ marginBottom: 16, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
            bodyStyle={{ flex: 1, overflow: 'auto', minHeight: 0 }}
          >
        {filteredPlans.length === 0 ? (
          <Empty
            description={planStatusTab === '已提报' 
              ? `暂无已提报的${getPlatformName(selectedPlatform)}` 
              : `暂无可提报的${getPlatformName(selectedPlatform)}`}
            style={{ padding: '40px 0' }}
          />
        ) : (
          <div style={{ marginTop: planViewMode === 'simple' ? '0' : '16px' }}>
            {filteredPlans.map(plan => {
              const progress = getPlanProgress(plan);
              const allActivities = getAllActivities(plan);
              // 计算活动统计：总数、待开始、进行中、已结束
              const activityStats = {
                total: allActivities.length,
                待开始: 0,
                进行中: 0,
                已结束: 0
              };
              allActivities.forEach(activity => {
                const status = getActivityStatus(activity);
                if (status === '待开始') {
                  activityStats.待开始++;
                } else if (status === '进行中') {
                  activityStats.进行中++;
                } else {
                  activityStats.已结束++;
                }
              });
              const activeActivities = allActivities.filter(activity => {
                const status = getActivityStatus(activity);
                return status === '进行中';
              });
              
              // 计算方案在当月的时间跨度（用于甘特图）
              const monthStart = selectedMonth.startOf('month');
              const monthEnd = selectedMonth.endOf('month');
              const daysInMonth = selectedMonth.daysInMonth();
              
              let ganttStart = 0; // 进度条开始位置（百分比）
              let ganttWidth = 0; // 进度条宽度（百分比）
              let ganttLabel = '';
              let isFullMonth = false; // 是否覆盖整月
              let actualStart: Dayjs | null = null; // 当月范围内的实际开始日期
              let actualEnd: Dayjs | null = null; // 当月范围内的实际结束日期
              
              if (progress) {
                const progressStart = dayjs(progress.startDate);
                const progressEnd = dayjs(progress.endDate);
                
                // 计算在当月范围内的实际起止日期
                actualStart = progressStart.isBefore(monthStart) ? monthStart : progressStart;
                actualEnd = progressEnd.isAfter(monthEnd) ? monthEnd : progressEnd;
                
                if (actualStart.isSameOrBefore(monthEnd) && actualEnd.isSameOrAfter(monthStart)) {
                  // 计算开始位置（从月初到实际开始的天数）
                  const startDay = actualStart.diff(monthStart, 'day');
                  // 计算跨度（实际开始到实际结束的天数+1）
                  const spanDays = actualEnd.diff(actualStart, 'day') + 1;
                  
                  ganttStart = (startDay / daysInMonth) * 100;
                  ganttWidth = (spanDays / daysInMonth) * 100;
                  
                  // 判断是否覆盖整月
                  isFullMonth = progressStart.isBefore(monthStart) && progressEnd.isAfter(monthEnd);
                  
                  // 生成标签文本
                  if (isFullMonth) {
                    ganttLabel = '全月';
                  } else {
                    ganttLabel = `${actualStart.format('MM.DD')}-${actualEnd.format('MM.DD')}`;
                  }
                }
              }
              
              // 根据当前时间与方案时间跨度的关系选择颜色
              let planColor = '#999'; // 默认灰色（已结束）
              if (progress) {
                const now = dayjs();
                const progressStart = dayjs(progress.startDate);
                const progressEnd = dayjs(progress.endDate);
                
                if (now.isBefore(progressStart, 'day')) {
                  // 当前时间在方案开始前：黄色（与待开始同色）
                  planColor = '#faad14';
                } else if (now.isAfter(progressEnd, 'day')) {
                  // 当前时间在方案结束后：灰色（与已结束同色）
                  planColor = '#999';
                } else {
                  // 当前时间在方案跨度内：蓝色（与进行中同色）
                  planColor = '#1890ff';
                }
              }
              
              // 简洁模式：一行显示方案信息
              if (planViewMode === 'simple') {
                // 判断是否为整月（11.01~11.30）
                let timeSpanText = '';
                if (progress && actualStart && actualEnd) {
                  const progressStart = dayjs(progress.startDate);
                  const progressEnd = dayjs(progress.endDate);
                  
                  // 判断是否覆盖整月
                  const isFullMonthCoverage = progressStart.isBefore(monthStart) && progressEnd.isAfter(monthEnd);
                  
                  // 判断是否为当月整月（11.01~11.30）
                  const isMonthStart = actualStart.isSame(monthStart, 'day');
                  const isMonthEnd = actualEnd.isSame(monthEnd, 'day');
                  const isExactMonth = isMonthStart && isMonthEnd && !isFullMonthCoverage;
                  
                  if (isFullMonthCoverage || isExactMonth) {
                    timeSpanText = '全月';
                  } else {
                    timeSpanText = `${actualStart.format('MM.DD')}-${actualEnd.format('MM.DD')}`;
                  }
                }
                
                // 生成显示文本：如"万店满减神券（全月）"
                const displayText = `${plan.planName}${timeSpanText ? `（${timeSpanText}）` : ''}`;
                
                return (
                  <div
                    key={plan.id}
                    style={{
                      marginBottom: '16px',
                      cursor: 'pointer',
                      padding: '12px',
                      backgroundColor: '#fff',
                      border: '1px solid #e8e8e8',
                      borderRadius: '4px',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setPlanModalVisible(true);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = planColor;
                      e.currentTarget.style.boxShadow = `0 2px 8px rgba(24, 144, 255, 0.2)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* 甘特图进度条 */}
                    {ganttWidth > 0 && (
                      <div style={{ position: 'relative', marginBottom: '8px' }}>
                        {/* 进度条容器 */}
                        <div style={{
                          position: 'relative',
                          height: '8px',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          {/* 进度条 */}
                          <div
                            style={{
                              position: 'absolute',
                              left: `${ganttStart}%`,
                              width: `${ganttWidth}%`,
                              height: '100%',
                              backgroundColor: planColor,
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {/* 方案信息一行显示 */}
                    <div style={{ 
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: '#333'
                    }}>
                      {displayText}
                    </div>
                  </div>
                );
              }
              
              // 详细模式：显示完整信息
              return (
                <div
                  key={plan.id}
                  style={{
                    marginBottom: '24px',
                    padding: '16px',
                    backgroundColor: '#fff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setPlanModalVisible(true);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = planColor;
                    e.currentTarget.style.boxShadow = `0 2px 8px rgba(24, 144, 255, 0.2)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e8e8e8';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* 方案信息 */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Text strong style={{ fontSize: '16px' }}>{plan.planName}</Text>
                      <Tag color="blue">{plan.channel}</Tag>
                      <Tag color={plan.registrationStatus === '已提报' ? 'green' : 'orange'}>
                        {plan.registrationStatus === '已提报' ? '已提报' : '未提报'}
                      </Tag>
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {getPlatformName(plan.platform)}编号: {plan.planId}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        活动统计: 总数 {activityStats.total} | 待开始 {activityStats.待开始} | 进行中 {activityStats.进行中} | 已结束 {activityStats.已结束}
                      </Text>
                    </div>
                  </div>
                  
                  {/* 甘特图进度条 */}
                  {ganttWidth > 0 && (
                    <div style={{ position: 'relative', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* 进度条容器 */}
                      <div style={{
                        position: 'relative',
                        height: '32px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        flex: 1
                      }}>
                        {/* 进度条 */}
                        <div
                          style={{
                            position: 'absolute',
                            left: `${ganttStart}%`,
                            width: `${ganttWidth}%`,
                            height: '100%',
                            backgroundColor: planColor,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.transform = 'scaleY(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'scaleY(1)';
                          }}
                        >
                          {/* 如果覆盖整月，在进度条中显示"全月" */}
                          {isFullMonth && ganttLabel}
                        </div>
                      </div>
                      
                      {/* 时间跨度显示在右侧 */}
                      <div style={{
                        fontSize: '12px',
                        color: planColor,
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        minWidth: '80px',
                        textAlign: 'right'
                      }}>
                        {ganttLabel}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
          </Card>
        </Col>
        
        <Col span={16} style={{ display: 'flex', flexDirection: 'column' }}>
          {/* 日历模块 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>活动日历</span>
                {/* 活动状态统计 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                  <span style={{ color: '#333', fontWeight: 'bold' }}>
                    总数: {activityStatistics.总数}
                  </span>
                  <span style={{ color: '#faad14', fontWeight: 'bold' }}>
                    待开始: {activityStatistics.待开始}
                  </span>
                  <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                    进行中: {activityStatistics.进行中}
                  </span>
                  <span style={{ color: '#999', fontWeight: 'bold' }}>
                    已结束: {activityStatistics.已结束}
                  </span>
                </div>
              </div>
            }
            style={{ marginBottom: 16, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
            bodyStyle={{ flex: 1, overflow: 'auto', minHeight: 0 }}
          >
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, minmax(60px, 1fr))', 
              gap: '8px',
              width: '100%',
              minWidth: '500px' // 确保最小宽度，在小屏幕上可以横向滚动
            }}>
          {/* 星期标题 */}
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => {
            const isWeekend = index === 0 || index === 6; // 周日或周六
            return (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '4px',
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  color: '#000',
                  backgroundImage: isWeekend 
                    ? 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)' 
                    : 'none',
                  backgroundSize: '3px 3px',
                  fontSize: '12px'
                }}
              >
                {day}
              </div>
            );
          })}
          
          {/* 日历日期 */}
          {(() => {
            const startDate = selectedMonth.startOf('month');
            const firstDayOfWeek = startDate.day(); // 0-6，0是周日
            const daysInMonth = selectedMonth.daysInMonth();
            const cells: React.ReactNode[] = [];
            
            // 填充月初空白
            for (let i = 0; i < firstDayOfWeek; i++) {
              cells.push(<div key={`empty-${i}`} style={{ minHeight: '60px' }} />);
            }
            
            // 生成日期单元格
            for (let day = 1; day <= daysInMonth; day++) {
              const date = selectedMonth.date(day);
              const node = getMarketingNode(date);
              const isMajor = isMajorPromotion(date);
              const { activePlans, activeActivities } = getActivePlansAndActivities(date);
              const isSelected = selectedDate && selectedDate.isSame(date, 'day');
              
              // 判断是否为今日
              const isToday = date.isSame(dayjs(), 'day');
              
              // 判断是否为节假日（有营销节点且是节假日类型）
              const isHolidayDate = node && node.type === 'holiday';
              // 判断是否为周末
              const isWeekend = date.day() === 0 || date.day() === 6;
              
              // 根据日期类型设置样式
              let cellStyle: React.CSSProperties = {
                minHeight: '60px',
                padding: '4px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                border: '1px solid #d9d9d9',
                width: '100%',
                boxSizing: 'border-box'
              };
              
              if (isSelected) {
                cellStyle.border = '2px solid #1890ff';
                cellStyle.backgroundColor = '#e6f7ff';
                cellStyle.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
              } else if (isToday) {
                // 今日：蓝色边框、浅蓝色背景
                cellStyle.border = '2px solid #1890ff';
                cellStyle.backgroundColor = '#e6f7ff';
                cellStyle.boxShadow = '0 2px 4px rgba(24, 144, 255, 0.2)';
              } else if (isHolidayDate && node?.isMajor) {
                // 重大节假日：红色边框、红色背景渐变
                cellStyle.border = '2px solid #ff4d4f';
                cellStyle.backgroundColor = '#fff1f0';
                cellStyle.backgroundImage = 'linear-gradient(135deg, #fff1f0 0%, #ffe7e6 100%)';
                cellStyle.boxShadow = '0 2px 4px rgba(255, 77, 79, 0.15)';
              } else if (isHolidayDate) {
                // 普通节假日：橙色边框、浅橙色背景
                cellStyle.border = '2px solid #ff9800';
                cellStyle.backgroundColor = '#fff7e6';
                cellStyle.boxShadow = '0 1px 3px rgba(255, 152, 0, 0.1)';
              } else if (node && node.type === 'shopping' && node.isMajor) {
                // 重大购物节：橙色边框、橙色背景渐变
                cellStyle.border = '2px solid #fa8c16';
                cellStyle.backgroundColor = '#fff7e6';
                cellStyle.backgroundImage = 'linear-gradient(135deg, #fff7e6 0%, #ffecc7 100%)';
                cellStyle.boxShadow = '0 2px 4px rgba(250, 140, 22, 0.15)';
              } else if (isWeekend && !node) {
                // 普通周末：浅灰色连续细斜线背景，文字颜色与工作日一致
                cellStyle.border = '1px solid #d9d9d9';
                cellStyle.backgroundColor = '#fff';
                cellStyle.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)';
                cellStyle.backgroundSize = '3px 3px';
                cellStyle.boxShadow = 'none';
              } else {
                // 普通日期：白色背景
                cellStyle.backgroundColor = '#fff';
                cellStyle.border = '1px solid #d9d9d9';
              }
              
              cells.push(
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDate(date);
                    setDateModalVisible(true);
                  }}
                  style={cellStyle}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.zIndex = '10';
                      if (isToday) {
                        // 今日悬停时保持蓝色样式，但稍微加深
                        e.currentTarget.style.backgroundColor = '#bae7ff';
                        e.currentTarget.style.borderColor = '#1890ff';
                      } else if (!isHolidayDate && !node) {
                        e.currentTarget.style.backgroundColor = '#f0f5ff';
                        e.currentTarget.style.borderColor = '#1890ff';
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.zIndex = '1';
                      if (isToday) {
                        // 今日恢复为蓝色样式
                        e.currentTarget.style.backgroundColor = '#e6f7ff';
                        e.currentTarget.style.borderColor = '#1890ff';
                      } else if (!isHolidayDate && !node) {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.borderColor = '#d9d9d9';
                      }
                    }
                  }}
                >
                  {/* 日期数字和活动数（同行显示） */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: '2px',
                    marginBottom: '2px'
                  }}>
                    <div style={{ 
                      fontSize: isHolidayDate && node?.isMajor ? '14px' : (isWeekend && !node ? '13px' : '12px'), 
                      fontWeight: isHolidayDate && node?.isMajor ? 'bold' : (isWeekend && !node ? 'bold' : 'bold'),
                      color: isHolidayDate && node?.isMajor 
                        ? '#ff4d4f' 
                        : (isHolidayDate 
                          ? '#ff9800' 
                          : (node && node.type === 'shopping' && node.isMajor
                            ? '#fa8c16'
                            : '#000')), // 周末文字颜色与工作日一致
                      textShadow: isHolidayDate && node?.isMajor 
                        ? '0 1px 2px rgba(255, 77, 79, 0.2)' 
                        : 'none'
                    }}>
                      {day}
                    </div>
                    
                    {/* 活动数（居右显示，每个日期都显示） */}
                    {activeActivities.length > 0 && (
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#52c41a',
                        fontWeight: 'bold'
                      }}>
                        活动数：{activeActivities.length}
                      </div>
                    )}
                  </div>
                  
                  {/* 营销节点标签（显示在日期数字下方） */}
                  {node && (
                    <div style={{ marginTop: '2px' }}>
                      <Tag 
                        color={node.type === 'holiday' 
                          ? (node.isMajor ? 'red' : 'orange')
                          : node.type === 'shopping' 
                          ? 'orange' 
                          : node.type === 'sports' 
                          ? 'blue' 
                          : 'purple'}
                        style={{ 
                          fontSize: '9px', 
                          padding: '1px 4px', 
                          margin: 0,
                          fontWeight: node.isMajor ? 'bold' : 'normal',
                          border: node.isMajor ? '1px solid' : 'none',
                          lineHeight: '1.2'
                        }}
                      >
                        {node.name}
                      </Tag>
                    </div>
                  )}
                  
                  
                </div>
              );
            }
            
            return cells;
          })()}
        </div>
          </Card>
        </Col>
      </Row>
      
      {/* 方案详情弹窗 */}
      <Modal
        title={selectedPlan ? `${selectedPlan.planName} - 活动明细` : '方案详情'}
        open={planModalVisible}
        onCancel={() => {
          setPlanModalVisible(false);
          setSelectedPlan(null);
        }}
        footer={null}
        width={800}
      >
        {selectedPlan && (
          <div>
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>{getPlatformName(selectedPlan.platform)}编号：</Text>
                <Text>{selectedPlan.planId}</Text>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <Text strong>参与渠道：</Text>
                <Tag color="blue">{selectedPlan.channel}</Tag>
              </div>
              <div>
                <Text strong>提报截止时间：</Text>
                <Text>{selectedPlan.submissionDeadline}</Text>
              </div>
            </div>
            
            {selectedPlan.registrationStatus === '未提报' ? (
              <Empty
                description="该方案尚未提报，暂无活动明细"
                style={{ padding: '40px 0' }}
              />
            ) : (
              <Table
                columns={[
                  {
                    title: '活动名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: 200
                  },
                  {
                    title: '活动类型',
                    dataIndex: 'type',
                    key: 'type',
                    width: 100,
                    render: (type: string) => <Tag color="blue">{type || '-'}</Tag>
                  },
                  {
                    title: '开始日期',
                    dataIndex: 'startDate',
                    key: 'startDate',
                    width: 120
                  },
                  {
                    title: '结束日期',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    width: 120
                  },
                  {
                    title: '活动状态',
                    key: 'status',
                    width: 100,
                    render: (_: any, record: CouponDetail) => {
                      const status = getActivityStatus(record);
                      const colorMap = {
                        '待开始': 'default',
                        '进行中': 'processing',
                        '已结束': 'default'
                      };
                      return <Tag color={colorMap[status]}>{status}</Tag>;
                    }
                  }
                ]}
                dataSource={getAllActivities(selectedPlan)}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 个活动`
                }}
                size="small"
              />
            )}
          </div>
        )}
      </Modal>

      {/* 日期详情弹窗 */}
      <Modal
        title={selectedDate ? `${selectedDate.format('YYYY年MM月DD日')} - 进行中的方案和活动` : '日期详情'}
        open={dateModalVisible}
        onCancel={() => {
          setDateModalVisible(false);
          setSelectedDate(null);
        }}
        footer={null}
        width={1200}
      >
        {selectedDate && (() => {
          const { activePlans, activeActivities } = getActivePlansAndActivities(selectedDate);
          const node = getMarketingNode(selectedDate);
          
          return (
            <div>
              {node && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <Text strong>营销节点：</Text>
                  <Tag 
                    color={node.type === 'holiday' ? 'red' : node.type === 'shopping' ? 'orange' : node.type === 'sports' ? 'blue' : 'purple'}
                    style={{ marginLeft: '8px' }}
                  >
                    {node.name}
                  </Tag>
                </div>
              )}
              
              {activePlans.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  该日暂无进行中的方案和活动
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <Text strong style={{ fontSize: '16px' }}>
                      进行中的{getPlatformName(selectedPlatform)}：{activePlans.length} 个 | 
                      进行中的活动：{activeActivities.length} 个
                    </Text>
                  </div>
                  
                  {/* 所有活动明细表格 */}
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                      活动明细列表：
                    </Text>
                    <Table
                      columns={[
                        {
                          title: '所属方案',
                          key: 'planName',
                          width: 200,
                          render: (_: any, record: CouponDetail) => {
                            const planActivity = activeActivities.find(item => item.activity.id === record.id);
                            return planActivity ? planActivity.plan.planName : '-';
                          }
                        },
                        {
                          title: '活动名称',
                          dataIndex: 'name',
                          key: 'name',
                          width: 250,
                          ellipsis: true
                        },
                        {
                          title: '活动类型',
                          dataIndex: 'type',
                          key: 'type',
                          width: 100,
                          render: (type: string) => <Tag color="blue">{type || '-'}</Tag>
                        },
                        {
                          title: '开始日期',
                          dataIndex: 'startDate',
                          key: 'startDate',
                          width: 120
                        },
                        {
                          title: '结束日期',
                          dataIndex: 'endDate',
                          key: 'endDate',
                          width: 120
                        },
                        {
                          title: '活动状态',
                          key: 'status',
                          width: 100,
                          render: (_: any, record: CouponDetail) => {
                            const status = getActivityStatus(record);
                            const colorMap = {
                              '待开始': 'default',
                              '进行中': 'processing',
                              '已结束': 'default'
                            };
                            return <Tag color={colorMap[status]}>{status}</Tag>;
                          }
                        },
                        {
                          title: '操作',
                          key: 'action',
                          width: 120,
                          render: (_: any, record: CouponDetail) => {
                            const planActivity = activeActivities.find(item => item.activity.id === record.id);
                            if (!planActivity) return null;
                            return (
                              <Button
                                type="link"
                                size="small"
                                onClick={() => {
                                  setSelectedPlan(planActivity.plan);
                                  setDateModalVisible(false);
                                  setPlanModalVisible(true);
                                }}
                              >
                                查看方案详情
                              </Button>
                            );
                          }
                        }
                      ]}
                      dataSource={activeActivities.map(item => item.activity)}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 个活动`
                      }}
                      size="small"
                    />
                  </div>
                  
                  {/* 按方案分组展示 */}
                  <div>
                    <Text strong style={{ fontSize: '14px', marginBottom: '12px', display: 'block' }}>
                      按方案分组：
                    </Text>
                    {activePlans.map(plan => {
                      const planActivities = activeActivities.filter(item => item.plan.id === plan.id);
                      const progress = getPlanProgress(plan);
                      
                      return (
                        <Card
                          key={plan.id}
                          title={plan.planName}
                          style={{ marginBottom: '16px' }}
                          size="small"
                          extra={
                            <Button
                              type="link"
                              size="small"
                              onClick={() => {
                                setSelectedPlan(plan);
                                setDateModalVisible(false);
                                setPlanModalVisible(true);
                              }}
                            >
                              查看全部活动
                            </Button>
                          }
                        >
                          <div style={{ marginBottom: '12px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {getPlatformName(plan.platform)}编号: {plan.planId} | 
                              参与渠道: <Tag color="blue" style={{ margin: '0 4px' }}>{plan.channel}</Tag> |
                              {progress && `方案周期: ${progress.startDate} ~ ${progress.endDate}`} |
                              该日进行中活动: {planActivities.length} 个
                            </Text>
                          </div>
                          
                          <Table
                            columns={[
                              {
                                title: '活动名称',
                                dataIndex: 'name',
                                key: 'name',
                                width: 300,
                                ellipsis: true
                              },
                              {
                                title: '活动类型',
                                dataIndex: 'type',
                                key: 'type',
                                width: 100,
                                render: (type: string) => <Tag color="blue">{type || '-'}</Tag>
                              },
                              {
                                title: '开始日期',
                                dataIndex: 'startDate',
                                key: 'startDate',
                                width: 120
                              },
                              {
                                title: '结束日期',
                                dataIndex: 'endDate',
                                key: 'endDate',
                                width: 120
                              },
                              {
                                title: '活动状态',
                                key: 'status',
                                width: 100,
                                render: (_: any, record: CouponDetail) => {
                                  const status = getActivityStatus(record);
                                  return <Tag color="processing">{status}</Tag>;
                                }
                              }
                            ]}
                            dataSource={planActivities.map(item => item.activity)}
                            rowKey="id"
                            pagination={false}
                            size="small"
                          />
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default MarketingCalendarV2;

