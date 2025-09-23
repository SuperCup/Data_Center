import axios from 'axios';

// 导入模拟数据
import '../mock';

// 创建axios实例
const api = axios.create({
  baseURL: '/',
  timeout: 5000
});

// 获取数据源列表
export const getDataSources = () => {
  return api.get('/api/datasources');
};

// 获取首页看板数据
export const getDashboardData = () => {
  return api.get('/api/dashboard');
};

// 获取活动列表
export const getActivities = () => {
  return api.get('/api/activities');
};

// 获取机制效果数据
export const getMechanisms = () => {
  return api.get('/api/mechanisms');
};

// 获取渠道分析数据
export const getChannels = () => {
  return api.get('/api/channels');
};

export default api;