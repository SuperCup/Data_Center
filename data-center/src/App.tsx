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
import AllActivities from './pages/client/AllActivities';
import ActivityAnalysis from './pages/client/ActivityAnalysis';
import CouponAnalysis from './pages/client/CouponAnalysis';
import UserAnalysis from './pages/client/UserAnalysis';
import CouponDetail from './pages/client/CouponDetail';
import MechanismEffect from './pages/client/MechanismEffect';
import ChannelAnalysis from './pages/client/ChannelAnalysis';
import RequestCenter from './pages/client/RequestCenter';
import InstantRetail from './pages/client/InstantRetail';
import QrMarketing from './pages/client/QrMarketing';
import CustomService from './pages/client/CustomService';

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
          <Route path="sales-analysis" element={<Dashboard />} />
          <Route path="all-activities" element={<AllActivities />} />
          <Route path="activity-analysis" element={<ActivityAnalysis />} />
          <Route path="coupon-analysis" element={<CouponAnalysis />} />
          <Route path="user-analysis" element={<UserAnalysis />} />
          <Route path="coupon-detail/:couponId" element={<CouponDetail />} />
          <Route path="instant-retail" element={<InstantRetail />} />
          <Route path="qr-marketing" element={<QrMarketing />} />
          <Route path="custom-service" element={<CustomService />} />
          <Route index element={<AllActivities />} />
        </Route>

        {/* 根路径重定向 */}
        <Route path="/" element={
          <Navigate to={isBusinessUser ? "/business" : "/client"} replace />
        } />
        
        {/* 根据用户类型重定向 */}
        <Route path="*" element={
          <Navigate to={isBusinessUser ? "/business" : "/client"} replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
