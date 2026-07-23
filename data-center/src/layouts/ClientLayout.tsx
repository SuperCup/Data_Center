import React, { useMemo } from 'react';
import { Layout, Menu, Dropdown, Space, Avatar, theme, Segmented } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  DatabaseOutlined,
  CalendarOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/system_logo.png';

const { Header, Content, Sider } = Layout;

const LAST_DASH_KEY = 'dsm_last_dashboard_path';

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const isAiMode = location.pathname.startsWith('/client/ai');

  const userMenuItems = [
    { key: 'account', icon: <UserOutlined />, label: '账号管理' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      navigate('/login');
    }
  };

  const dashboardMenuItems = [
    { key: 'store-marketing-group', label: '到店营销', type: 'group' as const },
    { key: 'all-activities', label: '活动管理', icon: <UnorderedListOutlined /> },
    { key: 'sales-analysis', label: '销售分析', icon: <BarChartOutlined /> },
    { key: 'user-analysis', label: '行为分析', icon: <BarChartOutlined /> },
    { key: 'custom-service-store', label: '专属定制', icon: <SettingOutlined /> },
    { key: 'instant-retail-group', label: '即时零售', type: 'group' as const },
    { key: 'marketing-calendar-v1', label: '活动日历', icon: <CalendarOutlined /> },
    { key: 'activity-progress-general', label: '活动进度（通用）', icon: <ProjectOutlined /> },
    { key: 'activity-progress-flash', label: '活动进度（定制）', icon: <ProjectOutlined /> },
    { key: 'rtb-analysis', label: 'RTB分析', icon: <BarChartOutlined /> },
    { key: 'official-flag-analysis', label: '官旗分析', icon: <BarChartOutlined /> },
    { key: 'supply-analysis', label: '供给分析', icon: <BarChartOutlined /> },
    { key: 'custom-service-instant', label: '专属定制', icon: <SettingOutlined /> },
    { key: 'qr-marketing-group', label: '物码营销', type: 'group' as const },
    { key: 'qr-all-activities', label: '全量活动', icon: <UnorderedListOutlined /> },
    { key: 'qr-user-analysis', label: '用户分析', icon: <BarChartOutlined /> },
    { key: 'custom-service-qr', label: '专属定制', icon: <SettingOutlined /> },
    { key: 'file-delivery-group', label: '文件交付', type: 'group' as const },
    { key: 'file-delivery', label: '文件交付', icon: <DatabaseOutlined /> },
    { key: 'data-asset-group', label: '数据资产', type: 'group' as const },
    { key: 'product-list', label: '商品清单', icon: <DatabaseOutlined /> },
  ];

  const getSelectedKeys = () => {
    return [location.pathname.split('/')[2] || 'all-activities'];
  };

  const handleMainMenuClick = ({ key }: { key: string }) => {
    if (key.endsWith('-group')) return;
    navigate(`/client/${key}`);
  };

  const switchMode = (mode: string | number) => {
    if (mode === 'ai') {
      if (!isAiMode) {
        sessionStorage.setItem(LAST_DASH_KEY, location.pathname);
      }
      navigate('/client/ai');
      return;
    }
    const last = sessionStorage.getItem(LAST_DASH_KEY) || '/client/all-activities';
    navigate(last.startsWith('/client') ? last : '/client/all-activities');
  };

  const contentStyle = useMemo(() => {
    if (isAiMode) {
      return {
        margin: 0,
        padding: 0,
        background: '#f7f8fa',
        minHeight: 'calc(100vh - 64px)',
        marginTop: 64,
        overflow: 'hidden' as const,
        borderRadius: 0,
      };
    }
    return {
      margin: '24px 16px',
      padding: 24,
      background: colorBgContainer,
      borderRadius: borderRadiusLG,
      minHeight: 'calc(100vh - 112px)',
      marginTop: 88,
    };
  }, [isAiMode, colorBgContainer, borderRadiusLG]);

  const siderWidth = isAiMode ? 0 : 240;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isAiMode && (
        <Sider
          width={240}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid #f0f0f0',
              padding: '0 16px',
            }}
          >
            <img src={logo} alt="系统logo" style={{ height: 32, maxWidth: '100%' }} />
          </div>
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            style={{ border: 'none', height: 'calc(100vh - 64px)', overflow: 'auto' }}
            items={dashboardMenuItems}
            onClick={handleMainMenuClick}
          />
        </Sider>
      )}

      <Layout style={{ marginLeft: siderWidth }}>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            position: 'fixed',
            top: 0,
            right: 0,
            left: siderWidth,
            zIndex: 99,
            height: 64,
          }}
        >
          <Space size={16}>
            <Segmented
              value={isAiMode ? 'ai' : 'dashboard'}
              onChange={switchMode}
              options={[
                { label: '数据看板', value: 'dashboard' },
                { label: 'AI 工作台', value: 'ai' },
              ]}
            />
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1890ff',
                borderRight: '1px solid #d9d9d9',
                paddingRight: 16,
              }}
            >
              舒洁
            </span>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
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

        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientLayout;
