import React, { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Typography, Radio, Select, Space, Tag, List } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const { Title, Text } = Typography;

const mockActivities = [
  { label: '全量', value: 'all' },
  { label: '康师傅红烧牛肉面扫码有礼活动', value: 'QR001' },
  { label: '康师傅老坛酸菜面扫码赢红包', value: 'QR002' },
  { label: '康师傅香辣牛肉面扫码送好礼', value: 'QR003' },
  { label: '康师傅国庆扫码翻倍奖励活动', value: 'QR004' },
];

const activityDetails: Record<string, any> = {
  all: {
    name: '全量活动汇总',
    period: '2025-01-01 ~ 2025-12-31',
    status: '进行中',
    planCodeCount: 1000000,
    actualScanCount: 785420,
    actualScanRate: 78.5,
    repurchaseRate: 22.4,
  },
  QR001: {
    id: 'QR001',
    name: '康师傅红烧牛肉面扫码有礼活动',
    period: '2025-10-01 ~ 2025-10-31',
    status: '进行中',
    planCodeCount: 200000,
    actualScanCount: 156320,
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
    actualScanRate: 81.0,
    repurchaseRate: 19.8,
  },
  QR003: {
    id: 'QR003',
    name: '康师傅香辣牛肉面扫码送好礼',
    period: '2025-08-01 ~ 2025-08-31',
    status: '已结束',
    planCodeCount: 120000,
    actualScanCount: 93210,
    actualScanRate: 77.7,
    repurchaseRate: 17.2,
  },
  QR004: {
    id: 'QR004',
    name: '康师傅国庆扫码翻倍奖励活动',
    period: '2025-11-01 ~ 2025-11-30',
    status: '待开始',
    planCodeCount: 260000,
    actualScanCount: 0,
    actualScanRate: 0,
    repurchaseRate: 0,
  },
};

