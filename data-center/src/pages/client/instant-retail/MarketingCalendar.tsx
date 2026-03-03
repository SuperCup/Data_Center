import React, { useState, useMemo } from 'react';
import { DatePicker, Radio, Typography, Tooltip, Tag } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const weekDayNames: { [key: number]: string } = {
  0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六'
};

type Platform = '美团闪购' | '淘宝闪购' | '京东到家' | '多点' | '全部';

interface Mechanism {
  name: string;
  startDay: number;
  endDay: number;
}

interface CalendarActivity {
  id: string;
  activityName: string;
  channel: string;
  platform: Platform;
  mechanisms: Mechanism[];
}

interface PlatformTheme {
  primary: string;
  bg: string;
  border: string;
  text: string;
  tagBg: string;
  tagText: string;
  lightBg: string;
}

const PLATFORM_THEMES: Record<string, PlatformTheme> = {
  '美团闪购': {
    primary: '#FFDD00',
    bg: '#FFFBE6',
    border: '#FFD666',
    text: '#AD6800',
    tagBg: '#FFFBE6',
    tagText: '#D48806',
    lightBg: '#FFFDF0',
  },
  '淘宝闪购': {
    primary: '#FF6A00',
    bg: '#FFF7E6',
    border: '#FFB86C',
    text: '#D46B08',
    tagBg: '#FFF7E6',
    tagText: '#D46B08',
    lightBg: '#FFFAF0',
  },
  '京东到家': {
    primary: '#E4393C',
    bg: '#FFF1F0',
    border: '#FFA39E',
    text: '#CF1322',
    tagBg: '#FFF1F0',
    tagText: '#CF1322',
    lightBg: '#FFF5F5',
  },
  '多点': {
    primary: '#00B578',
    bg: '#F6FFED',
    border: '#95DE64',
    text: '#389E0D',
    tagBg: '#F6FFED',
    tagText: '#389E0D',
    lightBg: '#F8FFF4',
  },
};

const HOLIDAYS: { [key: string]: string } = {
  '2026-01-01': '元旦',
  '2026-01-02': '元旦',
  '2026-01-03': '元旦',
  '2026-02-17': '春节',
  '2026-02-18': '春节',
  '2026-02-19': '春节',
  '2026-02-20': '春节',
  '2026-02-21': '春节',
  '2026-02-22': '春节',
  '2026-02-23': '春节',
  '2026-03-08': '妇女节',
  '2026-04-04': '清明节',
  '2026-04-05': '清明节',
  '2026-04-06': '清明节',
  '2026-05-01': '劳动节',
  '2026-05-02': '劳动节',
  '2026-05-03': '劳动节',
  '2026-05-04': '劳动节',
  '2026-05-05': '劳动节',
  '2026-06-18': '618',
  '2026-06-19': '端午节',
  '2026-06-20': '端午节',
  '2026-06-21': '端午节',
  '2026-09-25': '中秋节',
  '2026-09-26': '中秋节',
  '2026-09-27': '中秋节',
  '2026-10-01': '国庆节',
  '2026-10-02': '国庆节',
  '2026-10-03': '国庆节',
  '2026-10-04': '国庆节',
  '2026-10-05': '国庆节',
  '2026-10-06': '国庆节',
  '2026-10-07': '国庆节',
  '2026-11-11': '双11',
  '2026-12-12': '双12',
  '2026-12-25': '圣诞节',
};

