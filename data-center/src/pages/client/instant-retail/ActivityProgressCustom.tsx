import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

const ActivityProgressCustom: React.FC = () => {
  return (
    <div style={{ padding: 0, minHeight: '100vh' }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>活动进度（定制）</Title>
      </div>
      <Card>
        <Paragraph style={{ fontSize: 14, marginBottom: 0, color: '#595959' }}>
          <Text>
            部分客户（如康师傅）数据权限管理严格，且内容定制化程度较高，需要定制看板（数据组使用 QBI 创建后挂载）。
          </Text>
        </Paragraph>
      </Card>
    </div>
  );
};

export default ActivityProgressCustom;