const QrUserAnalysis: React.FC = () => {
  const [filterDimension, setFilterDimension] = useState<'activity' | 'time'>('activity');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['all']);
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');

  const currentDetail = useMemo(() => {
    if (filterDimension === 'time') return null;
    if (selectedActivities.includes('all')) {
      return activityDetails.all;
    }
    if (selectedActivities.length === 1) {
      return activityDetails[selectedActivities[0]] || activityDetails.all;
    }
    const selected = selectedActivities.map(id => activityDetails[id]).filter(Boolean);
    return {
      name: `已选 ${selected.length} 个活动`,
      period: '自定义周期',
      status: '进行中',
      planCodeCount: selected.reduce((s: number, a: any) => s + a.planCodeCount, 0),
      actualScanCount: selected.reduce((s: number, a: any) => s + a.actualScanCount, 0),
      actualScanRate: selected.reduce((s: number, a: any) => s + a.actualScanCount, 0) / selected.reduce((s: number, a: any) => s + a.planCodeCount, 1) * 100,
      repurchaseRate: selected.reduce((s: number, a: any) => s + a.repurchaseRate, 0) / selected.length,
    };
  }, [selectedActivities, filterDimension]);

  const handleActivityChange = (values: string[]) => {
    if (values.includes('all') && !selectedActivities.includes('all')) {
      setSelectedActivities(['all']);
    } else if (values.includes('all') && values.length > 1) {
      setSelectedActivities(values.filter(v => v !== 'all'));
    } else if (values.length === 0) {
      setSelectedActivities(['all']);
    } else {
      setSelectedActivities(values);
    }
  };

  const [areaMode, setAreaMode] = useState<'province' | 'city'>('province');
  const [mapReady, setMapReady] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>('全部');

  useEffect(() => {
    fetch('/china-map.json').then((r) => r.json()).then((geo) => {
      echarts.registerMap('china', geo);
      setMapReady(true);
    }).catch(() => setMapReady(false));
  }, []);

  const sourcePieOption = useMemo(() => {
    const sources = [
      { name: '微信小程序', value: 48000 },
      { name: '线下推广', value: 32000 },
      { name: '自然购买', value: 28000 },
      { name: '线上推广', value: 36000 },
    ];
    const data = sources.map((s) => {
      const isSelected = selectedSource === '全部' || !selectedSource ? true : s.name === selectedSource;
      return {
        ...s,
        selected: s.name === selectedSource,
        itemStyle: { opacity: isSelected ? 1 : 0.25 },
      };
    });
    return {
      title: { text: '来源占比', left: 'center' },
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0 },
      series: [{
        type: 'pie',
        radius: '60%',
        selectedMode: 'single',
        data,
        label: { show: true, formatter: '{b} {d}%' },
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
      }],
    };
  }, [selectedSource]);

  const getFunnelData = (source: string | null) => {
    const sourceColors = {
      '全部': ['#5b8ff9', '#5b8ff9', '#5b8ff9', '#5b8ff9'],
      '微信小程序': ['#738adb', '#5470c6', '#3a53a1', '#2a3b72'],
      '线下推广': ['#b1da9c', '#91cc75', '#72a65a', '#538040'],
      '自然购买': ['#fbd685', '#fac858', '#e1b142', '#c89a2c'],
      '线上推广': ['#f38d8d', '#ee6666', '#d14d4d', '#b43434'],
    };
    const currentSource = (source || '全部') as keyof typeof sourceColors;
    const colors = sourceColors[currentSource];

    const allSourcesData = {
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
    };

    let displayData;
    if (currentSource === '全部') {
      const stages = ['活动扫码', '活动参与', '活动抽奖', '活动复购'];
      displayData = stages.map(stage => {
        const totalValue = Object.values(allSourcesData).reduce((sum, sourceData) => {
          const stageItem = sourceData.find(item => item.name === stage);
          return sum + (stageItem ? stageItem.value : 0);
        }, 0);
        return { name: stage, value: totalValue };
      });
    } else {
      displayData = allSourcesData[currentSource as keyof typeof allSourcesData] || allSourcesData['微信小程序'];
    }

    const data = displayData.map((item, idx) => ({
      ...item,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: colors[idx] },
            { offset: 1, color: colors[idx + 1] || colors[idx] }
          ]
        }
      }
    }));

    return [{
      name: currentSource,
      type: 'funnel',
      left: '10%',
      width: '60%',
      sort: 'descending',
      label: { show: true, position: 'right', formatter: '{b}: {c}' },
      data
    }];
  };

  const funnelOption = useMemo(() => ({
    title: { text: '来源转化漏斗', left: 'center' },
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.seriesName} - ${p.name}: ${p.value}` },
    series: getFunnelData(selectedSource),
  }), [selectedSource]);

  const provinceData = [
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
    { name: '河北', value: 17500 },
    { name: '安徽', value: 16800 },
    { name: '福建', value: 16500 },
    { name: '湖南', value: 16200 },
    { name: '辽宁', value: 15500 },
    { name: '江西', value: 14800 },
    { name: '陕西', value: 14200 },
    { name: '云南', value: 13500 },
    { name: '广西', value: 12800 },
    { name: '山西', value: 12200 },
    { name: '黑龙江', value: 11500 },
    { name: '贵州', value: 10800 },
    { name: '吉林', value: 10200 },
    { name: '天津', value: 9800 },
    { name: '新疆', value: 8500 },
    { name: '内蒙古', value: 8200 },
    { name: '甘肃', value: 7800 },
    { name: '海南', value: 6500 },
    { name: '宁夏', value: 5200 },
    { name: '青海', value: 4100 },
    { name: '西藏', value: 2500 },
  ];

  const cityData = [
    { name: '广州', value: [113.2644, 23.1291, 18000] },
    { name: '深圳', value: [114.0579, 22.5431, 17500] },
    { name: '杭州', value: [120.1551, 30.2741, 16800] },
    { name: '上海', value: [121.4737, 31.2304, 21000] },
    { name: '北京', value: [116.4074, 39.9042, 20000] },
    { name: '成都', value: [104.0665, 30.5728, 16200] },
    { name: '武汉', value: [114.3054, 30.5931, 15800] },
    { name: '西安', value: [108.9398, 34.3416, 12600] },
    { name: '南京', value: [118.7969, 32.0603, 14200] },
  ];

  const provinceOption = useMemo(() => ({
    title: { text: '用户分布（省份）', left: 'center' },
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}: ${p.value || 0}` },
    visualMap: {
      min: 0, max: 50000, left: 20, bottom: 20,
      text: ['高', '低'], calculable: true,
      inRange: { color: ['#e6f7ff', '#1890ff', '#003a8c'] }
    },
    series: [{ type: 'map', map: 'china', roam: true, label: { show: false }, data: provinceData }],
  }), []);

  const cityOption = useMemo(() => ({
    title: { text: '用户分布（城市）', left: 'center' },
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}: ${p.value[2]}` },
    geo: { map: 'china', roam: true, itemStyle: { areaColor: '#f5f5f5', borderColor: '#d9d9d9' } },
    visualMap: {
      min: 0, max: 25000, left: 20, bottom: 20,
      text: ['高', '低'], calculable: true, dimension: 2,
      inRange: { color: ['#fff7e6', '#ffa940', '#d46b08'] }
    },
    series: [{ type: 'scatter', coordinateSystem: 'geo', data: cityData, symbolSize: (val: any) => Math.max(6, Math.round(val[2] / 1500)), itemStyle: { color: '#fa8c16' } }],
  }), []);

  const genderOption = useMemo(() => ({
    title: { text: '用户性别占比', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie', radius: '60%',
      data: [
        { name: '男', value: 15240 },
        { name: '女', value: 12100 },
        { name: '无', value: 1300 },
      ],
      label: { show: true, formatter: '{b} {d}%' }
    }],
  }), []);

  const ageOption = useMemo(() => ({
    title: { text: '用户年龄占比', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['0-17', '18-24', '25-29', '30-39', '40-49', '50及以上'], axisLabel: { interval: 0 } },
    yAxis: { type: 'value' },
    series: [{ name: '人数', type: 'bar', barWidth: '60%', data: [1200, 5800, 8600, 7200, 4100, 1740], itemStyle: { color: '#1890ff' } }]
  }), []);

  const educationOption = useMemo(() => ({
    title: { text: '用户学历占比', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士'] },
    series: [{ name: '人数', type: 'bar', data: [800, 2100, 4500, 6800, 9200, 3400, 1840], itemStyle: { color: '#52c41a' } }]
  }), []);

  const cityTierOption = useMemo(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 12, right: 12, bottom: 4, top: 30, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['一线城市', '新一线城市', '二线城市', '三线城市', '四线城市', '五线城市', '其他城市'],
      axisLabel: { interval: 0, fontSize: 11, rotate: 30 },
    },
    yAxis: { type: 'value', name: '用户数' },
    series: [{
      name: '用户数',
      type: 'bar',
      barWidth: '55%',
      data: [58200, 46800, 35600, 24300, 15800, 8900, 4200],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#1890ff' },
          { offset: 1, color: '#69c0ff' },
        ]),
      },
      label: { show: true, position: 'top', fontSize: 11, color: '#595959' },
    }],
  }), []);

  const consumptionPreferenceOption = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      data: [
        { name: '低消费人群', value: 42800, itemStyle: { color: '#69c0ff' } },
        { name: '中消费人群', value: 86500, itemStyle: { color: '#1890ff' } },
        { name: '高消费人群', value: 34200, itemStyle: { color: '#003a8c' } },
      ],
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 12 },
    }],
  }), []);

  const consumptionLocationOption = useMemo(() => {
    const locations = ['房产小区', '公司企业', '购物', '基础设施', '教育学校', '酒店宾馆', '旅游景点', '美食', '汽车', '生活服务', '文化场馆', '医疗保健', '银行金融', '娱乐休闲', '运动健身'];
    const values = [18200, 24500, 32100, 8600, 15800, 9200, 12400, 28600, 6800, 19500, 5200, 11300, 7800, 21600, 16400];
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 12, right: 20, bottom: 4, top: 16, containLabel: true },
      xAxis: {
        type: 'category',
        data: locations,
        axisLabel: { interval: 0, fontSize: 10, rotate: 40 },
      },
      yAxis: { type: 'value', name: '用户数' },
      series: [{
        name: '用户数',
        type: 'bar',
        barWidth: '60%',
        data: values,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#52c41a' },
            { offset: 1, color: '#95de64' },
          ]),
        },
        label: { show: true, position: 'top', fontSize: 10, color: '#595959' },
      }],
    };
  }, []);

  const brandLoyaltyOption = useMemo(() => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      data: [
        { name: '品牌新客', value: 112600, itemStyle: { color: '#fa8c16' } },
        { name: '品牌老客', value: 81200, itemStyle: { color: '#faad14' } },
      ],
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 12 },
    }],
  }), []);

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
        <Row gutter={24} align="middle">
          <Col>
            <Radio.Group value={filterDimension} onChange={(e) => setFilterDimension(e.target.value)}>
              <Radio.Button value="activity">按活动</Radio.Button>
              <Radio.Button value="time">按时间</Radio.Button>
            </Radio.Group>
          </Col>
          <Col flex="auto">
            {filterDimension === 'activity' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text strong>活动选择：</Text>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ flex: 1 }}
                  placeholder="请选择活动"
                  value={selectedActivities}
                  onChange={handleActivityChange}
                  options={mockActivities}
                  maxTagCount="responsive"
                />
              </div>
            ) : (
              <Space size="large">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text strong>选择年度：</Text>
                  <Select
                    style={{ width: 120 }}
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={[
                      { label: '全量', value: 'all' },
                      { label: '2025年', value: '2025' },
                      { label: '2024年', value: '2024' },
                    ]}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text strong>选择季度：</Text>
                  <Select
                    style={{ width: 120 }}
                    value={selectedQuarter}
                    onChange={setSelectedQuarter}
                    options={[
                      { label: '全量', value: 'all' },
                      { label: '第一季度', value: 'Q1' },
                      { label: '第二季度', value: 'Q2' },
                      { label: '第三季度', value: 'Q3' },
                      { label: '第四季度', value: 'Q4' },
                    ]}
                  />
                </div>
              </Space>
            )}
          </Col>
        </Row>
      </Card>

      {filterDimension === 'activity' && currentDetail && (
        <Card title="活动详情" style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col span={16}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div>
                    <Text strong>活动名称：</Text>
                    <Text>{currentDetail.name}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动周期：</Text>
                    <Text>{currentDetail.period}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>状态：</Text>
                    <Tag color={currentDetail.status === '进行中' ? 'processing' : currentDetail.status === '已结束' ? 'success' : 'warning'}>
                      {currentDetail.status}
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
                    <Text strong style={{ color: '#1890ff' }}>{currentDetail.planCodeCount.toLocaleString()}</Text>
                  </div>
                  <div>
                    <Text>实际扫码量：</Text>
                    <Text strong style={{ color: '#52c41a' }}>{currentDetail.actualScanCount.toLocaleString()}</Text>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <Text>实际扫码率：{currentDetail.actualScanRate.toFixed(1)}%</Text>
                    <Text>复购率：{currentDetail.repurchaseRate.toFixed(1)}%</Text>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      <Card title="用户基础信息分析" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <ReactECharts option={genderOption} style={{ height: 360 }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <ReactECharts option={ageOption} style={{ height: 360 }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <ReactECharts option={educationOption} style={{ height: 360 }} />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="用户分布" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div />
          <Radio.Group value={areaMode} onChange={(e) => setAreaMode(e.target.value)} size="small">
            <Radio.Button value="province">省份</Radio.Button>
            <Radio.Button value="city">城市</Radio.Button>
          </Radio.Group>
        </div>
        <Row gutter={16}>
          <Col span={8}>
            {mapReady ? (
              <ReactECharts option={areaMode === 'province' ? provinceOption : cityOption} style={{ height: 360 }} notMerge lazyUpdate />
            ) : (
              <div style={{ textAlign: 'center', padding: 16 }}><Text type="secondary">地图加载中...</Text></div>
            )}
          </Col>
          <Col span={8}>
            <Card title="用户城市等级分析" size="small" styles={{ body: { padding: '8px 12px' } }}>
              <ReactECharts option={cityTierOption} style={{ height: 340 }} />
            </Card>
          </Col>
          <Col span={8}>
            <div style={{ background: '#fafafa', padding: '12px 16px', borderRadius: '4px', height: '380px', overflowY: 'auto' }}>
              <Title level={5} style={{ marginTop: 0, marginBottom: 12, textAlign: 'center' }}>
                {areaMode === 'province' ? '省份' : '城市'}用户 Top 10
              </Title>
              <List
                dataSource={
                  areaMode === 'province'
                    ? [...provinceData].sort((a, b) => b.value - a.value).slice(0, 10)
                    : [...cityData].map(item => ({ name: item.name, value: item.value[2] })).sort((a, b) => b.value - a.value).slice(0, 10)
                }
                renderItem={(item: { name: string; value: number }, index: number) => (
                  <List.Item style={{ padding: '5px 0', border: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <span style={{
                        width: 20, height: 20,
                        background: index < 3 ? '#1890ff' : '#f5f5f5',
                        color: index < 3 ? '#fff' : '#8c8c8c',
                        borderRadius: '50%',
                        display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
                        marginRight: 8, fontSize: 11, fontWeight: 'bold', flexShrink: 0,
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ flex: 1, fontSize: 13 }}>{item.name}</span>
                      <Text strong style={{ fontSize: 13 }}>{item.value.toLocaleString()}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="用户偏好分析" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="消费偏好分析" size="small">
              <ReactECharts option={consumptionPreferenceOption} style={{ height: 340 }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="消费地点分析" size="small">
              <ReactECharts option={consumptionLocationOption} style={{ height: 340 }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="品牌忠诚度分析" size="small">
              <ReactECharts option={brandLoyaltyOption} style={{ height: 340 }} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default QrUserAnalysis;
