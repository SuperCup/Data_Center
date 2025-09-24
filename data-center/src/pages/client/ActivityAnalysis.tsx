import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Select, Typography, Button, Table, Pagination, Radio, Tag, Tooltip as AntTooltip } from 'antd';
import { ShoppingOutlined, DollarOutlined, TagOutlined, AppstoreOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Option } = Select;
const { Title, Text } = Typography;

// 模拟活动数据
const mockActivities = [
  {
    id: '1',
    name: '2025年9-10月康师傅红烧牛肉面全国促销活动',
    startDate: '2025-09-01',
    endDate: '2025-10-31',
    mechanisms: [
      '满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5',
      '满18减1.8', '满20减2', '满22减2.2', '满25减2.5', '满28减2.8',
      '满30减3', '满32减3.2', '满35减3.5', '满38减3.8', '满40减4',
      '满42减4.2', '满45减4.5', '满48减4.8', '满50减5', '满60减6'
    ],
    budget: 50000,
    consumed: 32500,
    gmv: 142500,
    usedCount: Math.round(12500 * 1.5),
    batchCount: 8 * 15,
    discount: 32500,
    usageRate: 78.5,
    batches: [
      { id: 'b1', name: '指定品满5元减0.5元', gmv: 22500, discount: 1750 },
      { id: 'b2', name: '指定品满8元减0.8元', gmv: 19000, discount: 1400 },
      { id: 'b3', name: '指定品满10元减1元', gmv: 26000, discount: 2100 },
      { id: 'b4', name: '指定品满12元减1.2元', gmv: 16000, discount: 1250 },
      { id: 'b5', name: '指定品满15元减1.5元', gmv: 24000, discount: 1900 },
      { id: 'b6', name: '指定品满18元减1.8元', gmv: 14500, discount: 1100 },
      { id: 'b7', name: '指定品满20元减2元', gmv: 10500, discount: 800 },
      { id: 'b8', name: '指定品满22元减2.2元', gmv: 10000, discount: 750 }
    ]
  },
  {
    id: '2',
    name: '2025年8月康师傅老坛酸菜面夏日特惠活动',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    mechanisms: [
      '满4减0.4', '满6减0.6', '满8减0.8', '满10减1', '满12减1.2',
      '满14减1.4', '满16减1.6', '满18减1.8', '满20减2', '满22减2.2',
      '满24减2.4', '满26减2.6', '满28减2.8', '满30减3', '满32减3.2',
      '满34减3.4', '满36减3.6', '满38减3.8', '满40减4', '满50减5'
    ],
    budget: 40000,
    consumed: 26000,
    gmv: 97500,
    usedCount: Math.round(8500 * 1.5),
    batchCount: 5 * 15,
    discount: 26000,
    usageRate: 82.3,
    batches: [
      { id: 'b1', name: '指定品满4元减0.4元', gmv: 21000, discount: 1600 },
      { id: 'b2', name: '指定品满6元减0.6元', gmv: 19000, discount: 1400 },
      { id: 'b3', name: '指定品满8元减0.8元', gmv: 22500, discount: 1750 },
      { id: 'b4', name: '指定品满10元减1元', gmv: 17500, discount: 1300 },
      { id: 'b5', name: '指定品满12元减1.2元', gmv: 17500, discount: 1250 }
    ]
  },
  {
    id: '3',
    name: '2025年7月康师傅香辣牛肉面品牌推广活动',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    mechanisms: [
      '满3减0.3', '满5减0.5', '满6减0.6', '满8减0.8', '满9减0.9',
      '满10减1', '满12减1.2', '满14减1.4', '满15减1.5', '满16减1.6',
      '满18减1.8', '满20减2', '满21减2.1', '满24减2.4', '满25减2.5',
      '满27减2.7', '满30减3', '满32减3.2', '满35减3.5', '满40减4'
    ],
    budget: 30000,
    consumed: 24000,
    gmv: 82500,
    usedCount: Math.round(9200 * 1.5),
    batchCount: 6 * 15,
    discount: 24000,
    usageRate: 85.1,
    batches: [
      { id: 'b1', name: '指定品满3元减0.3元', gmv: 16000, discount: 1200 },
      { id: 'b2', name: '指定品满5元减0.5元', gmv: 14000, discount: 1050 },
      { id: 'b3', name: '指定品满6元减0.6元', gmv: 14500, discount: 1100 },
      { id: 'b4', name: '指定品满8元减0.8元', gmv: 12500, discount: 950 },
      { id: 'b5', name: '指定品满9元减0.9元', gmv: 13000, discount: 1000 },
      { id: 'b6', name: '指定品满10元减1元', gmv: 12500, discount: 900 }
    ]
  }
];

