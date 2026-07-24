import React, { useMemo, useState } from 'react';
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
  Switch,
  Tag,
  Typography,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { INITIAL_KNOWLEDGE, KnowledgeItem, uid } from '../../../services/aiMock';
import './aiWorkbench.css';

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

const KnowledgeBase: React.FC = () => {
  const [list, setList] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);
  const [keyword, setKeyword] = useState('');
  const [kind, setKind] = useState<string>();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = useMemo(
    () =>
      list.filter(
        (k) =>
          (!keyword || k.title.includes(keyword) || k.content.includes(keyword)) &&
          (!kind || k.kind === kind)
      ),
    [list, keyword, kind]
  );

  const onAdd = async () => {
    const values = await form.validateFields();
    setList((prev) => [
      {
        id: uid('k'),
        title: values.title,
        kind: values.kind,
        status: 'enabled',
        updatedAt: '今天',
        refs: 0,
        content: values.content,
      },
      ...prev,
    ]);
    message.success('知识已添加');
    setOpen(false);
    form.resetFields();
  };

  return (
      <div className="ai-wb-page">
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            品牌知识库
          </Title>
          <Text type="secondary">文档、指标口径与品牌规则，供 Agent 引用</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          新增知识
        </Button>
      </Space>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          allowClear
          placeholder="搜索知识库"
          style={{ width: 260 }}
          onSearch={setKeyword}
          onChange={(e) => !e.target.value && setKeyword('')}
        />
        <Select
          allowClear
          placeholder="类型"
          style={{ width: 140 }}
          value={kind}
          onChange={setKind}
          options={['指标口径', '品牌规则', 'FAQ', '文档'].map((v) => ({ value: v, label: v }))}
        />
      </Space>

      <Row gutter={[16, 16]}>
        {filtered.map((k) => (
          <Col xs={24} sm={12} lg={8} key={k.id}>
            <Card
              size="small"
              title={k.title}
              extra={<Tag color={k.status === 'enabled' ? 'success' : 'default'}>{k.kind}</Tag>}
              actions={[
                <Switch
                  key="sw"
                  checkedChildren="启用"
                  unCheckedChildren="停用"
                  checked={k.status === 'enabled'}
                  onChange={(checked) =>
                    setList((prev) =>
                      prev.map((item) =>
                        item.id === k.id
                          ? { ...item, status: checked ? 'enabled' : 'disabled' }
                          : item
                      )
                    )
                  }
                />,
                <Button
                  key="del"
                  type="link"
                  danger
                  onClick={() => {
                    setList((prev) => prev.filter((item) => item.id !== k.id));
                    message.success('已删除');
                  }}
                >
                  删除
                </Button>,
              ]}
            >
              <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                {k.content}
              </Paragraph>
              <Text type="secondary" style={{ fontSize: 12 }}>
                引用 {k.refs} 次 · {k.updatedAt}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="新增品牌知识"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onAdd}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ kind: '指标口径' }}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="kind" label="类型" rules={[{ required: true }]}>
            <Select
              options={['指标口径', '品牌规则', 'FAQ', '文档'].map((v) => ({
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

export default KnowledgeBase;
