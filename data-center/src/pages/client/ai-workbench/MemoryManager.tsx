import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { PlusOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons';
import { INITIAL_MEMORIES, MemoryItem, uid } from '../../../services/aiMock';
import './aiWorkbench.css';

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

const MemoryManager: React.FC = () => {
  const [list, setList] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const onAdd = async () => {
    const values = await form.validateFields();
    setList((prev) => [
      {
        id: uid('m'),
        title: values.title,
        kind: values.kind,
        pinned: false,
        content: values.content,
        updatedAt: '今天',
      },
      ...prev,
    ]);
    message.success('记忆已添加');
    setOpen(false);
    form.resetFields();
  };

  return (
      <div className="ai-wb-page">
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            记忆管理
          </Title>
          <Text type="secondary">偏好、常看指标、历史提问与浏览轨迹</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          新增记忆
        </Button>
      </Space>

      <Row gutter={[16, 16]}>
        {list.map((m) => (
          <Col xs={24} sm={12} lg={8} key={m.id}>
            <Card
              size="small"
              title={
                <Space>
                  {m.pinned ? (
                    <PushpinFilled style={{ color: '#1890ff' }} />
                  ) : (
                    <PushpinOutlined />
                  )}
                  {m.title}
                </Space>
              }
              extra={<Tag>{m.kind}</Tag>}
              actions={[
                <Button
                  key="pin"
                  type="link"
                  onClick={() =>
                    setList((prev) =>
                      prev.map((item) =>
                        item.id === m.id ? { ...item, pinned: !item.pinned } : item
                      )
                    )
                  }
                >
                  {m.pinned ? '取消置顶' : '置顶'}
                </Button>,
                <Button
                  key="del"
                  type="link"
                  danger
                  onClick={() => {
                    setList((prev) => prev.filter((item) => item.id !== m.id));
                    message.success('已删除');
                  }}
                >
                  删除
                </Button>,
              ]}
            >
              <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                {m.content}
              </Paragraph>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {m.updatedAt}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title="新增个人记忆" open={open} onCancel={() => setOpen(false)} onOk={onAdd} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ kind: '偏好' }}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="kind" label="类型" rules={[{ required: true }]}>
            <Select
              options={['偏好', '常看指标', '历史提问', '浏览轨迹'].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      </div>
  );
};

export default MemoryManager;
