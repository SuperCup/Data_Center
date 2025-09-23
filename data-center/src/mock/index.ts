import Mock from 'mockjs';

// 模拟数据源管理数据
Mock.mock('/api/datasources', 'get', {
  'data|4-8': [{
    'id|+1': 1,
    'name|1': ['微信支付', '支付宝', '抖音', '美团', '京东', '淘宝', '拼多多', '快手'],
    'status|1': ['normal', 'error', 'pending'],
    'lastUpdate': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'description': '@csentence(20, 50)'
  }]
});

// 模拟首页看板数据
Mock.mock('/api/dashboard', 'get', {
  'activityCount|5-20': 10,
  'userCoverage|800000-2000000': 1000000,
  'couponIssued|500000-1500000': 800000,
  'couponUsed|200000-500000': 300000,
  'budgetUsed|30-95': 75,
  'channelData': [
    { 'name': '微信', 'value|20-50': 35 },
    { 'name': '支付宝', 'value|10-40': 25 },
    { 'name': '抖音', 'value|10-30': 20 },
    { 'name': '美团', 'value|5-20': 10 }
  ]
});

// 模拟活动分析数据
Mock.mock('/api/activities', 'get', {
  'data|3-6': [{
    'id|+1': 1,
    'name': '@ctitle(5, 10)活动',
    'couponIssued|50000-200000': 100000,
    'couponClaimed|30000-150000': 80000,
    'couponUsed|10000-100000': 50000,
    'roi|2-5.1': 3.5,
    'budget|300000-1500000': 800000,
    'budgetUsed|200000-1000000': 600000
  }]
});

// 模拟机制效果数据
Mock.mock('/api/mechanisms', 'get', {
  'data': [
    {
      'id': 1,
      'name': '满减券',
      'conversion|25-45.1': 35.8,
      'roi|3-5.1': 4.2,
      'userSatisfaction|80-98': 92,
      'color': '#1890ff'
    },
    {
      'id': 2,
      'name': '折扣券',
      'conversion|20-40.1': 28.5,
      'roi|2.5-4.5.1': 3.5,
      'userSatisfaction|75-95': 88,
      'color': '#52c41a'
    },
    {
      'id': 3,
      'name': '团购',
      'conversion|30-50.1': 42.3,
      'roi|4-6.1': 5.1,
      'userSatisfaction|85-99': 95,
      'color': '#fa8c16'
    },
    {
      'id': 4,
      'name': '直播带货',
      'conversion|30-45.1': 38.7,
      'roi|3.5-5.5.1': 4.8,
      'userSatisfaction|80-98': 90,
      'color': '#722ed1'
    }
  ]
});

// 模拟渠道分析数据
Mock.mock('/api/channels', 'get', {
  'data|4-6': [{
    'id|+1': 1,
    'name|1': ['微信', '支付宝', '抖音', '美团', '京东', '淘宝'],
    'exposure|500000-2500000': 1000000,
    'click|100000-800000': 300000,
    'conversion|50000-300000': 100000,
    'ctr|15-40': 25,
    'cvr|20-50': 35,
    'cost|100000-500000': 200000,
    'roi|2.5-5.5.1': 4.0
  }]
});

export default Mock;