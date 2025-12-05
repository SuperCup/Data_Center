// 到店营销统一数据源

// 活动数据接口
export interface ActivityData {
  key: string;
  id?: string;  // 兼容旧代码使用的 id 字段
  activityId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  budget: number;
  consumed: number;
  retailerCount: number;
  skuCount: number;
  usedCount: number;
  batchCount: number;
  discount: number;
  usageRate: number;
  zeroUsageRetailers?: string[];
  salesAmount: number;
  platforms: string[];
  mechanisms?: {
    [key: string]: string[];
  };
  batches?: Array<{
    id: string;
    name: string;
    gmv: number;
    discount: number;
  }>;
  gmv?: number;
}

// 零售商数据接口
export interface RetailerData {
  id: string;
  name: string;
  type: 'KA' | '小店';
  gmv: number;
  discount: number;
  usedCount: number;
  avgPrice: number;
  activeSku: number;
  trend?: {
    sales: number[];
    discount: number[];
  };
  orderCount?: number;
  batchCount?: number;
  roi?: number;
  usageRate?: number;
}

// 商品数据接口
export interface ProductData {
  id: string;
  name: string;
  code: string;
  code69?: string;
  gmv: number;
  discount: number;
  usedCount: number;
  salesCount?: number;
  salesVolume?: number;
  orderCount?: number;
  trend?: {
    sales: number[];
    discount: number[];
  };
}

// 批次/优惠券数据接口
export interface CouponData {
  key: string;
  couponId: string;
  title: string;
  subtitle: string;
  description: string;
  couponType: string;
  couponStatus: string;
  startTime: string;
  endTime: string;
  couponAmount: number;
  issuedCount: number;
  usedCount: number;
  activityName: string;
}

// 用户分析数据接口
export interface UserAnalysisData {
  key: string;
  channel: string;
  region: string;
  activity: string;
  visitUsers: number;
  receiveUsers: number;
  usageUsers: number;
  conversionRate: number;
  usageRate: number;
  mechanisms?: string[];
}

// 渠道数据接口
export interface ChannelData {
  id: number;
  name: string;
  exposure: number;
  click: number;
  conversion: number;
  ctr: number;
  cvr: number;
  cost: number;
  roi: number;
}

// 统一的活动数据
export const unifiedActivities: ActivityData[] = [
  {
    key: '1',
    id: '1',  // 添加 id 字段以兼容旧代码
    activityId: 'ACT001',
    name: '广州小茗同学2元乐享活动',
    startDate: '2025-10-15',
    endDate: '2025-12-15',
    status: '进行中',
    budget: 50000,
    consumed: 32000,
    retailerCount: 125,
    skuCount: 8,
    usedCount: 8500,
    batchCount: 8 * 15,
    discount: 32000,
    usageRate: 78.5,
    zeroUsageRetailers: [],
    salesAmount: 120000,
    platforms: ['微信', '支付宝', '微信小店'],
    gmv: 142500,
    mechanisms: {
      '微信优惠券': ['满5减0.5', '满8减0.8', '满10减1', '满12减1.2'],
      '支付宝优惠券/碰一下': ['满15减1.5', '满18减1.8', '满20减2', '满22减2.2'],
      '微信小店': ['2元乐享', '新品立减2元']
    },
    batches: [
      { id: 'b1', name: '指定品满5元减0.5元', gmv: 22500, discount: 1750 },
      { id: 'b2', name: '指定品满8元减0.8元', gmv: 19000, discount: 1400 },
      { id: 'b3', name: '指定品满10元减1元', gmv: 26000, discount: 2100 },
      { id: 'b4', name: '指定品满12元减1.2元', gmv: 16000, discount: 1250 },
      { id: 'b5', name: '指定品满15元减1.5元', gmv: 24000, discount: 1900 },
      { id: 'b6', name: '指定品满18元减1.8元', gmv: 14500, discount: 1100 },
      { id: 'b7', name: '指定品满20元减2元', gmv: 10500, discount: 800 },
      { id: 'b8', name: '指定品满22元减2.2元', gmv: 10000, discount: 750 }
    ]
  }
];

