import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  BarChartOutlined,
  GiftOutlined,
  TagOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import logo from '../assets/logo.svg';

const { Header, Content, Sider } = Layout;

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '到店营销',
      children: [
        {
          key: 'sales-analysis',
          icon: <BarChartOutlined />,
          label: '销售分析',
        },
        {
          key: 'all-activities',
          icon: <UnorderedListOutlined />,
          label: '全量活动',
        },
        {
          key: 'activity-analysis',
          icon: <GiftOutlined />,
          label: '活动分析',
        },
        {
          key: 'coupon-analysis',
          icon: <TagOutlined />,
          label: '优惠券分析',
        },
        {
          key: 'user-analysis',
          icon: <BarChartOutlined />,
          label: '用户分析',
        },
      ],
    },
    {
      key: 'instant-retail',
      icon: <ShopOutlined />,
      label: '即时零售',
    },
    {
      key: 'custom-service',
      icon: <SettingOutlined />,
      label: '专属定制',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(`/client/${key}`);
  };

  // 获取当前选中的菜单项
  const selectedKey = location.pathname.split('/')[2] || 'sales-analysis';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} width={200} style={{ background: colorBgContainer }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', paddingLeft: 24, paddingRight: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: 24, height: 24, marginRight: 8 }} />
            <h2 style={{ margin: 0, color: '#1890ff', fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              交付中台-品牌端
            </h2>
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientLayout;