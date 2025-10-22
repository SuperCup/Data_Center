import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import './App.css';

// 客户端页面
// 到店营销
import Dashboard from './pages/client/store-marketing/Dashboard';
import AllActivities from './pages/client/store-marketing/AllActivities';
import ActivityAnalysis from './pages/client/store-marketing/ActivityAnalysis';
import UserAnalysis from './pages/client/store-marketing/UserAnalysis';
import CouponDetail from './pages/client/store-marketing/CouponDetail';
import MechanismEffect from './pages/client/store-marketing/MechanismEffect';
import ChannelAnalysis from './pages/client/store-marketing/ChannelAnalysis';
import RequestCenter from './pages/client/store-marketing/RequestCenter';
// 即时零售
import InstantRetail from './pages/client/instant-retail/InstantRetail';
// 物码营销
import QrMarketing from './pages/client/qr-marketing/QrMarketing';
// 专属定制
import CustomService from './pages/client/custom-service/CustomService';
// 数据资产
import ProductList from './pages/client/data-asset/ProductList';

function App() {
  return (
    <Router>
      <Routes>
        {/* 客户端路由 */}
        <Route path="/client" element={<ClientLayout />}>
          <Route path="sales-analysis" element={<Dashboard />} />
          <Route path="all-activities" element={<AllActivities />} />
          <Route path="activity-analysis" element={<ActivityAnalysis />} />
          <Route path="activity-analysis/:activityId" element={<ActivityAnalysis />} />
          <Route path="user-analysis" element={<UserAnalysis />} />
          <Route path="coupon-detail/:couponId" element={<CouponDetail />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="instant-retail" element={<InstantRetail />} />
          <Route path="qr-marketing" element={<QrMarketing />} />
          <Route path="custom-service" element={<CustomService />} />
          <Route index element={<AllActivities />} />
        </Route>
        {/* 根路径重定向 */}
        <Route path="/" element={<Navigate to="/client" />} />
      </Routes>
    </Router>
  );
}

export default App;
