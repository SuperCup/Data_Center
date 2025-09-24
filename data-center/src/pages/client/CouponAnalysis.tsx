import React, { useState } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Tag, Space, Typography, Row, Col, Statistic } from 'antd';
import { SearchOutlined, DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

// 优惠券数据接口
interface CouponData {
  key: string;
  couponId: string;
  title: string;        // 标题
  subtitle: string;     // 副标题
  description: string;
  couponType: string;
  couponStatus: string;
  startTime: string;
  endTime: string;
  couponAmount: number;
  issuedCount: number;
  usedCount: number;
  activityName: string; // 所属活动名称
}

// 模拟优惠券数据
const mockCouponData: CouponData[] = [
  {
    key: '1',
    couponId: '230916001',
    title: '单价立减2.5',
    subtitle: '满4.5元减2.5元',
    description: '全场满5减1优惠券',
    couponType: '满减',
    couponStatus: '进行中',
    startTime: '2025-09-28',
    endTime: '2025-10-28',
    couponAmount: 100, // 1元
    issuedCount: 1000,
    usedCount: 250,
    activityName: '2025年9月秋季促销活动',
  },
  {
    key: '2',
    couponId: '230916002',
    title: '全品满33减13',
    subtitle: '满33元减13元',
    description: '指定品满10减2优惠券',
    couponType: '满减',
    couponStatus: '进行中',
    startTime: '2025-09-28',
    endTime: '2025-10-28',
    couponAmount: 200, // 2元
    issuedCount: 800,
    usedCount: 180,
    activityName: '2025年9月秋季促销活动',
  },
  {
    key: '3',
    couponId: '230916003',
    title: '全品满33减13',
    subtitle: '满33元减13元',
    description: '满15减3优惠券',
    couponType: '满减',
    couponStatus: '待开始',
    startTime: '2025-10-01',
    endTime: '2025-10-31',
    couponAmount: 300, // 3元
    issuedCount: 600,
    usedCount: 0,
    activityName: '2025年10月国庆特惠活动',
  },
  {
    key: '4',
    couponId: '230916004',
    title: '单价立减2.5',
    subtitle: '满4.5元减2.5元',
    description: '满20减2优惠券',
    couponType: '满减',
    couponStatus: '已结束',
    startTime: '2025-08-01',
    endTime: '2025-08-31',
    couponAmount: 200, // 2元
    issuedCount: 1200,
    usedCount: 950,
    activityName: '2025年8月夏日清凉活动',
  },
  {
    key: '5',
    couponId: '230916005',
    title: '全品满33减13',
    subtitle: '满33元减13元',
    description: '满25减2.5优惠券',
    couponType: '满减',
    couponStatus: '进行中',
    startTime: '2025-09-15',
    endTime: '2025-10-15',
    couponAmount: 250, // 2.5元
    issuedCount: 500,
    usedCount: 120,
    activityName: '2025年9月中秋节活动',
  },
  {
    key: '6',
    couponId: '230916006',
    title: '单价立减2.5',
    subtitle: '满4.5元减2.5元',
    description: '满30减3优惠券',
    couponType: '满减',
    couponStatus: '待开始',
    startTime: '2025-10-05',
    endTime: '2025-11-05',
    couponAmount: 300, // 3元
    issuedCount: 300,
    usedCount: 0,
    activityName: '2025年10月国庆特惠活动',
  },
  {
    key: '7',
    couponId: '230916007',
    title: '单价立减2.5',
    subtitle: '满4.5元减2.5元',
    description: '满35减2优惠券',
    couponType: '满减',
    couponStatus: '进行中',
    startTime: '2025-09-20',
    endTime: '2025-10-20',
    couponAmount: 200, // 2元
    issuedCount: 400,
    usedCount: 85,
    activityName: '2025年9月秋季促销活动',
  },
  {
    key: '8',
    couponId: '230916008',
    title: '全品满33减13',
    subtitle: '满33元减13元',
    description: '满40减3优惠券',
    couponType: '满减',
    couponStatus: '已结束',
    startTime: '2025-07-01',
    endTime: '2025-07-31',
    couponAmount: 300, // 3元
    issuedCount: 700,
    usedCount: 650,
    activityName: '2025年7月夏日狂欢活动',
  },
  {
    key: '9',
    couponId: '230916009',
    title: '康师傅满10减2元券',
    subtitle: '满10元减2元',
    description: '满45减2.5优惠券',
    couponType: '满减',
    couponStatus: '进行中',
    startTime: '2025-09-10',
    endTime: '2025-10-10',
    couponAmount: 250, // 2.5元
    issuedCount: 350,
    usedCount: 75,
    activityName: '康师傅品牌专场活动',
  },
  {
    key: '10',
    couponId: '230916010',
    title: '鲜Q面满10减5',
    subtitle: '满10元减5元',
    description: '满50减3优惠券',
    couponType: '满减',
    couponStatus: '待开始',
    startTime: '2025-10-10',
    endTime: '2025-11-10',
    couponAmount: 300, // 3元
    issuedCount: 200,
    usedCount: 0,
    activityName: '鲜Q面新品推广活动',
  },
];

const CouponAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<CouponData[]>(mockCouponData);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 查看详情处理函数
  const handleViewDetail = (couponId: string) => {
    // 跳转到详情页面
    navigate(`/client/coupon-detail/${couponId}`);
  };

  // 表格列定义
  const columns: ColumnsType<CouponData> = [
    {
      title: '优惠券编号',
      dataIndex: 'couponId',
      key: 'couponId',
      width: 120,
      fixed: 'left',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '副标题',
      dataIndex: 'subtitle',
      key: 'subtitle',
      width: 150,
    },
    {
      title: '所属活动名称',
      dataIndex: 'activityName',
      key: 'activityName',
      width: 180,
    },
    {
      title: '优惠券类型',
      dataIndex: 'couponType',
      key: 'couponType',
      width: 100,
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: '优惠券状态',
      dataIndex: 'couponStatus',
      key: 'couponStatus',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        if (status === '进行中') color = 'green';
        else if (status === '待开始') color = 'orange';
        else if (status === '已结束') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 120,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 120,
    },
    {
      title: '优惠券金额',
      dataIndex: 'couponAmount',
      key: 'couponAmount',
      width: 120,
      render: (amount: number) => `¥${(amount / 100).toFixed(2)}`,
      sorter: (a, b) => a.couponAmount - b.couponAmount,
    },
    {
      title: '已发放数量',
      dataIndex: 'issuedCount',
      key: 'issuedCount',
      width: 120,
      sorter: (a, b) => a.issuedCount - b.issuedCount,
    },
    {
      title: '已使用数量',
      dataIndex: 'usedCount',
      key: 'usedCount',
      width: 120,
      sorter: (a, b) => a.usedCount - b.usedCount,
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            onClick={() => handleViewDetail(record.couponId)}
          >
            查看
          </Button>
          <Button type="link" size="small">
            查看可核销商户
          </Button>
          <Button type="link" size="small">
            查看可核销商品
          </Button>
        </Space>
      ),
    },
  ];

  // 搜索功能
  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, selectedStatus, selectedActivity, dateRange);
  };

  // 筛选功能
  const filterData = (
    search: string,
    status?: string,
    activity?: string,
    dateRangeFilter?: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    let filtered = mockCouponData;

    if (search) {
      filtered = filtered.filter(
        item =>
          item.couponId.toLowerCase().includes(search.toLowerCase()) ||
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(item => item.couponStatus === status);
    }

    if (activity) {
      filtered = filtered.filter(item => item.activityName === activity);
    }

    if (dateRangeFilter && dateRangeFilter.length === 2 && dateRangeFilter[0] && dateRangeFilter[1]) {
      const [startDate, endDate] = dateRangeFilter;
      filtered = filtered.filter(item => {
        const itemStartDate = dayjs(item.startTime);
        const itemEndDate = dayjs(item.endTime);
        return (
          (itemStartDate.isAfter(startDate) || itemStartDate.isSame(startDate)) &&
          (itemEndDate.isBefore(endDate) || itemEndDate.isSame(endDate))
        );
      });
    }

    setFilteredData(filtered);
  };

  // 统计数据
  const totalCoupons = mockCouponData.length;
  const activeCoupons = mockCouponData.filter(item => item.couponStatus === '进行中').length;
  const totalAmount = mockCouponData.reduce((sum, item) => sum + item.couponAmount, 0);
  const totalIssued = mockCouponData.reduce((sum, item) => sum + item.issuedCount, 0);

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>优惠券分析</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="优惠券总数"
              value={totalCoupons}
              suffix="张"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已激活优惠券"
              value={activeCoupons}
              suffix="张"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="优惠券总金额"
              value={totalAmount / 100}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已发放总数"
              value={totalIssued}
              suffix="张"
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={5}>
            <Input
              placeholder="搜索优惠券编码、标题、副标题"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col span={3}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={(value) => {
                setSelectedStatus(value);
                filterData(searchText, value, selectedActivity, dateRange);
              }}
              allowClear
            >
              <Option value="待开始">待开始</Option>
              <Option value="进行中">进行中</Option>
              <Option value="已结束">已结束</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="选择活动名称"
              style={{ width: '100%' }}
              value={selectedActivity}
              onChange={(value) => {
                setSelectedActivity(value);
                filterData(searchText, selectedStatus, value, dateRange);
              }}
              allowClear
            >
              <Option value="2025年9月秋季促销活动">2025年9月秋季促销活动</Option>
              <Option value="2025年10月国庆特惠活动">2025年10月国庆特惠活动</Option>
              <Option value="2025年8月夏日清凉活动">2025年8月夏日清凉活动</Option>
              <Option value="2025年9月中秋节活动">2025年9月中秋节活动</Option>
              <Option value="康师傅品牌专场活动">康师傅品牌专场活动</Option>
              <Option value="鲜Q面新品推广活动">鲜Q面新品推广活动</Option>
              <Option value="2025年7月夏日狂欢活动">2025年7月夏日狂欢活动</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              placeholder={['开始时间', '结束时间']}
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates);
                filterData(searchText, selectedStatus, selectedActivity, dates);
              }}
            />
          </Col>
          <Col span={6}>
            {/* 预留空间 */}
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 2400, y: 600 }}
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

export default CouponAnalysis;