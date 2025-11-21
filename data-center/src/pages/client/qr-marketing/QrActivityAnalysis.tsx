import React, { useMemo, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Table, Radio, DatePicker, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ActivityDetail {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: '进行中' | '已结束' | '待开始';
  planCodeCount: number;
  actualScanCount: number;
  planScanRate: number;
  actualScanRate: number;
  repurchaseRate: number;
}

interface PrizeRow {
  key: string;
  name: string;
  total: number;
  probability?: number;
  totalIssued: number;
  remaining: number;
}

interface ProductMetric {
  key: string;
  nameWithCode: string;
  scanTimes: number;
  scanUsers: number;
  scanRate: number;
  repurchaseRate: number;
}

const mockActivities: Record<string, ActivityDetail> = {
  QR001: {
    id: 'QR001',
    name: '康师傅红烧牛肉面扫码有礼活动',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: '进行中',
    planCodeCount: 200000,
    actualScanCount: 156320,
    planScanRate: 75.0,
    actualScanRate: 78.2,
    repurchaseRate: 21.5,
  },
  QR002: {
    id: 'QR002',
    name: '康师傅老坛酸菜面扫码赢红包',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    status: '已结束',
    planCodeCount: 150000,
    actualScanCount: 121540,
    planScanRate: 70.0,
    actualScanRate: 81.0,
    repurchaseRate: 19.8,
  },
  QR003: {
    id: 'QR003',
    name: '康师傅香辣牛肉面扫码送好礼',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    status: '已结束',
    planCodeCount: 120000,
    actualScanCount: 93210,
    planScanRate: 65.0,
    actualScanRate: 77.7,
    repurchaseRate: 17.2,
  },
  QR004: {
    id: 'QR004',
    name: '康师傅国庆扫码翻倍奖励活动',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: '待开始',
    planCodeCount: 260000,
    actualScanCount: 0,
    planScanRate: 80.0,
    actualScanRate: 0,
    repurchaseRate: 0,
  },
};

const prizeData: PrizeRow[] = [
  { key: 'p1', name: '红包 1元', total: 50000, probability: 8, totalIssued: 38120, remaining: 11880 },
  { key: 'p2', name: '红包 2元', total: 20000, probability: 5, totalIssued: 16540, remaining: 3460 },
  { key: 'p3', name: '红包 5元', total: 5000, probability: 1.5, totalIssued: 3200, remaining: 1800 },
  { key: 'p4', name: '实物礼品', total: 1000, probability: 0.3, totalIssued: 480, remaining: 520 },
];

const products: ProductMetric[] = [
  { key: 'pd1', nameWithCode: '红烧牛肉面 6923333422', scanTimes: 13200, scanUsers: 11820, scanRate: 82.4, repurchaseRate: 24.1 },
  { key: 'pd2', nameWithCode: '香辣牛肉面 6923333423', scanTimes: 11800, scanUsers: 10560, scanRate: 79.5, repurchaseRate: 22.3 },
  { key: 'pd3', nameWithCode: '老坛酸菜面 6923333424', scanTimes: 10980, scanUsers: 9800, scanRate: 77.7, repurchaseRate: 21.2 },
  { key: 'pd4', nameWithCode: '鲜虾鱼板面 6923333425', scanTimes: 9800, scanUsers: 8800, scanRate: 75.1, repurchaseRate: 19.5 },
];

const QrActivityAnalysis: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const activity = mockActivities[activityId || 'QR001'] || mockActivities['QR001'];
  const [dateType, setDateType] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>([
    dayjs(activity.startDate),
    dayjs(activity.endDate),
  ]);

  const handleDateTypeChange = (e: any) => {
    setDateType(e.target.value);
  };
  const handleDateRangeChange = (range: any) => {
    setDateRange(range as any);
  };

  const core = useMemo(() => {
    const start = (dateRange && dateRange[0]) ? dateRange[0] : dayjs(activity.startDate);
    const end = (dateRange && dateRange[1]) ? dateRange[1] : dayjs(activity.endDate);
    const days = Math.max(1, end.diff(start, 'day') + 1);
    let scanCount = 0;
    for (let i = 0; i < days; i += 1) {
      const base = 1 + Math.max(0, Math.sin(i / 3)) + (i % 7 >= 1 && i % 7 <= 5 ? 0.8 : 0.2);
      scanCount += Math.round((activity.actualScanCount / Math.max(1, dayjs(activity.endDate).diff(dayjs(activity.startDate), 'day') + 1)) * base * 0.9);
    }
    const scanRateRaw = activity.planCodeCount ? (scanCount / activity.planCodeCount) * 100 : 0;
    const scanRate = Math.max(0, Math.min(50, scanRateRaw));
    const scanUsers = Math.round(scanCount * 0.9);
    const prizeIssued = Math.round(scanCount * 0.2);
    const redAmount = prizeIssued * 3;
    const prevEnd = start.subtract(1, 'day');
    const prevStart = prevEnd.subtract(days - 1, 'day');
    let prevScanCount = 0;
    for (let i = 0; i < days; i += 1) {
      const base = 1 + Math.max(0, Math.sin(i / 3)) + (i % 7 >= 1 && i % 7 <= 5 ? 0.8 : 0.2);
      prevScanCount += Math.round((activity.actualScanCount / Math.max(1, dayjs(activity.endDate).diff(dayjs(activity.startDate), 'day') + 1)) * base * 0.85);
    }
    const prevScanRateRaw = activity.planCodeCount ? (prevScanCount / activity.planCodeCount) * 100 : 0;
    const prevScanUsers = Math.round(prevScanCount * 0.9);
    const prevPrizeIssued = Math.round(prevScanCount * 0.2);
    const prevRedAmount = prevPrizeIssued * 3;
    const mom = {
      scanCount: prevScanCount ? ((scanCount - prevScanCount) / prevScanCount) * 100 : 0,
      scanRate: prevScanRateRaw ? ((scanRateRaw - prevScanRateRaw) / prevScanRateRaw) * 100 : 0,
      scanUsers: prevScanUsers ? ((scanUsers - prevScanUsers) / prevScanUsers) * 100 : 0,
      prizeIssued: prevPrizeIssued ? ((prizeIssued - prevPrizeIssued) / prevPrizeIssued) * 100 : 0,
      redAmount: prevRedAmount ? ((redAmount - prevRedAmount) / prevRedAmount) * 100 : 0,
    };
    return { scanCount, scanRate, scanUsers, prizeIssued, redAmount, mom };
  }, [activity, dateRange]);

  const prizeColumns: ColumnsType<PrizeRow> = [
    { title: '奖品名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '奖品总数', dataIndex: 'total', key: 'total', width: 120 },
    { title: '中奖概率', dataIndex: 'probability', key: 'probability', width: 120, render: (v: number | undefined) => (v == null ? '-' : `${v.toFixed(2)}%`) },
    { title: '奖品总发放数量', dataIndex: 'totalIssued', key: 'totalIssued', width: 160 },
    { title: '奖品剩余数量', dataIndex: 'remaining', key: 'remaining', width: 140 },
  ];

  const scanTrendOption = useMemo(() => {
    const start = (dateRange && dateRange[0]) ? dateRange[0] : dayjs(activity.startDate);
    const end = (dateRange && dateRange[1]) ? dateRange[1] : dayjs(activity.endDate);
    const days = Math.max(1, end.diff(start, 'day') + 1);
    const labels: string[] = [];
    const values: number[] = [];
    for (let i = 0; i < days; i += 1) {
      const d = start.add(i, 'day');
      labels.push(d.format('MM-DD'));
      const base = 1 + Math.max(0, Math.sin(i / 3)) + (i % 7 >= 1 && i % 7 <= 5 ? 0.8 : 0.2);
      values.push(Math.round((activity.actualScanCount / days) * base * 0.9));
    }
    return {
      title: { text: '扫码趋势分析', left: 'center' },
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 24, bottom: 40, top: 40 },
      xAxis: { type: 'category', data: labels },
      yAxis: { type: 'value', name: '扫码次数' },
      series: [{ name: '扫码次数', type: 'line', smooth: true, data: values, lineStyle: { color: '#1890ff' } }],
    };
  }, [activity, dateRange]);

  const productRankingOption = useMemo(() => {
    const sorted = [...products].sort((a, b) => b.scanTimes - a.scanTimes);
    const categories = sorted.map((p) => p.nameWithCode);
    const data = sorted.map((p) => p.scanTimes);
    const metricsByName = sorted.reduce((m, p) => {
      m[p.nameWithCode] = { scanUsers: p.scanUsers, scanRate: p.scanRate, repurchaseRate: p.repurchaseRate };
      return m;
    }, {} as Record<string, { scanUsers: number; scanRate: number; repurchaseRate: number }>);
    return {
      title: { text: '商品扫码排行', left: 'center' },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const name = params.name;
          const value = params.value;
          const extra = metricsByName[name] || { scanUsers: 0, scanRate: 0, repurchaseRate: 0 };
          return `${name}<br/>扫码次数：${value}<br/>扫码人数：${extra.scanUsers.toLocaleString()}<br/>扫码率：${extra.scanRate.toFixed(1)}%<br/>复购率：${extra.repurchaseRate.toFixed(1)}%`;
        },
      },
      grid: { left: 240, right: 80, bottom: 40, top: 40 },
      xAxis: { type: 'value', name: '扫码次数', axisLabel: { overflow: 'truncate' } },
      yAxis: { type: 'category', data: categories, axisLabel: { interval: 0 } },
      series: [{ type: 'bar', data, itemStyle: { color: '#1890ff' }, label: { show: true, position: 'right' } }],
    };
  }, []);

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const sourcePieOption = useMemo(() => {
    const sources = [
      { name: '微信小程序', value: 48000 },
      { name: '线下推广', value: 32000 },
      { name: '自然购买', value: 28000 },
      { name: '线上推广', value: 36000 },
    ];
    const data = sources.map((s) => ({
      ...s,
      selected: selectedSource ? (s.name === selectedSource) : false,
      itemStyle: selectedSource ? { opacity: s.name === selectedSource ? 1 : 0.25 } : undefined,
    }));
    return {
      title: { text: '来源占比', left: 'center' },
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie',
        radius: '60%',
        selectedMode: 'single',
        data,
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
      }],
    };
  }, [selectedSource]);

  const getFunnelData = (source: string | null) => {
    const all = {
      '微信小程序': [
        { name: '活动扫码', value: 48000 },
        { name: '活动参与', value: 42000 },
        { name: '活动抽奖', value: 32000 },
        { name: '活动复购', value: 12000 },
      ],
      '线下推广': [
        { name: '活动扫码', value: 32000 },
        { name: '活动参与', value: 27000 },
        { name: '活动抽奖', value: 19000 },
        { name: '活动复购', value: 7000 },
      ],
      '自然购买': [
        { name: '活动扫码', value: 28000 },
        { name: '活动参与', value: 23000 },
        { name: '活动抽奖', value: 16000 },
        { name: '活动复购', value: 8000 },
      ],
      '线上推广': [
        { name: '活动扫码', value: 36000 },
        { name: '活动参与', value: 30000 },
        { name: '活动抽奖', value: 22000 },
        { name: '活动复购', value: 9000 },
      ],
    } as Record<string, { name: string; value: number }[]>;
    if (source && all[source]) {
      return [{ name: source, type: 'funnel', left: 'center', width: '70%', sort: 'descending', label: { show: true, position: 'inside' }, data: all[source] }];
    }
    return [
      { name: '微信小程序', type: 'funnel', left: '10%', width: '35%', sort: 'descending', label: { show: true, position: 'inside' }, data: all['微信小程序'] },
      { name: '支付宝小程序', type: 'funnel', left: '55%', width: '35%', sort: 'descending', label: { show: true, position: 'inside' }, data: all['支付宝小程序'] },
      { name: '抖音到店', type: 'funnel', left: '10%', top: '55%', width: '35%', sort: 'descending', label: { show: true, position: 'inside' }, data: all['抖音到店'] },
      { name: '美团到店', type: 'funnel', left: '55%', top: '55%', width: '35%', sort: 'descending', label: { show: true, position: 'inside' }, data: all['美团到店'] },
    ];
  };
  const funnelOption = useMemo(() => ({
    title: { text: '来源转化漏斗', left: 'center' },
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.seriesName} - ${p.name}: ${p.value}` },
    legend: { bottom: 0 },
    series: getFunnelData(selectedSource),
  }), [selectedSource]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>活动分析</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>该数据仅作业务分析参考，不作为最终结算依据。</Text>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
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
                value={dateRange}
                onChange={handleDateRangeChange}
                picker={dateType as any}
                style={{ width: 240 }}
                size="small"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="活动详情" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div><Text strong>活动名称：</Text><Text>{activity.name}</Text></div>
              </Col>
              <Col span={24}>
                <div><Text strong>活动周期：</Text><Text>{dayjs(activity.startDate).format('YYYY-MM-DD')} 至 {dayjs(activity.endDate).format('YYYY-MM-DD')}</Text></div>
              </Col>
              <Col span={24}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div><Text strong>状态：</Text><Text>{activity.status}</Text></div>
                  <div><Text strong>计划码量：</Text><Text>{activity.planCodeCount.toLocaleString()}</Text></div>
                </div>
              </Col>
              <Col span={24}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div><Text strong>实际扫码次数：</Text><Text>{activity.actualScanCount.toLocaleString()}</Text></div>
                  <div><Text strong>计划扫码率：</Text><Text>{`${activity.planScanRate.toFixed(1)}%`}</Text></div>
                  <div><Text strong>实际扫码率：</Text><Text>{`${activity.actualScanRate.toFixed(1)}%`}</Text></div>
                  <div><Text strong>复购率：</Text><Text>{`${activity.repurchaseRate.toFixed(1)}%`}</Text></div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Card title="核心指标" style={{ marginBottom: 16 }}>
      <Row gutter={16} justify="space-around" align="middle">
        <Col span={4}>
          <Card style={{ minHeight: 128 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div>扫码次数</div>
              <Tooltip title="扫码的总量">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <Statistic value={core.scanCount} valueStyle={{ color: '#000000', fontSize: 20 }} suffix={<Text type="secondary">环比 {core.mom.scanCount >= 0 ? '+' : '-'}{Math.abs(core.mom.scanCount).toFixed(1)}%</Text>} />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ minHeight: 128 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div>扫码率</div>
              <Tooltip title="扫码量/计划码量">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <Statistic value={core.scanRate} precision={1} valueStyle={{ color: '#000000', fontSize: 20 }} suffix="%" />
            <div style={{ marginTop: 6, fontSize: 12 }}>
              <Text type="secondary">环比 {core.mom.scanRate >= 0 ? '+' : '-'}{Math.abs(core.mom.scanRate).toFixed(1)}%</Text>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ minHeight: 128 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div>扫码人数</div>
              <Tooltip title="扫码的总人数">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <Statistic value={core.scanUsers} valueStyle={{ color: '#000000', fontSize: 20 }} suffix={<Text type="secondary">环比 {core.mom.scanUsers >= 0 ? '+' : '-'}{Math.abs(core.mom.scanUsers).toFixed(1)}%</Text>} />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ minHeight: 128 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div>发奖量</div>
              <Tooltip title="发放的奖品总量">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <Statistic value={core.prizeIssued} valueStyle={{ color: '#000000', fontSize: 20 }} suffix={<Text type="secondary">环比 {core.mom.prizeIssued >= 0 ? '+' : '-'}{Math.abs(core.mom.prizeIssued).toFixed(1)}%</Text>} />
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ minHeight: 128 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div>红包发放总额</div>
              <Tooltip title="发放的红包总金额">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <Statistic value={core.redAmount} valueStyle={{ color: '#000000', fontSize: 20 }} prefix="¥" suffix={<Text type="secondary">环比 {core.mom.redAmount >= 0 ? '+' : '-'}{Math.abs(core.mom.redAmount).toFixed(1)}%</Text>} />
          </Card>
        </Col>
      </Row>
      </Card>

      <Card title="扫码趋势分析" style={{ marginBottom: 16 }}>
        <ReactECharts option={scanTrendOption} style={{ height: 360 }} />
      </Card>

      <Card title="发奖分析" style={{ marginBottom: 16 }}>
        {(() => {
          const summary: PrizeRow = {
            key: 'sum',
            name: '汇总',
            total: prizeData.reduce((s, r) => s + (r.total || 0), 0),
            totalIssued: prizeData.reduce((s, r) => s + (r.totalIssued || 0), 0),
            remaining: prizeData.reduce((s, r) => s + (r.remaining || 0), 0),
          };
          const prizeTableData: PrizeRow[] = [...prizeData, summary];
          return <Table columns={prizeColumns} dataSource={prizeTableData} rowKey="key" pagination={{ pageSize: 10 }} />;
        })()}
      </Card>

      <Card title="商品排行" style={{ marginBottom: 16 }}>
        <ReactECharts option={productRankingOption} style={{ height: 360 }} />
      </Card>

      <Card title="活动转化" style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={10}>
          <Card>
            <ReactECharts option={sourcePieOption} style={{ height: 360 }} onEvents={{ click: (p: any) => setSelectedSource(p.name) }} />
          </Card>
        </Col>
        <Col span={14}>
          <Card>
            <ReactECharts option={funnelOption} style={{ height: 360 }} />
          </Card>
        </Col>
      </Row>
      </Card>
    </div>
  );
};

export default QrActivityAnalysis;