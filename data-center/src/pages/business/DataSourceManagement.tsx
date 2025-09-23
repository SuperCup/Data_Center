import React from 'react';
import { Table, Tag, Card, Button, Space } from 'antd';
import { SyncOutlined, InfoCircleOutlined } from '@ant-design/icons';

const DataSourceManagement: React.FC = () => {
  // 模拟数据
  const dataSource = [
    {
      id: 1,
      name: '微信支付',
      status: 'normal',
      lastUpdate: '2023-09-22 10:30:45',
      description: '微信支付交易数据，包含支付金额、时间、用户ID等信息',
    },
    {
      id: 2,
      name: '支付宝',
      status: 'normal',
      lastUpdate: '2023-09-22 09:15:22',
      description: '支付宝交易数据，包含支付金额、时间、用户ID等信息',
    },
    {
      id: 3,
      name: '抖音',
      status: 'error',
      lastUpdate: '2023-09-21 18:45:30',
      description: '抖音平台数据，包含曝光量、点击量、转化量等信息',
    },
    {
      id: 4,
      name: '美团',
      status: 'pending',
      lastUpdate: '2023-09-20 14:20:10',
      description: '美团平台数据，包含订单量、客单价、用户评价等信息',
    },
  ];

  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        let text = '正常';
        let icon = null;
        
        if (status === 'error') {
          color = 'red';
          text = '异常';
          icon = <InfoCircleOutlined />;
        } else if (status === 'pending') {
          color = 'orange';
          text = '待更新';
          icon = <SyncOutlined spin />;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: '数据说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small">查看详情</Button>
          <Button type="link" size="small">更新配置</Button>
          <Button type="link" size="small" danger={record.status === 'error'}>
            {record.status === 'error' ? '修复异常' : '检查连接'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card 
        title="数据源管理" 
        extra={<Button type="primary">添加数据源</Button>}
        style={{ marginBottom: 20 }}
      >
        <p>管理已接入平台的数据源，监控数据接入状态，查看数据口径说明与变更记录。</p>
      </Card>
      
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default DataSourceManagement;