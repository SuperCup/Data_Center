import React, { useState, useEffect } from 'react';
import { Card, Calendar, Badge, Modal, Form, Input, DatePicker, Select, Button, Space, List, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface MarketingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  platform: '微信' | '支付宝' | '抖音' | '美团' | '天猫' | '微信小店' | '其他';
  type: 'promotion' | 'campaign' | 'launch' | 'analysis';
  status: 'planned' | 'ongoing' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

const MarketingCalendar: React.FC = () => {
  const [events, setEvents] = useState<MarketingEvent[]>([
    {
      id: '1',
      title: '双十一促销活动',
      description: '年度最大促销活动，全品类参与',
      date: '2024-11-11',
      platform: '天猫',
      type: 'promotion',
      status: 'planned',
      priority: 'high'
    },
    {
      id: '2',
      title: '新品发布会',
      description: '春季新品线上发布',
      date: '2024-03-15',
      platform: '抖音',
      type: 'launch',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: '3',
      title: '用户行为分析报告',
      description: '月度用户行为数据分析',
      date: '2024-02-28',
      platform: '微信',
      type: 'analysis',
      status: 'ongoing',
      priority: 'medium'
    }
  ]);

  // 筛选状态：月份与平台
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(dayjs());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MarketingEvent | null>(null);
  const [form] = Form.useForm();

  // 进入页面弹窗一次提醒
  useEffect(() => {
    Modal.info({
      title: '提醒',
      content: '感谢关注，当前页面设计中，请完成后查看。',
      okText: '知道了'
    });
  }, []);

  const getEventsByDate = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    return events.filter(event => {
      const matchDate = event.date === dateStr;
      const matchMonth = !selectedMonth || dayjs(event.date).isSame(selectedMonth, 'month');
      const matchPlatform = selectedPlatform === 'all' || event.platform === selectedPlatform;
      return matchDate && matchMonth && matchPlatform;
    });
  };

  const filteredEvents = events.filter(event => {
    const matchMonth = !selectedMonth || dayjs(event.date).isSame(selectedMonth, 'month');
    const matchPlatform = selectedPlatform === 'all' || event.platform === selectedPlatform;
    return matchMonth && matchPlatform;
  });

  const dateCellRender = (value: Dayjs) => {
    const dayEvents = getEventsByDate(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayEvents.map(event => (
          <li key={event.id}>
            <Badge 
              status={event.priority === 'high' ? 'error' : event.priority === 'medium' ? 'warning' : 'default'} 
              text={event.title.length > 8 ? `${event.title.substring(0, 8)}...` : event.title}
              style={{ fontSize: '12px' }}
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    form.resetFields();
    if (selectedDate) {
      form.setFieldsValue({ date: selectedDate });
    }
    setModalVisible(true);
  };

  const handleEditEvent = (event: MarketingEvent) => {
    setEditingEvent(event);
    form.setFieldsValue({
      ...event,
      date: dayjs(event.date)
    });
    setModalVisible(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const eventData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        id: editingEvent ? editingEvent.id : Date.now().toString()
      };

      if (editingEvent) {
        setEvents(events.map(event => 
          event.id === editingEvent.id ? eventData : event
        ));
      } else {
        setEvents([...events, eventData]);
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'blue';
      case 'ongoing': return 'orange';
      case 'completed': return 'green';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'promotion': return '促销活动';
      case 'campaign': return '营销活动';
      case 'launch': return '产品发布';
      case 'analysis': return '数据分析';
      default: return type;
    }
  };

  return (
    <div className="marketing-calendar-container">
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, marginRight: 8 }}>营销日历</Title>
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
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={(v) => setSelectedMonth(v)}
              style={{ width: 160 }}
              size="small"
            />
            <Select
              value={selectedPlatform}
              onChange={setSelectedPlatform}
              style={{ width: 160 }}
              size="small"
            >
              <Option value="all">全部平台</Option>
              <Option value="微信">微信</Option>
              <Option value="支付宝">支付宝</Option>
              <Option value="抖音">抖音</Option>
              <Option value="美团">美团</Option>
              <Option value="天猫">天猫</Option>
              <Option value="微信小店">微信小店</Option>
              <Option value="其他">其他</Option>
            </Select>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 日历视图 */}
        <Card style={{ flex: 2 }}>
          <Calendar
            value={selectedMonth || dayjs()}
            onPanelChange={(value) => setSelectedMonth(value)}
            dateCellRender={dateCellRender}
            onSelect={handleDateSelect}
          />
        </Card>

        {/* 事件列表 */}
        <Card title="营销事件列表" style={{ flex: 1 }}>
          <List
            dataSource={filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
            renderItem={event => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    onClick={() => handleEditEvent(event)}
                  />,
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDeleteEvent(event.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  title={
                    <div>
                      <Text strong>{event.title}</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Tag color={getStatusColor(event.status)}>
                          {event.status === 'planned' ? '计划中' : 
                           event.status === 'ongoing' ? '进行中' : '已完成'}
                        </Tag>
                        <Tag>{event.platform}</Tag>
                        <Tag>{getTypeText(event.type)}</Tag>
                      </div>
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary">{event.description}</Text>
                      <br />
                      <Text type="secondary">{event.date}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* 添加/编辑事件模态框 */}
      <Modal
        title={editingEvent ? '编辑营销事件' : '添加营销事件'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'promotion',
            status: 'planned',
            priority: 'medium',
            platform: '微信'
          }}
        >
          <Form.Item
            name="platform"
            label="平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select>
              <Option value="微信">微信</Option>
              <Option value="支付宝">支付宝</Option>
              <Option value="抖音">抖音</Option>
              <Option value="美团">美团</Option>
              <Option value="天猫">天猫</Option>
              <Option value="微信小店">微信小店</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="事件标题"
            rules={[{ required: true, message: '请输入事件标题' }]}
          >
            <Input placeholder="请输入事件标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="事件描述"
            rules={[{ required: true, message: '请输入事件描述' }]}
          >
            <TextArea rows={3} placeholder="请输入事件描述" />
          </Form.Item>

          <Form.Item
            name="date"
            label="事件日期"
            rules={[{ required: true, message: '请选择事件日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="type"
            label="事件类型"
            rules={[{ required: true, message: '请选择事件类型' }]}
          >
            <Select>
              <Option value="promotion">促销活动</Option>
              <Option value="campaign">营销活动</Option>
              <Option value="launch">产品发布</Option>
              <Option value="analysis">数据分析</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="事件状态"
            rules={[{ required: true, message: '请选择事件状态' }]}
          >
            <Select>
              <Option value="planned">计划中</Option>
              <Option value="ongoing">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MarketingCalendar;