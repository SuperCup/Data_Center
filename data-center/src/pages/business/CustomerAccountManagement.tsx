import React from 'react';
import { Table, Button, Space, Input, Select, Card, Typography } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const CustomerAccountManagement: React.FC = () => {
  // 模拟客户账号数据
  const customers = [
    {
      id: 1,
      name: '腾讯游戏',
      contact: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138001',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-10-15 14:30:22',
    },
    {
      id: 2,
      name: '网易游戏',
      contact: '李四',
      email: 'lisi@example.com',
      phone: '13900139002',
      role: 'user',
      status: 'active',
      lastLogin: '2023-10-14 09:15:43',
    },
    {
      id: 3,
      name: '完美世界',
      contact: '王五',
      email: 'wangwu@example.com',
      phone: '13700137003',
      role: 'user',
      status: 'inactive',
      lastLogin: '2023-10-10 16:22:10',
    },
  ];

  // 表格列配置
  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <span>{role === 'admin' ? '管理员' : '普通用户'}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status === 'active' ? '活跃' : '未活跃'}
        </span>
      ),
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>客户账号与权限管理</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="客户名称/联系人" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">所有状态</Option>
            <Option value="active">活跃</Option>
            <Option value="inactive">未活跃</Option>
          </Select>
          <Select defaultValue="all" style={{ width: 120 }}>
            <Option value="all">所有角色</Option>
            <Option value="admin">管理员</Option>
            <Option value="user">普通用户</Option>
          </Select>
          <Button type="primary">搜索</Button>
          <Button>重置</Button>
        </Space>
        
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          添加客户账号
        </Button>
        
        <Table 
          columns={columns} 
          dataSource={customers} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default CustomerAccountManagement;