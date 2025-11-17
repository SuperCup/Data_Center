import React, { useState, useMemo } from 'react';
import { Card, DatePicker, Select, Table, Tag, Typography, Tooltip, Empty } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

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
}

// 活动日期数据
interface ActivityDateData {
  date: string; // YYYY-MM-DD
  coupons: CouponDetail[]; // 该日期的优惠券列表
  highlighted?: boolean; // 是否高亮显示
}

// 营销活动
interface MarketingActivity {
  id: string;
  activityName: string; // 活动名称，如 "25年11月万店满减神券"
  platform: Platform;
  channel: Channel; // 参与渠道
  planId?: string; // 方案编号
  submissionDeadline?: string; // 提报截止时间
  dateData: ActivityDateData[]; // 日期数据数组
}

const MarketingCalendar: React.FC = () => {
  // 筛选状态
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');

  // 模拟数据 - 根据图片示例
  const [activities] = useState<MarketingActivity[]>([
    {
      id: '1',
      activityName: '25年11月万店满减神券',
      platform: '美团闪购',
      channel: '全渠道',
      planId: '1970692819795308620',
      submissionDeadline: '2025-10-20 23:59:59',
      dateData: [
        {
          date: '2025-11-14',
          highlighted: true,
          coupons: [
            { id: '1', name: '零食下午茶满49减12_同享券', type: '同享券' },
            { id: '2', name: '夜宵解馋满49减12_同享券', type: '同享券' },
            { id: '3', name: '通用运费券59减8', type: '同享券' }
          ]
        },
        {
          date: '2025-11-15',
          highlighted: true,
          coupons: [
            { id: '4', name: '零食下午茶满29减7_同享券', type: '同享券' },
            { id: '5', name: '夜宵解馋满99减25_同享券', type: '同享券' }
          ]
        },
        {
          date: '2025-11-16',
          highlighted: true,
          coupons: [
            { id: '6', name: '夜间置物满39减10_专享券', type: '专享券' }
          ]
        }
      ]
    },
    {
      id: '2',
      activityName: '25年11月新供给渠道加强',
      platform: '美团闪购',
      channel: '全渠道',
      dateData: [
        {
          date: '2025-11-07',
          highlighted: true,
          coupons: [
            { id: '7', name: '11月全品类-共补券59-30(品牌15)', type: '共补券' }
          ]
        },
        {
          date: '2025-11-08',
          highlighted: true,
          coupons: [
            { id: '8', name: '11月全品类-共补券夜间18点-6点69-35(品牌17元5)', type: '共补券' }
          ]
        },
        {
          date: '2025-11-09',
          highlighted: true,
          coupons: [
            { id: '9', name: '11月全品类-共补券39-20(品牌10)', type: '共补券' }
          ]
        }
      ]
    },
    {
      id: '3',
      activityName: '11月万店满减神券',
      platform: '淘宝闪购',
      channel: '全渠道',
      planId: '68199417',
      dateData: [
        {
          date: '2025-11-01',
          highlighted: true,
          coupons: [
            { id: '10', name: '通用神券79减20', type: '同享券' },
            { id: '11', name: '通用神券59减15', type: '同享券' }
          ]
        },
        {
          date: '2025-11-02',
          highlighted: true,
          coupons: [
            { id: '12', name: '王牌券88减15', type: '同享券' },
            { id: '13', name: '通用神券129减30', type: '同享券' }
          ]
        },
        {
          date: '2025-11-21',
          highlighted: true,
          coupons: [
            { id: '14', name: '通用运费券59减8', type: '同享券' },
            { id: '15', name: '通用神券159减40', type: '同享券' }
          ]
        },
        {
          date: '2025-11-22',
          highlighted: true,
          coupons: [
            { id: '16', name: '通用神券39减8', type: '同享券' }
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

  // 筛选后的活动
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (selectedPlatform !== 'all' && activity.platform !== selectedPlatform) {
        return false;
      }
      // 检查活动是否有数据在当前选中月份
      const hasDataInMonth = activity.dateData.some(dateData => {
        const date = dayjs(dateData.date);
        return date.isSame(selectedMonth, 'month');
      });
      return hasDataInMonth;
    });
  }, [activities, selectedMonth, selectedPlatform]);

  // 获取某个活动在某个日期的优惠券数据
  const getActivityDateCoupons = (activity: MarketingActivity, date: Dayjs): CouponDetail[] => {
    const dateStr = date.format('YYYY-MM-DD');
    const dateData = activity.dateData.find(d => d.date === dateStr);
    return dateData?.coupons || [];
  };

  // 检查日期是否高亮
  const isDateHighlighted = (activity: MarketingActivity, date: Dayjs): boolean => {
    const dateStr = date.format('YYYY-MM-DD');
    const dateData = activity.dateData.find(d => d.date === dateStr);
    return dateData?.highlighted || false;
  };

  // 渲染日期单元格内容
  const renderDateCell = (activity: MarketingActivity, date: Dayjs) => {
    const coupons = getActivityDateCoupons(activity, date);
    const isHighlighted = isDateHighlighted(activity, date);

    if (coupons.length === 0) {
      return <div style={{ minHeight: '40px' }}></div>;
    }

    return (
      <div
        style={{
          minHeight: '40px',
          padding: '4px',
          backgroundColor: isHighlighted ? '#fffbe6' : 'transparent',
          border: isHighlighted ? '1px solid #ffd591' : 'none',
          borderRadius: '2px'
        }}
      >
        {coupons.map((coupon, index) => (
          <Tooltip key={coupon.id} title={coupon.name}>
            <div
              style={{
                fontSize: '12px',
                lineHeight: '1.4',
                marginBottom: index < coupons.length - 1 ? '4px' : 0,
                color: '#333',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {coupon.name}
            </div>
          </Tooltip>
        ))}
      </div>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '活动',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 200,
      fixed: 'left' as const,
      render: (text: string, record: MarketingActivity) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          {record.planId && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                方案编号: {record.planId}
              </Text>
            </div>
          )}
          {record.submissionDeadline && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                提报截止: {record.submissionDeadline}
              </Text>
            </div>
          )}
        </div>
      )
    },
    {
      title: '参与渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 100,
      fixed: 'left' as const,
      render: (channel: Channel) => (
        <Tag color="blue">{channel}</Tag>
      )
    },
    ...monthDates.map(date => ({
      title: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
            {date.format('MM.DD')}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>
            {weekDayMap[date.day()]}
          </div>
        </div>
      ),
      key: date.format('YYYY-MM-DD'),
      width: 120,
      align: 'center' as const,
      render: (_: any, record: MarketingActivity) => renderDateCell(record, date)
    }))
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
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
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
            <Text strong style={{ width: '60px' }}>平台：</Text>
            <Select
              value={selectedPlatform}
              onChange={(value) => setSelectedPlatform(value)}
              style={{ width: 160 }}
            >
              <Option value="all">全部平台</Option>
              <Option value="美团闪购">美团闪购</Option>
              <Option value="淘宝闪购">淘宝闪购</Option>
              <Option value="京东到家">京东到家</Option>
            </Select>
          </div>
        </div>
      </Card>

      {/* 表格展示 */}
      <Card>
        {filteredActivities.length === 0 ? (
          <Empty description="暂无数据" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table
              columns={columns}
              dataSource={filteredActivities}
              rowKey="id"
              pagination={false}
              bordered
              size="small"
              scroll={{ x: 'max-content' }}
              style={{
                fontSize: '12px'
              }}
            />
          </div>
        )}
      </Card>

      {/* 图例说明 */}
      <Card style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Text strong>图例说明：</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#fffbe6', border: '1px solid #ffd591', borderRadius: '2px' }}></div>
            <Text style={{ fontSize: '12px' }}>高亮日期</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag color="blue">全渠道</Tag>
            <Text style={{ fontSize: '12px' }}>参与渠道</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MarketingCalendar;
