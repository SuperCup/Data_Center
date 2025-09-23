import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Divider, DatePicker, Select, Pie, Line } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingOutlined, DollarOutlined, TagOutlined, AppstoreOutlined } from '@ant-design/icons';
import { PieChart, Pie as RechartsPie, Cell, LineChart, Line as RechartsLine, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const { RangePicker } = DatePicker;
const { Option } = Select;

// 颜色配置
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
const PLATFORM_COLORS = {
  '微信': '#07C160',
  '支付宝': '#1677FF',
  '抖音来客': '#000000',
  '美团到店': '#FFC300'
};

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<[string, string]>(['2023-10-01', '2023-10-31']);
  const [paymentPlatform, setPaymentPlatform] = useState<string>('all');
  
  // 模拟数据
  const stats = {
    batchCount: 12,
    couponIssued: 850000,
    couponUsed: 320000,
    budgetUsed: 75,
    gmv: 4680000,
    discount: 1870000,
    platformData: [
      { name: '微信', value: 45, gmv: 2106000, discount: 841500, budget: 80, clientBudget: { total: 1000000, used: 800000 }, orders: 21060 },
      { name: '支付宝', value: 25, gmv: 1170000, discount: 467500, budget: 70, clientBudget: { total: 800000, used: 560000 }, orders: 11700 },
      { name: '抖音来客', value: 20, gmv: 936000, discount: 374000, budget: 65, clientBudget: { total: 600000, used: 390000 }, orders: 9360 },
      { name: '美团到店', value: 10, gmv: 468000, discount: 187000, budget: 85, clientBudget: { total: 400000, used: 340000 }, orders: 4680 },
    ],
    gmvTrend: [
      { date: 'Oct 01', gmv: 156000, wechat: 70200, alipay: 39000, douyin_visitor: 31200, meituan_local: 15600 },
      { date: 'Oct 02', gmv: 168000, wechat: 75600, alipay: 42000, douyin_visitor: 33600, meituan_local: 16800 },
      { date: 'Oct 03', gmv: 180000, wechat: 81000, alipay: 45000, douyin_visitor: 36000, meituan_local: 18000 },
      { date: 'Oct 04', gmv: 162000, wechat: 72900, alipay: 40500, douyin_visitor: 32400, meituan_local: 16200 },
      { date: 'Oct 05', gmv: 150000, wechat: 67500, alipay: 37500, douyin_visitor: 30000, meituan_local: 15000 },
      { date: 'Oct 06', gmv: 165000, wechat: 74250, alipay: 41250, douyin_visitor: 33000, meituan_local: 16500 },
      { date: 'Oct 07', gmv: 175000, wechat: 78750, alipay: 43750, douyin_visitor: 35000, meituan_local: 17500 },
      { date: 'Oct 08', gmv: 185000, wechat: 83250, alipay: 46250, douyin_visitor: 37000, meituan_local: 18500 },
      { date: 'Oct 09', gmv: 190000, wechat: 85500, alipay: 47500, douyin_visitor: 38000, meituan_local: 19000 },
      { date: 'Oct 10', gmv: 195000, wechat: 87750, alipay: 48750, douyin_visitor: 39000, meituan_local: 19500 },
    ],
    distributionChannels: [
      { name: '品牌小程序', issued: 180000, used: 72000, wechat: 90000, alipay: 45000, douyin_visitor: 27000, meituan_local: 18000 },
      { name: '支付有礼', issued: 150000, used: 60000, wechat: 60000, alipay: 60000, douyin_visitor: 15000, meituan_local: 15000 },
      { name: '零售商小程序', issued: 120000, used: 48000, wechat: 54000, alipay: 30000, douyin_visitor: 24000, meituan_local: 12000 },
      { name: '扫码领券', issued: 100000, used: 40000, wechat: 50000, alipay: 25000, douyin_visitor: 15000, meituan_local: 10000 },
      { name: '立减与折扣', issued: 80000, used: 32000, wechat: 32000, alipay: 20000, douyin_visitor: 20000, meituan_local: 8000 },
      { name: '社群', issued: 70000, used: 28000, wechat: 42000, alipay: 14000, douyin_visitor: 10500, meituan_local: 3500 },
      { name: '智能促销员', issued: 60000, used: 24000, wechat: 27000, alipay: 15000, douyin_visitor: 12000, meituan_local: 6000 },
      { name: '扫码购', issued: 50000, used: 20000, wechat: 25000, alipay: 12500, douyin_visitor: 7500, meituan_local: 5000 },
      { name: '碰一下', issued: 30000, used: 12000, wechat: 15000, alipay: 7500, douyin_visitor: 4500, meituan_local: 3000 },
      { name: 'H5', issued: 10000, used: 4000, wechat: 4000, alipay: 3000, douyin_visitor: 2000, meituan_local: 1000 },
    ]
  };

  // 渠道发券排行数据处理
  const issuedChannelRanking = [...stats.distributionChannels]
    .sort((a, b) => b.issued - a.issued)
    .slice(0, 5);

  // 渠道核销排行数据处理
  const usedChannelRanking = [...stats.distributionChannels]
    .sort((a, b) => b.used - a.used)
    .slice(0, 5);

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };

  const handlePlatformChange = (value: string) => {
    setPaymentPlatform(value);
  };

  return (
    <div>
      <h2>首页看板</h2>
      
      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={12}>
            <span style={{ marginRight: 8 }}>Date Range:</span>
            <RangePicker onChange={handleDateRangeChange} />
          </Col>
          <Col span={12}>
            <span style={{ marginRight: 8 }}>支付平台：</span>
            <Select defaultValue="all" style={{ width: 120 }} onChange={handlePlatformChange}>
              <Option value="all">全部</Option>
              <Option value="wechat">微信</Option>
              <Option value="alipay">支付宝</Option>
            </Select>
          </Col>
        </Row>
      </Card>
      
      <Divider />
      
      {/* 平台占比饼图 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card title="GMV平台占比">
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="gmv"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${(value).toLocaleString()} 元`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="订单数平台占比">
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="orders"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${(value).toLocaleString()} 单`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="活动数平台占比">
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="优惠金额平台占比">
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="discount"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${(value).toLocaleString()} 元`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* 核心指标总览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="批次数"
              value={stats.batchCount}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="优惠券发放量"
              value={stats.couponIssued}
              prefix={<TagOutlined />}
              suffix="张"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="优惠券核销量"
              value={stats.couponUsed}
              prefix={<TagOutlined />}
              suffix="张"
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="核销率"
              value={Math.round((stats.couponUsed / stats.couponIssued) * 100)}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* GMV和优惠金额 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="GMV"
              value={stats.gmv}
              prefix={<DollarOutlined />}
              suffix="元"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="优惠金额"
              value={stats.discount}
              prefix={<DollarOutlined />}
              suffix="元"
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 预算使用率 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="预算使用情况">
            <Row align="middle" justify="center">
              <Col span={12}>
                <Progress
                  type="dashboard"
                  percent={stats.budgetUsed}
                  format={percent => `${percent}%`}
                  width={200}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="预算使用率"
                  value={stats.budgetUsed}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                  suffix="%"
                />
                <div style={{ marginTop: 10 }}>
                  <span>剩余预算: </span>
                  <span style={{ fontWeight: 'bold' }}>
                    {100 - stats.budgetUsed}%
                  </span>
                </div>
              </Col>
            </Row>
            <Divider>各平台预算使用情况</Divider>
            <Row gutter={[16, 16]}>
              {stats.platformData.map(platform => (
                <Col span={6} key={platform.name}>
                  <Card bordered={false} size="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span>{platform.name}</span>
                      <span style={{ fontWeight: 'bold' }}>{platform.budget}%</span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
                      <div>预算使用率: <span style={{ fontWeight: 'bold', color: '#3f8600' }}>{platform.budget}%</span></div>
                      <div>剩余预算: <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{100 - platform.budget}%</span></div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            <Divider>客户端预算分平台展示</Divider>
            <Row gutter={[16, 16]}>
              {stats.platformData.map(platform => (
                <Col span={6} key={platform.name}>
                  <Card bordered={false} size="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span>{platform.name}客户端预算</span>
                      <span style={{ fontWeight: 'bold', color: '#3f8600' }}>
                        {Math.round((platform.clientBudget.used / platform.clientBudget.total) * 100)}%
                      </span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: '14px' }}>
                      <div>总预算: <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{(platform.clientBudget.total / 10000).toFixed(2)}万元</span></div>
                      <div>已使用: <span style={{ fontWeight: 'bold', color: '#cf1322' }}>{(platform.clientBudget.used / 10000).toFixed(2)}万元</span></div>
                      <div>剩余: <span style={{ fontWeight: 'bold', color: '#3f8600' }}>{((platform.clientBudget.total - platform.clientBudget.used) / 10000).toFixed(2)}万元</span></div>
                      <div>使用率: <span style={{ fontWeight: 'bold' }}>{Math.round((platform.clientBudget.used / platform.clientBudget.total) * 100)}%</span></div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* GMV走势图 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="GMV走势图">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.gmvTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number, name: string) => {
                    const nameMap = {
                      gmv: 'GMV总额',
                      wechat: '微信',
                      alipay: '支付宝',
                      douyin_visitor: '抖音来客',
                      meituan_local: '美团到店'
                    };
                    return [`${value.toLocaleString()} 元`, nameMap[name] || name];
                  }} />
                  <Legend />
                  <RechartsLine
                    type="monotone"
                    dataKey="gmv"
                    name="GMV总额"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="wechat"
                    name="微信"
                    stroke={PLATFORM_COLORS['微信']}
                    activeDot={{ r: 6 }}
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="alipay"
                    name="支付宝"
                    stroke={PLATFORM_COLORS['支付宝']}
                    activeDot={{ r: 6 }}
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="douyin_visitor"
                    name="抖音来客"
                    stroke={PLATFORM_COLORS['抖音来客']}
                    activeDot={{ r: 6 }}
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="meituan_local"
                    name="美团到店"
                    stroke={PLATFORM_COLORS['美团到店']}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* 平台分布 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="平台分布">
            <Row>
              <Col span={12}>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsPie
                        data={stats.platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                        ))}
                      </RechartsPie>
                      <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Col>
              <Col span={12}>
                <Row gutter={[16, 16]}>
                  {stats.platformData.map(platform => (
                    <Col span={12} key={platform.name}>
                      <Card bordered={false} size="small">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{platform.name}</span>
                          <span style={{ fontWeight: 'bold' }}>{platform.value}%</span>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <div>GMV: <span style={{ fontWeight: 'bold' }}>{platform.gmv.toLocaleString()}元</span></div>
                          <div>优惠金额: <span style={{ fontWeight: 'bold' }}>{platform.discount.toLocaleString()}元</span></div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      {/* 渠道分布 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="渠道分布">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="各平台占比" bordered={false} style={{ marginBottom: 16 }}>
                  <Row gutter={[16, 16]}>
                    {stats.platformData.map((platform, index) => (
                      <Col span={6} key={platform.name}>
                        <Card bordered={false} size="small">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span>{platform.name}</span>
                            <span style={{ fontWeight: 'bold' }}>{platform.value}%</span>
                          </div>
                          <Progress 
                            percent={platform.value} 
                            strokeColor={PLATFORM_COLORS[platform.name] || COLORS[index % COLORS.length]}
                          />
                          <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                            <div>发券量占比: <span style={{ fontWeight: 'bold' }}>{platform.value}%</span></div>
                            <div>核销量占比: <span style={{ fontWeight: 'bold' }}>{Math.round(platform.value * 0.9)}%</span></div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="发券渠道平台占比" bordered={false} style={{ marginBottom: 16 }}>
                  <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.distributionChannels.slice(0, 5)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number, name: string) => {
                          const nameMap = {
                            wechat: '微信',
                            alipay: '支付宝',
                            douyin_visitor: '抖音来客',
                            meituan_local: '美团到店'
                          };
                          return [`${value.toLocaleString()} 张`, nameMap[name] || name];
                        }} />
                        <Legend />
                        <Bar dataKey="wechat" name="微信" stackId="a" fill={PLATFORM_COLORS['微信']} />
                        <Bar dataKey="alipay" name="支付宝" stackId="a" fill={PLATFORM_COLORS['支付宝']} />
                        <Bar dataKey="douyin_visitor" name="抖音来客" stackId="a" fill={PLATFORM_COLORS['抖音来客']} />
                        <Bar dataKey="meituan_local" name="美团到店" stackId="a" fill={PLATFORM_COLORS['美团到店']} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="发券渠道排行" bordered={false}>
                  {issuedChannelRanking.map((channel, index) => (
                    <div key={channel.name} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>{index + 1}. {channel.name}</span>
                        <span>{channel.issued.toLocaleString()}张</span>
                      </div>
                      <Progress 
                        percent={(channel.issued / issuedChannelRanking[0].issued) * 100} 
                        showInfo={false} 
                        strokeColor={COLORS[index % COLORS.length]} 
                      />
                    </div>
                  ))}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="核销渠道排行" bordered={false}>
                  {usedChannelRanking.map((channel, index) => (
                    <div key={channel.name} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>{index + 1}. {channel.name}</span>
                        <span>{channel.used.toLocaleString()}张</span>
                      </div>
                      <Progress 
                        percent={(channel.used / usedChannelRanking[0].used) * 100} 
                        showInfo={false} 
                        strokeColor={COLORS[index % COLORS.length]} 
                      />
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;