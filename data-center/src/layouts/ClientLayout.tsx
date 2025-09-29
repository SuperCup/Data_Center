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
  TagOutlined
} from '@ant-design/icons';
import logo from '../assets/system_logo.png';

const { Header, Content } = Layout;

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
  
  // 主菜单项配置
  const mainMenuItems = [
    {
      key: 'dashboard',
      label: '到店营销',
      icon: <DashboardOutlined />,
      children: [
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
          key: 'activity-analysis',
          label: '活动分析',
          icon: <GiftOutlined />,
        },
        {
          key: 'coupon-analysis',
          label: '批次分析',
          icon: <TagOutlined />,
        },
        {
          key: 'user-analysis',
          label: '用户分析',
          icon: <BarChartOutlined />,
        },
      ],
    },
    {
      key: 'instant-retail',
      label: '即时零售',
      icon: <ShopOutlined />,
    },
    {
      key: 'qr-marketing',
      label: '物码营销',
      icon: <QrcodeOutlined />,
    },
    {
      key: 'custom-service',
      label: '专属定制',
      icon: <SettingOutlined />,
    },
  ];

  // 处理主菜单点击
  const handleMainMenuClick = ({ key }: { key: string }) => {
    navigate(`/client/${key}`);
  };

  // 获取当前选中的菜单项
  const currentSelectedKey = location.pathname.split('/')[2] || 'all-activities';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 24px', 
        background: colorBgContainer, 
        position: 'fixed', 
        top: 0, 
        left: 0,
        right: 0, 
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        {/* Logo区域 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="系统logo" style={{ height: 40, marginRight: 24 }} />
          
          {/* 主导航菜单 */}
          <Menu
            mode="horizontal"
            selectedKeys={[currentSelectedKey]}
            style={{ 
              border: 'none',
              backgroundColor: 'transparent',
              flex: 1,
              minWidth: 600
            }}
            items={mainMenuItems.map(item => ({
              key: item.key,
              label: item.children ? (
                <Dropdown
                  menu={{
                    items: item.children.map(child => ({
                      key: child.key,
                      label: child.label,
                      icon: child.icon,
                      onClick: () => navigate(`/client/${child.key}`)
                    }))
                  }}
                  placement="bottomLeft"
                >
                  <Space>
                    {item.icon}
                    {item.label}
                    <DownOutlined />
                  </Space>
                </Dropdown>
              ) : (
                <Space onClick={() => navigate(`/client/${item.key}`)}>
                  {item.icon}
                  {item.label}
                </Space>
              )
            }))}
          />
        </div>

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
        margin: '88px 16px 24px 16px', 
        padding: 24, 
        background: colorBgContainer, 
        borderRadius: borderRadiusLG, 
        minHeight: 'calc(100vh - 112px)' 
      }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default ClientLayout;