const mockActivities: CalendarActivity[] = [
  {
    id: '1',
    activityName: '26年3月万店满减神券',
    channel: '全渠道',
    platform: '美团闪购',
    mechanisms: [
      { name: '零食下午茶满49减12_同享券', startDay: 1, endDay: 31 },
      { name: '夜宵解馋满49减12_同享券', startDay: 1, endDay: 31 },
      { name: '通用运费券59减8', startDay: 1, endDay: 31 },
      { name: '零食下午茶满29减7_同享券', startDay: 5, endDay: 20 },
      { name: '夜宵解馋满99减25_同享券', startDay: 10, endDay: 31 },
      { name: '夜间置物满39减10_专享券', startDay: 1, endDay: 20 },
      { name: '通用神券39减8', startDay: 15, endDay: 31 },
    ]
  },
  {
    id: '2',
    activityName: '26年3月新供给渠道加强',
    channel: '全渠道',
    platform: '美团闪购',
    mechanisms: [
      { name: '3月全品类-共补券59-30（品牌15）', startDay: 1, endDay: 20 },
      { name: '3月全品类-共补券夜间18点-6点69-35（品牌17元5）', startDay: 5, endDay: 25 },
      { name: '3月全品类-共补券39-20（品牌10）', startDay: 9, endDay: 31 },
    ]
  },
  {
    id: '3',
    activityName: '3月38大促活动',
    channel: '全渠道',
    platform: '美团闪购',
    mechanisms: [
      { name: '38节专享券99减25', startDay: 1, endDay: 8 },
      { name: '38节专享券149减40', startDay: 1, endDay: 8 },
      { name: '38节通用神券59减15', startDay: 5, endDay: 10 },
    ]
  },
  {
    id: '4',
    activityName: '3月淘宝闪购满减活动',
    channel: '全渠道',
    platform: '淘宝闪购',
    mechanisms: [
      { name: '通用神券79减20', startDay: 1, endDay: 31 },
      { name: '通用神券59减15', startDay: 1, endDay: 18 },
      { name: '王牌券88减15', startDay: 1, endDay: 31 },
      { name: '通用神券129减30', startDay: 8, endDay: 31 },
      { name: '通用运费券59减8', startDay: 15, endDay: 31 },
      { name: '通用神券159减40', startDay: 1, endDay: 31 },
      { name: '通用神券39减8', startDay: 10, endDay: 25 },
    ]
  },
  {
    id: '5',
    activityName: '3月淘宝新供给渠道加强',
    channel: '全渠道',
    platform: '淘宝闪购',
    mechanisms: [
      { name: '3月全品类-共补券59-30（品牌15）', startDay: 1, endDay: 15 },
      { name: '3月全品类-共补券39-20（品牌10）', startDay: 10, endDay: 31 },
    ]
  },
  {
    id: '6',
    activityName: '3月京东到家满减活动',
    channel: '全渠道',
    platform: '京东到家',
    mechanisms: [
      { name: '京东专享券119减25', startDay: 1, endDay: 31 },
      { name: '京东PLUS会员专享券89减18', startDay: 1, endDay: 31 },
      { name: '京东通用神券79减20', startDay: 5, endDay: 20 },
    ]
  },
  {
    id: '7',
    activityName: '3月京东38大促',
    channel: '全渠道',
    platform: '京东到家',
    mechanisms: [
      { name: '38节京东专享券149减40', startDay: 3, endDay: 8 },
      { name: '38节京东通用运费券49减5', startDay: 3, endDay: 10 },
    ]
  },
  {
    id: '8',
    activityName: '3月多点满减活动',
    channel: '全渠道',
    platform: '多点',
    mechanisms: [
      { name: '多点通用券59减15', startDay: 1, endDay: 31 },
      { name: '多点新客券29减8', startDay: 1, endDay: 15 },
      { name: '多点会员券99减25', startDay: 10, endDay: 31 },
    ]
  },
];

const MarketingCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('全部');

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
    if (selectedPlatform === '全部') return mockActivities;
    return mockActivities.filter(a => a.platform === selectedPlatform);
  }, [selectedPlatform]);

  const dayStats = useMemo(() => {
    const stats: { activityCount: number; mechCount: number; activityNames: string[] }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      let actCount = 0;
      let mCount = 0;
      const names: string[] = [];
      filteredActivities.forEach(act => {
        const hasActive = act.mechanisms.some(m => d >= m.startDay && d <= m.endDay);
        if (hasActive) {
          actCount++;
          names.push(act.activityName);
          act.mechanisms.forEach(m => {
            if (d >= m.startDay && d <= m.endDay) mCount++;
          });
        }
      });
      stats.push({ activityCount: actCount, mechCount: mCount, activityNames: names });
    }
    return stats;
  }, [filteredActivities, daysInMonth]);

  const getTheme = (platform: string): PlatformTheme => {
    return PLATFORM_THEMES[platform] || PLATFORM_THEMES['美团闪购'];
  };

  const renderMechanismCells = (mech: Mechanism, platform: string) => {
    const cells: React.ReactNode[] = [];
    const theme = getTheme(platform);
    let day = 1;

    while (day <= daysInMonth) {
      if (day >= mech.startDay && day <= mech.endDay) {
        if (day === mech.startDay) {
          const span = Math.min(mech.endDay, daysInMonth) - mech.startDay + 1;
          cells.push(
            <td
              key={`m-${day}`}
              colSpan={span}
              style={{
                padding: '1px 4px',
                backgroundColor: theme.bg,
                borderLeft: `2px solid ${theme.primary}`,
                borderRight: `1px solid ${theme.border}`,
                borderTop: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
                borderRadius: '2px',
                fontSize: '11px',
                color: theme.text,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '18px',
              }}
            >
              {mech.name}
            </td>
          );
          day += span;
        } else {
          day++;
        }
      } else {
        cells.push(
          <td
            key={`e-${day}`}
            style={{
              border: 'none',
            }}
          />
        );
        day++;
      }
    }
    return cells;
  };

  const getHeaderBg = (d: { isWeekend: boolean; isToday: boolean; holiday: string | null }) => {
    if (d.isToday) return '#1890ff';
    if (d.holiday) return '#fff0f0';
    if (d.isWeekend) return '#fff2e8';
    return '#fafafa';
  };

  const getHeaderColor = (d: { isWeekend: boolean; isToday: boolean; holiday: string | null }) => {
    if (d.isToday) return '#fff';
    if (d.holiday) return '#cf1322';
    if (d.isWeekend) return '#d46b08';
    return '#262626';
  };

  const getWeekdayColor = (d: { isWeekend: boolean; isToday: boolean; holiday: string | null }) => {
    if (d.isToday) return '#fff';
    if (d.holiday) return '#cf1322';
    if (d.isWeekend) return '#d46b08';
    return '#8c8c8c';
  };

  return (
    <div style={{ padding: 0, height: 'calc(100vh - 64px - 48px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0 }}>
        <Title level={4} style={{ margin: 0 }}>营销日历</Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          数据更新时间：{dayjs().format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexShrink: 0,
        padding: '10px 16px', background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0',
      }}>
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={(date) => date && setSelectedMonth(date)}
          style={{ width: 140 }}
          format="YYYY年MM月"
          allowClear={false}
        />
        <Radio.Group
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="全部">全部</Radio.Button>
          <Radio.Button value="美团闪购">美团闪购</Radio.Button>
          <Radio.Button value="淘宝闪购">淘宝闪购</Radio.Button>
          <Radio.Button value="京东到家">京东到家</Radio.Button>
          <Radio.Button value="多点">多点</Radio.Button>
        </Radio.Group>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 4, padding: '0 2px', fontSize: 11, color: '#8c8c8c', flexShrink: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#1890ff' }} />
          今天
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#fff0f0', border: '1px solid #ffccc7' }} />
          节假日
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#fff2e8', border: '1px solid #ffd591' }} />
          周末
        </span>
      </div>

      <div style={{
        background: '#fff', borderRadius: 6, border: '1px solid #e8e8e8',
        flex: 1, overflow: 'auto', minHeight: 0,
      }}>
        <table style={{
          borderCollapse: 'collapse',
          width: '100%',
          tableLayout: 'fixed',
        }}>
          <colgroup>
            <col style={{ width: 180 }} />
            <col style={{ width: 60 }} />
            {days.map((_, i) => (
              <col key={i} />
            ))}
          </colgroup>
          <thead style={{ position: 'sticky', top: 0, zIndex: 4 }}>
            <tr>
              <th style={{
                position: 'sticky', left: 0, zIndex: 5,
                background: '#fafafa', padding: '4px 8px',
                borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8',
                textAlign: 'left', fontWeight: 600, fontSize: '12px',
              }}>
                活动
              </th>
              <th style={{
                position: 'sticky', left: 180, zIndex: 5,
                background: '#fafafa', padding: '4px 4px',
                borderBottom: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8',
                textAlign: 'center', fontWeight: 600, fontSize: '12px',
              }}>
                渠道
              </th>
              {days.map((d, idx) => {
                const stat = dayStats[idx];
                const bg = getHeaderBg(d);
                const color = getHeaderColor(d);
                return (
                  <Tooltip
                    key={d.day}
                    title={
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
                    }
                    placement="bottom"
                  >
                    <th style={{
                      background: bg,
                      padding: '2px 0',
                      borderBottom: '1px solid #e8e8e8',
                      borderRight: '1px solid #f0f0f0',
                      textAlign: 'center',
                      fontWeight: d.isToday ? 700 : d.isWeekend || d.holiday ? 700 : 500,
                      fontSize: '11px',
                      color,
                      lineHeight: '16px',
                      cursor: 'default',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={d.isToday ? {
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 18, height: 18, borderRadius: '50%',
                          backgroundColor: '#1890ff', color: '#fff', fontWeight: 700, lineHeight: '18px',
                        } : undefined}>
                          {d.day}
                        </span>
                        {d.holiday && (
                          <span style={{
                            fontSize: '8px',
                            color: d.isToday ? '#fff' : '#cf1322',
                            lineHeight: '10px',
                            maxWidth: 32, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
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
              <th style={{
                position: 'sticky', left: 0, zIndex: 5,
                background: '#fafafa', padding: '2px 8px',
                borderBottom: '2px solid #e8e8e8', borderRight: '1px solid #e8e8e8',
              }} />
              <th style={{
                position: 'sticky', left: 180, zIndex: 5,
                background: '#fafafa', padding: '2px 4px',
                borderBottom: '2px solid #e8e8e8', borderRight: '1px solid #e8e8e8',
              }} />
              {days.map((d) => (
                <th key={`w-${d.day}`} style={{
                  background: d.isToday ? '#e6f4ff' : d.holiday ? '#fff0f0' : d.isWeekend ? '#fff2e8' : '#fafafa',
                  padding: '1px 0',
                  borderBottom: '2px solid #e8e8e8',
                  borderRight: '1px solid #f0f0f0',
                  textAlign: 'center',
                  fontSize: '10px',
                  fontWeight: 400,
                  color: getWeekdayColor(d),
                }}>
                  {d.weekDay}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((activity) => {
              const mechCount = activity.mechanisms.length;
              const theme = getTheme(activity.platform);
              return activity.mechanisms.map((mech, mechIdx) => (
                <tr key={`${activity.id}-${mechIdx}`}>
                  {mechIdx === 0 && (
                    <>
                      <td
                        rowSpan={mechCount}
                        style={{
                          position: 'sticky', left: 0, zIndex: 2,
                          background: '#fff',
                          padding: '3px 6px',
                          borderBottom: '1px solid #e8e8e8',
                          borderRight: '1px solid #e8e8e8',
                          borderLeft: `3px solid ${theme.primary}`,
                          verticalAlign: 'top',
                          lineHeight: '18px',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '11px', color: '#262626', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>
                          {activity.activityName}
                        </div>
                        <Tag
                          style={{
                            marginTop: 2,
                            fontSize: '10px',
                            lineHeight: '16px',
                            padding: '0 4px',
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.tagBg,
                            color: theme.tagText,
                          }}
                        >
                          {activity.platform}
                        </Tag>
                      </td>
                      <td
                        rowSpan={mechCount}
                        style={{
                          position: 'sticky', left: 180, zIndex: 2,
                          background: '#fff',
                          padding: '3px 4px',
                          borderBottom: '1px solid #e8e8e8',
                          borderRight: '1px solid #e8e8e8',
                          textAlign: 'center',
                          fontSize: '11px',
                          color: '#595959',
                          verticalAlign: 'top',
                        }}
                      >
                        {activity.channel}
                      </td>
                    </>
                  )}
                  {renderMechanismCells(mech, activity.platform)}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketingCalendar;
