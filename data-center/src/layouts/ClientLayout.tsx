import React from 'react';
import { Layout, Menu, Dropdown, Space, Avatar, theme } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, DownOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShopOutlined, 
  BarChartOutlined, 
  ShoppingCartOutlined, 
  QrcodeOutlined, 
  CrownOutlined,
  ThunderboltOutlined,
  TagsOutlined,
  GiftOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  TagOutlined,
  DatabaseOutlined,
  MonitorOutlined
} from '@ant-design/icons';
import logo from '../assets/system_logo.png';

const { Header, Content, Sider } = Layout;

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 根据当前路径确定选中的菜单项
  const selectedKey = location.pathname.split('/').pop() || 'all-activities';
  
  // 用户菜单项
  const userMenuItems = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: '账号管理',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // 处理退出登录逻辑
      console.log('退出登录');
    } else if (key === 'account') {
      // 处理账号管理逻辑
      console.log('账号管理');
    }
  };
  
  // 主菜单项配置 - 将一级菜单改为分区标题
  const mainMenuItems = [
    {
      key: 'store-marketing-group',
      label: '到店营销',
      type: 'group' as const,
    },
    {
      key: 'all-activities',
      label: '全量活动',
      icon: <UnorderedListOutlined />,
    },
    {
      key: 'sales-analysis',
      label: '销售分析',
      icon: <BarChartOutlined />,
    },
    {
      key: 'user-analysis',
      label: '用户分析',
      icon: <BarChartOutlined />,
    },
    {
      key: 'instant-retail-group',
      label: '即时零售',
      type: 'group' as const,
    },
    {
      key: 'price-monitoring',
      label: '破价监测',
      icon: <MonitorOutlined />,
    },
    {
      key: 'qr-marketing-group',
      label: '物码营销',
      type: 'group' as const,
    },
    {
      key: 'qr-marketing',
      label: '物码营销',
      icon: <QrcodeOutlined />,
    },
    {
      key: 'custom-service-group',
      label: '专属定制',
      type: 'group' as const,
    },
    {
      key: 'custom-service',
      label: '专属定制',
      icon: <SettingOutlined />,
    },
    {
      key: 'data-asset-group',
      label: '数据资产',
      type: 'group' as const,
    },
    {
      key: 'product-list',
      label: '商品清单',
      icon: <DatabaseOutlined />,
    },
  ];

  // 处理主菜单点击
  const handleMainMenuClick = ({ key }: { key: string }) => {
    // 如果是分组标题，不进行导航
    if (key.endsWith('-group')) {
      return;
    }
    
    // 直接导航到对应页面
    navigate(`/client/${key}`);
  };

  // 获取当前选中的菜单项
  const currentSelectedKey = location.pathname.split('/')[2] || 'all-activities';
  
  // 根据当前路径确定选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname.split('/')[2] || 'all-activities';
    return [path];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧菜单栏 */}
      <Sider 
        width={240} 
        style={{ 
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100
        }}
      >
        {/* Logo区域 */}
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 16px'
        }}>
          <img src={logo} alt="系统logo" style={{ height: 32, maxWidth: '100%' }} />
        </div>
        
        {/* 左侧菜单 */}
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          style={{ 
            border: 'none',
            height: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}
          items={mainMenuItems}
          onClick={handleMainMenuClick}
        />
      </Sider>

      <Layout style={{ marginLeft: 240 }}>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer, 
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          position: 'fixed',
          top: 0,
          right: 0,
          left: 240,
          zIndex: 99,
          height: 64
        }}>
          {/* 用户信息区域 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: '#1890ff',
              borderRight: '1px solid #d9d9d9',
              paddingRight: '16px'
            }}>
              康师傅
            </span>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>luffy</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: colorBgContainer, 
          borderRadius: borderRadiusLG, 
          minHeight: 'calc(100vh - 112px)',
          marginTop: 88
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientLayout;