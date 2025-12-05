import React from 'react';
import { Card, Row, Col, Table, Statistic, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { unifiedChannels, type ChannelData } from '../../../data/storeMarketingData';

const ChannelAnalysis: React.FC = () => {
  // 使用统一的渠道数据
  const channelData = unifiedChannels;

  const columns = [
    {
      title: '渠道',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '曝光量',
      dataIndex: 'exposure',
      key: 'exposure',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '点击量',
      dataIndex: 'click',
      key: 'click',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '转化量',
      dataIndex: 'conversion',
      key: 'conversion',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '点击率(CTR)',
      dataIndex: 'ctr',
      key: 'ctr',
      render: (value: number) => `${value}%`,
    },
    {
      title: '转化率(CVR)',
      dataIndex: 'cvr',
      key: 'cvr',
      render: (value: number) => `${value}%`,
    },
    {
      title: '投放成本',
      dataIndex: 'cost',
      key: 'cost',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      render: (value: number) => {
        const color = value >= 4.0 ? '#3f8600' : value >= 3.5 ? '#1890ff' : '#cf1322';
        const icon = value >= 3.5 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        return (
          <span style={{ color }}>
            {icon} {value}
          </span>
        );
      },
    },
  ];

  // 投放素材效果数据
  const contentData = [
    {
      id: 1,
      type: '短视频',
      name: '618狂欢购物节',
      playCount: 1200000,
      ctr: 8.5,
      cvr: 3.2,
      roi: 4.5,
    },
    {
      id: 2,
      type: '直播',
      name: '新品发布会',
      playCount: 800000,
      ctr: 12.3,
      cvr: 5.8,
      roi: 6.2,
    },
    {
      id: 3,
      type: '短视频',
      name: '产品使用教程',
      playCount: 500000,
      ctr: 6.8,
      cvr: 2.5,
      roi: 3.8,
    },
    {
      id: 4,
      type: '直播',
      name: '达人推荐',
      playCount: 950000,
      ctr: 10.5,
      cvr: 4.2,
      roi: 5.3,
    },
  ];

  const contentColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '内容名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '播放量',
      dataIndex: 'playCount',
      key: 'playCount',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '点击率',
      dataIndex: 'ctr',
      key: 'ctr',
      render: (value: number) => `${value}%`,
    },
    {
      title: '转化率',
      dataIndex: 'cvr',
      key: 'cvr',
      render: (value: number) => `${value}%`,
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
    },
  ];

  return (
    <div>
      <h2>渠道分析</h2>
      <Divider />
      
      {/* 渠道效果对比 */}
      <Card title="各渠道投放效果对比" style={{ marginBottom: 20 }}>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <Statistic
              title="总曝光量"
              value={channelData.reduce((sum: number, item: ChannelData) => sum + item.exposure, 0)}
              formatter={(value) => `${(value as number).toLocaleString()}`}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总点击量"
              value={channelData.reduce((sum: number, item: ChannelData) => sum + item.click, 0)}
              formatter={(value) => `${(value as number).toLocaleString()}`}
              valueStyle={{ color: '#000000' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总转化量"
              value={channelData.reduce((sum: number, item: ChannelData) => sum + item.conversion, 0)}
              formatter={(value) => `${(value as number).toLocaleString()}`}
              valueStyle={{ color: '#000000' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均ROI"
              value={channelData.reduce((sum: number, item: ChannelData) => sum + item.roi, 0) / channelData.length}
              precision={2}
              valueStyle={{ color: '#000000' }}
              prefix={<ArrowUpOutlined />}
            />
          </Col>
        </Row>
        
        <Table 
          dataSource={channelData} 
          columns={columns} 
          rowKey="id"
          pagination={false}
        />
      </Card>
      
      {/* 投放素材效果 */}
      <Card title="投放素材效果">
        <Table 
          dataSource={contentData} 
          columns={contentColumns} 
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ChannelAnalysis;