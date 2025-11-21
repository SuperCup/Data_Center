import React, { useMemo, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Tag, Table, Radio, Select, Input } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntTooltip } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { ColumnsType } from 'antd/es/table';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

interface ActivityDetail {
  id: string;
  name: string;
  period: string;
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
  todayIssued: number;
  totalIssued: number;
  remaining: number;
}

interface ProductRow {
  key: string;
  nameWithCode: string;
  todayScanCount: number;
  todayScanUsers: number;
  totalScanCount: number;
  totalScanUsers: number;
}

const mockActivityDetail: Record<string, ActivityDetail> = {
  QR001: {
    id: 'QR001',
    name: '康师傅红烧牛肉面扫码有礼活动',
    period: '2025-10-01 ~ 2025-10-31',
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
    period: '2025-09-01 ~ 2025-09-30',
    status: '已结束',
    planCodeCount: 150000,
    actualScanCount: 121540,
    planScanRate: 70.0,
    actualScanRate: 81.0,
    repurchaseRate: 19.8,
  },
};

const Realtime: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const detail = mockActivityDetail[activityId || 'QR001'] || mockActivityDetail['QR001'];

  const [regionType, setRegionType] = useState<'province' | 'city'>('province');
  const [rangeType, setRangeType] = useState<'today' | 'all'>('today');
  type ProductFilterKey = '全部' | '康师傅红烧牛肉面' | '康师傅香辣牛肉面' | '康师傅老坛酸菜面';
  const [selectedProduct, setSelectedProduct] = useState<ProductFilterKey>('全部');

  const productMap: Record<ProductFilterKey, (p: ProductRow) => boolean> = useMemo(() => ({
    全部: (p: ProductRow) => true,
    康师傅红烧牛肉面: (p: ProductRow) => p.nameWithCode.includes('红烧牛肉面'),
    康师傅香辣牛肉面: (p: ProductRow) => p.nameWithCode.includes('香辣牛肉面'),
    康师傅老坛酸菜面: (p: ProductRow) => p.nameWithCode.includes('老坛酸菜面'),
  }), []);

  const prizeColumns: ColumnsType<PrizeRow> = [
    { title: '奖品名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '奖品总数', dataIndex: 'total', key: 'total', width: 120 },
    { title: '中奖概率', dataIndex: 'probability', key: 'probability', width: 120, render: (v: number, r: PrizeRow) => (r.key === 'sum' || v === undefined ? '-' : `${v.toFixed(2)}%`) },
    { title: '今日发放数量', dataIndex: 'todayIssued', key: 'todayIssued', width: 140 },
    { title: '奖品总发放数量', dataIndex: 'totalIssued', key: 'totalIssued', width: 160 },
    { title: '奖品剩余数量', dataIndex: 'remaining', key: 'remaining', width: 140 },
  ];

  const prizeData: PrizeRow[] = [
    { key: 'p1', name: '红包 1元', total: 50000, probability: 8, todayIssued: 1520, totalIssued: 38120, remaining: 11880 },
    { key: 'p2', name: '红包 2元', total: 20000, probability: 5, todayIssued: 820, totalIssued: 16540, remaining: 3460 },
    { key: 'p3', name: '红包 5元', total: 5000, probability: 1.5, todayIssued: 220, totalIssued: 3200, remaining: 1800 },
    { key: 'p4', name: '实物礼品', total: 1000, probability: 0.3, todayIssued: 25, totalIssued: 480, remaining: 520 },
  ];

  const prizeSummary = useMemo(() => {
    const typesCount = prizeData.length;
    const total = prizeData.reduce((s, r) => s + (r.total || 0), 0);
    const todayIssued = prizeData.reduce((s, r) => s + (r.todayIssued || 0), 0);
    const totalIssued = prizeData.reduce((s, r) => s + (r.totalIssued || 0), 0);
    const remaining = prizeData.reduce((s, r) => s + (r.remaining || 0), 0);
    return { typesCount, total, todayIssued, totalIssued, remaining };
  }, [prizeData]);

  const prizeDataWithSummary = useMemo(() => {
    const summary: PrizeRow = {
      key: 'sum',
      name: '汇总',
      total: prizeSummary.total,
      todayIssued: prizeSummary.todayIssued,
      totalIssued: prizeSummary.totalIssued,
      remaining: prizeSummary.remaining,
    };
    return [...prizeData, summary];
  }, [prizeData, prizeSummary]);

  const productColumns: ColumnsType<ProductRow> = [
    { title: '排名', key: 'rank', width: 80, render: (_: any, __: ProductRow, index: number) => index + 1 },
    { title: '产品名称+69码', dataIndex: 'nameWithCode', key: 'nameWithCode', width: 260 },
    { title: '今日扫码次数', dataIndex: 'todayScanCount', key: 'todayScanCount', width: 140 },
    { title: '今日扫码人数', dataIndex: 'todayScanUsers', key: 'todayScanUsers', width: 140 },
    { title: '总扫码次数', dataIndex: 'totalScanCount', key: 'totalScanCount', width: 140 },
    { title: '总扫码人数', dataIndex: 'totalScanUsers', key: 'totalScanUsers', width: 140 },
  ];

  const productData: ProductRow[] = [
    { key: 'pd1', nameWithCode: '红烧牛肉面 6923333422', todayScanCount: 820, todayScanUsers: 740, totalScanCount: 13200, totalScanUsers: 11820 },
    { key: 'pd2', nameWithCode: '香辣牛肉面 6923333423', todayScanCount: 730, todayScanUsers: 660, totalScanCount: 11800, totalScanUsers: 10560 },
    { key: 'pd3', nameWithCode: '老坛酸菜面 6923333424', todayScanCount: 690, todayScanUsers: 615, totalScanCount: 10980, totalScanUsers: 9800 },
  ];

  const filteredProducts = useMemo(() => {
    const matcher = productMap[selectedProduct];
    return productData.filter(matcher);
  }, [selectedProduct, productMap, productData]);

  const metrics = useMemo(() => {
    const todayScanCount = filteredProducts.reduce((sum, p) => sum + p.todayScanCount, 0);
    const todayScanUsers = filteredProducts.reduce((sum, p) => sum + p.todayScanUsers, 0);
    const todayPrizeIssued = Math.round(todayScanCount * 0.2);
    const todayRedEnvelopeAmount = todayPrizeIssued * 3;
    return { todayScanCount, todayScanUsers, todayPrizeIssued, todayRedEnvelopeAmount };
  }, [filteredProducts]);

  const hourlyOption = useMemo(() => {
    const hours = Array.from({ length: 25 }, (_, i) => i);
    const base = hours.map((h) => 1 + Math.max(0, Math.sin(h / 3)) + (h > 8 && h < 22 ? 1.2 : 0.2));
    const baseSum = base.reduce((a, b) => a + b, 0);
    const scale = metrics.todayScanCount > 0 ? metrics.todayScanCount / baseSum : 0;
    const values = base.map((v) => Math.round(v * scale));
    return {
      title: { text: '扫码量时序趋势（0-24点）', left: 'center' },
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 24, bottom: 40, top: 40 },
      xAxis: { type: 'category', name: '时间点', nameLocation: 'middle', nameGap: 30, data: hours.map((h) => `${h}:00`) },
      yAxis: { type: 'value', name: '扫码量', nameLocation: 'middle', nameGap: 45 },
      series: [{ name: '扫码量', type: 'line', smooth: true, data: values, lineStyle: { color: '#1890ff' } }],
    };
  }, [metrics.todayScanCount]);

  const regionCategories = useMemo(() => {
    if (regionType === 'province') {
      return ['广东', '江苏', '浙江', '山东', '河南', '四川', '湖北', '福建'];
    }
    return ['广州', '深圳', '苏州', '杭州', '青岛', '郑州', '成都', '武汉'];
  }, [regionType]);

  const regionValues = useMemo(() => {
    const base = rangeType === 'today' ? 1000 : 25000;
    return regionCategories.map((_, idx) => Math.round(base * (1 - idx * 0.06)));
  }, [regionCategories, rangeType]);

  const regionOption = useMemo(() => ({
    title: { text: `${regionType === 'province' ? '省份' : '城市'}扫码排行（${rangeType === 'today' ? '今日' : '全量'}）`, left: 'center' },
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 24, bottom: 40, top: 40 },
    xAxis: { type: 'category', data: regionCategories },
    yAxis: { type: 'value', name: '扫码次数' },
    series: [{ type: 'bar', data: regionValues, itemStyle: { color: '#1890ff' } }],
  }), [regionCategories, regionValues, regionType, rangeType]);

  const [regionSearch, setRegionSearch] = useState<string>('');

  const detailColumns = useMemo(() => {
    const isProvince = regionType === 'province';
    const isToday = rangeType === 'today';
    const nameTitle = isProvince ? '省份' : '城市';
    if (isToday) {
      return [
        { title: nameTitle, dataIndex: 'name', key: 'name', width: 120 },
        { title: '今日扫码量', dataIndex: 'todayScanCount', key: 'todayScanCount', width: 120 },
        { title: '今日扫码人数', dataIndex: 'todayScanUsers', key: 'todayScanUsers', width: 120 },
        { title: '今日扫码率', dataIndex: 'todayScanRate', key: 'todayScanRate', width: 120, render: (v: number) => `${v.toFixed(1)}%` },
        { title: '今日复购率', dataIndex: 'todayRepurchaseRate', key: 'todayRepurchaseRate', width: 120, render: (v: number) => `${v.toFixed(1)}%` },
        { title: '今日发奖量', dataIndex: 'todayPrizeIssued', key: 'todayPrizeIssued', width: 120 },
        { title: '今日红包发放金额', dataIndex: 'todayRedEnvelopeAmount', key: 'todayRedEnvelopeAmount', width: 160, render: (v: number) => `¥${v.toLocaleString()}` },
      ] as ColumnsType<any>;
    }
    return [
      { title: nameTitle, dataIndex: 'name', key: 'name', width: 120 },
      { title: '扫码量', dataIndex: 'scanCount', key: 'scanCount', width: 120 },
      { title: '扫码人数', dataIndex: 'scanUsers', key: 'scanUsers', width: 120 },
      { title: '扫码率', dataIndex: 'scanRate', key: 'scanRate', width: 120, render: (v: number) => `${v.toFixed(1)}%` },
      { title: '复购率', dataIndex: 'repurchaseRate', key: 'repurchaseRate', width: 120, render: (v: number) => `${v.toFixed(1)}%` },
      { title: '发奖量', dataIndex: 'prizeIssued', key: 'prizeIssued', width: 120 },
      { title: '红包发放金额', dataIndex: 'redEnvelopeAmount', key: 'redEnvelopeAmount', width: 160, render: (v: number) => `¥${v.toLocaleString()}` },
    ] as ColumnsType<any>;
  }, [regionType, rangeType]);

  const detailData = useMemo(() => {
    const data = regionCategories.map((name: string, idx: number) => {
      const baseToday = regionValues[idx];
      const todayUsers = Math.max(1, Math.round(baseToday * 0.9));
      const todayRate = Math.max(0, 60 + (10 - idx) * 2);
      const todayRep = Math.max(0, 20 - idx);
      const todayPrize = Math.round(baseToday * 0.25);
      const todayMoney = todayPrize * 3;
      const allFactor = 25;
      const allCount = baseToday * allFactor;
      const allUsers = todayUsers * allFactor;
      const allRate = todayRate;
      const allRep = todayRep;
      const allPrize = todayPrize * allFactor;
      const allMoney = todayMoney * allFactor;
      return {
        name,
        todayScanCount: baseToday,
        todayScanUsers: todayUsers,
        todayScanRate: todayRate,
        todayRepurchaseRate: todayRep,
        todayPrizeIssued: todayPrize,
        todayRedEnvelopeAmount: todayMoney,
        scanCount: allCount,
        scanUsers: allUsers,
        scanRate: allRate,
        repurchaseRate: allRep,
        prizeIssued: allPrize,
        redEnvelopeAmount: allMoney,
      };
    });
    const q = regionSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item: any) => item.name.toLowerCase().includes(q));
  }, [regionCategories, regionValues, regionSearch]);

  return (
    <div style={{ padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>实时动态</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Select value={selectedProduct} onChange={setSelectedProduct} style={{ width: '100%' }}>
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="康师傅红烧牛肉面">康师傅红烧牛肉面</Select.Option>
            <Select.Option value="康师傅香辣牛肉面">康师傅香辣牛肉面</Select.Option>
            <Select.Option value="康师傅老坛酸菜面">康师傅老坛酸菜面</Select.Option>
          </Select>
        </Col>
      </Row>

      <Card title="活动详情" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div>
                  <Text strong>活动名称：</Text>
                  <Text>{detail.name}</Text>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <Text strong>活动周期：</Text>
                  <Text>{detail.period}</Text>
                </div>
              </Col>
              <Col span={24}>
                <div>
                  <Text strong>状态：</Text>
                  <Tag color={detail.status === '进行中' ? 'processing' : detail.status === '已结束' ? 'success' : 'warning'}>
                    {detail.status}
                  </Tag>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <div>
              <Text strong>码量与扫码：</Text>
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text>计划码量：</Text>
                  <Text strong style={{ color: '#1890ff' }}>{detail.planCodeCount.toLocaleString()}</Text>
                </div>
                <div>
                  <Text>实际扫码量：</Text>
                  <Text strong style={{ color: '#52c41a' }}>{detail.actualScanCount.toLocaleString()}</Text>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <Text>计划扫码率：{detail.planScanRate.toFixed(1)}%</Text>
                  <Text>实际扫码率：{detail.actualScanRate.toFixed(1)}%</Text>
                  <Text>复购率：{detail.repurchaseRate.toFixed(1)}%</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="核心指标" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>今日扫码量</span>
                <AntTooltip title={<div>今天的扫码总量</div>} placement="topLeft">
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic value={metrics.todayScanCount} suffix={<Text type="secondary">环比 +3.2%</Text>} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>今日扫码人数</span>
                <AntTooltip title={<div>今天的扫码总人数</div>} placement="topLeft">
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic value={metrics.todayScanUsers} suffix={<Text type="secondary">环比 +2.5%</Text>} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>今日发奖量</span>
                <AntTooltip title={<div>今天发放的奖品总量</div>} placement="topLeft">
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic value={metrics.todayPrizeIssued} suffix={<Text type="secondary">环比 -1.1%</Text>} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>今日红包发放金额</span>
                <AntTooltip title={<div>今天发放的红包总金额</div>} placement="topLeft">
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic value={metrics.todayRedEnvelopeAmount} suffix={<Text type="secondary">元 环比 +4.0%</Text>} />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="扫码量时序趋势" style={{ marginBottom: 16 }}>
        <ReactECharts option={hourlyOption} style={{ height: 360 }} />
      </Card>

      <Card title="发奖分析" style={{ marginBottom: 16 }}>
        <Table columns={prizeColumns} dataSource={prizeDataWithSummary} rowKey="key" pagination={{ pageSize: 10 }} />
      </Card>

      <Card title="产品排行" style={{ marginBottom: 16 }}>
        <Table columns={productColumns} dataSource={productData} rowKey="key" pagination={{ pageSize: 10 }} />
      </Card>

      <Card title="省份/城市扫码排行">
        <Space style={{ marginBottom: 12 }}>
          <Radio.Group value={regionType} onChange={(e) => setRegionType(e.target.value)}>
            <Radio.Button value="province">省份</Radio.Button>
            <Radio.Button value="city">城市</Radio.Button>
          </Radio.Group>
          <Radio.Group value={rangeType} onChange={(e) => setRangeType(e.target.value)}>
            <Radio.Button value="today">今日</Radio.Button>
            <Radio.Button value="all">全量</Radio.Button>
          </Radio.Group>
        </Space>
        <ReactECharts option={regionOption} style={{ height: 360 }} />
      </Card>

      <Card title="省份/城市扫码明细">
        <Row gutter={16} style={{ marginBottom: 12 }}>
          <Col span={8}>
            <Input placeholder="搜索省份/城市" value={regionSearch} onChange={(e) => setRegionSearch(e.target.value)} />
          </Col>
        </Row>
        <Table columns={detailColumns} dataSource={detailData} rowKey={(r) => r.name} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Realtime;