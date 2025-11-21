import React, { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Radio } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const { Title, Text } = Typography;

const QrUserAnalysis: React.FC = () => {
  const [scanTimeMode, setScanTimeMode] = useState<'hour' | 'week'>('hour');
  const [areaMode, setAreaMode] = useState<'province' | 'city'>('province');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    fetch('/china-map.json').then((r) => r.json()).then((geo) => {
      echarts.registerMap('china', geo);
      setMapReady(true);
    }).catch(() => setMapReady(false));
  }, []);

  const funnelOption = useMemo(() => ({
    title: { text: '用户转化分析', left: 'center' },
    tooltip: { trigger: 'item', formatter: ({ name, value }: any) => `${name}: ${value}` },
    legend: { bottom: 0 },
    series: [{
      name: '转化', type: 'funnel', left: 'center', width: '70%', sort: 'descending', label: { show: true, position: 'inside' },
      data: [
        { name: '活动扫码', value: 56000 },
        { name: '活动参与', value: 46000 },
        { name: '活动抽奖', value: 32000 },
        { name: '活动复购', value: 14000 },
      ],
    }],
  }), []);

  const coreMetrics = useMemo(() => {
    const purchaseCount = 28640;
    const avgRepurchase = 1.6;
    return { purchaseCount, avgRepurchase };
  }, []);

  const scanTimeOption = useMemo(() => {
    if (scanTimeMode === 'hour') {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const points = hours.map((h) => {
        const v = Math.round(800 + Math.sin(h / 2) * 300 + (h >= 9 && h <= 21 ? 600 : 0));
        return [h, v, Math.max(8, Math.round(v / 120))];
      });
      return {
        title: { text: '扫码时间分布（24小时）', left: 'center' },
        tooltip: { trigger: 'item', formatter: (p: any) => `小时：${p.value[0]} 点<br/>扫码次数：${p.value[1]}` },
        xAxis: { type: 'value', name: '小时', min: 0, max: 23 },
        yAxis: { type: 'value', name: '扫码次数' },
        grid: { left: 60, right: 24, bottom: 60, top: 60 },
        series: [{ type: 'scatter', data: points, symbolSize: (d: any) => d[2], itemStyle: { color: '#40a9ff' } }],
      };
    }
    const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data: number[][] = [];
    week.forEach((w, wi) => {
      hours.forEach((h) => {
        const base = 400 + Math.sin((h + wi) / 2) * 200 + (h >= 10 && h <= 20 ? 500 : 0) + (wi >= 5 ? 300 : 0);
        const v = Math.round(base);
        data.push([h, wi, Math.max(6, Math.round(v / 140))]);
      });
    });
    return {
      title: { text: '扫码时间分布（周一-周日）', left: 'center' },
      tooltip: { trigger: 'item', formatter: (p: any) => `星期：${week[p.value[1]]}<br/>小时：${p.value[0]} 点` },
      grid: { left: 80, right: 24, bottom: 60, top: 60 },
      xAxis: { type: 'value', name: '小时', min: 0, max: 23 },
      yAxis: { type: 'category', data: week },
      series: [{ type: 'scatter', data, symbolSize: (d: any) => d[2], itemStyle: { color: '#1890ff' } }],
    };
  }, [scanTimeMode]);

  const provinceOption = useMemo(() => ({
    title: { text: '用户分布（省份）', left: 'center' },
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}: ${p.value || 0}` },
    visualMap: { min: 0, max: 50000, left: 20, bottom: 20, text: ['高', '低'], calculable: true },
    series: [{ type: 'map', map: 'china', roam: true, label: { show: false },
      data: [
        { name: '广东', value: 48000 },
        { name: '江苏', value: 36000 },
        { name: '浙江', value: 34000 },
        { name: '山东', value: 30000 },
        { name: '河南', value: 28000 },
        { name: '四川', value: 26000 },
        { name: '湖北', value: 22000 },
        { name: '北京', value: 20000 },
        { name: '上海', value: 21000 },
        { name: '重庆', value: 19000 },
      ],
    }],
  }), []);

  const cityOption = useMemo(() => ({
    title: { text: '用户分布（城市）', left: 'center' },
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}: ${p.value[2]}` },
    geo: { map: 'china', roam: true },
    series: [{ type: 'scatter', coordinateSystem: 'geo',
      data: [
        { name: '广州', value: [113.2644, 23.1291, 18000] },
        { name: '深圳', value: [114.0579, 22.5431, 17500] },
        { name: '杭州', value: [120.1551, 30.2741, 16800] },
        { name: '上海', value: [121.4737, 31.2304, 21000] },
        { name: '北京', value: [116.4074, 39.9042, 20000] },
        { name: '成都', value: [104.0665, 30.5728, 16200] },
        { name: '武汉', value: [114.3054, 30.5931, 15800] },
        { name: '西安', value: [108.9398, 34.3416, 12600] },
        { name: '南京', value: [118.7969, 32.0603, 14200] },
      ],
      symbolSize: (val: any) => Math.max(6, Math.round(val[2] / 1500)),
      itemStyle: { color: '#fa8c16' },
    }],
  }), []);

  const repurchaseOption = useMemo(() => ({
    title: { text: '复购次数分布', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0 },
    series: [{ type: 'pie', radius: '60%', data: [
      { name: '1次', value: 16800 },
      { name: '2次', value: 9400 },
      { name: '3次及以上', value: 5200 },
    ], }],
  }), []);

  const productOption = useMemo(() => {
    const items = [
      { name: '红烧牛肉面 6923333422', value: 13200 },
      { name: '香辣牛肉面 6923333423', value: 11800 },
      { name: '老坛酸菜面 6923333424', value: 10980 },
      { name: '鲜虾鱼板面 6923333425', value: 9800 },
    ];
    return {
      title: { text: '产品分析', left: 'center' },
      tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>购买次数：${p.value}` },
      grid: { left: 240, right: 80, bottom: 40, top: 40 },
      xAxis: { type: 'value', name: '购买次数' },
      yAxis: { type: 'category', data: items.map((i) => i.name), axisLabel: { interval: 0 } },
      series: [{ type: 'bar', data: items.map((i) => i.value), itemStyle: { color: '#1890ff' }, label: { show: true, position: 'right' } }],
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>用户分析</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>该数据仅作业务分析参考，不作为最终结算依据。</Text>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <ReactECharts option={funnelOption} style={{ height: 360 }} />
      </Card>

      <Card title="核心指标" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>购买人数</div>
              <Statistic value={coreMetrics.purchaseCount} valueStyle={{ color: '#000000', fontSize: 20 }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>人均复购</div>
              <Statistic value={coreMetrics.avgRepurchase} precision={1} valueStyle={{ color: '#000000', fontSize: 20 }} />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="扫码时间" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div />
          <Radio.Group value={scanTimeMode} onChange={(e) => setScanTimeMode(e.target.value)} size="small">
            <Radio.Button value="hour">24小时</Radio.Button>
            <Radio.Button value="week">周一-周日</Radio.Button>
          </Radio.Group>
        </div>
        <ReactECharts option={scanTimeOption} style={{ height: 380 }} />
      </Card>

      <Card title="用户分布" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div />
          <Radio.Group value={areaMode} onChange={(e) => setAreaMode(e.target.value)} size="small">
            <Radio.Button value="province">省份</Radio.Button>
            <Radio.Button value="city">城市</Radio.Button>
          </Radio.Group>
        </div>
        {mapReady ? (
          <ReactECharts option={areaMode === 'province' ? provinceOption : cityOption} style={{ height: 420 }} notMerge lazyUpdate />
        ) : (
          <div style={{ textAlign: 'center', padding: 16 }}><Text type="secondary">地图加载中...</Text></div>
        )}
      </Card>

      <Card title="复购次数" style={{ marginBottom: 16 }}>
        <ReactECharts option={repurchaseOption} style={{ height: 360 }} />
      </Card>

      <Card title="产品分析" style={{ marginBottom: 16 }}>
        <ReactECharts option={productOption} style={{ height: 360 }} />
      </Card>
    </div>
  );
};

export default QrUserAnalysis;