// 模拟零售商数据
const mockRetailers = [
  { id: '1', name: '华润万家(北京朝阳店)', type: 'KA', gmv: 285000, discount: 12000, usedCount: 1250 },
  { id: '2', name: '永辉超市(上海浦东店)', type: 'KA', gmv: 268000, discount: 11000, usedCount: 1180 },
  { id: '3', name: '家乐福(广州天河店)', type: 'KA', gmv: 245000, discount: 10000, usedCount: 1080 },
  { id: '4', name: '沃尔玛(深圳南山店)', type: 'KA', gmv: 232000, discount: 9500, usedCount: 1020 },
  { id: '5', name: '大润发(杭州西湖店)', type: 'KA', gmv: 218000, discount: 8500, usedCount: 960 },
  { id: '6', name: '美宜佳(东莞虎门店)', type: '小店', gmv: 125000, discount: 4500, usedCount: 580 },
  { id: '7', name: '7-11(成都锦江店)', type: '小店', gmv: 118000, discount: 4200, usedCount: 550 },
  { id: '8', name: '全家(武汉江汉店)', type: '小店', gmv: 112000, discount: 4000, usedCount: 520 },
  { id: '9', name: '罗森(南京鼓楼店)', type: '小店', gmv: 108000, discount: 3800, usedCount: 500 },
  { id: '10', name: '苏宁小店(西安雁塔店)', type: '小店', gmv: 95000, discount: 3500, usedCount: 450 },
  { id: '11', name: '天虹超市(福州台江店)', type: 'KA', gmv: 185000, discount: 7500, usedCount: 820 },
  { id: '12', name: '物美超市(天津和平店)', type: 'KA', gmv: 175000, discount: 7000, usedCount: 780 }
];

// 模拟商品数据
const mockProducts = [
  { id: '1', name: '6923333422康师傅红烧牛肉面', gmv: 185000, discount: 7500, usedCount: 820 },
  { id: '2', name: '6923333423康师傅香辣牛肉面', gmv: 175000, discount: 7200, usedCount: 780 },
  { id: '3', name: '6923333424康师傅老坛酸菜面', gmv: 165000, discount: 6800, usedCount: 720 },
  { id: '4', name: '6923333425康师傅鲜虾鱼板面', gmv: 155000, discount: 6500, usedCount: 680 },
  { id: '5', name: '6923333426康师傅西红柿鸡蛋面', gmv: 145000, discount: 6200, usedCount: 640 },
  { id: '6', name: '6923333427康师傅麻辣牛肉面', gmv: 135000, discount: 5800, usedCount: 600 },
  { id: '7', name: '6923333428康师傅香菇炖鸡面', gmv: 125000, discount: 5500, usedCount: 560 },
  { id: '8', name: '6923333429康师傅酸辣牛肉面', gmv: 115000, discount: 5200, usedCount: 520 },
  { id: '9', name: '6923333430康师傅鲜虾面', gmv: 105000, discount: 4800, usedCount: 480 },
  { id: '10', name: '6923333431康师傅排骨面', gmv: 95000, discount: 4500, usedCount: 440 },
  { id: '11', name: '6923333432康师傅海鲜面', gmv: 85000, discount: 4200, usedCount: 400 },
  { id: '12', name: '6923333433康师傅蘑菇面', gmv: 75000, discount: 3800, usedCount: 360 }
];

