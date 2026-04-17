import React, { useState, useMemo, useRef } from 'react';
import { DatePicker, Radio, Typography, Tooltip, Tag, Input, Button } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const weekDayNames: { [key: number]: string } = {
  0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六'
};

type Platform = '美团闪购' | '淘宝闪购' | '京东到家' | '多点' | '全部';
/** full=全程可领；offset=开始+3天~结束-3天；weekend=机制期间内的周末可用 */
type CouponTimeType = 'full' | 'offset' | 'weekend';

interface Mechanism {
  name: string;
  startDay: number;
  endDay: number;
  fullName?: string;
  customLabel?: string;
  budgetUsageProgress?: number;
  couponTimeType?: CouponTimeType;
}

interface CalendarActivity {
  id: string;
  activityName: string;
  channel: string;
  platform: Platform;
  mechanisms: Mechanism[];
}

interface PlatformTheme {
  primary: string; bg: string; border: string; text: string;
  tagBg: string; tagText: string; lightBg: string;
}

const PLATFORM_THEMES: Record<string, PlatformTheme> = {
  '美团闪购': { primary: '#FFDD00', bg: '#FFFBE6', border: '#FFD666', text: '#AD6800', tagBg: '#FFFBE6', tagText: '#D48806', lightBg: '#FFFDF0' },
  '淘宝闪购': { primary: '#FF6A00', bg: '#FFF7E6', border: '#FFB86C', text: '#D46B08', tagBg: '#FFF7E6', tagText: '#D46B08', lightBg: '#FFFAF0' },
  '京东到家': { primary: '#E4393C', bg: '#FFF1F0', border: '#FFA39E', text: '#CF1322', tagBg: '#FFF1F0', tagText: '#CF1322', lightBg: '#FFF5F5' },
  '多点':    { primary: '#00B578', bg: '#F6FFED', border: '#95DE64', text: '#389E0D', tagBg: '#F6FFED', tagText: '#389E0D', lightBg: '#F8FFF4' },
};

interface HolidayColor { bg: string; weekBg: string; text: string; }
const HOLIDAY_COLORS: Record<string, HolidayColor> = {
  '元旦':  { bg: '#cf1322', weekBg: '#ff4d4f', text: '#fff' },
  '春节':  { bg: '#a8071a', weekBg: '#cf1322', text: '#fff' },
  '妇女节': { bg: '#c41d7f', weekBg: '#eb2f96', text: '#fff' },
  '清明节': { bg: '#237804', weekBg: '#52c41a', text: '#fff' },
  '劳动节': { bg: '#ad4e00', weekBg: '#fa8c16', text: '#fff' },
  '618':   { bg: '#d4380d', weekBg: '#ff7a45', text: '#fff' },
  '端午节': { bg: '#006d75', weekBg: '#08979c', text: '#fff' },
  '中秋节': { bg: '#874d00', weekBg: '#d48806', text: '#fff' },
  '国庆节': { bg: '#820014', weekBg: '#a8071a', text: '#fff' },
  '双11':  { bg: '#391085', weekBg: '#722ed1', text: '#fff' },
  '双12':  { bg: '#003eb3', weekBg: '#2f54eb', text: '#fff' },
  '圣诞节': { bg: '#135200', weekBg: '#389e0d', text: '#fff' },
};
const DEFAULT_HOLIDAY_COLOR: HolidayColor = { bg: '#ff4d4f', weekBg: '#ff7875', text: '#fff' };
const getHolidayColor = (name: string | null): HolidayColor =>
  name ? (HOLIDAY_COLORS[name] ?? DEFAULT_HOLIDAY_COLOR) : DEFAULT_HOLIDAY_COLOR;

