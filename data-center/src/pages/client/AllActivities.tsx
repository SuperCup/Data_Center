import React, { useState } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Tag, Space, Typography, Row, Col } from 'antd';
import { SearchOutlined, DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

// 活动数据接口
interface ActivityData {
  key: string;
  activityId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  budget: number;
  consumed: number;
  gmv: number;
  usedCount: number;
  batchCount: number;
  discount: number;
  usageRate: number;
}

// 模拟全量活动数据
const mockAllActivities: ActivityData[] = [
  {
    key: '1',
    activityId: 'ACT001',
    name: '2025年9月康师傅红烧牛肉面秋季促销活动',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    status: '进行中',
    budget: 50000,
    consumed: 32000,
    gmv: 125000,
    usedCount: 8500,
    batchCount: 8 * 15,
    discount: 32000,
    usageRate: 78.5,
  },
  {
    key: '2',
    activityId: 'ACT002',
    name: '2025年8月康师傅老坛酸菜面夏日特惠活动',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    status: '已结束',
    budget: 40000,
    consumed: 26000,
    gmv: 97500,
    usedCount: Math.round(8500 * 1.5),
    batchCount: 5 * 15,
    discount: 26000,
    usageRate: 82.3,
  },
  {
    key: '3',
    activityId: 'ACT003',
    name: '2025年7月康师傅香辣牛肉面品牌推广活动',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    status: '已结束',
    budget: 30000,
    consumed: 24000,
    gmv: 82500,
    usedCount: Math.round(9200 * 1.5),
    batchCount: 6 * 15,
    discount: 24000,
    usageRate: 85.1,
  },
  {
    key: '4',
    activityId: 'ACT004',
    name: '2025年10月国庆特惠活动',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: '待开始',
    budget: 60000,
    consumed: 0,
    gmv: 0,
    usedCount: 0,
    batchCount: 0,
    discount: 0,
    usageRate: 0,
  },
  {
    key: '5',
    activityId: 'ACT005',
    name: '2025年11月双十一狂欢活动',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: '待开始',
    budget: 80000,
    consumed: 0,
    gmv: 0,
    usedCount: 0,
    batchCount: 0,
    discount: 0,
    usageRate: 0,
  },
  {
    key: '6',
    activityId: 'ACT006',
    name: '2025年6月儿童节特别活动',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: '已结束',
    budget: 25000,
    consumed: 22000,
    gmv: 68000,
    usedCount: 6800,
    batchCount: 4 * 15,
    discount: 22000,
    usageRate: 88.0,
  },
];

const AllActivities: React.FC = () => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<ActivityData[]>(mockAllActivities);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 跳转到活动分析页面
  const handleActivityAnalysis = (activityId: string) => {
    // 跳转到活动分析页面，并传递活动ID参数
    navigate(`/client/activity-analysis?activityId=${activityId}`);
  };

  // 筛选数据
  const filterData = (
    search: string,
    status: string | undefined,
    dateRangeValue: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    let filtered = mockAllActivities;

    // 按名称搜索
    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.activityId.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 按状态筛选
    if (status) {
      filtered = filtered.filter(item => item.status === status);
    }

    // 按日期范围筛选
    if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
      const startDate = dateRangeValue[0];
      const endDate = dateRangeValue[1];
      filtered = filtered.filter(item => {
        const itemStartDate = dayjs(item.startDate);
        const itemEndDate = dayjs(item.endDate);
        return (
          (itemStartDate.isAfter(startDate) || itemStartDate.isSame(startDate)) && 
          (itemStartDate.isBefore(endDate) || itemStartDate.isSame(endDate)) ||
          (itemEndDate.isAfter(startDate) || itemEndDate.isSame(startDate)) && 
          (itemEndDate.isBefore(endDate) || itemEndDate.isSame(endDate)) ||
          (itemStartDate.isBefore(startDate) || itemStartDate.isSame(startDate)) && 
          (itemEndDate.isAfter(endDate) || itemEndDate.isSame(endDate))
        );
      });
    }

    setFilteredData(filtered);
  };

  // 表格列定义
  const columns: ColumnsType<ActivityData> = [
    {
      title: '活动编号',
      dataIndex: 'activityId',
      key: 'activityId',
      width: 120,
      fixed: 'left',
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      fixed: 'left',
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        if (status === '进行中') color = 'green';
        else if (status === '已结束') color = 'blue';
        else if (status === '待开始') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '预算(元)',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '消耗(元)',
      dataIndex: 'consumed',
      key: 'consumed',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '销售额(元)',
      dataIndex: 'gmv',
      key: 'gmv',
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
    {
      title: '批次数',
      dataIndex: 'batchCount',
      key: 'batchCount',
      width: 100,
    },
    {
      title: '优惠金额(元)',
      dataIndex: 'discount',
      key: 'discount',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '核销率(%)',
      dataIndex: 'usageRate',
      key: 'usageRate',
      width: 100,
      render: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small"
            onClick={() => handleActivityAnalysis(record.activityId)}
          >
            活动分析
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="all-activities-container">
      {/* 页面标题 */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>全量活动</Title>
      </Card>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input
              placeholder="搜索活动名称或编号"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                filterData(e.target.value, selectedStatus, dateRange);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(value);
                filterData(searchText, value, dateRange);
              }}
              allowClear
            >
              <Option value="进行中">进行中</Option>
              <Option value="已结束">已结束</Option>
              <Option value="待开始">待开始</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                filterData(searchText, selectedStatus, dates);
              }}
            />
          </Col>
          <Col span={8}>
            <Space>
              <Button icon={<FilterOutlined />}>
                高级筛选
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出数据
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 1800, y: 600 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default AllActivities;