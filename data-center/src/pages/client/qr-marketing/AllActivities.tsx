import React, { useState } from 'react';
import { Table, Card, Input, Select, DatePicker, Button, Tag, Space, Typography, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

interface QrActivityData {
  key: string;
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: '进行中' | '已结束' | '待开始';
  planCodeCount: number;
  actualScanCount: number;
  actualScanRate: number;
  repurchaseRate: number;
}

const mockQrActivities: QrActivityData[] = [
  {
    key: '1',
    id: 'QR001',
    name: '康师傅红烧牛肉面扫码有礼活动',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: '进行中',
    planCodeCount: 200000,
    actualScanCount: 156320,
    actualScanRate: 78.2,
    repurchaseRate: 21.5,
  },
  {
    key: '2',
    id: 'QR002',
    name: '康师傅老坛酸菜面扫码赢红包',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    status: '已结束',
    planCodeCount: 150000,
    actualScanCount: 121540,
    actualScanRate: 81.0,
    repurchaseRate: 19.8,
  },
  {
    key: '3',
    id: 'QR003',
    name: '康师傅香辣牛肉面扫码送好礼',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    status: '已结束',
    planCodeCount: 120000,
    actualScanCount: 93210,
    actualScanRate: 77.7,
    repurchaseRate: 17.2,
  },
  {
    key: '4',
    id: 'QR004',
    name: '康师傅国庆扫码翻倍奖励活动',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: '待开始',
    planCodeCount: 260000,
    actualScanCount: 0,
    actualScanRate: 0,
    repurchaseRate: 0,
  },
];

const AllActivities: React.FC = () => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<QrActivityData[]>(mockQrActivities);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const filterData = (
    search: string,
    status: string | undefined,
    dateRangeValue: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    let filtered = mockQrActivities;

    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(item => item.status === status);
    }

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

  const handleRealtime = (activityId: string) => {
    navigate(`/client/qr-realtime/${activityId}`);
  };

  const handleActivityAnalysis = (activityId: string) => {
    navigate(`/client/qr-activity-analysis/${activityId}`);
  };

  const columns: ColumnsType<QrActivityData> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 120, fixed: 'left' },
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      fixed: 'left',
      render: (text: string) => (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
          {text}
        </div>
      ),
    },
    { title: '开始时间', dataIndex: 'startDate', key: 'startDate', width: 120, render: (date: string) => dayjs(date).format('YYYY-MM-DD') },
    { title: '结束时间', dataIndex: 'endDate', key: 'endDate', width: 120, render: (date: string) => dayjs(date).format('YYYY-MM-DD') },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: QrActivityData['status']) => {
        let color: any = 'default';
        if (status === '进行中') color = 'processing';
        else if (status === '已结束') color = 'success';
        else if (status === '待开始') color = 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: '计划码量', dataIndex: 'planCodeCount', key: 'planCodeCount', width: 120, render: (v: number) => v.toLocaleString() },
    { title: '实际扫码量', dataIndex: 'actualScanCount', key: 'actualScanCount', width: 120, render: (v: number) => v.toLocaleString() },
    { title: '实际扫码率', dataIndex: 'actualScanRate', key: 'actualScanRate', width: 120, render: (v: number) => `${v.toFixed(1)}%` },
    { title: '复购率', dataIndex: 'repurchaseRate', key: 'repurchaseRate', width: 100, render: (v: number) => `${v.toFixed(1)}%` },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleRealtime(record.id)}>实时动态</Button>
          <Button type="link" size="small" onClick={() => handleActivityAnalysis(record.id)}>活动分析</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="qr-all-activities-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>全量活动</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Input
              placeholder="搜索活动名称或ID"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                const v = e.target.value;
                setSearchText(v);
                filterData(v, selectedStatus, dateRange);
              }}
            />
          </Col>
          <Col span={6}>
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
          <Col span={10}>
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
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 1600, y: 550 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          size="small"
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default AllActivities;