import React, { useState } from 'react';
import { Card, Descriptions, Tag, Button, Space, Typography, Row, Col, Statistic, Modal, Table } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface CouponDetailData {
  batchCode: string;          // 批次编码
  createTime: string;         // 创建时间
  faceValue: number;          // 面值
  title: string;              // 标题
  subtitle: string;           // 副标题
  startTime: string;          // 开始时间
  endTime: string;            // 结束时间
  status: string;             // 状态
  issuedQuantity: number;     // 发放数量
  usedQuantity: number;       // 使用数量
  usedAmount: number;         // 使用金额
  remainingQuantity: number;  // 剩余数量
  totalAmount: number;        // 总金额
  discountAmount: number;     // 优惠金额
  refundQuantity: number;     // 退款数量
  refundAmount: number;       // 退款金额
  activityName: string;       // 所属活动名称
  minConsumption: number;     // 最小消费额
  maxPerPerson: number;       // 每人最多领取量
  totalBudget: number;        // 总预算
  verifiedAmount: number;     // 已核销金额
  totalIssuedAmount: number;  // 发放总金额
  plannedQuantity: number;    // 计划总数量
  description: string;        // 优惠描述
}

// 模拟可核销商户数据
// 模拟可核销商户数据 - 扩展数据以支持分页
const mockMerchantData = [
  { id: '1', name: '华润万家(北京朝阳店)' },
  { id: '2', name: '华润万家(北京海淀店)' },
  { id: '3', name: '华润万家(北京西城店)' },
  { id: '4', name: '华润万家(北京东城店)' },
  { id: '5', name: '华润万家(北京丰台店)' },
  { id: '6', name: '华润万家(北京石景山店)' },
  { id: '7', name: '华润万家(北京通州店)' },
  { id: '8', name: '华润万家(北京昌平店)' },
  { id: '9', name: '华润万家(北京大兴店)' },
  { id: '10', name: '华润万家(北京房山店)' },
  { id: '11', name: '华润万家(北京顺义店)' },
  { id: '12', name: '华润万家(北京怀柔店)' },
];

// 模拟可核销商品数据 - 仅康师傅相关商品
const mockProductData = [
  { id: '1', barcode: '6901028089303', name: '康师傅红烧牛肉面', standardPrice: 4.5 },
  { id: '2', barcode: '6901028089304', name: '康师傅香辣牛肉面', standardPrice: 4.5 },
  { id: '3', barcode: '6901028089305', name: '康师傅老坛酸菜牛肉面', standardPrice: 5.0 },
  { id: '4', barcode: '6901028089306', name: '康师傅鲜虾鱼板面', standardPrice: 4.8 },
  { id: '5', barcode: '6901028089307', name: '康师傅西红柿鸡蛋面', standardPrice: 4.2 },
  { id: '6', barcode: '6901028089308', name: '康师傅香菇炖鸡面', standardPrice: 4.8 },
  { id: '7', barcode: '6901028089309', name: '康师傅麻辣牛肉面', standardPrice: 4.5 },
  { id: '8', barcode: '6901028089310', name: '康师傅酸辣粉丝', standardPrice: 3.8 },
  { id: '9', barcode: '6901028089311', name: '康师傅绿茶 500ml', standardPrice: 3.0 },
  { id: '10', barcode: '6901028089312', name: '康师傅冰红茶 500ml', standardPrice: 3.0 },
  { id: '11', barcode: '6901028089313', name: '康师傅蜂蜜柚子茶 500ml', standardPrice: 3.5 },
  { id: '12', barcode: '6901028089314', name: '康师傅茉莉清茶 500ml', standardPrice: 2.8 },
];