const ActivityAnalysis: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<string>('1');
  const [retailerType, setRetailerType] = useState<string>('all');
  const [retailerPage, setRetailerPage] = useState<number>(1);
  const [productPage, setProductPage] = useState<number>(1);

  // 获取当前选中的活动数据
  const currentActivity = mockActivities.find(activity => activity.id === selectedActivity) || mockActivities[0];

  // 零售商分页数据
  const filteredRetailers = retailerType === 'all' 
    ? mockRetailers 
    : mockRetailers.filter(retailer => retailer.type === retailerType);
  const retailerPageSize = 10;
  const retailerStartIndex = (retailerPage - 1) * retailerPageSize;
  const currentRetailers = filteredRetailers.slice(retailerStartIndex, retailerStartIndex + retailerPageSize);

  // 商品分页数据
  const productPageSize = 10;
  const productStartIndex = (productPage - 1) * productPageSize;
  const currentProducts = mockProducts.slice(productStartIndex, productStartIndex + productPageSize);

  // 零售商表格列定义
  const retailerColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => retailerStartIndex + index + 1,
    },
    {
      title: '零售商名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'KA' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
    {
      title: '销售额(元)',
      dataIndex: 'gmv',
      key: 'gmv',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '优惠金额(元)',
      dataIndex: 'discount',
      key: 'discount',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '核销数',
      dataIndex: 'usedCount',
      key: 'usedCount',
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
  ];

  // 商品表格列定义
  const productColumns = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => productStartIndex + index + 1,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '销售额(元)',
      dataIndex: 'gmv',
      key: 'gmv',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '优惠金额(元)',
      dataIndex: 'discount',
      key: 'discount',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '核销数',
      dataIndex: 'usedCount',
      key: 'usedCount',
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
  ];

  return (
      <div className="activity-analysis-container">
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0 }}>活动分析</Title>
            <Select
              style={{ width: 400 }}
              placeholder="选择活动"
              value={selectedActivity}
              onChange={setSelectedActivity}
              showSearch
            >
              {mockActivities.map(activity => (
                <Option key={activity.id} value={activity.id}>
                  {activity.name}
                </Option>
              ))}
            </Select>
          </div>
        </Card>

      {/* 2. 活动详情 */}
      {currentActivity && (
        <Card title="活动详情" style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col span={16}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div>
                    <Text strong>活动名称：</Text>
                    <Text>{currentActivity.name}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动周期：</Text>
                    <Text>{currentActivity.startDate} 至 {currentActivity.endDate}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动机制：</Text>
                    <div style={{ marginTop: 8 }}>
                      {currentActivity.mechanisms.map((mechanism, index) => (
                        <Tag key={index} style={{ margin: '2px 4px 2px 0' }}>
                          {mechanism}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <div>
                <Text strong>活动预算与消耗：</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text>预算：</Text>
                    <Text strong style={{ color: '#1890ff' }}>
                      ¥{(currentActivity.budget / 10000).toFixed(1)}万
                    </Text>
                  </div>
                  <div>
                    <Text>消耗：</Text>
                    <Text strong style={{ color: '#52c41a' }}>
                      ¥{(currentActivity.consumed / 10000).toFixed(1)}万
                    </Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Progress 
                      percent={Math.round((currentActivity.consumed / currentActivity.budget) * 100)}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* 3. 核心指标 */}
      <Card title="核心指标" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} style={{ display: 'flex' }}>
          {/* 活动销售额 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>活动销售额</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝平台：</strong></div>
                      <div style={{ marginBottom: 8 }}>所有订单的订单商品数量×商品价格之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音来客/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.gmv}
                precision={0}
                valueStyle={{ color: '#4A90E2', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<ShoppingOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          
          {/* 核券数 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>核券数</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>平台下载的正向账单数量之和（无账单活动，取活动详情中统计的核销数量）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音来客/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.usedCount}
                precision={0}
                valueStyle={{ color: '#7ED321', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<TagOutlined />}
              />
            </Card>
          </Col>
          
          {/* 活动数 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>活动数</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div>平台侧创建的活动数量之和</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.batchCount}
                precision={0}
                valueStyle={{ color: '#9013FE', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>
          
          {/* 优惠金额 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>优惠金额</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>账单中返回的优惠金额之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音来客/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.discount}
                precision={0}
                valueStyle={{ color: '#D0021B', fontSize: '24px', fontWeight: 'bold' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          
          {/* 核销率 */}
          <Col flex="1" xs={24} sm={12} md={8} lg={4}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#666' }}>核销率</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>仅供参考</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>(未退款账单之和/平台活动详情中的领券数之和)×100%</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音来客/美团到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.usageRate}
                precision={1}
                valueStyle={{ color: '#F5A623', fontSize: '24px', fontWeight: 'bold' }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 4. 活动对比 */}
      <Card title="活动对比" style={{ marginBottom: 16 }}>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              data={currentActivity?.batches || []}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="gmv" 
                type="number" 
                name="销售金额"
                unit="万元"
                tickFormatter={(value) => `${(value / 10000).toFixed(1)}`}
              />
              <YAxis 
                dataKey="discount" 
                type="number" 
                name="优惠金额"
                unit="万元"
                tickFormatter={(value) => `${(value / 10000).toFixed(1)}`}
              />
              <Tooltip 
                  formatter={(value, name, props) => {
                    if (name === 'discount') {
                      return [`${(Number(value) / 10000).toFixed(1)}万元`, '优惠金额'];
                    }
                    return [`${(Number(value) / 10000).toFixed(1)}万元`, '销售金额'];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.name;
                    }
                    return '';
                  }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ 
                          backgroundColor: 'white', 
                          padding: '8px 12px', 
                          border: '1px solid #ccc', 
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data.name}</div>
                          <div>优惠金额：{(data.discount / 10000).toFixed(1)}万元</div>
                          <div>销售金额：{(data.gmv / 10000).toFixed(1)}万元</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              <Scatter dataKey="discount" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Row gutter={16}>
        {/* 5. 零售商 */}
        <Col span={12}>
          <Card 
            title="零售商" 
            extra={
              <Radio.Group value={retailerType} onChange={(e) => setRetailerType(e.target.value)} size="small">
                <Radio.Button value="all">全部</Radio.Button>
                <Radio.Button value="KA">KA</Radio.Button>
                <Radio.Button value="小店">小店</Radio.Button>
              </Radio.Group>
            }
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={retailerColumns}
              dataSource={currentRetailers}
              pagination={false}
              size="small"
              rowKey="id"
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Pagination
                current={retailerPage}
                total={filteredRetailers.length}
                pageSize={retailerPageSize}
                onChange={setRetailerPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              />
            </div>
          </Card>
        </Col>

        {/* 6. 商品 */}
        <Col span={12}>
          <Card title="商品" style={{ marginBottom: 16 }}>
            <Table
              columns={productColumns}
              dataSource={currentProducts}
              pagination={false}
              size="small"
              rowKey="id"
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Pagination
                current={productPage}
                total={mockProducts.length}
                pageSize={productPageSize}
                onChange={setProductPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ActivityAnalysis;