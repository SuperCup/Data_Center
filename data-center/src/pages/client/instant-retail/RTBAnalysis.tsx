import React from 'react';
import { Card, Result } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const RTBAnalysis: React.FC = () => {
  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      <Card>
        <Result
          icon={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
          title="需求调研中"
          subTitle="RTB分析功能正在需求调研中，我们将尽快为您提供完整的功能体验。"
        />
      </Card>
    </div>
  );
};

export default RTBAnalysis;