// 模拟详情数据
const mockDetailData: CouponDetailData = {
  batchCode: '230916001',
  createTime: '2025-09-16 10:30:00',
  faceValue: 250,
  title: '单价立减2.5',
  subtitle: '满4.5元减2.5元',
  startTime: '2025-09-28',
  endTime: '2025-10-28',
  status: '进行中',
  issuedQuantity: 1000,
  usedQuantity: 250,
  usedAmount: 62500,
  remainingQuantity: 750,
  totalAmount: 250000,
  discountAmount: 62500,
  refundQuantity: 5,
  refundAmount: 1250,
  activityName: '2025年9月秋季促销活动',
  minConsumption: 450,
  maxPerPerson: 3,
  totalBudget: 500000,
  verifiedAmount: 62500,
  totalIssuedAmount: 250000,
  plannedQuantity: 2000,
  description: '满4.5元减2.5元，适用于指定商品，每人限领3张，活动期间有效',
};

const CouponDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 状态管理
  const [merchantModalVisible, setMerchantModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

  // 商户表格列定义
  const merchantColumns = [
    {
      title: '商户名称',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  // 商品表格列定义
  const productColumns = [
    {
      title: '69码',
      dataIndex: 'barcode',
      key: 'barcode',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '标准价',
      dataIndex: 'standardPrice',
      key: 'standardPrice',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
  ];

  const handleBack = () => {
    navigate('/client/coupon-analysis');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中': return 'green';
      case '待开始': return 'orange';
      case '已结束': return 'red';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ 
        background: '#fff', 
        padding: '24px', 
        borderRadius: '8px', 
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              type="text"
              style={{ color: '#262626', marginRight: '16px' }}
            >
              返回
            </Button>
          </div>
        </div>
      </div>

      {/* 基本信息 */}
      <Card title="基本信息" style={{ marginBottom: '24px' }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="批次编码">
            {mockDetailData.batchCode}
          </Descriptions.Item>
          <Descriptions.Item label="标题">
            {mockDetailData.title}
          </Descriptions.Item>
          <Descriptions.Item label="副标题">
            {mockDetailData.subtitle}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {mockDetailData.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="开始时间">
            {mockDetailData.startTime}
          </Descriptions.Item>
          <Descriptions.Item label="结束时间">
            {mockDetailData.endTime}
          </Descriptions.Item>
          <Descriptions.Item label="面值">
            ¥{(mockDetailData.faceValue / 100).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="所属活动名称">
            {mockDetailData.activityName}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={getStatusColor(mockDetailData.status)}>
              {mockDetailData.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="最小消费额">
            ¥{(mockDetailData.minConsumption / 100).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="每人最多领取量">
            {mockDetailData.maxPerPerson} 张
          </Descriptions.Item>
          <Descriptions.Item label="总预算">
            ¥{(mockDetailData.totalBudget / 100).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="已核销金额">
            ¥{(mockDetailData.verifiedAmount / 100).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="发放总金额">
            ¥{(mockDetailData.totalIssuedAmount / 100).toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="计划总数量">
            {mockDetailData.plannedQuantity} 张
          </Descriptions.Item>
          <Descriptions.Item label="已发放数量">
            {mockDetailData.issuedQuantity} 张
          </Descriptions.Item>
          <Descriptions.Item label="已使用数量">
            {mockDetailData.usedQuantity} 张
          </Descriptions.Item>
        </Descriptions>
        
        {/* 优惠描述单独显示 */}
        <div style={{ marginTop: '16px' }}>
          <strong>优惠描述：</strong>
          <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
            {mockDetailData.description}
          </div>
        </div>
      </Card>

      {/* 可核销商户列表 */}
      <Card title="可核销商户列表" style={{ marginBottom: '24px' }}>
        <Table
          columns={merchantColumns}
          dataSource={mockMerchantData}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 可核销商品列表 */}
      <Card title="可核销商品列表" style={{ marginBottom: '24px' }}>
        <Table
          columns={productColumns}
          dataSource={mockProductData}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 可核销商户弹窗 */}
      <Modal
        title="可核销商户列表"
        open={merchantModalVisible}
        onCancel={() => setMerchantModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={merchantColumns}
          dataSource={mockMerchantData}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* 可核销商品弹窗 */}
      <Modal
        title="可核销商品列表"
        open={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={productColumns}
          dataSource={mockProductData}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default CouponDetail;