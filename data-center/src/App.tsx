import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import './App.css';

// 客户端页面
// 到店营销
import Dashboard from './pages/client/store-marketing/Dashboard';
import AllActivities from './pages/client/store-marketing/AllActivities';
import ActivityAnalysis from './pages/client/store-marketing/ActivityAnalysis';
import SmallStoreActivityAnalysis from './pages/client/store-marketing/SmallStoreActivityAnalysis';
import SmalStoreDashboard from './pages/client/store-marketing/SmalStoreDashboard';
import UserAnalysis from './pages/client/store-marketing/UserAnalysis';
import CouponDetail from './pages/client/store-marketing/CouponDetail';
import MechanismEffect from './pages/client/store-marketing/MechanismEffect';
import ChannelAnalysis from './pages/client/store-marketing/ChannelAnalysis';
import RequestCenter from './pages/client/store-marketing/RequestCenter';
// 即时零售
import InstantRetail from './pages/client/instant-retail/InstantRetail';
import PriceMonitoring from './pages/client/instant-retail/PriceMonitoring';
import PriceMonitoringDashboard from './pages/client/instant-retail/PriceMonitoringDashboard';
import MarketingCalendar from './pages/client/instant-retail/MarketingCalendar';
import MarketingCalendarV2 from './pages/client/instant-retail/MarketingCalendarV2';
import ActivityProgress from './pages/client/instant-retail/ActivityProgress';
import ActivityProgressCustom from './pages/client/instant-retail/ActivityProgressCustom';
import ActivityAnalysisInstant from './pages/client/instant-retail/ActivityAnalysis';
import AllAnalysis from './pages/client/instant-retail/AllAnalysis';
import RTBAnalysis from './pages/client/instant-retail/RTBAnalysis';
import OfficialFlagAnalysis from './pages/client/instant-retail/OfficialFlagAnalysis';
import SupplyAnalysis from './pages/client/instant-retail/SupplyAnalysis';
// 物码营销
import QrMarketing from './pages/client/qr-marketing/QrMarketing';
import QrAllActivities from './pages/client/qr-marketing/AllActivities';
import QrUserAnalysis from './pages/client/qr-marketing/UserAnalysis';
import QrRealtime from './pages/client/qr-marketing/Realtime';
import QrActivityAnalysis from './pages/client/qr-marketing/QrActivityAnalysis';
// 专属定制
import CustomService from './pages/client/custom-service/CustomService';
// 文件交付
import FileDelivery from './pages/client/file-delivery/FileDelivery';
// 数据资产
import ProductList from './pages/client/data-asset/ProductList';
// 登录页面
import Login from './pages/auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录路由 */}
        <Route path="/login" element={<Login />} />
        {/* 客户端路由 */}
        <Route path="/client" element={<ClientLayout />}>
          <Route path="sales-analysis" element={<Dashboard />} />
          <Route path="all-activities" element={<AllActivities />} />
          <Route path="activity-analysis" element={<ActivityAnalysis />} />
          <Route path="activity-analysis/:activityId" element={<ActivityAnalysis />} />
          <Route path="small-store-activity-analysis" element={<SmallStoreActivityAnalysis />} />
          <Route path="store-marketing/small-store-dashboard" element={<SmalStoreDashboard />} />
          <Route path="user-analysis" element={<UserAnalysis />} />
          <Route path="custom-service-store" element={<CustomService />} />
          <Route path="coupon-detail/:couponId" element={<CouponDetail />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="instant-retail" element={<InstantRetail />} />
          <Route path="price-monitoring" element={<PriceMonitoring />} />
          <Route path="price-monitoring-dashboard" element={<PriceMonitoringDashboard />} />
          <Route path="price-monitoring-dashboard/:taskId" element={<PriceMonitoringDashboard />} />
          <Route path="marketing-calendar" element={<MarketingCalendarV2 />} />
          <Route path="marketing-calendar-v1" element={<MarketingCalendar />} />
          <Route path="activity-progress" element={<ActivityProgress />} />
          <Route path="activity-progress-general" element={<ActivityProgress />} />
          <Route path="activity-progress-flash" element={<ActivityProgressCustom />} />
          <Route path="activity-analysis-instant" element={<ActivityAnalysisInstant />} />
          <Route path="all-analysis" element={<AllAnalysis />} />
          <Route path="rtb-analysis" element={<RTBAnalysis />} />
          <Route path="official-flag-analysis" element={<OfficialFlagAnalysis />} />
          <Route path="supply-analysis" element={<SupplyAnalysis />} />
          <Route path="custom-service-instant" element={<CustomService />} />
          <Route path="qr-marketing" element={<QrMarketing />} />
          <Route path="qr-all-activities" element={<QrAllActivities />} />
          <Route path="qr-user-analysis" element={<QrUserAnalysis />} />
          <Route path="qr-realtime/:activityId" element={<QrRealtime />} />
          <Route path="qr-activity-analysis/:activityId" element={<QrActivityAnalysis />} />
          <Route path="custom-service-qr" element={<CustomService />} />
          <Route path="custom-service" element={<CustomService />} />
          <Route path="file-delivery" element={<FileDelivery />} />
          <Route index element={<AllActivities />} />
        </Route>
        {/* 根路径重定向 */}
        <Route path="/" element={<Navigate to="/client" />} />
      </Routes>
    </Router>
  );
}

export default App;
