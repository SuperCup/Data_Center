import React, { useState, useMemo } from 'react';
import { Card, DatePicker, Select, Table, Tag, Typography, Tooltip, Empty } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { Option } = Select;

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

// 优惠券详情
interface CouponDetail {
  id: string;
  name: string; // 优惠券名称，如 "零食下午茶满49减12_同享券"
  type?: '同享券' | '专享券' | '共补券'; // 券类型
  startDate?: string; // 开始日期 YYYY-MM-DD
  endDate?: string; // 结束日期 YYYY-MM-DD
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
  dateData: ActivityDateData[]; // 日期数据数组
}

// 节假日列表（2025年）
const HOLIDAYS: { [key: string]: string } = {
  '2025-01-01': '元旦',
  '2025-01-28': '春节',
  '2025-01-29': '春节',
  '2025-01-30': '春节',
  '2025-01-31': '春节',
  '2025-02-01': '春节',
  '2025-02-02': '春节',
  '2025-02-03': '春节',
  '2025-04-04': '清明节',
  '2025-04-05': '清明节',
  '2025-04-06': '清明节',
  '2025-05-01': '劳动节',
  '2025-05-02': '劳动节',
  '2025-05-03': '劳动节',
  '2025-05-04': '劳动节',
  '2025-05-05': '劳动节',
  '2025-06-10': '端午节',
  '2025-09-15': '中秋节',
  '2025-09-16': '中秋节',
  '2025-09-17': '中秋节',
  '2025-10-01': '国庆节',
  '2025-10-02': '国庆节',
  '2025-10-03': '国庆节',
  '2025-10-04': '国庆节',
  '2025-10-05': '国庆节',
  '2025-10-06': '国庆节',
  '2025-10-07': '国庆节',
  '2025-10-08': '国庆节',
  '2025-11-11': '双11',
  '2025-12-25': '圣诞节'
};

// 判断是否为节假日
const isHoliday = (date: Dayjs): string | null => {
  const dateStr = date.format('YYYY-MM-DD');
  return HOLIDAYS[dateStr] || null;
};

