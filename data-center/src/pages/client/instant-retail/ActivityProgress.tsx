import React, { useState, useEffect } from 'react';
import { Card, Progress, Timeline, Statistic, Row, Col, Table, Tag, Button, Modal, Form, Input, DatePicker, Select, Space, Typography } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ActivityTask {
  id: string;
  name: string;
  description: string;
  assignee: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  priority: 'high' | 'medium' | 'low';
}

interface Activity {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in_progress' | 'completed' | 'paused';
  progress: number;
  budget: number;
  spent: number;
  tasks: ActivityTask[];
}

const ActivityProgress: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: '双十一大促活动',
      description: '年度最大规模促销活动，涵盖全品类商品',
      startDate: '2024-10-01',
      endDate: '2024-11-15',
      status: 'in_progress',
      progress: 65,
      budget: 1000000,
      spent: 650000,
      tasks: [
        {
          id: '1-1',
          name: '活动策划',
          description: '制定活动方案和营销策略',
          assignee: '张三',
          startDate: '2024-10-01',
          endDate: '2024-10-10',
          status: 'completed',
          progress: 100,
          priority: 'high'
        },
        {
          id: '1-2',
          name: '商品准备',
          description: '筛选参与活动的商品，设置促销价格',
          assignee: '李四',
          startDate: '2024-10-05',
          endDate: '2024-10-25',
          status: 'in_progress',
          progress: 80,
          priority: 'high'
        },
        {
          id: '1-3',
          name: '页面设计',
          description: '设计活动页面和宣传素材',
          assignee: '王五',
          startDate: '2024-10-10',
          endDate: '2024-10-30',
          status: 'in_progress',
          progress: 45,
          priority: 'medium'
        }
      ]
    },
    {
      id: '2',
      name: '春季新品发布',
      description: '春季新品线上发布活动',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'completed',
      progress: 100,
      budget: 500000,
      spent: 480000,
      tasks: [
        {
          id: '2-1',
          name: '产品拍摄',
          description: '新品商业摄影',
          assignee: '赵六',
          startDate: '2024-03-01',
          endDate: '2024-03-10',
          status: 'completed',
          progress: 100,
          priority: 'high'
        },
        {
          id: '2-2',
          name: '发布会筹备',
          description: '线上发布会准备工作',
          assignee: '钱七',
          startDate: '2024-03-05',
          endDate: '2024-03-20',
          status: 'completed',
          progress: 100,
          priority: 'medium'
        }
      ]
    }
  ]);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 进入页面弹窗一次提醒
  useEffect(() => {
    Modal.info({
      title: '提醒',
      content: '感谢关注，当前页面设计中，请完成后查看。',
      okText: '知道了'
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'blue';
      case 'in_progress': return 'orange';
      case 'completed': return 'green';
      case 'paused': return 'red';
      case 'pending': return 'default';
      case 'overdue': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return '规划中';
      case 'in_progress': return '进行中';
      case 'completed': return '已完成';
      case 'paused': return '已暂停';
      case 'pending': return '待开始';
      case 'overdue': return '已逾期';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <ClockCircleOutlined />;
      case 'in_progress': return <PlayCircleOutlined />;
      case 'completed': return <CheckCircleOutlined />;
      case 'paused': return <PauseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const activityColumns: ColumnsType<Activity> = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: '时间范围',
      key: 'dateRange',
      render: (_, record) => (
        <div>
          <Text>{record.startDate}</Text>
          <br />
          <Text>至 {record.endDate}</Text>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      )
    },
    {
      title: '预算执行',
      key: 'budget',
      render: (_, record) => (
        <div>
          <Text>已用: ¥{record.spent.toLocaleString()}</Text>
          <br />
          <Text type="secondary">总预算: ¥{record.budget.toLocaleString()}</Text>
          <Progress 
            percent={Math.round((record.spent / record.budget) * 100)} 
            size="small"
            showInfo={false}
          />
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditActivity(record)}
          >
            编辑
          </Button>
        </Space>
      )
    }
  ];

  const taskColumns: ColumnsType<ActivityTask> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee'
    },
    {
      title: '截止日期',
      dataIndex: 'endDate',
      key: 'endDate'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      )
    }
  ];

  const handleViewDetail = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailModalVisible(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    form.setFieldsValue({
      ...activity,
      startDate: dayjs(activity.startDate),
      endDate: dayjs(activity.endDate)
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedActivity = {
        ...selectedActivity!,
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      };

      setActivities(activities.map(activity => 
        activity.id === selectedActivity!.id ? updatedActivity : activity
      ));

      setEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 计算总体统计数据
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.status === 'completed').length;
  const inProgressActivities = activities.filter(a => a.status === 'in_progress').length;
  const totalBudget = activities.reduce((sum, a) => sum + a.budget, 0);
  const totalSpent = activities.reduce((sum, a) => sum + a.spent, 0);

  return (
    <div className="activity-progress-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>活动进度管理</Title>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
            该数据仅作业务分析参考，不作为最终结算依据。
          </Text>
        </div>
      </div>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {/* 这里可以添加筛选条件，如状态筛选、时间筛选等 */}
          </div>
        </div>
      </Card>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总活动数"
              value={totalActivities}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="进行中"
              value={inProgressActivities}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={completedActivities}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预算执行率"
              value={Math.round((totalSpent / totalBudget) * 100)}
              suffix="%"
              valueStyle={{ color: totalSpent / totalBudget > 0.8 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 活动列表 */}
      <Card title="活动列表">
        <Table
          columns={activityColumns}
          dataSource={activities}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 活动详情模态框 */}
      <Modal
        title="活动详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedActivity && (
          <div>
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="整体进度"
                    value={selectedActivity.progress}
                    suffix="%"
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Progress percent={selectedActivity.progress} />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="预算执行"
                    value={Math.round((selectedActivity.spent / selectedActivity.budget) * 100)}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <Progress 
                    percent={Math.round((selectedActivity.spent / selectedActivity.budget) * 100)} 
                  />
                </Card>
              </Col>
            </Row>

            <Card title="任务列表" size="small">
              <Table
                columns={taskColumns}
                dataSource={selectedActivity.tasks}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>

            <Card title="进度时间线" size="small" style={{ marginTop: '16px' }}>
              <Timeline>
                {selectedActivity.tasks.map(task => (
                  <Timeline.Item
                    key={task.id}
                    color={getStatusColor(task.status)}
                    dot={getStatusIcon(task.status)}
                  >
                    <div>
                      <Text strong>{task.name}</Text>
                      <br />
                      <Text type="secondary">负责人: {task.assignee}</Text>
                      <br />
                      <Text type="secondary">截止: {task.endDate}</Text>
                      <br />
                      <Progress percent={task.progress} size="small" />
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        )}
      </Modal>

      {/* 编辑活动模态框 */}
      <Modal
        title="编辑活动"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="活动名称"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true, message: '请输入活动描述' }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始日期"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束日期"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  <Option value="planning">规划中</Option>
                  <Option value="in_progress">进行中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="paused">已暂停</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="progress"
                label="进度 (%)"
                rules={[{ required: true, message: '请输入进度' }]}
              >
                <Input type="number" min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="总预算"
                rules={[{ required: true, message: '请输入总预算' }]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="spent"
                label="已花费"
                rules={[{ required: true, message: '请输入已花费金额' }]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivityProgress;