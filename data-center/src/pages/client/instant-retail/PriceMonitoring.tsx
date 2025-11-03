import React, { useState } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Tag, Space, Typography, Row, Col } from 'antd';
import { SearchOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// 破价监测任务数据接口
interface PriceMonitoringTask {
  key: string;
  taskId: string;
  taskName: string;
  collectionTypes: string[]; // 修改：采集类型（支持多种类型）
  monitoringPlatforms: string[]; // 修改：监测平台（支持多种类型）
  frequency: string; // 新增：频次
  commodityCount: number; // 监测商品数
  brokenPriceProductCount: number; // 新增：破价产品数
  brokenPriceRate: number; // 新增：破价率
  status: string;
  startDate: string;
  endDate: string;
}

// 模拟破价监测任务数据
const mockPriceMonitoringTasks: PriceMonitoringTask[] = [
  {
    key: '1',
    taskId: 'PM001',
    taskName: '康师傅红烧牛肉面破价监测',
    collectionTypes: ['RPA抓取', '人工截图'],
    monitoringPlatforms: ['美团闪购', '京东到家'],
    frequency: '2次/日',
    commodityCount: 15,
    brokenPriceProductCount: 3,
    brokenPriceRate: 20.0,
    status: '监测中',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
  },
  {
    key: '2',
    taskId: 'PM002',
    taskName: '康师傅老坛酸菜面破价监测',
    collectionTypes: ['平台订单'],
    monitoringPlatforms: ['京东到家'],
    frequency: '1次/日',
    commodityCount: 12,
    brokenPriceProductCount: 2,
    brokenPriceRate: 16.7,
    status: '监测中',
    startDate: '2025-01-05',
    endDate: '2025-02-05',
  },
  {
    key: '3',
    taskId: 'PM003',
    taskName: '康师傅香辣牛肉面破价监测',
    collectionTypes: ['RPA抓取'],
    monitoringPlatforms: ['饿了么'],
    frequency: '1次/周',
    commodityCount: 8,
    brokenPriceProductCount: 1,
    brokenPriceRate: 12.5,
    status: '已完成',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
  },
  {
    key: '4',
    taskId: 'PM004',
    taskName: '康师傅海鲜面破价监测',
    collectionTypes: ['人工截图', 'RPA抓取'],
    monitoringPlatforms: ['美团闪购', '饿了么'],
    frequency: '2次/周',
    commodityCount: 10,
    brokenPriceProductCount: 0,
    brokenPriceRate: 0.0,
    status: '待开始',
    startDate: '2025-02-01',
    endDate: '2025-02-28',
  },
  {
    key: '5',
    taskId: 'PM005',
    taskName: '康师傅鲜虾鱼板面破价监测',
    collectionTypes: ['平台订单', 'RPA抓取'],
    monitoringPlatforms: ['京东到家', '美团闪购'],
    frequency: '1次/日',
    commodityCount: 6,
    brokenPriceProductCount: 1,
    brokenPriceRate: 16.7,
    status: '监测中',
    startDate: '2025-01-10',
    endDate: '2025-02-10',
  },
];

const PriceMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<PriceMonitoringTask[]>(mockPriceMonitoringTasks);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedCollectionTypes, setSelectedCollectionTypes] = useState<string[]>([]);
  const [selectedMonitoringPlatforms, setSelectedMonitoringPlatforms] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 筛选数据
  const filterData = (
    search: string,
    status: string | undefined,
    collectionTypes: string[],
    monitoringPlatforms: string[],
    dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    let filtered = mockPriceMonitoringTasks;

    // 搜索筛选
    if (search) {
      filtered = filtered.filter(item =>
        item.taskName.toLowerCase().includes(search.toLowerCase()) ||
        item.taskId.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 状态筛选
    if (status) {
      filtered = filtered.filter(item => item.status === status);
    }

    // 采集类型筛选
    if (collectionTypes && collectionTypes.length > 0) {
      filtered = filtered.filter(item => 
        collectionTypes.some(type => item.collectionTypes.includes(type))
      );
    }

    // 监测平台筛选
    if (monitoringPlatforms && monitoringPlatforms.length > 0) {
      filtered = filtered.filter(item => 
        monitoringPlatforms.some(platform => item.monitoringPlatforms.includes(platform))
      );
    }

    // 日期筛选
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(item => {
        const itemStartDate = dayjs(item.startDate);
        const itemEndDate = dayjs(item.endDate);
        return (
          itemStartDate.isBetween(dateRange[0], dateRange[1], 'day', '[]') ||
          itemEndDate.isBetween(dateRange[0], dateRange[1], 'day', '[]') ||
          (itemStartDate.isBefore(dateRange[0]) && itemEndDate.isAfter(dateRange[1]))
        );
      });
    }

    setFilteredData(filtered);
  };

  // 监测看板跳转
  const handleDashboard = (taskId: string) => {
    navigate(`/client/price-monitoring-dashboard/${taskId}`);
  };

  // 状态标签渲染
  const renderStatusTag = (status: string) => {
    const statusConfig = {
      '监测中': { color: 'processing', text: '监测中' },
      '已完成': { color: 'success', text: '已完成' },
      '待开始': { color: 'default', text: '待开始' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列配置
  const columns: ColumnsType<PriceMonitoringTask> = [
    {
      title: '任务编号',
      dataIndex: 'taskId',
      key: 'taskId',
      width: 120,
      fixed: 'left',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 300,
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '采集类型',
      dataIndex: 'collectionTypes',
      key: 'collectionTypes',
      width: 180,
      align: 'center',
      render: (types: string[]) => (
        <div>
          {types.map((type, index) => {
            const typeConfig = {
              'RPA抓取': { color: 'blue', text: 'RPA抓取' },
              '人工截图': { color: 'green', text: '人工截图' },
              '平台订单': { color: 'orange', text: '平台订单' },
            };
            const config = typeConfig[type as keyof typeof typeConfig] || { color: 'default', text: type };
            return (
              <Tag key={index} color={config.color} style={{ margin: '2px' }}>
                {config.text}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: '监测平台',
      dataIndex: 'monitoringPlatforms',
      key: 'monitoringPlatforms',
      width: 150,
      align: 'center',
      render: (platforms: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '4px', justifyContent: 'center' }}>
          {platforms.map((platform, index) => {
            const platformConfig = {
              '美团闪购': { color: 'gold', text: '美团闪购' },
              '京东到家': { color: 'red', text: '京东到家' },
              '饿了么': { color: 'cyan', text: '饿了么' },
            };
            const config = platformConfig[platform as keyof typeof platformConfig] || { color: 'default', text: platform };
            return (
              <Tag key={index} color={config.color} style={{ margin: 0, fontSize: '12px' }}>
                {config.text}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: '频次',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 100,
      align: 'center',
      render: (frequency: string) => <Text strong>{frequency}</Text>,
    },
    {
      title: '监测商品数',
      dataIndex: 'commodityCount',
      key: 'commodityCount',
      width: 120,
      align: 'center',
      render: (count: number) => <Text strong>{count}</Text>,
    },
    {
      title: '破价产品数',
      dataIndex: 'brokenPriceProductCount',
      key: 'brokenPriceProductCount',
      width: 120,
      align: 'center',
      render: (count: number) => <Text strong style={{ color: count > 0 ? '#ff4d4f' : '#52c41a' }}>{count}</Text>,
    },
    {
      title: '破价率',
      dataIndex: 'brokenPriceRate',
      key: 'brokenPriceRate',
      width: 100,
      align: 'center',
      render: (rate: number) => (
        <Text strong style={{ color: rate > 0 ? '#ff4d4f' : '#52c41a' }}>
          {rate.toFixed(1)}%
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: renderStatusTag,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => handleDashboard(record.taskId)}
          >
            监测看板
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="price-monitoring-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>破价监测</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={5}>
            <Input
              placeholder="搜索任务名称或编号"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);
                filterData(value, selectedStatus, selectedCollectionTypes, selectedMonitoringPlatforms, dateRange);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={3}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(value);
                filterData(searchText, value, selectedCollectionTypes, selectedMonitoringPlatforms, dateRange);
              }}
              allowClear
            >
              <Option value="监测中">监测中</Option>
              <Option value="已完成">已完成</Option>
              <Option value="待开始">待开始</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              mode="multiple"
              placeholder="选择采集类型"
              style={{ width: '100%' }}
              value={selectedCollectionTypes}
              onChange={(value) => {
                setSelectedCollectionTypes(value);
                filterData(searchText, selectedStatus, value, selectedMonitoringPlatforms, dateRange);
              }}
              allowClear
            >
              <Option value="RPA抓取">RPA抓取</Option>
              <Option value="人工截图">人工截图</Option>
              <Option value="平台订单">平台订单</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              mode="multiple"
              placeholder="选择监测平台"
              style={{ width: '100%' }}
              value={selectedMonitoringPlatforms}
              onChange={(value) => {
                setSelectedMonitoringPlatforms(value);
                filterData(searchText, selectedStatus, selectedCollectionTypes, value, dateRange);
              }}
              allowClear
            >
              <Option value="美团闪购">美团闪购</Option>
              <Option value="京东到家">京东到家</Option>
              <Option value="饿了么">饿了么</Option>
            </Select>
          </Col>
          <Col span={5}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                filterData(searchText, selectedStatus, selectedCollectionTypes, selectedMonitoringPlatforms, dates);
              }}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
          <Col span={3}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setSearchText('');
                setSelectedStatus(undefined);
                setSelectedCollectionTypes([]);
                setSelectedMonitoringPlatforms([]);
                setDateRange(null);
                setFilteredData(mockPriceMonitoringTasks);
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 1500, y: 550 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          size="small"
          style={{ marginBottom: '20px' }}
        />
      </Card>
    </div>
  );
};

export default PriceMonitoring;