const MarketingCalendar: React.FC = () => {
  // 筛选状态
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('美团闪购');

  // 模拟数据 - 根据图片示例
  const [plans] = useState<MarketingPlan[]>([
    {
      id: '1',
      planName: '25年11月万店满减神券',
      platform: '美团闪购',
      channel: '全渠道',
      planId: '1970692819795308620',
      submissionDeadline: '2025-10-20 23:59:59',
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

  // 筛选后的方案
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      if (plan.platform !== selectedPlatform) {
        return false;
      }
      // 检查方案是否有数据在当前选中月份
      const hasDataInMonth = plan.dateData.some(dateData => {
        const date = dayjs(dateData.date);
        return date.isSame(selectedMonth, 'month');
      });
      return hasDataInMonth;
    });
  }, [plans, selectedMonth, selectedPlatform]);

  // 将方案数据展开为机制行（每个机制一行）
  const expandedData = useMemo(() => {
    const result: Array<{
      id: string;
      planId: string;
      planName: string;
      channel: Channel;
      planIdNumber: string;
      submissionDeadline: string;
      coupon: CouponDetail;
      rowIndex: number;
    }> = [];
    
    filteredPlans.forEach(plan => {
      const allCoupons = getPlanAllCoupons(plan);
      allCoupons.forEach(({ coupon, rowIndex }) => {
        result.push({
          id: `${plan.id}-${coupon.id}`,
          planId: plan.id,
          planName: plan.planName,
          channel: plan.channel,
          planIdNumber: plan.planId,
          submissionDeadline: plan.submissionDeadline,
          coupon,
          rowIndex
        });
      });
    });
    
    return result;
  }, [filteredPlans]);

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
  const renderDateCell = (rowData: typeof expandedData[0], date: Dayjs, visibleDateRange?: { start: Dayjs; end: Dayjs }) => {
    if (!rowData || !date) {
      return <div style={{ minHeight: '40px', position: 'relative' }}></div>;
    }
    
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
    
    const colors: { [key: string]: string } = {
      '同享券': '#1890ff',
      '专享券': '#52c41a',
      '共补券': '#722ed1'
    };
    const color = colors[coupon.type || '同享券'] || '#1890ff';
    
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
            left: isStart ? '0' : '-1px', // 开始日期从0开始，其他日期向左延伸1px以消除间隙
            right: isEnd ? '0' : '-1px', // 结束日期到0结束，其他日期向右延伸1px以消除间隙
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

  // 计算每个方案包含的机制数量（用于rowSpan）
  const planRowSpans = useMemo(() => {
    const spans: { [planId: string]: number } = {};
    expandedData.forEach(row => {
      spans[row.planId] = (spans[row.planId] || 0) + 1;
    });
    return spans;
  }, [expandedData]);

  // 表格列定义
  const columns = [
    {
      title: '方案',
      key: 'plan',
      width: 200,
      fixed: 'left' as const,
      onCell: (record: typeof expandedData[0], index?: number) => {
        // 检查是否是同一方案的第一个机制行
        const isFirstInPlan = index === 0 || (index !== undefined && expandedData[index - 1].planId !== record.planId);
        const rowSpan = isFirstInPlan ? planRowSpans[record.planId] : 0;
        return {
          rowSpan: rowSpan,
          style: {
            backgroundColor: '#fff',
            zIndex: 10,
            position: 'relative' as React.CSSProperties['position']
          } as React.CSSProperties
        };
      },
      render: (_: any, record: typeof expandedData[0], index: number) => {
        // 检查是否是同一方案的第一个机制行
        const isFirstInPlan = index === 0 || expandedData[index - 1].planId !== record.planId;
        
        if (!isFirstInPlan) {
          // 如果不是第一个，返回null（会被rowSpan隐藏）
          return null;
        }
        
        return (
          <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#fff' }}>
            <Text strong style={{ fontSize: '14px' }}>{record.planName}</Text>
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                方案编号: {record.planIdNumber}
              </Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                提报截止: {record.submissionDeadline}
              </Text>
            </div>
            <div style={{ marginTop: '4px' }}>
              <Tag color="blue" style={{ fontSize: '12px' }}>{record.channel}</Tag>
            </div>
          </div>
        );
      }
    },
    {
      title: '机制名',
      key: 'couponName',
      width: 250,
      fixed: 'left' as const,
      onCell: () => ({
        style: {
          backgroundColor: '#fff',
          zIndex: 10,
          position: 'relative' as React.CSSProperties['position']
        } as React.CSSProperties
      }),
      render: (_: any, record: typeof expandedData[0]) => (
        <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: '14px' }}>{record.coupon.name}</Text>
          <div style={{ marginTop: '4px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.coupon.startDate} ~ {record.coupon.endDate}
            </Text>
          </div>
        </div>
      )
    },
    ...monthDates.map(date => {
      const holiday = isHoliday(date);
      const isWeekend = date.day() === 0 || date.day() === 6; // 0是周日，6是周六
      return {
        title: (
          <div style={{ 
            textAlign: 'center',
            backgroundColor: isWeekend ? '#f5f5f5' : 'transparent',
            padding: '4px',
            position: 'relative'
          }}>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              color: holiday ? '#ff4d4f' : '#000',
              backgroundColor: holiday ? '#fff1f0' : 'transparent',
              padding: holiday ? '2px 4px' : '0',
              borderRadius: holiday ? '2px' : '0',
              display: 'inline-block'
            }}>
              {date.format('MM.DD')}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: holiday ? '#ff4d4f' : (isWeekend ? '#999' : '#666'),
              fontWeight: holiday ? 'bold' : 'normal',
              marginTop: '2px'
            }}>
              {holiday || weekDayMap[date.day()]}
            </div>
            {isWeekend && !holiday && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)',
                pointerEvents: 'none'
              }} />
            )}
          </div>
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
        render: (_: any, record: typeof expandedData[0]) => {
          // 计算可见日期范围（当前月份的第一天和最后一天）
          const visibleStart = selectedMonth.startOf('month');
          const visibleEnd = selectedMonth.endOf('month');
          const visibleDateRange = { start: visibleStart, end: visibleEnd };
          
          const cellContent = renderDateCell(record, date, visibleDateRange);
          return (
            <div style={{
              position: 'relative',
              backgroundColor: isWeekend && !holiday ? '#fafafa' : 'transparent',
              borderRight: 'none',
              minHeight: '40px'
            }}>
              {cellContent}
              {isWeekend && !holiday && (
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
          );
        }
      };
    })
  ];

  return (
    <div className="marketing-calendar-container" style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
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
            <div style={{ 
              display: 'inline-flex', 
              border: '1px solid #d9d9d9', 
              borderRadius: '6px',
              padding: '2px',
              backgroundColor: '#fafafa',
              overflow: 'hidden'
            }}>
              {[
                { value: '美团闪购', label: '美团闪购' },
                { value: '淘宝闪购', label: '淘宝闪购' },
                { value: '京东到家', label: '京东到家' }
              ].map((item, index) => (
                <div
                  key={item.value}
                  onClick={() => setSelectedPlatform(item.value as Platform)}
                  style={{
                    padding: '6px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    backgroundColor: selectedPlatform === item.value ? '#1890ff' : 'transparent',
                    color: selectedPlatform === item.value ? '#fff' : '#000',
                    borderRight: index < 2 ? '1px solid #d9d9d9' : 'none',
                    whiteSpace: 'nowrap',
                    fontWeight: selectedPlatform === item.value ? '500' : 'normal'
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
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
              dataSource={expandedData}
              rowKey="id"
              pagination={false}
              bordered={false}
              size="small"
              scroll={{ x: 'max-content' }}
              style={{
                fontSize: '12px'
              }}
              components={{
                body: {
                  cell: (props: any) => {
                    // 如果是日期列，去掉边框和padding
                    if (props.columnKey && props.columnKey.includes('2025-')) {
                      return <td {...props} style={{ ...props.style, borderRight: 'none', borderLeft: 'none', padding: 0, borderTop: 'none', borderBottom: 'none', position: 'relative', overflow: 'hidden' }} />;
                    }
                    // 固定列设置更高的z-index和背景色
                    if (props.columnKey === 'plan' || props.columnKey === 'couponName') {
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
