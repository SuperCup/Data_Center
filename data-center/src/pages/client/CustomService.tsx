import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Modal, Button } from 'antd';
import { DashboardOutlined, ShopOutlined, QrcodeOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const { Meta } = Card;

const CustomService: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // 页面加载时自动弹出提示
  useEffect(() => {
    setModalVisible(true);
  }, []);

  const productCards = [
    {
      key: 'dashboard',
      title: '到店营销',
      description: '通过微信支付、支付宝、抖音本地生活、美团团购在商超便利渠道、传统小店渠道发放优惠券并完成支付核销的业务',
      icon: <ShopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      features: [
        '微信支付和支付宝发券',
        '品牌私域开发规划（小程序、公众号、企业微信、H5活动等）',
        '抖音本地生活、美团团购投放',
        '投放渠道规划（品牌直播、零售直播、平台直播、达人投放、内容或短视频制作与投放等）'
      ]
    },
    {
      key: 'instant-retail',
      title: '即时零售',
      description: '品牌在美团闪购、饿了么/淘宝闪购、京东到家、多点、朴朴等平台的综合服务',
      icon: <DashboardOutlined style={{ fontSize: '48px', color: '#40a9ff' }} />,
      features: [
        '活动代运营服务',
        'RTB广告投放服务',
        '平台官旗运营服务',
        '闪电仓托盘服务'
      ]
    },
    {
      key: 'qr-marketing',
      title: '物码营销',
      description: '待补充',
      icon: <QrcodeOutlined style={{ fontSize: '48px', color: '#597ef7' }} />,
      features: ['待补充']
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 功能设计阶段说明 */}
      <div style={{ 
        marginBottom: '16px', 
        textAlign: 'center',
        background: '#e6f7ff',
        border: '1px solid #91d5ff',
        borderRadius: '8px',
        padding: '12px 16px'
      }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#1890ff', 
          margin: 0,
          fontWeight: '500'
        }}>
          ⚠️ 功能设计阶段，如有描述错误，敬请指正
        </p>
      </div>

      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#262626', marginBottom: '8px' }}>
          专属定制服务
        </h1>
        <p style={{ fontSize: '16px', color: '#8c8c8c' }}>
          为您提供个性化的报表定制服务
        </p>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {productCards.map((product) => (
          <Col xs={24} sm={12} lg={8} key={product.key}>
            <Card
              hoverable
              style={{ 
                height: '100%',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ padding: '32px 24px' }}
              cover={
                <div style={{ 
                  padding: '40px 24px 20px', 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)'
                }}>
                  {product.icon}
                </div>
              }
            >
              <Meta
                title={
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                      {product.title}
                    </h3>
                  </div>
                }
                description={
                  <div>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#666', 
                      textAlign: 'center',
                      marginBottom: '20px',
                      lineHeight: '1.6'
                    }}>
                      {product.description}
                    </p>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#262626' }}>
                        核心功能：
                      </h4>
                      <ul style={{ 
                        paddingLeft: '16px', 
                        margin: 0,
                        fontSize: '13px',
                        color: '#666'
                      }}>
                        {product.features.map((feature, index) => (
                          <li key={index} style={{ marginBottom: '4px' }}>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 定制服务说明 */}
      <Card 
        style={{ 
          marginTop: '32px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          border: 'none'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          <CustomerServiceOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <h2 style={{ color: 'white', marginBottom: '16px' }}>专业定制服务</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px', opacity: 0.9 }}>
            我们提供专业的报表定制服务，根据您的需求量身打造个性化报表。
            无论是数据分析、可视化展示，我们都能为您提供最适合的报表方案。
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: 'white', marginBottom: '8px' }}>📊 数据分析</h4>
              <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>深度数据挖掘与分析</p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '8px' }}>📈 可视化报表</h4>
              <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>个性化图表与仪表板</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 弹窗提示 */}
      <Modal
        title={
          <div style={{ textAlign: 'center' }}>
            <CustomerServiceOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '8px' }} />
            定制服务说明
          </div>
        }
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={500}
        footer={[
          <Button key="ok" type="primary" onClick={() => setModalVisible(false)}>
            我知道了
          </Button>
        ]}
      >
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
            如果您对报表有定制需要，可联系客户经理提出定制要求。
          </p>
          <div style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
            padding: '16px',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#52c41a' }}>
              💡 我们的专业团队将根据您的具体需求，为您量身定制最适合的数据分析和报表方案。
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomService;