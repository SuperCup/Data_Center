import React from 'react';
import { Card, Row, Col, Statistic, Progress, Divider } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const MechanismEffect: React.FC = () => {
  // 模拟数据
  const mechanisms = [
    {
      id: 1,
      name: '满减券',
      conversion: 35.8,
      roi: 4.2,
      userSatisfaction: 92,
      color: '#1890ff',
    },
    {
      id: 2,
      name: '折扣券',
      conversion: 28.5,
      roi: 3.5,
      userSatisfaction: 88,
      color: '#40a9ff',
    },
    {
      id: 3,
      name: '团购',
      conversion: 42.3,
      roi: 5.1,
      userSatisfaction: 95,
      color: '#096dd9',
    },
    {
      id: 4,
      name: '直播带货',
      conversion: 38.7,
      roi: 4.8,
      userSatisfaction: 90,
      color: '#69c0ff',
    },
  ];

  return (
    <div>
      <h2>机制效果</h2>
      <Divider />
      
      {/* 机制效果对比 */}
      <Row gutter={16}>
        {mechanisms.map(mechanism => (
          <Col span={6} key={mechanism.id}>
            <Card 
              title={mechanism.name} 
              bordered={true}
              headStyle={{ background: mechanism.color, color: '#fff' }}
            >
              <Statistic
                title="转化率"
                value={mechanism.conversion}
                precision={1}
                valueStyle={{ color: mechanism.color }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
              <Divider style={{ margin: '12px 0' }} />
              
              <Statistic
                title="ROI"
                value={mechanism.roi}
                precision={1}
                valueStyle={{ color: mechanism.color }}
              />
              <Divider style={{ margin: '12px 0' }} />
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>用户满意度</span>
                  <span style={{ color: mechanism.color }}>{mechanism.userSatisfaction}%</span>
                </div>
                <Progress 
                  percent={mechanism.userSatisfaction} 
                  showInfo={false}
                  strokeColor={mechanism.color}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Divider />
      
      {/* 用户行为路径分析 */}
      <Card title="用户行为路径分析" style={{ marginTop: 20 }}>
        <Row gutter={16}>
          <Col span={24}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 800, margin: '0 auto' }}>
                <div style={{ width: 120, textAlign: 'center' }}>
                  <div style={{ background: '#1890ff', color: '#fff', padding: '10px', borderRadius: '4px' }}>
                    曝光
                  </div>
                  <div style={{ marginTop: 8 }}>100%</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 10px' }}>
                  <div style={{ height: 2, background: '#1890ff', width: '100%' }}></div>
                  <div style={{ position: 'absolute', width: '100%', textAlign: 'center', color: '#1890ff' }}>
                    75%
                  </div>
                </div>
                
                <div style={{ width: 120, textAlign: 'center' }}>
                  <div style={{ background: '#40a9ff', color: '#fff', padding: '10px', borderRadius: '4px' }}>
          点击
        </div>
                  <div style={{ marginTop: 8 }}>75%</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 10px' }}>
                  <div style={{ height: 2, background: '#52c41a', width: '100%' }}></div>
                  <div style={{ position: 'absolute', width: '100%', textAlign: 'center', color: '#52c41a' }}>
                    60%
                  </div>
                </div>
                
                <div style={{ width: 120, textAlign: 'center' }}>
                  <div style={{ background: '#fa8c16', color: '#fff', padding: '10px', borderRadius: '4px' }}>
                    领券
                  </div>
                  <div style={{ marginTop: 8 }}>45%</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 10px' }}>
                  <div style={{ height: 2, background: '#fa8c16', width: '100%' }}></div>
                  <div style={{ position: 'absolute', width: '100%', textAlign: 'center', color: '#fa8c16' }}>
                    40%
                  </div>
                </div>
                
                <div style={{ width: 120, textAlign: 'center' }}>
                  <div style={{ background: '#722ed1', color: '#fff', padding: '10px', borderRadius: '4px' }}>
                    使用
                  </div>
                  <div style={{ marginTop: 8 }}>18%</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MechanismEffect;