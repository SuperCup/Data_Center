import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DatabaseOutlined,
  BarChartOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const BusinessLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      key: 'datasource',
      icon: <DatabaseOutlined />,
      label: '数据源管理',
    },
    {
      key: 'report-template',
      icon: <BarChartOutlined />,
      label: '报表模板配置',
    },
    {
      key: 'customer-management',
      icon: <UserOutlined />,
      label: '客户账号与权限分配',
    },
    {
      key: 'request-management',
      icon: <FileTextOutlined />,
      label: '客户定制需求管理',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(`/business/${key}`);
  };

  // 获取当前选中的菜单项
  const selectedKey = location.pathname.split('/')[2] || 'datasource';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        <div style={{ float: 'left', width: 200, height: 31, margin: '16px 24px 16px 0', background: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, color: '#fff' }}>交付中台——品牌端-业务端</h2>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BusinessLayout;