import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BusinessLayout from './layouts/BusinessLayout';
import ClientLayout from './layouts/ClientLayout';
import './App.css';

// 业务端页面
import DataSourceManagement from './pages/business/DataSourceManagement';
import ReportTemplateConfig from './pages/business/ReportTemplateConfig';
import CustomerAccountManagement from './pages/business/CustomerAccountManagement';
import CustomRequestManagement from './pages/business/CustomRequestManagement';

// 客户端页面
import Dashboard from './pages/client/Dashboard';
import ActivityAnalysis from './pages/client/ActivityAnalysis';
import MechanismEffect from './pages/client/MechanismEffect';
import ChannelAnalysis from './pages/client/ChannelAnalysis';
import RequestCenter from './pages/client/RequestCenter';

// 模拟登录状态
const isBusinessUser = false; // 设置为false以查看客户端

function App() {
  return (
    <Router>
      <Routes>
        {/* 业务端路由 */}
        <Route path="/business" element={<BusinessLayout />}>
          <Route path="datasource" element={<DataSourceManagement />} />
          <Route path="report-template" element={<ReportTemplateConfig />} />
          <Route path="customer-management" element={<CustomerAccountManagement />} />
          <Route path="request-management" element={<CustomRequestManagement />} />
          <Route index element={<DataSourceManagement />} />
        </Route>

        {/* 客户端路由 */}
        <Route path="/client" element={<ClientLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="activity" element={<ActivityAnalysis />} />
          <Route path="mechanism" element={<MechanismEffect />} />
          <Route path="channel" element={<ChannelAnalysis />} />
          <Route path="request" element={<RequestCenter />} />
          <Route index element={<Dashboard />} />
        </Route>

        {/* 根据用户类型重定向 */}
        <Route path="*" element={
          <Navigate to={isBusinessUser ? "/business" : "/client"} replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