// 统一的零售商数据
export const unifiedRetailers: RetailerData[] = [
  { id: '1', name: '华润万家', type: 'KA', gmv: 285000, discount: 12000, usedCount: 1250, avgPrice: 22.8, activeSku: 45, trend: { sales: [12, 15, 18, 22, 28], discount: [0.8, 1.0, 1.2, 1.5, 1.8] }, orderCount: 12500, batchCount: 5, roi: 10.0, usageRate: 45.2 },
  { id: '2', name: '永辉超市', type: 'KA', gmv: 268000, discount: 11000, usedCount: 1180, avgPrice: 22.7, activeSku: 42, trend: { sales: [10, 13, 16, 20, 26], discount: [0.7, 0.9, 1.1, 1.4, 1.7] }, orderCount: 11600, batchCount: 4, roi: 10.0, usageRate: 42.8 },
  { id: '3', name: '家乐福', type: 'KA', gmv: 245000, discount: 10000, usedCount: 1080, avgPrice: 22.7, activeSku: 38, trend: { sales: [9, 12, 15, 18, 24], discount: [0.6, 0.8, 1.0, 1.3, 1.6] }, orderCount: 10400, batchCount: 4, roi: 10.0, usageRate: 41.5 },
  { id: '4', name: '沃尔玛', type: 'KA', gmv: 232000, discount: 9500, usedCount: 1020, avgPrice: 22.7, activeSku: 36, trend: { sales: [8, 11, 14, 17, 23], discount: [0.5, 0.7, 0.9, 1.2, 1.5] }, orderCount: 9000, batchCount: 3, roi: 10.0, usageRate: 38.9 },
  { id: '5', name: '大润发', type: 'KA', gmv: 218000, discount: 8500, usedCount: 960, avgPrice: 22.7, activeSku: 34, trend: { sales: [7, 10, 13, 16, 21], discount: [0.4, 0.6, 0.8, 1.1, 1.4] }, orderCount: 7600, batchCount: 3, roi: 10.0, usageRate: 36.2 },
  { id: '6', name: '芙蓉兴盛', type: '小店', gmv: 125000, discount: 4500, usedCount: 580, avgPrice: 21.6, activeSku: 28, trend: { sales: [5, 7, 9, 11, 12], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '7', name: '怡福百货', type: '小店', gmv: 118000, discount: 4200, usedCount: 550, avgPrice: 21.5, activeSku: 26, trend: { sales: [4, 6, 8, 10, 11], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '8', name: '众和食杂', type: '小店', gmv: 112000, discount: 4000, usedCount: 520, avgPrice: 21.5, activeSku: 24, trend: { sales: [3, 5, 7, 9, 11], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '9', name: '浩林便利店', type: '小店', gmv: 108000, discount: 3800, usedCount: 500, avgPrice: 21.6, activeSku: 22, trend: { sales: [3, 4, 6, 8, 10], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '10', name: '一号门士多', type: '小店', gmv: 95000, discount: 3500, usedCount: 450, avgPrice: 21.1, activeSku: 20, trend: { sales: [2, 3, 5, 7, 9], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '11', name: '天虹超市', type: 'KA', gmv: 185000, discount: 7500, usedCount: 820, avgPrice: 22.6, activeSku: 32, trend: { sales: [6, 9, 12, 15, 18], discount: [0.4, 0.6, 0.8, 1.0, 1.2] }, orderCount: 6400, batchCount: 2, roi: 10.0, usageRate: 34.8 },
  { id: '12', name: '物美超市', type: 'KA', gmv: 175000, discount: 7000, usedCount: 780, avgPrice: 22.4, activeSku: 30, trend: { sales: [5, 8, 11, 14, 17], discount: [0.3, 0.5, 0.7, 0.9, 1.1] }, orderCount: 4800, batchCount: 2, roi: 10.0, usageRate: 31.5 },
  { id: '13', name: '文发士多', type: '小店', gmv: 88000, discount: 3200, usedCount: 420, avgPrice: 21.0, activeSku: 18, trend: { sales: [2, 3, 4, 6, 8], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '14', name: '嘉利烟酒店', type: '小店', gmv: 82000, discount: 3000, usedCount: 390, avgPrice: 21.0, activeSku: 16, trend: { sales: [1, 2, 3, 5, 7], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '15', name: '美惠佳', type: '小店', gmv: 78000, discount: 2800, usedCount: 370, avgPrice: 21.1, activeSku: 15, trend: { sales: [1, 2, 3, 4, 6], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '16', name: '好运来超市', type: '小店', gmv: 72000, discount: 2600, usedCount: 340, avgPrice: 21.2, activeSku: 14, trend: { sales: [1, 2, 3, 4, 5], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } }
];

// 统一的商品数据
export const unifiedProducts: ProductData[] = [
  { id: '1', name: '康师傅红烧牛肉面', code: '6923333422', code69: '6901028089296', gmv: 185000, discount: 7500, usedCount: 820, salesCount: 8200, salesVolume: 4800, orderCount: 2400, trend: { sales: [15, 18, 22, 25, 30], discount: [0.6, 0.7, 0.8, 0.9, 1.0] } },
  { id: '2', name: '康师傅香辣牛肉面', code: '6923333423', code69: '6901028089302', gmv: 175000, discount: 7200, usedCount: 780, salesCount: 7800, salesVolume: 4200, orderCount: 2100, trend: { sales: [14, 17, 20, 23, 28], discount: [0.5, 0.6, 0.7, 0.8, 0.9] } },
  { id: '3', name: '康师傅老坛酸菜面', code: '6923333424', code69: '6901028089319', gmv: 165000, discount: 6800, usedCount: 720, salesCount: 7200, salesVolume: 3800, orderCount: 1900, trend: { sales: [13, 16, 19, 22, 26], discount: [0.4, 0.5, 0.6, 0.7, 0.8] } },
  { id: '4', name: '康师傅鲜虾鱼板面', code: '6923333425', code69: '6901028089326', gmv: 155000, discount: 6500, usedCount: 680, salesCount: 6800, salesVolume: 3400, orderCount: 1700, trend: { sales: [12, 15, 18, 21, 24], discount: [0.4, 0.5, 0.6, 0.7, 0.8] } },
  { id: '5', name: '康师傅西红柿鸡蛋面', code: '6923333426', code69: '6901028089333', gmv: 145000, discount: 6200, usedCount: 640, salesCount: 6400, salesVolume: 3000, orderCount: 1500, trend: { sales: [11, 14, 17, 20, 23], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '6', name: '康师傅麻辣牛肉面', code: '6923333427', code69: '6901028089340', gmv: 135000, discount: 5800, usedCount: 600, salesCount: 6000, salesVolume: 2600, orderCount: 1300, trend: { sales: [10, 13, 16, 19, 22], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '7', name: '康师傅香菇炖鸡面', code: '6923333428', code69: '6901028089357', gmv: 125000, discount: 5500, usedCount: 560, salesCount: 5600, salesVolume: 2200, orderCount: 1100, trend: { sales: [9, 12, 15, 18, 20], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '8', name: '康师傅酸辣牛肉面', code: '6923333429', code69: '6901028089364', gmv: 115000, discount: 5200, usedCount: 520, salesCount: 5200, salesVolume: 1800, orderCount: 900, trend: { sales: [8, 11, 14, 17, 19], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '9', name: '康师傅鲜虾面', code: '6923333430', code69: '6901028089371', gmv: 105000, discount: 4800, usedCount: 480, salesCount: 4800, salesVolume: 1500, orderCount: 750, trend: { sales: [7, 10, 13, 16, 18], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '10', name: '康师傅排骨面', code: '6923333431', code69: '6901028089388', gmv: 95000, discount: 4500, usedCount: 440, salesCount: 4400, salesVolume: 1200, orderCount: 600, trend: { sales: [6, 9, 12, 15, 17], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '11', name: '康师傅海鲜面', code: '6923333432', gmv: 85000, discount: 4200, usedCount: 400, salesCount: 4000, salesVolume: 1000, orderCount: 500, trend: { sales: [5, 8, 11, 14, 16], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '12', name: '康师傅蘑菇面', code: '6923333433', gmv: 75000, discount: 3800, usedCount: 360, salesCount: 3600, salesVolume: 800, orderCount: 400, trend: { sales: [4, 7, 10, 13, 15], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } }
];

// 统一的优惠券数据
export const unifiedCoupons: CouponData[] = [
  {
    key: '1',
    couponId: '230916001',
    title: '单价立减2.5',
    subtitle: '满4.5元减2.5元',
    description: '全场满5减1优惠券',
    couponType: '满减',
    couponStatus: '进行中',
    startTime: '2025-09-28',
    endTime: '2025-10-28',
    couponAmount: 100,
    issuedCount: 1000,
    usedCount: 250,
    activityName: '广州小茗同学2元乐享活动',
  },
  {
    key: '2',
    couponId: '230916002',
    title: '全品满33减13',
    subtitle: '满33元减13元',
    description: '指定品满10减2优惠券',
    couponType: '满减',
    couponStatus: '进行中',
    startTime: '2025-09-28',
    endTime: '2025-10-28',
    couponAmount: 200,
    issuedCount: 800,
    usedCount: 180,
    activityName: '广州小茗同学2元乐享活动',
  },
  {
    key: '3',
    couponId: '230916003',
    title: '全品满33减13',
    subtitle: '满33元减13元',
    description: '满15减3优惠券',
    couponType: '满减',
    couponStatus: '待开始',
    startTime: '2025-10-01',
    endTime: '2025-10-31',
    couponAmount: 300,
    issuedCount: 600,
    usedCount: 0,
    activityName: '广州小茗同学2元乐享活动',
  },
  {
    key: '4',
    couponId: '230916004',
    title: '单价立减2.5',
    subtitle: '满4.5元减2.5元',
    description: '满20减2优惠券',
    couponType: '满减',
    couponStatus: '已结束',
    startTime: '2025-08-01',
    endTime: '2025-08-31',
    couponAmount: 200,
    issuedCount: 1200,
    usedCount: 950,
    activityName: '广州小茗同学2元乐享活动',
  },
  {
    key: '5',
    couponId: '230916005',
    title: '全品满33减13',
    subtitle: '满33元减13元',
    description: '满25减2.5优惠券',
    couponType: '满减',
    couponStatus: '进行中',
    startTime: '2025-09-15',
    endTime: '2025-10-15',
    couponAmount: 250,
    issuedCount: 900,
    usedCount: 320,
    activityName: '广州小茗同学2元乐享活动',
  }
];

// 统一的用户分析数据
export const unifiedUserAnalysis: UserAnalysisData[] = [
  {
    key: '1',
    channel: '品牌小程序',
    region: '华东',
    activity: '广州小茗同学2元乐享活动',
    visitUsers: 7708,
    receiveUsers: 7252,
    usageUsers: 7167,
    conversionRate: 94.09,
    usageRate: 92.99,
    mechanisms: ['满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满18减1.8', '满20减2', '满22减2.2', '满25减2.5', '满28减2.8', '满30减3', '满32减3.2', '满35减3.5', '满38减3.8', '满40减4']
  },
  {
    key: '2',
    channel: '品牌小程序',
    region: '华南',
    activity: '广州小茗同学2元乐享活动',
    visitUsers: 6500,
    receiveUsers: 6100,
    usageUsers: 5980,
    conversionRate: 93.85,
    usageRate: 92.03,
    mechanisms: ['满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满18减1.8', '满20减2', '满22减2.2', '满25减2.5', '满28减2.8', '满30减3', '满32减3.2', '满35减3.5', '满38减3.8', '满40减4']
  },
  {
    key: '3',
    channel: '品牌小程序',
    region: '华北',
    activity: '广州小茗同学2元乐享活动',
    visitUsers: 5800,
    receiveUsers: 5400,
    usageUsers: 5250,
    conversionRate: 93.10,
    usageRate: 90.52,
    mechanisms: ['满6减0.6', '满9减0.9', '满12减1.2', '满15减1.5', '满18减1.8', '满21减2.1', '满24减2.4', '满27减2.7', '满30减3', '满33减3.3', '满36减3.6', '满39减3.9', '满42减4.2', '满45减4.5', '满48减4.8', '满50减5']
  },
  {
    key: '4',
    channel: 'H5',
    region: '华东',
    activity: '广州小茗同学2元乐享活动',
    visitUsers: 4200,
    receiveUsers: 3800,
    usageUsers: 3650,
    conversionRate: 90.48,
    usageRate: 86.90,
    mechanisms: ['满4减0.4', '满6减0.6', '满8减0.8', '满10减1', '满12减1.2', '满14减1.4', '满16减1.6', '满18减1.8', '满20减2', '满22减2.2', '满24减2.4', '满26减2.6', '满28减2.8', '满30减3', '满32减3.2', '满35减3.5']
  },
  {
    key: '5',
    channel: 'H5',
    region: '华南',
    activity: '广州小茗同学2元乐享活动',
    visitUsers: 3900,
    receiveUsers: 3500,
    usageUsers: 3300,
    conversionRate: 89.74,
    usageRate: 84.62,
    mechanisms: ['满3减0.3', '满5减0.5', '满8减0.8', '满10减1', '满12减1.2', '满15减1.5', '满18减1.8', '满20减2', '满22减2.2', '满24减2.4', '满26减2.6', '满28减2.8', '满30减3', '满32减3.2', '满35减3.5', '满38减3.8']
  },
  {
    key: '6',
    channel: 'H5',
    region: '华东',
    activity: '广州小茗同学2元乐享活动',
    visitUsers: 2800,
    receiveUsers: 2400,
    usageUsers: 2200,
    conversionRate: 85.71,
    usageRate: 78.57,
    mechanisms: ['满3减0.3', '满5减0.5', '满6减0.6', '满8减0.8', '满9减0.9', '满10减1', '满12减1.2', '满14减1.4', '满15减1.5', '满16减1.6', '满18减1.8', '满20减2', '满21减2.1', '满24减2.4', '满25减2.5', '满27减2.7']
  }
];

// 统一的渠道数据
export const unifiedChannels: ChannelData[] = [
  {
    id: 1,
    name: '微信',
    exposure: 1500000,
    click: 450000,
    conversion: 180000,
    ctr: 30,
    cvr: 40,
    cost: 300000,
    roi: 4.2,
  },
  {
    id: 2,
    name: '支付宝',
    exposure: 1200000,
    click: 300000,
    conversion: 105000,
    ctr: 25,
    cvr: 35,
    cost: 250000,
    roi: 3.5,
  },
  {
    id: 3,
    name: '抖音',
    exposure: 2000000,
    click: 700000,
    conversion: 210000,
    ctr: 35,
    cvr: 30,
    cost: 400000,
    roi: 3.8,
  },
  {
    id: 4,
    name: '美团',
    exposure: 800000,
    click: 200000,
    conversion: 80000,
    ctr: 25,
    cvr: 40,
    cost: 150000,
    roi: 4.5,
  },
];

// Dashboard 核心指标数据
export const dashboardStats = {
  overview: {
    gmv: 4680000,
    gmvYoY: 15.2,
    gmvMoM: 5.8,
    usedCount: 320000,
    usedCountYoY: 12.5,
    usedCountMoM: 4.2,
    batchCount: 12,
    batchCountYoY: 20.0,
    batchCountMoM: 9.1,
    discount: 1870000,
    discountYoY: 18.3,
    discountMoM: 7.5,
    roi: 2.5,
    roiYoY: 8.5,
    roiMoM: 3.2,
    orderCount: 42120,
    orderCountYoY: 14.8,
    orderCountMoM: 6.3,
    usageRate: 37.6,
    usageRateYoY: 2.5,
    usageRateMoM: 1.2
  },
  budget: {
    total: 2800000,
    used: 1870000,
    usageRate: 66.8,
    updateTime: '2025-10-31 23:59:59'
  },
  platformData: [
    { name: '微信', value: 45, gmv: 2106000, discount: 841500, budget: 80, clientBudget: { total: 1000000, used: 800000 }, orders: 21060, usedCount: 144000 },
    { name: '支付宝', value: 25, gmv: 1170000, discount: 467500, budget: 70, clientBudget: { total: 800000, used: 560000 }, orders: 11700, usedCount: 80000 },
    { name: '抖音到店', value: 20, gmv: 936000, discount: 374000, budget: 65, clientBudget: { total: 600000, used: 390000 }, orders: 9360, usedCount: 64000 },
  ],
  distributionChannels: [
    { name: '品牌小程序', wechat: 80000, alipay: 50000, douyin_visitor: 30000, meituan_local: 20000 },
    { name: '支付有礼', wechat: 70000, alipay: 40000, douyin_visitor: 25000, meituan_local: 15000 },
    { name: '零售商小程序', wechat: 60000, alipay: 30000, douyin_visitor: 20000, meituan_local: 10000 },
    { name: '扫码领券', wechat: 50000, alipay: 25000, douyin_visitor: 15000, meituan_local: 10000 },
    { name: '立减与折扣', wechat: 40000, alipay: 20000, douyin_visitor: 10000, meituan_local: 10000 },
  ],
  platformIssuanceData: [
    { name: '微信', issuedCount: 280000, usedCount: 224000, gmv: 3276000, discount: 1310400, usageRate: 80.0 },
    { name: '支付宝', issuedCount: 200000, usedCount: 160000, gmv: 2340000, discount: 936000, usageRate: 80.0 },
    { name: '抖音到店', issuedCount: 15000, usedCount: 12000, gmv: 175500, discount: 70200, usageRate: 80.0 },
  ],
  platformChannelData: {
    '微信': [
      { name: '品牌小程序', issuedCount: 80000, usedCount: 72000, gmv: 1800000, discount: 720000, usageRate: 90.0 },
      { name: '支付有礼', issuedCount: 70000, usedCount: 60000, gmv: 1500000, discount: 600000, usageRate: 85.7 },
      { name: '立减与折扣', issuedCount: '--', usedCount: 12000, gmv: 306000, discount: 121500, usageRate: '--' },
      { name: '零售商小程序', issuedCount: 25000, usedCount: 20000, gmv: 500000, discount: 200000, usageRate: 80.0 },
      { name: '扫码领券', issuedCount: 20000, usedCount: 16000, gmv: 400000, discount: 160000, usageRate: 80.0 },
      { name: '社群', issuedCount: 15000, usedCount: 12000, gmv: 300000, discount: 120000, usageRate: 80.0 },
      { name: '智能促销员', issuedCount: 12000, usedCount: 10000, gmv: 250000, discount: 100000, usageRate: 83.3 },
      { name: '扫码购', issuedCount: 10000, usedCount: 8000, gmv: 200000, discount: 80000, usageRate: 80.0 },
      { name: 'H5', issuedCount: 5000, usedCount: 4000, gmv: 100000, discount: 40000, usageRate: 80.0 },
    ],
    '支付宝': [
      { name: '支付有礼', issuedCount: 50000, usedCount: 40000, gmv: 800000, discount: 320000, usageRate: 80.0 },
      { name: '扫码领券', issuedCount: 30000, usedCount: 25000, gmv: 500000, discount: 200000, usageRate: 83.3 },
      { name: '零售商小程序', issuedCount: 20000, usedCount: 15000, gmv: 370000, discount: 147500, usageRate: 75.0 },
      { name: '品牌小程序', issuedCount: 18000, usedCount: 15000, gmv: 350000, discount: 140000, usageRate: 83.3 },
      { name: '立减与折扣', issuedCount: '--', usedCount: 12000, gmv: 300000, discount: 120000, usageRate: '--' },
      { name: '社群', issuedCount: 12000, usedCount: 10000, gmv: 250000, discount: 100000, usageRate: 83.3 },
      { name: '智能促销员', issuedCount: 10000, usedCount: 8000, gmv: 200000, discount: 80000, usageRate: 80.0 },
      { name: '扫码购', issuedCount: 8000, usedCount: 6000, gmv: 150000, discount: 60000, usageRate: 75.0 },
      { name: '碰一下', issuedCount: 6000, usedCount: 5000, gmv: 120000, discount: 48000, usageRate: 83.3 },
      { name: 'H5', issuedCount: 3000, usedCount: 2500, gmv: 80000, discount: 32000, usageRate: 83.3 },
    ],
    '抖音到店': [
      { name: '社群', issuedCount: 80000, usedCount: 64000, gmv: 936000, discount: 374000, usageRate: 80.0 },
    ],
  },
  issuedChannelRanking: [
    { name: '品牌小程序', issued: 180000 },
    { name: '支付有礼', issued: 150000 },
    { name: '零售商小程序', issued: 120000 },
    { name: '扫码领券', issued: 100000 },
    { name: '立减与折扣', issued: 80000 },
    { name: '社群', issued: 70000 },
    { name: '智能促销员', issued: 60000 },
    { name: '扫码购', issued: 50000 },
    { name: '碰一下', issued: 30000 },
    { name: 'H5', issued: 10000 },
  ],
  usedChannelRanking: [
    { name: '品牌小程序', used: 72000 },
    { name: '支付有礼', used: 60000 },
    { name: '零售商小程序', used: 48000 },
    { name: '扫码领券', used: 40000 },
    { name: '立减与折扣', used: 32000 },
    { name: '社群', used: 28000 },
    { name: '智能促销员', used: 24000 },
    { name: '扫码购', used: 20000 },
    { name: '碰一下', used: 12000 },
    { name: 'H5', used: 4000 },
  ],
  channels: [
    { name: '品牌小程序', usedCount: 72000 },
    { name: '支付有礼', usedCount: 60000 },
    { name: '零售商小程序', usedCount: 48000 },
    { name: '扫码领券', usedCount: 40000 },
    { name: '立减与折扣', usedCount: 32000 },
    { name: '社群', usedCount: 28000 },
    { name: '智能促销员', usedCount: 24000 },
    { name: '扫码购', usedCount: 20000 },
    { name: '碰一下', usedCount: 12000 },
    { name: 'H5', usedCount: 4000 },
  ],
  retailers: [
    { name: '华润万家大卖场', usedCount: 65000, gmv: 1300000, batchCount: 5, discount: 130000, roi: 10.0, orderCount: 13000, usageRate: 45.2 },
    { name: '沃尔玛', usedCount: 58000, gmv: 1160000, batchCount: 4, discount: 116000, roi: 10.0, orderCount: 11600, usageRate: 42.8 },
    { name: '山姆', usedCount: 52000, gmv: 1040000, batchCount: 4, discount: 104000, roi: 10.0, orderCount: 10400, usageRate: 41.5 },
    { name: '大润发', usedCount: 45000, gmv: 900000, batchCount: 3, discount: 90000, roi: 10.0, orderCount: 9000, usageRate: 38.9 },
    { name: '永辉', usedCount: 38000, gmv: 760000, batchCount: 3, discount: 76000, roi: 10.0, orderCount: 7600, usageRate: 36.2 },
    { name: '物美超市', usedCount: 32000, gmv: 640000, batchCount: 2, discount: 64000, roi: 10.0, orderCount: 6400, usageRate: 34.8 },
    { name: '麦德龙', usedCount: 28000, gmv: 560000, batchCount: 2, discount: 56000, roi: 10.0, orderCount: 5600, usageRate: 33.1 },
    { name: '大张盛德美', usedCount: 24000, gmv: 480000, batchCount: 2, discount: 48000, roi: 10.0, orderCount: 4800, usageRate: 31.5 },
    { name: '永旺', usedCount: 20000, gmv: 400000, batchCount: 1, discount: 40000, roi: 10.0, orderCount: 4000, usageRate: 29.8 },
    { name: '华润苏果便利店', usedCount: 18000, gmv: 360000, batchCount: 1, discount: 36000, roi: 10.0, orderCount: 3600, usageRate: 28.2 },
  ],
  mechanisms: [
    { name: '满200减30', usedCount: 85000, gmv: 1700000, batchCount: 6, discount: 170000, roi: 10.0, orderCount: 17000, usageRate: 48.5 },
    { name: '满100减15', usedCount: 72000, gmv: 1440000, batchCount: 5, discount: 144000, roi: 10.0, orderCount: 14400, usageRate: 45.8 },
    { name: '满50减8', usedCount: 58000, gmv: 1160000, batchCount: 4, discount: 116000, roi: 10.0, orderCount: 11600, usageRate: 42.1 },
    { name: '满300减50', usedCount: 45000, gmv: 900000, batchCount: 3, discount: 90000, roi: 10.0, orderCount: 9000, usageRate: 38.9 },
    { name: '满150减25', usedCount: 38000, gmv: 760000, batchCount: 3, discount: 76000, roi: 10.0, orderCount: 7600, usageRate: 36.2 },
    { name: '满80减12', usedCount: 32000, gmv: 640000, batchCount: 2, discount: 64000, roi: 10.0, orderCount: 6400, usageRate: 34.8 },
    { name: '满60减10', usedCount: 28000, gmv: 560000, batchCount: 2, discount: 56000, roi: 10.0, orderCount: 5600, usageRate: 33.1 },
    { name: '满120减20', usedCount: 24000, gmv: 480000, batchCount: 2, discount: 48000, roi: 10.0, orderCount: 4800, usageRate: 31.5 },
    { name: '满88减15', usedCount: 18000, gmv: 360000, batchCount: 1, discount: 36000, roi: 10.0, orderCount: 3600, usageRate: 28.2 },
    { name: '满168减28', usedCount: 15000, gmv: 300000, batchCount: 1, discount: 30000, roi: 10.0, orderCount: 3000, usageRate: 25.8 },
  ],
  skus: [
    { name: '康师傅红烧牛肉面', code69: '6901028089296', gmv: 240000, orderCount: 2400, discount: 24000, usedCount: 24000, salesVolume: 4800 },
    { name: '康师傅香辣牛肉面', code69: '6901028089302', gmv: 210000, orderCount: 2100, discount: 21000, usedCount: 21000, salesVolume: 4200 },
    { name: '康师傅老坛酸菜面', code69: '6901028089319', gmv: 190000, orderCount: 1900, discount: 19000, usedCount: 19000, salesVolume: 3800 },
    { name: '康师傅鲜虾鱼板面', code69: '6901028089326', gmv: 170000, orderCount: 1700, discount: 17000, usedCount: 17000, salesVolume: 3400 },
    { name: '康师傅西红柿鸡蛋面', code69: '6901028089333', gmv: 150000, orderCount: 1500, discount: 15000, usedCount: 15000, salesVolume: 3000 },
    { name: '康师傅麻辣牛肉面', code69: '6901028089340', gmv: 130000, orderCount: 1300, discount: 13000, usedCount: 13000, salesVolume: 2600 },
    { name: '康师傅香菇炖鸡面', code69: '6901028089357', gmv: 110000, orderCount: 1100, discount: 11000, usedCount: 11000, salesVolume: 2200 },
    { name: '康师傅酸辣牛肉面', code69: '6901028089364', gmv: 90000, orderCount: 900, discount: 9000, usedCount: 9000, salesVolume: 1800 },
    { name: '康师傅绿茶 500ml', code69: '6901028089371', gmv: 75000, orderCount: 750, discount: 7500, usedCount: 7500, salesVolume: 1500 },
    { name: '康师傅冰红茶 500ml', code69: '6901028089388', gmv: 60000, orderCount: 600, discount: 6000, usedCount: 6000, salesVolume: 1200 },
  ],
  trends: [
    { date: '10-01', gmv: 156000, usedCount: 10667, batchCount: 12, discount: 62333, roi: 2.5, orderCount: 1560, usageRate: 35.6 },
    { date: '10-02', gmv: 168000, usedCount: 11500, batchCount: 12, discount: 67200, roi: 2.5, orderCount: 1680, usageRate: 36.2 },
    { date: '10-03', gmv: 180000, usedCount: 12333, batchCount: 12, discount: 72000, roi: 2.5, orderCount: 1800, usageRate: 36.8 },
    { date: '10-04', gmv: 162000, usedCount: 11100, batchCount: 12, discount: 64800, roi: 2.5, orderCount: 1620, usageRate: 37.0 },
    { date: '10-05', gmv: 150000, usedCount: 10267, batchCount: 12, discount: 60000, roi: 2.5, orderCount: 1500, usageRate: 37.2 },
    { date: '10-06', gmv: 165000, usedCount: 11300, batchCount: 12, discount: 66000, roi: 2.5, orderCount: 1650, usageRate: 37.4 },
    { date: '10-07', gmv: 175000, usedCount: 12000, batchCount: 12, discount: 70000, roi: 2.5, orderCount: 1750, usageRate: 37.6 },
    { date: '10-08', gmv: 185000, usedCount: 12667, batchCount: 12, discount: 74000, roi: 2.5, orderCount: 1850, usageRate: 37.8 },
    { date: '10-09', gmv: 190000, usedCount: 13000, batchCount: 12, discount: 76000, roi: 2.5, orderCount: 1900, usageRate: 38.0 },
    { date: '10-10', gmv: 195000, usedCount: 13333, batchCount: 12, discount: 78000, roi: 2.5, orderCount: 1950, usageRate: 38.2 },
  ],
  timeAnalysisData: (() => {
    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data: Array<{ day: string; hour: number; gmv: number; dayIndex: number; hourIndex: number }> = [];
    
    weekdays.forEach((day, dayIndex) => {
      const isWeekend = dayIndex >= 5;
      hours.forEach((hour) => {
        let baseGmv = 50000;
        
        if (hour >= 9 && hour <= 12) {
          baseGmv *= isWeekend ? 2.4 : 2.2;
        } else if (hour >= 14 && hour <= 17) {
          baseGmv *= isWeekend ? 2.2 : 1.9;
        } else if (hour >= 19 && hour <= 22) {
          baseGmv *= isWeekend ? 2.8 : 2.5;
        } else if (hour >= 0 && hour <= 6) {
          baseGmv *= 0.2;
        } else {
          baseGmv *= isWeekend ? 1.6 : 1.0;
        }
        
        if (isWeekend) {
          baseGmv *= 1.5;
        }
        
        const randomFactor = 0.7 + Math.random() * 0.6;
        const gmv = Math.round(baseGmv * randomFactor);
        
        data.push({
          day,
          hour,
          gmv,
          dayIndex,
          hourIndex: hour
        });
      });
    });
    
    return data;
  })(),
  periods: [
    { name: '双11预售', usedCount: 64000, batchCount: 3, budgetUsed: 256000 },
    { name: '国庆黄金周', usedCount: 57600, batchCount: 4, budgetUsed: 230400 },
    { name: '开学季', usedCount: 51200, batchCount: 2, budgetUsed: 204800 },
    { name: '夏季促销', usedCount: 44800, batchCount: 3, budgetUsed: 179200 },
    { name: '618大促', usedCount: 38400, batchCount: 5, budgetUsed: 153600 },
    { name: '五一小长假', usedCount: 32000, batchCount: 2, budgetUsed: 128000 },
    { name: '春节特惠', usedCount: 25600, batchCount: 4, budgetUsed: 102400 },
    { name: '情人节专题', usedCount: 19200, batchCount: 1, budgetUsed: 76800 },
    { name: '会员日', usedCount: 12800, batchCount: 2, budgetUsed: 51200 },
    { name: '周年庆', usedCount: 6400, batchCount: 1, budgetUsed: 25600 },
  ]
};
