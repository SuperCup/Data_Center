import React from 'react';
import { Card, Result } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const QrMarketing: React.FC = () => {
  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card>
        <Result
          icon={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
          title="系统开发中，敬请期待"
          subTitle="物码营销功能正在紧张开发中，我们将尽快为您提供完整的功能体验。"
        />
      </Card>
    </div>
  );
};

export default QrMarketing;