const HOLIDAYS: { [key: string]: string } = {
  '2026-01-01': '元旦', '2026-01-02': '元旦', '2026-01-03': '元旦',
  '2026-02-17': '春节', '2026-02-18': '春节', '2026-02-19': '春节',
  '2026-02-20': '春节', '2026-02-21': '春节', '2026-02-22': '春节', '2026-02-23': '春节',
  '2026-03-08': '妇女节',
  '2026-04-04': '清明节', '2026-04-05': '清明节', '2026-04-06': '清明节',
  '2026-05-01': '劳动节', '2026-05-02': '劳动节', '2026-05-03': '劳动节',
  '2026-05-04': '劳动节', '2026-05-05': '劳动节',
  '2026-06-18': '618',
  '2026-06-19': '端午节', '2026-06-20': '端午节', '2026-06-21': '端午节',
  '2026-09-25': '中秋节', '2026-09-26': '中秋节', '2026-09-27': '中秋节',
  '2026-10-01': '国庆节', '2026-10-02': '国庆节', '2026-10-03': '国庆节',
  '2026-10-04': '国庆节', '2026-10-05': '国庆节', '2026-10-06': '国庆节', '2026-10-07': '国庆节',
  '2026-11-11': '双11',
  '2026-12-12': '双12',
  '2026-12-25': '圣诞节',
};

const mockActivities: CalendarActivity[] = [
  {
    id: '1', activityName: '26年3月万店满减神券', channel: '全渠道', platform: '美团闪购',
    mechanisms: [
      { name: '零食下午茶满49减12_同享券', startDay: 1, endDay: 31, couponTimeType: 'offset' },  // ①非全程
      { name: '夜宵解馋满49减12_同享券',   startDay: 1, endDay: 31, couponTimeType: 'full' },
      { name: '通用运费券59减8',           startDay: 1, endDay: 31, couponTimeType: 'full' },
      { name: '零食下午茶满29减7_同享券',  startDay: 5, endDay: 20, couponTimeType: 'full' },
      { name: '夜宵解馋满99减25_同享券',   startDay: 10, endDay: 31, couponTimeType: 'full' },
      { name: '夜间置物满39减10_专享券',   startDay: 1, endDay: 20, couponTimeType: 'offset' },  // ②非全程
      { name: '通用神券39减8',             startDay: 15, endDay: 31, couponTimeType: 'full' },
    ]
  },
  {
    id: '2', activityName: '26年3月新供给渠道加强', channel: '全渠道', platform: '美团闪购',
    mechanisms: [
      { name: '3月全品类-共补券59-30（品牌15）',             startDay: 1,  endDay: 20, couponTimeType: 'full' },
      { name: '3月全品类-共补券夜间18点-6点69-35（品牌17元5）', startDay: 5, endDay: 25, couponTimeType: 'weekend' }, // ③非全程
      { name: '3月全品类-共补券39-20（品牌10）',             startDay: 9,  endDay: 31, couponTimeType: 'full' },
    ]
  },
  {
    id: '3', activityName: '3月38大促活动', channel: '全渠道', platform: '美团闪购',
    mechanisms: [
      { name: '38节专享券99减25',    startDay: 1, endDay: 8,  couponTimeType: 'full' },
      { name: '38节专享券149减40',   startDay: 1, endDay: 8,  couponTimeType: 'full' },
      { name: '38节通用神券59减15',  startDay: 5, endDay: 10, couponTimeType: 'offset' }, // ④非全程
    ]
  },
  {
    id: '4', activityName: '3月淘宝闪购满减活动', channel: '全渠道', platform: '淘宝闪购',
    mechanisms: [
      { name: '通用神券79减20',    startDay: 1,  endDay: 31, couponTimeType: 'full' },
      { name: '通用神券59减15',    startDay: 1,  endDay: 18, couponTimeType: 'full' },
      { name: '王牌券88减15',      startDay: 1,  endDay: 31, couponTimeType: 'full' },
      { name: '通用神券129减30',   startDay: 8,  endDay: 31, couponTimeType: 'full' },
      { name: '通用运费券59减8',   startDay: 15, endDay: 31, couponTimeType: 'full' },
      { name: '通用神券159减40',   startDay: 1,  endDay: 31, couponTimeType: 'full' },
      { name: '通用神券39减8',     startDay: 10, endDay: 25, couponTimeType: 'full' },
    ]
  },
  {
    id: '5', activityName: '3月淘宝新供给渠道加强', channel: '全渠道', platform: '淘宝闪购',
    mechanisms: [
      { name: '3月全品类-共补券59-30（品牌15）', startDay: 1,  endDay: 15, couponTimeType: 'full' },
      { name: '3月全品类-共补券39-20（品牌10）', startDay: 10, endDay: 31, couponTimeType: 'full' },
    ]
  },
  {
    id: '6', activityName: '3月京东到家满减活动', channel: '全渠道', platform: '京东到家',
    mechanisms: [
      { name: '京东专享券119减25',        startDay: 1, endDay: 31, couponTimeType: 'full' },
      { name: '京东PLUS会员专享券89减18', startDay: 1, endDay: 31, couponTimeType: 'full' },
      { name: '京东通用神券79减20',       startDay: 5, endDay: 20, couponTimeType: 'full' },
    ]
  },
  {
    id: '7', activityName: '3月京东38大促', channel: '全渠道', platform: '京东到家',
    mechanisms: [
      { name: '38节京东专享券149减40',   startDay: 3, endDay: 8,  couponTimeType: 'full' },
      { name: '38节京东通用运费券49减5', startDay: 3, endDay: 10, couponTimeType: 'full' },
    ]
  },
  {
    id: '8', activityName: '3月多点满减活动', channel: '全渠道', platform: '多点',
    mechanisms: [
      { name: '多点通用券59减15', startDay: 1,  endDay: 31, couponTimeType: 'full' },
      { name: '多点新客券29减8',  startDay: 1,  endDay: 15, couponTimeType: 'full' },
      { name: '多点会员券99减25', startDay: 10, endDay: 31, couponTimeType: 'full' },
    ]
  },
];

const MarketingCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('全部');
  const [searchKeyword, setSearchKeyword] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const daysInMonth = selectedMonth.daysInMonth();
  const year = selectedMonth.year();
  const month = selectedMonth.month();
  const today = dayjs();
  const isCurrentMonth = today.year() === year && today.month() === month;
  const todayDay = today.date();

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = dayjs(new Date(year, month, i + 1));
      const dow = d.day();
      const dateStr = d.format('YYYY-MM-DD');
      return {
        day: i + 1,
        weekDay: weekDayNames[dow],
        isWeekend: dow === 0 || dow === 6,
        isToday: isCurrentMonth && i + 1 === todayDay,
        holiday: HOLIDAYS[dateStr] || null,
      };
    });
  }, [year, month, daysInMonth, isCurrentMonth, todayDay]);

  const filteredActivities = useMemo(() => {
    let list = selectedPlatform === '全部' ? mockActivities : mockActivities.filter(a => a.platform === selectedPlatform);
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      list = list.filter(a => a.activityName.toLowerCase().includes(kw));
    }
    return list;
  }, [selectedPlatform, searchKeyword]);

  const extractDiscountLabel = (name: string): string => {
    const m1 = name.match(/满(\d+)减(\d+)/);
    if (m1) return `满${m1[1]}减${m1[2]}`;
    const m2 = name.match(/(\d+)减(\d+)/);
    if (m2) return `${m2[1]}减${m2[2]}`;
    const m3 = name.match(/(\d+)-(\d+)/);
    if (m3) return `${m3[1]}-${m3[2]}`;
    return name.slice(0, 6);
  };

  /** 计算领券时间文字描述（用于浮窗和导出） */
  const calcCouponTimeDesc = (m: Mechanism, dim: number): string => {
    const type = m.couponTimeType ?? 'full';
    if (type === 'full') return '机制期间全程可领';
    if (type === 'weekend') return '机制期间内的周末可用';
    // offset
    const cs = Math.min(m.startDay + 3, dim);
    const ce = Math.max(m.endDay - 3, cs);
    const startStr = selectedMonth.clone().date(cs).format('MM月DD日');
    const endStr = selectedMonth.clone().date(ce).format('MM月DD日');
    return `${startStr} 至 ${endStr}`;
  };

  /**
   * 计算领券时间在机制横条内的可视分区
   * 返回每个色块的 left% 和 width%（相对于整个机制跨度）
   */
  const computeCouponSegments = (
    m: Mechanism & { couponTimeType: CouponTimeType },
    sd: number, ed: number
  ): Array<{ left: number; width: number }> => {
    const totalDays = ed - sd + 1;
    if (totalDays <= 0) return [];

    if (m.couponTimeType === 'full') return [{ left: 0, width: 100 }];

    if (m.couponTimeType === 'offset') {
      const cs = Math.max(sd, m.startDay + 3);
      const ce = Math.min(ed, m.endDay - 3);
      if (ce < cs) return [{ left: 0, width: 100 }];
      return [{
        left: ((cs - sd) / totalDays) * 100,
        width: ((ce - cs + 1) / totalDays) * 100,
      }];
    }

    // weekend 类型：遍历机制区间，找出所有周末
    const segs: Array<{ left: number; width: number }> = [];
    for (let d = sd; d <= ed; d++) {
      const dow = dayjs(new Date(year, month, d)).day();
      if (dow === 0 || dow === 6) {
        segs.push({
          left: ((d - sd) / totalDays) * 100,
          width: (1 / totalDays) * 100,
        });
      }
    }
    return segs;
  };

  const displayActivities = useMemo(() => {
    return filteredActivities.map((activity) => ({
      ...activity,
      mechanisms: activity.mechanisms.map((m) => {
        const hash = Array.from(m.name).reduce((s, c) => s + c.charCodeAt(0), 0);
        return {
          ...m,
          fullName: m.fullName ?? `${activity.activityName}｜${m.name}`,
          customLabel: m.customLabel ?? extractDiscountLabel(m.name),
          budgetUsageProgress: m.budgetUsageProgress ?? Math.min(100, 40 + (hash % 55)),
          couponTimeType: m.couponTimeType ?? 'full',
        };
      }),
    }));
  }, [filteredActivities]);

  const dayStats = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      let actCount = 0, mCount = 0;
      const names: string[] = [];
      displayActivities.forEach(act => {
        const hasActive = act.mechanisms.some(m => d >= m.startDay && d <= m.endDay);
        if (hasActive) {
          actCount++;
          names.push(act.activityName);
          act.mechanisms.forEach(m => { if (d >= m.startDay && d <= m.endDay) mCount++; });
        }
      });
      return { activityCount: actCount, mechCount: mCount, activityNames: names };
    });
  }, [displayActivities, daysInMonth]);

  const getTheme = (platform: string): PlatformTheme =>
    PLATFORM_THEMES[platform] || PLATFORM_THEMES['美团闪购'];

  const holidayTypesInMonth = useMemo(() => {
    const seen = new Map<string, string>();
    days.forEach(d => {
      if (d.holiday && !seen.has(d.holiday)) seen.set(d.holiday, getHolidayColor(d.holiday).bg);
    });
    return Array.from(seen.entries());
  }, [days]);

  /** 导出 Excel（HTML table 格式，.xls） */
  const handleExportExcel = () => {
    const headers = ['活动名称', '平台', '渠道', '机制名称', '开始日期', '结束日期', '领券时间', '预算使用进度'];
    const rows: string[][] = [];
    displayActivities.forEach(act => {
      act.mechanisms.forEach(m => {
        const sd = Math.min(m.startDay, daysInMonth);
        const ed = Math.min(m.endDay, daysInMonth);
        rows.push([
          act.activityName, act.platform, act.channel, m.name,
          selectedMonth.clone().date(sd).format('YYYY年MM月DD日'),
          selectedMonth.clone().date(ed).format('YYYY年MM月DD日'),
          calcCouponTimeDesc(m, daysInMonth),
          `${(m.budgetUsageProgress ?? 0).toFixed(1)}%`,
        ]);
      });
    });

    const thHtml = headers.map(h => `<th style="background:#f5f5f5;font-weight:bold;border:1px solid #ccc;padding:6px 10px;">${h}</th>`).join('');
    const tbodyHtml = rows.map(r =>
      `<tr>${r.map(c => `<td style="border:1px solid #ddd;padding:5px 10px;">${c}</td>`).join('')}</tr>`
    ).join('');

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>活动日历</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
<body><table><thead><tr>${thHtml}</tr></thead><tbody>${tbodyHtml}</tbody></table></body></html>`;

    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `活动日历_${selectedMonth.format('YYYY年MM月')}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMechanismCells = (mech: Mechanism, platform: string) => {
    const cells: React.ReactNode[] = [];
    const theme = getTheme(platform);
    const sd = Math.min(mech.startDay, daysInMonth);
    const ed = Math.min(mech.endDay, daysInMonth);
    const startStr = selectedMonth.clone().date(sd).startOf('day').format('YYYY年MM月DD日 HH:mm:ss');
    const endStr = selectedMonth.clone().date(ed).endOf('day').format('YYYY年MM月DD日 HH:mm:ss');
    const fullName = mech.fullName ?? mech.name;
    const customLabel = mech.customLabel ?? mech.name;
    const budgetPct = mech.budgetUsageProgress ?? 0;
    const couponDesc = calcCouponTimeDesc(mech, daysInMonth);
    const couponType = (mech.couponTimeType ?? 'offset') as CouponTimeType;
    const couponSegments = computeCouponSegments({ ...mech, couponTimeType: couponType }, sd, ed);

    const tooltipTitle = (
      <div style={{ fontSize: 12, lineHeight: '22px', color: '#fff', whiteSpace: 'nowrap' }}>
        <div style={{ marginBottom: 2, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 4, whiteSpace: 'normal', wordBreak: 'break-all', maxWidth: 320 }}>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>机制名称：</span>{fullName}
        </div>
        <div><span style={{ color: 'rgba(255,255,255,0.55)' }}>开始时间：</span>{startStr}</div>
        <div><span style={{ color: 'rgba(255,255,255,0.55)' }}>结束时间：</span>{endStr}</div>
        <div><span style={{ color: 'rgba(255,255,255,0.55)' }}>领券时间：</span>{couponDesc}</div>
        <div><span style={{ color: 'rgba(255,255,255,0.55)' }}>预算使用进度：</span>{budgetPct.toFixed(1)}%</div>
      </div>
    );

    let day = 1;
    while (day <= daysInMonth) {
      if (day >= mech.startDay && day <= mech.endDay) {
        if (day === mech.startDay) {
          const span = Math.min(mech.endDay, daysInMonth) - mech.startDay + 1;
          cells.push(
            <td key={`m-${day}`} colSpan={span} style={{
              position: 'relative',
              padding: '2px 4px',
              borderLeft: `2px solid ${theme.primary}`,
              borderRight: `1px solid ${theme.border}`,
              borderTop: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`,
              borderRadius: '2px',
              fontSize: '11px',
              color: theme.text,
              fontWeight: 500,
              verticalAlign: 'middle',
              overflow: 'hidden',
            }}>
              {/* 背景层：不可领时段斜线，可领时段实心 */}
              {couponType === 'full' ? (
                <div style={{ position: 'absolute', inset: 0, background: theme.bg, zIndex: 0 }} />
              ) : (
                <>
                  {/* 整体斜线底纹（代表不可领时段，统一使用浅灰色） */}
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: 'repeating-linear-gradient(-45deg, #f5f5f5 0px, #f5f5f5 3px, #d9d9d9 3px, #d9d9d9 5px)',
                  }} />
                  {/* 可领时段：实心色块覆盖斜线 */}
                  {couponSegments.map((seg, i) => (
                    <div key={i} style={{
                      position: 'absolute', top: 0, bottom: 0, zIndex: 1,
                      left: `${seg.left}%`,
                      width: `${Math.max(seg.width, 2.5)}%`,
                      background: theme.bg,
                    }} />
                  ))}
                </>
              )}
              {/* 内容层（机制名 + 标签）浮于背景之上 */}
              <Tooltip title={tooltipTitle} placement="topLeft" mouseEnterDelay={0.2}>
                <div style={{ position: 'relative', zIndex: 2, cursor: 'default', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, lineHeight: '18px' }}>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {mech.name}
                    </span>
                    <Tag style={{
                      margin: 0, flexShrink: 0, fontSize: 10, lineHeight: '14px', padding: '0 4px',
                      border: `1px solid ${theme.border}`, backgroundColor: theme.tagBg, color: theme.tagText,
                      maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {customLabel}
                    </Tag>
                  </div>
                </div>
              </Tooltip>
            </td>
          );
          day += span;
        } else { day++; }
      } else {
        cells.push(<td key={`e-${day}`} style={{ border: 'none' }} />);
        day++;
      }
    }
    return cells;
  };

  const getHeaderBg = (d: { isWeekend: boolean; isToday: boolean; holiday: string | null }) => {
    if (d.isToday) return '#1890ff';
    if (d.holiday) return getHolidayColor(d.holiday).bg;
    if (d.isWeekend) return '#fff2e8';
    return '#fafafa';
  };
  const getHeaderColor = (d: { isWeekend: boolean; isToday: boolean; holiday: string | null }) => {
    if (d.isToday || d.holiday) return '#fff';
    if (d.isWeekend) return '#d46b08';
    return '#262626';
  };
  const getWeekdayBg = (d: { isWeekend: boolean; isToday: boolean; holiday: string | null }) => {
    if (d.isToday) return '#e6f4ff';
    if (d.holiday) return getHolidayColor(d.holiday).weekBg;
    if (d.isWeekend) return '#fff2e8';
    return '#fafafa';
  };
  const getWeekdayColor = (d: { isWeekend: boolean; isToday: boolean; holiday: string | null }) => {
    if (d.isToday || d.holiday) return '#fff';
    if (d.isWeekend) return '#d46b08';
    return '#8c8c8c';
  };

  return (
    <div style={{ padding: 0, height: 'calc(100vh - 64px - 48px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* 标题行：标题 + 更新时间 | 导出按钮 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Title level={4} style={{ margin: 0 }}>活动日历</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            数据更新时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </div>
        <Button size="small" icon={<DownloadOutlined />} onClick={handleExportExcel}>
          导出 Excel
        </Button>
      </div>

      {/* 筛选栏 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0,
        padding: '10px 16px', background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DatePicker
            picker="month" value={selectedMonth}
            onChange={(date) => date && setSelectedMonth(date)}
            style={{ width: 140 }} format="YYYY年MM月" allowClear={false}
          />
          <Input
            placeholder="搜索活动名称"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear style={{ width: 200 }}
          />
        </div>
        <Radio.Group value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} buttonStyle="solid">
          <Radio.Button value="全部">全部</Radio.Button>
          <Radio.Button value="美团闪购">美团闪购</Radio.Button>
          <Radio.Button value="淘宝闪购">淘宝闪购</Radio.Button>
          <Radio.Button value="京东到家">京东到家</Radio.Button>
          <Radio.Button value="多点">多点</Radio.Button>
        </Radio.Group>
      </div>

      {/* 图例 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, padding: '0 2px', fontSize: 11, color: '#8c8c8c', flexShrink: 0, flexWrap: 'wrap', gap: 8 }}>
        {/* 左侧：领券时间说明 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              display: 'inline-block', width: 28, height: 10, borderRadius: 2, flexShrink: 0,
              background: 'repeating-linear-gradient(-45deg, #f5f5f5 0px, #f5f5f5 3px, #d9d9d9 3px, #d9d9d9 5px)',
            }} />
            不可领券时段
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-flex', width: 28, height: 10, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
              {(['美团闪购', '淘宝闪购', '京东到家', '多点'] as const).map((p) => (
                <span key={p} style={{ flex: 1, height: '100%', background: PLATFORM_THEMES[p].primary }} />
              ))}
            </span>
            可领券时段（平台主题色）
          </span>
        </div>
        {/* 右侧：日期图例 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#1890ff' }} />
            今天
          </span>
          {holidayTypesInMonth.map(([name, color]) => (
            <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: color }} />
              {name}
            </span>
          ))}
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#fff2e8', border: '1px solid #ffd591' }} />
            周末
          </span>
        </div>
      </div>

      {/* 日历表格 */}
      <div ref={tableRef} style={{ background: '#fff', borderRadius: 6, border: '1px solid #e8e8e8', flex: 1, overflow: 'auto', minHeight: 0 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 180 }} />
            <col style={{ width: 60 }} />
            {days.map((_, i) => <col key={i} />)}
          </colgroup>
          <thead style={{ position: 'sticky', top: 0, zIndex: 4 }}>
            <tr>
              <th style={{ position: 'sticky', left: 0, zIndex: 5, background: '#fafafa', padding: '4px 8px', borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>活动</th>
              <th style={{ position: 'sticky', left: 180, zIndex: 5, background: '#fafafa', padding: '4px 4px', borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', textAlign: 'center', fontWeight: 600, fontSize: '12px' }}>渠道</th>
              {days.map((d, idx) => {
                const stat = dayStats[idx];
                const bg = getHeaderBg(d);
                const color = getHeaderColor(d);
                return (
                  <Tooltip key={d.day} placement="bottom" title={
                    <div style={{ fontSize: '12px', lineHeight: '20px' }}>
                      <div style={{ fontWeight: 600, marginBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 4 }}>
                        {selectedMonth.format('YYYY年M月')}{d.day}日（{d.weekDay}）
                        {d.holiday && <span style={{ marginLeft: 6, color: '#ffc53d' }}>{d.holiday}</span>}
                      </div>
                      <div>进行中活动：<span style={{ fontWeight: 600, color: '#ffc53d' }}>{stat.activityCount}</span> 个</div>
                      <div>进行中机制：<span style={{ fontWeight: 600, color: '#ffc53d' }}>{stat.mechCount}</span> 个</div>
                      {stat.activityCount > 0 && (
                        <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                          {stat.activityNames.map((name, i) => (
                            <div key={i} style={{ color: 'rgba(255,255,255,0.85)' }}>· {name}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  }>
                    <th style={{ background: bg, padding: '2px 0', borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #f0f0f0', textAlign: 'center', fontWeight: d.isToday ? 700 : d.isWeekend || d.holiday ? 700 : 500, fontSize: '11px', color, lineHeight: '16px', cursor: 'default' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={d.isToday ? { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', backgroundColor: '#1890ff', color: '#fff', fontWeight: 700, lineHeight: '18px' } : undefined}>
                          {d.day}
                        </span>
                        {d.holiday && (
                          <span style={{ fontSize: '8px', color: '#fff', lineHeight: '10px', maxWidth: 32, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {d.holiday}
                          </span>
                        )}
                      </div>
                    </th>
                  </Tooltip>
                );
              })}
            </tr>
            <tr>
              <th style={{ position: 'sticky', left: 0, zIndex: 5, background: '#fafafa', padding: '2px 8px', borderBottom: '2px solid #e8e8e8', borderRight: '1px solid #e8e8e8' }} />
              <th style={{ position: 'sticky', left: 180, zIndex: 5, background: '#fafafa', padding: '2px 4px', borderBottom: '2px solid #e8e8e8', borderRight: '1px solid #e8e8e8' }} />
              {days.map((d) => (
                <th key={`w-${d.day}`} style={{ background: getWeekdayBg(d), padding: '1px 0', borderBottom: '2px solid #e8e8e8', borderRight: '1px solid #f0f0f0', textAlign: 'center', fontSize: '10px', fontWeight: 400, color: getWeekdayColor(d) }}>
                  {d.weekDay}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayActivities.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth + 2} style={{ textAlign: 'center', padding: '32px', color: '#8c8c8c', fontSize: 13 }}>
                  暂无匹配的活动
                </td>
              </tr>
            ) : (
              displayActivities.map((activity) => {
                const mechCount = activity.mechanisms.length;
                const theme = getTheme(activity.platform);
                return activity.mechanisms.map((mech, mechIdx) => (
                  <tr key={`${activity.id}-${mechIdx}`}>
                    {mechIdx === 0 && (
                      <>
                        <td rowSpan={mechCount} style={{ position: 'sticky', left: 0, zIndex: 2, background: '#fff', padding: '3px 6px', borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', borderLeft: `3px solid ${theme.primary}`, verticalAlign: 'top', lineHeight: '18px' }}>
                          <div style={{ fontWeight: 600, fontSize: '11px', color: '#262626', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>
                            {activity.activityName}
                          </div>
                          <Tag style={{ marginTop: 2, fontSize: '10px', lineHeight: '16px', padding: '0 4px', border: `1px solid ${theme.border}`, backgroundColor: theme.tagBg, color: theme.tagText }}>
                            {activity.platform}
                          </Tag>
                        </td>
                        <td rowSpan={mechCount} style={{ position: 'sticky', left: 180, zIndex: 2, background: '#fff', padding: '3px 4px', borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', textAlign: 'center', fontSize: '11px', color: '#595959', verticalAlign: 'top' }}>
                          {activity.channel}
                        </td>
                      </>
                    )}
                    {renderMechanismCells(mech, activity.platform)}
                  </tr>
                ));
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketingCalendar;
