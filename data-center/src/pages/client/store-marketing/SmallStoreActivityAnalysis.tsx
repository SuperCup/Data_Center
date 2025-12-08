import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Select, Typography, Button, Table, Pagination, Radio, Tag, Tooltip as AntTooltip, DatePicker, Modal, Drawer } from 'antd';
import { ShoppingOutlined, DollarOutlined, TagOutlined, AppstoreOutlined, QuestionCircleOutlined, SearchOutlined, PushpinOutlined, PushpinFilled, DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { ScatterChart, Scatter, LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import dayjs from 'dayjs';
import { useLocation, useParams } from 'react-router-dom';
import { unifiedActivities, type ActivityData } from '../../../data/storeMarketingData';

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// 使用统一的活动数据
const mockActivities = unifiedActivities;

// 模拟零售商数据
const mockRetailers = [
  { id: '1', name: '华润万家', type: 'KA', gmv: 285000, discount: 12000, usedCount: 1250, avgPrice: 22.8, activeSku: 45, trend: { sales: [12, 15, 18, 22, 28], discount: [0.8, 1.0, 1.2, 1.5, 1.8] } },
  { id: '2', name: '永辉超市', type: 'KA', gmv: 268000, discount: 11000, usedCount: 1180, avgPrice: 22.7, activeSku: 42, trend: { sales: [10, 13, 16, 20, 26], discount: [0.7, 0.9, 1.1, 1.4, 1.7] } },
  { id: '3', name: '家乐福', type: 'KA', gmv: 245000, discount: 10000, usedCount: 1080, avgPrice: 22.7, activeSku: 38, trend: { sales: [9, 12, 15, 18, 24], discount: [0.6, 0.8, 1.0, 1.3, 1.6] } },
  { id: '4', name: '沃尔玛', type: 'KA', gmv: 232000, discount: 9500, usedCount: 1020, avgPrice: 22.7, activeSku: 36, trend: { sales: [8, 11, 14, 17, 23], discount: [0.5, 0.7, 0.9, 1.2, 1.5] } },
  { id: '5', name: '大润发', type: 'KA', gmv: 218000, discount: 8500, usedCount: 960, avgPrice: 22.7, activeSku: 34, trend: { sales: [7, 10, 13, 16, 21], discount: [0.4, 0.6, 0.8, 1.1, 1.4] } },
  { id: '6', name: '芙蓉兴盛', type: '小店', gmv: 125000, discount: 4500, usedCount: 580, avgPrice: 21.6, activeSku: 28, trend: { sales: [5, 7, 9, 11, 12], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '7', name: '怡福百货', type: '小店', gmv: 118000, discount: 4200, usedCount: 550, avgPrice: 21.5, activeSku: 26, trend: { sales: [4, 6, 8, 10, 11], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '8', name: '众和食杂', type: '小店', gmv: 112000, discount: 4000, usedCount: 520, avgPrice: 21.5, activeSku: 24, trend: { sales: [3, 5, 7, 9, 11], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '9', name: '浩林便利店', type: '小店', gmv: 108000, discount: 3800, usedCount: 500, avgPrice: 21.6, activeSku: 22, trend: { sales: [3, 4, 6, 8, 10], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '10', name: '一号门士多', type: '小店', gmv: 95000, discount: 3500, usedCount: 450, avgPrice: 21.1, activeSku: 20, trend: { sales: [2, 3, 5, 7, 9], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '11', name: '天虹超市', type: 'KA', gmv: 185000, discount: 7500, usedCount: 820, avgPrice: 22.6, activeSku: 32, trend: { sales: [6, 9, 12, 15, 18], discount: [0.4, 0.6, 0.8, 1.0, 1.2] } },
  { id: '12', name: '物美超市', type: 'KA', gmv: 175000, discount: 7000, usedCount: 780, avgPrice: 22.4, activeSku: 30, trend: { sales: [5, 8, 11, 14, 17], discount: [0.3, 0.5, 0.7, 0.9, 1.1] } },
  { id: '13', name: '文发士多', type: '小店', gmv: 88000, discount: 3200, usedCount: 420, avgPrice: 21.0, activeSku: 18, trend: { sales: [2, 3, 4, 6, 8], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '14', name: '嘉利烟酒店', type: '小店', gmv: 82000, discount: 3000, usedCount: 390, avgPrice: 21.0, activeSku: 16, trend: { sales: [1, 2, 3, 5, 7], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '15', name: '美惠佳', type: '小店', gmv: 78000, discount: 2800, usedCount: 370, avgPrice: 21.1, activeSku: 15, trend: { sales: [1, 2, 3, 4, 6], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '16', name: '好运来超市', type: '小店', gmv: 72000, discount: 2600, usedCount: 340, avgPrice: 21.2, activeSku: 14, trend: { sales: [1, 2, 3, 4, 5], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } }
];

// 模拟商品数据
const mockProducts = [
  { id: '1', name: '康师傅红烧牛肉面', code: '6923333422', gmv: 185000, discount: 7500, usedCount: 820, salesCount: 8200, trend: { sales: [15, 18, 22, 25, 30], discount: [0.6, 0.7, 0.8, 0.9, 1.0] } },
  { id: '2', name: '康师傅香辣牛肉面', code: '6923333423', gmv: 175000, discount: 7200, usedCount: 780, salesCount: 7800, trend: { sales: [14, 17, 20, 23, 28], discount: [0.5, 0.6, 0.7, 0.8, 0.9] } },
  { id: '3', name: '康师傅老坛酸菜面', code: '6923333424', gmv: 165000, discount: 6800, usedCount: 720, salesCount: 7200, trend: { sales: [13, 16, 19, 22, 26], discount: [0.4, 0.5, 0.6, 0.7, 0.8] } },
  { id: '4', name: '康师傅鲜虾鱼板面', code: '6923333425', gmv: 155000, discount: 6500, usedCount: 680, salesCount: 6800, trend: { sales: [12, 15, 18, 21, 24], discount: [0.4, 0.5, 0.6, 0.7, 0.8] } },
  { id: '5', name: '康师傅西红柿鸡蛋面', code: '6923333426', gmv: 145000, discount: 6200, usedCount: 640, salesCount: 6400, trend: { sales: [11, 14, 17, 20, 23], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '6', name: '康师傅麻辣牛肉面', code: '6923333427', gmv: 135000, discount: 5800, usedCount: 600, salesCount: 6000, trend: { sales: [10, 13, 16, 19, 22], discount: [0.3, 0.4, 0.5, 0.6, 0.7] } },
  { id: '7', name: '康师傅香菇炖鸡面', code: '6923333428', gmv: 125000, discount: 5500, usedCount: 560, salesCount: 5600, trend: { sales: [9, 12, 15, 18, 20], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '8', name: '康师傅酸辣牛肉面', code: '6923333429', gmv: 115000, discount: 5200, usedCount: 520, salesCount: 5200, trend: { sales: [8, 11, 14, 17, 19], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '9', name: '康师傅鲜虾面', code: '6923333430', gmv: 105000, discount: 4800, usedCount: 480, salesCount: 4800, trend: { sales: [7, 10, 13, 16, 18], discount: [0.2, 0.3, 0.4, 0.5, 0.6] } },
  { id: '10', name: '康师傅排骨面', code: '6923333431', gmv: 95000, discount: 4500, usedCount: 440, salesCount: 4400, trend: { sales: [6, 9, 12, 15, 17], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '11', name: '康师傅海鲜面', code: '6923333432', gmv: 85000, discount: 4200, usedCount: 400, salesCount: 4000, trend: { sales: [5, 8, 11, 14, 16], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } },
  { id: '12', name: '康师傅蘑菇面', code: '6923333433', gmv: 75000, discount: 3800, usedCount: 360, salesCount: 3600, trend: { sales: [4, 7, 10, 13, 15], discount: [0.1, 0.2, 0.3, 0.4, 0.5] } }
];

// 部/课/所三级联动数据
const departmentData = {
  '广州乳饮': {
    courses: {
      '天河': ['天河', '越秀', '荔湾'],
      '海珠': ['海珠', '番禺', '白云'],
      '黄埔': ['黄埔', '花都']
    }
  },
  '深圳乳饮': {
    courses: {
      '南山': ['南山', '福田'],
      '宝安': ['宝安', '龙岗']
    }
  }
};

const SmallStoreActivityAnalysis: React.FC = () => {
  const location = useLocation();
  const { activityId } = useParams<{ activityId?: string }>();
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [retailerType, setRetailerType] = useState<string>('all');
  const [retailerPage, setRetailerPage] = useState<number>(1);
  const [smallStorePage, setSmallStorePage] = useState<number>(1);
  const [productPage, setProductPage] = useState<number>(1);
  const [showSmallStores, setShowSmallStores] = useState<boolean>(false);
  const [dateType, setDateType] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>([
    dayjs().subtract(1, 'month'),
    dayjs()
  ]);
  const [trendModalVisible, setTrendModalVisible] = useState<boolean>(false);
  const [selectedRetailerTrend, setSelectedRetailerTrend] = useState<any>(null);
  const [productTrendModalVisible, setProductTrendModalVisible] = useState<boolean>(false);
  const [selectedProductTrend, setSelectedProductTrend] = useState<any>(null);
  const [pinnedProducts, setPinnedProducts] = useState<Set<string>>(new Set());
  
  // 部/课/所筛选状态
  const [selectedDepartment, setSelectedDepartment] = useState<string>('广州乳饮');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedOffice, setSelectedOffice] = useState<string>('');
  
  // 未报名门店清单侧边栏状态
  const [unregisteredStoresDrawerVisible, setUnregisteredStoresDrawerVisible] = useState<boolean>(false);
  
  // 消费者触达数量饼图选中的项
  const [selectedPieSegment, setSelectedPieSegment] = useState<string>('');
  
  // 处理URL参数，设置默认选中的活动
  useEffect(() => {
    // 优先使用路由参数中的activityId
    let targetActivityId = activityId;
    if (!targetActivityId) {
      // 如果没有路由参数，则检查查询参数
      const searchParams = new URLSearchParams(location.search);
      targetActivityId = searchParams.get('activityId') || '';
    }
    
    if (targetActivityId) {
      // 从统一数据源中查找对应的活动
      const activity = unifiedActivities.find(a => a.activityId === targetActivityId);
      if (activity) {
        setSelectedActivityId(activity.activityId);
      } else {
        // 如果找不到，使用第一个活动
        setSelectedActivityId(unifiedActivities[0]?.activityId || '');
      }
    } else {
      // 如果没有参数，使用第一个活动
      setSelectedActivityId(unifiedActivities[0]?.activityId || '');
    }
  }, [location.search, activityId]);
  
  // 折线图可见性状态
  const [visibleLines, setVisibleLines] = useState({
    registeredStores: true,
    activeStores: false,
    activeStoreRatio: false,
    redeemCount: false,
    avgOutput: false,
    avgDailyOutput: false
  });

  // 获取当前选中的活动数据
  const currentActivity = unifiedActivities.find(activity => activity.activityId === selectedActivityId) || unifiedActivities[0];
  
  // 获取可选的课程（根据选中的部）
  const availableCourses = selectedDepartment && departmentData[selectedDepartment as keyof typeof departmentData]
    ? Object.keys(departmentData[selectedDepartment as keyof typeof departmentData].courses)
    : [];
  
  // 获取可选的所（根据选中的课）
  const availableOffices = (() => {
    if (!selectedDepartment || !selectedCourse) return [];
    const dept = departmentData[selectedDepartment as keyof typeof departmentData];
    if (!dept) return [];
    const courseKey = selectedCourse as keyof typeof dept.courses;
    const course = dept.courses[courseKey];
    return Array.isArray(course) ? course : [];
  })();
  
  // 获取当前选择级别的下一级数据（用于饼图）
  const getNextLevelData = () => {
    if (selectedOffice) {
      // 如果选择了所，显示该所下的营销所数据（这里用门店数据模拟）
      return [];
    } else if (selectedCourse) {
      // 如果选择了课，显示该课下所有所的触达消费者数
      const offices = availableOffices;
      return offices.map((office: string, index: number) => {
        const baseReach = 5000 + index * 1000;
        return {
          name: office,
          value: baseReach,
          reachCount: baseReach,
          reach1: Math.floor(baseReach * 0.5),
          reach2: Math.floor(baseReach * 0.3),
          reach3Plus: Math.floor(baseReach * 0.2),
          repCount: 3 + index,
        };
      });
    } else if (selectedDepartment) {
      // 如果选择了部，显示该部下所有课的触达消费者数
      const courses = availableCourses;
      return courses.map((course: string, index: number) => {
        const baseReach = 10000 + index * 2000;
        return {
          name: course,
          value: baseReach,
          reachCount: baseReach,
          reach1: Math.floor(baseReach * 0.5),
          reach2: Math.floor(baseReach * 0.3),
          reach3Plus: Math.floor(baseReach * 0.2),
          repCount: 5 + index * 2,
        };
      });
    } else {
      // 如果什么都没选，显示所有部的触达消费者数
      return Object.keys(departmentData).map((dept: string, index: number) => {
        const baseReach = 20000 + index * 5000;
        return {
          name: dept,
          value: baseReach,
          reachCount: baseReach,
          reach1: Math.floor(baseReach * 0.5),
          reach2: Math.floor(baseReach * 0.3),
          reach3Plus: Math.floor(baseReach * 0.2),
          repCount: 10 + index * 5,
        };
      });
    }
  };
  
  // 饼图数据
  const pieData = getNextLevelData();
  const totalReachCount = pieData.reduce((sum, item) => sum + item.value, 0);
  
  // 饼图颜色（全部使用蓝色系，以颜色深浅区分）
  const COLORS = ['#1890ff', '#40a9ff', '#69c0ff', '#91d5ff', '#bae7ff', '#e6f7ff', '#002c8c'];
  
  // 根据选中的饼图段获取明细数据
  const getDetailData = () => {
    if (!selectedPieSegment) {
      // 如果没有选中，返回所有数据
      return pieData.map((item, index) => ({
        key: `detail-${index}`,
        marketingOffice: item.name,
        repCount: item.repCount,
        reachCount: item.reachCount,
        reach1: item.reach1,
        reach2: item.reach2,
        reach3Plus: item.reach3Plus,
      }));
    } else {
      // 如果选中了某个段，只返回该段的数据
      const selectedItem = pieData.find(item => item.name === selectedPieSegment);
      return selectedItem ? [{
        key: 'detail-selected',
        marketingOffice: selectedItem.name,
        repCount: selectedItem.repCount,
        reachCount: selectedItem.reachCount,
        reach1: selectedItem.reach1,
        reach2: selectedItem.reach2,
        reach3Plus: selectedItem.reach3Plus,
      }] : [];
    }
  };
  
  // 处理部选择变化
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setSelectedCourse(''); // 重置课
    setSelectedOffice(''); // 重置所
    setSelectedPieSegment(''); // 重置饼图选中项
  };
  
  // 处理课选择变化
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedOffice(''); // 重置所
    setSelectedPieSegment(''); // 重置饼图选中项
  };
  
  // 处理所选择变化
  const handleOfficeChange = (value: string) => {
    setSelectedOffice(value);
    setSelectedPieSegment(''); // 重置饼图选中项
  };
  
  // 获取数据更新日期（当日早上10点）
  const getUpdateTime = () => {
    const today = dayjs();
    return today.hour(10).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
  };

  // 门店编码和业代名称映射数据（根据图片数据）
  const storeCodeAndRepMap: { [key: string]: { code: string; repName: string } } = {
    // 图片中的门店数据
    '总站平价': { code: 'B043076765', repName: '熊丹丹' },
    '便民超市': { code: 'B043101465', repName: '王猛' },
    '利一分': { code: 'B043176069', repName: '王猛' },
    '红豆超市': { code: 'B043176069', repName: '杨文章' },
    '伯惠超市': { code: 'B043177790', repName: '肖兆强' },
    '新一村超市': { code: 'B043179337', repName: '吴芬芬' },
    '王先枝商店': { code: 'B043200172', repName: '熊丹丹' },
    '旺明超市': { code: 'B043563902', repName: '王猛' },
    '芙蓉兴盛添添福商行': { code: 'B043675271', repName: '杨文章' },
    '运前批发部': { code: 'B043694823', repName: '肖兆强' },
    '惠民超市': { code: 'B170019701', repName: '吴芬芬' },
    '蔚然锦和依依': { code: 'B643807957', repName: '熊丹丹' },
    '明禧': { code: 'B643808368', repName: '王猛' },
    // 为现有门店数据分配真实的业代名称
    '芙蓉兴盛': { code: 'B043675270', repName: '杨文章' },
    '怡福百货': { code: 'B043101466', repName: '王猛' },
    '众和食杂': { code: 'B043177791', repName: '肖兆强' },
    '浩林便利店': { code: 'B043179338', repName: '吴芬芬' },
    '一号门士多': { code: 'B043200173', repName: '熊丹丹' },
    '文发士多': { code: 'B043563903', repName: '王猛' },
    '嘉利烟酒店': { code: 'B043675272', repName: '杨文章' },
    '美惠佳': { code: 'B043694824', repName: '肖兆强' },
    '好运来超市': { code: 'B170019702', repName: '吴芬芬' }
  };
  
  // 模拟趋势数据
  const mockTrends = [
    { date: '2025-01-01', registeredStores: 220, activeStores: 185, activeStoreRatio: 84.1, redeemCount: 2900, avgOutput: 15.7, avgDailyOutput: 1.95 },
    { date: '2025-01-02', registeredStores: 225, activeStores: 188, activeStoreRatio: 83.6, redeemCount: 3050, avgOutput: 16.2, avgDailyOutput: 2.02 },
    { date: '2025-01-03', registeredStores: 229, activeStores: 192, activeStoreRatio: 83.8, redeemCount: 3200, avgOutput: 16.7, avgDailyOutput: 2.08 },
    { date: '2025-01-04', registeredStores: 228, activeStores: 190, activeStoreRatio: 83.3, redeemCount: 3100, avgOutput: 16.3, avgDailyOutput: 2.05 },
    { date: '2025-01-05', registeredStores: 230, activeStores: 194, activeStoreRatio: 84.3, redeemCount: 3250, avgOutput: 16.8, avgDailyOutput: 2.10 },
    { date: '2025-01-06', registeredStores: 232, activeStores: 196, activeStoreRatio: 84.5, redeemCount: 3400, avgOutput: 17.3, avgDailyOutput: 2.15 },
    { date: '2025-01-07', registeredStores: 231, activeStores: 195, activeStoreRatio: 84.4, redeemCount: 3300, avgOutput: 16.9, avgDailyOutput: 2.12 }
  ];

  // 零售商分页数据（只显示KA类型）
  const filteredRetailers = mockRetailers.filter(retailer => retailer.type === 'KA');
  const retailerPageSize = 10;
  const retailerStartIndex = (retailerPage - 1) * retailerPageSize;
  const currentRetailers = filteredRetailers.slice(retailerStartIndex, retailerStartIndex + retailerPageSize);

  // 小店分页数据
  const smallStores = mockRetailers.filter(retailer => retailer.type === '小店');
  const smallStorePageSize = 10;
  const smallStoreStartIndex = (smallStorePage - 1) * smallStorePageSize;
  const currentSmallStores = smallStores.slice(smallStoreStartIndex, smallStoreStartIndex + smallStorePageSize);

  // 获取排序后的商品数据（置顶商品在前）
  const getSortedProducts = () => {
    const pinnedProductsList = mockProducts.filter(product => pinnedProducts.has(product.id));
    const unpinnedProductsList = mockProducts.filter(product => !pinnedProducts.has(product.id));
    
    // 按销售额排序（降序）
    const sortedPinned = pinnedProductsList.sort((a, b) => b.gmv - a.gmv);
    const sortedUnpinned = unpinnedProductsList.sort((a, b) => b.gmv - a.gmv);
    
    return [...sortedPinned, ...sortedUnpinned];
  };

  // 商品分页数据（使用排序后的数据）
  const productPageSize = 10;
  const sortedProducts = getSortedProducts();
  const productStartIndex = (productPage - 1) * productPageSize;
  const currentProducts = sortedProducts.slice(productStartIndex, productStartIndex + productPageSize);

  // 小店表格列定义
  const smallStoreColumns = [
    {
      title: '序号',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => smallStoreStartIndex + index + 1,
    },
    {
      title: '门店编码',
      key: 'storeCode',
      width: 120,
      render: (record: any) => {
        const storeInfo = storeCodeAndRepMap[record.name] || { code: '未分配', repName: '未分配' };
        return storeInfo.code;
      },
    },
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      width: 140,
    },
    {
      title: '业代名称',
      key: 'repName',
      width: 100,
      render: (record: any) => {
        const storeInfo = storeCodeAndRepMap[record.name] || { code: '未分配', repName: '未分配' };
        return storeInfo.repName;
      },
    },
    {
      title: '总库存数',
      key: 'totalStock',
      width: 110,
      render: (record: any) => {
        // 模拟总库存数，基于销售额和门店名称hash值计算，确保一致性
        const nameHash = record.name ? record.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) : 0;
        const baseStock = Math.round((record.gmv || 0) / 50) + (nameHash % 200) + 100;
        return baseStock.toLocaleString();
      },
    },
    {
      title: '库存使用进度',
      key: 'stockUsage',
      width: 120,
      render: (record: any) => {
        // 模拟库存使用进度，基于订单数计算，使用与总库存数相同的计算方式
        const nameHash = record.name ? record.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) : 0;
        const totalStock = Math.round((record.gmv || 0) / 50) + (nameHash % 200) + 100;
        const usedStock = Math.min(record.usedCount || 0, totalStock);
        const usagePercent = totalStock > 0 ? ((usedStock / totalStock) * 100).toFixed(1) : '0.0';
        return `${usagePercent}%`;
      },
    },
    {
      title: '订单数',
      dataIndex: 'usedCount',
      key: 'usedCount',
      width: 90,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '日均订单数',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 90,
      render: (value: number) => Math.round(value * 10), // 将单均价转换为日均订单数的模拟计算
    },
    {
      title: '时段分析',
      key: 'trend',
      width: 70,
      render: (record: any) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            setSelectedRetailerTrend(record);
            setTrendModalVisible(true);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  // 零售商表格列定义
  const retailerColumns = [
    {
      title: '序号',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => retailerStartIndex + index + 1,
    },
    {
      title: '零售商名称',
      dataIndex: 'name',
      key: 'name',
      width: 140,
    },
    {
      title: '销售额(元)',
      dataIndex: 'gmv',
      key: 'gmv',
      width: 110,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '销售额占比(%)',
      key: 'contributionRate',
      width: 100,
      render: (record: any) => {
        const totalGmv = mockRetailers.reduce((sum, retailer) => sum + retailer.gmv, 0);
        const contributionRate = ((record.gmv / totalGmv) * 100).toFixed(1);
        return contributionRate;
      },
    },
    {
      title: '优惠金额(元)',
      dataIndex: 'discount',
      key: 'discount',
      width: 110,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '订单数',
      dataIndex: 'usedCount',
      key: 'usedCount',
      width: 90,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '单均价(元)',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 90,
      render: (value: number) => value.toFixed(1),
    },
    {
      title: '趋势',
      key: 'trend',
      width: 70,
      render: (record: any) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            setSelectedRetailerTrend(record);
            setTrendModalVisible(true);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  // 商品表格列定义
  const productColumns = [
    {
      title: '序号',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => productStartIndex + index + 1,
    },
    {
      title: '商品名称',
      key: 'name',
      width: 200,
      render: (record: any) => `${record.name}(${record.code})`,
    },
    {
      title: '销售额(元)',
      dataIndex: 'gmv',
      key: 'gmv',
      width: 110,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '销售额占比(%)',
      key: 'contributionRate',
      width: 100,
      render: (record: any) => {
        const totalGmv = mockProducts.reduce((sum, product) => sum + product.gmv, 0);
        const contributionRate = ((record.gmv / totalGmv) * 100).toFixed(1);
        return contributionRate;
      },
    },
    {
      title: '销售件数',
      dataIndex: 'salesCount',
      key: 'salesCount',
      width: 90,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '优惠金额(元)',
      dataIndex: 'discount',
      key: 'discount',
      width: 110,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (record: any) => (
        <Button
          type="text"
          size="small"
          icon={pinnedProducts.has(record.id) ? <PushpinFilled style={{ color: '#1890ff' }} /> : <PushpinOutlined />}
          onClick={() => handleTogglePin(record.id)}
          title={pinnedProducts.has(record.id) ? '取消置顶' : '置顶'}
        />
      ),
    },
    {
      title: '趋势',
      key: 'trend',
      width: 70,
      render: (record: any) => (
        <Button 
          type="link" 
          size="small" 
          onClick={() => showProductTrendModal(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 时间筛选处理函数
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setDateRange(dates);
  };

  const handleDateTypeChange = (e: any) => {
    setDateType(e.target.value);
  };

  // 趋势弹窗处理函数
  const showTrendModal = (retailer: any) => {
    setSelectedRetailerTrend(retailer);
    setTrendModalVisible(true);
  };

  const closeTrendModal = () => {
    setTrendModalVisible(false);
    setSelectedRetailerTrend(null);
  };

  const showProductTrendModal = (product: any) => {
    setSelectedProductTrend(product);
    setProductTrendModalVisible(true);
  };

  const closeProductTrendModal = () => {
    setProductTrendModalVisible(false);
    setSelectedProductTrend(null);
  };

  // 置顶功能处理函数
  const handleTogglePin = (productId: string) => {
    const newPinnedProducts = new Set(pinnedProducts);
    if (newPinnedProducts.has(productId)) {
      newPinnedProducts.delete(productId);
    } else {
      newPinnedProducts.add(productId);
    }
    setPinnedProducts(newPinnedProducts);
  };




  return (
      <div className="activity-analysis-container">
        {/* 页面标题 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2} style={{ margin: 0, marginRight: 8 }}>微信小店活动分析</Title>
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <Text type="secondary">数据更新时间：{getUpdateTime()}</Text>
            <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
              该数据仅作业务分析参考，不作为最终结算依据。
            </Text>
          </div>
        </div>

        {/* 筛选条件 */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>时间筛选：</Text>
              <Radio.Group value={dateType} onChange={handleDateTypeChange} size="small">
                <Radio.Button value="day">日</Radio.Button>
                <Radio.Button value="week">周</Radio.Button>
                <Radio.Button value="month">月</Radio.Button>
              </Radio.Group>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                picker={dateType as any}
                style={{ width: 240 }}
                size="small"
              />
            </div>
            <div>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={() => {
                  // 导出明细数据
                  const exportData = smallStores.map((store: any, index: number) => {
                    const storeInfo = storeCodeAndRepMap[store.name] || { code: '未分配', repName: '未分配' };
                    // 使用固定的计算方式，基于门店名称的hash值来确保一致性
                    const nameHash = store.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    const totalStock = Math.round((store.gmv || 0) / 50) + (nameHash % 200) + 100;
                    const usedStock = Math.min(store.usedCount || 0, totalStock);
                    const usagePercent = totalStock > 0 ? ((usedStock / totalStock) * 100).toFixed(1) : '0.0';
                    return {
                      序号: index + 1,
                      门店编码: storeInfo.code,
                      门店名称: store.name,
                      业代名称: storeInfo.repName,
                      总库存数: totalStock,
                      库存使用进度: `${usagePercent}%`,
                      订单数: store.usedCount,
                      日均订单数: Math.round((store.avgPrice || 0) * 10)
                    };
                  });
                  
                  // 转换为CSV格式
                  const headers = Object.keys(exportData[0] || {});
                  const csvContent = [
                    headers.join(','),
                    ...exportData.map((row: any) => headers.map((header: string) => `"${row[header]}"`).join(','))
                  ].join('\n');
                  
                  // 添加BOM以支持中文
                  const BOM = '\uFEFF';
                  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  const url = URL.createObjectURL(blob);
                  link.setAttribute('href', url);
                  link.setAttribute('download', `门店明细数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                下载明细数据
              </Button>
            </div>
          </div>
        </Card>

        {/* 部课所筛选模块 */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>部：</Text>
              <Select
                style={{ width: 150 }}
                placeholder="选择部"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                allowClear
                size="small"
              >
                {Object.keys(departmentData).map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>课：</Text>
              <Select
                style={{ width: 150 }}
                placeholder="选择课"
                value={selectedCourse}
                onChange={handleCourseChange}
                disabled={!selectedDepartment}
                allowClear
                size="small"
              >
                {availableCourses.map(course => (
                  <Option key={course} value={course}>{course}</Option>
                ))}
              </Select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text>所：</Text>
                  <Select
                    style={{ width: 150 }}
                    placeholder="选择所"
                    value={selectedOffice}
                    onChange={handleOfficeChange}
                    disabled={!selectedCourse}
                    allowClear
                    size="small"
                  >
                {availableOffices.map((office: string) => (
                  <Option key={office} value={office}>{office}</Option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

      {/* 2. 活动详情 */}
      {currentActivity && (
        <Card title="活动详情" style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            {/* 活动基本信息 */}
            <Col span={8}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div>
                    <Text strong>活动名称：</Text>
                    <Text>{currentActivity?.name || ''}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动周期：</Text>
                    <Text>{currentActivity?.startDate ? dayjs(currentActivity.startDate).format('YYYY年MM月DD日') : ''} 至 {currentActivity?.endDate ? dayjs(currentActivity.endDate).format('YYYY年MM月DD日') : ''}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动机制：</Text>
                    <div style={{ marginTop: 8 }}>
                      {typeof currentActivity.mechanisms === 'object' && !Array.isArray(currentActivity.mechanisms) ? (
                        Object.entries(currentActivity.mechanisms).map(([platform, mechanisms]) => (
                          <div key={platform}>
                            {mechanisms.map((mechanism: string, index: number) => (
                              <Tag key={index} style={{ margin: '2px 4px 2px 0' }}>
                                {mechanism}
                              </Tag>
                            ))}
                          </div>
                        ))
                      ) : (
                        // 兼容旧的数组格式
                        Array.isArray(currentActivity.mechanisms) && currentActivity.mechanisms.map((mechanism, index) => (
                          <Tag key={index} style={{ margin: '2px 4px 2px 0' }}>
                            {mechanism}
                          </Tag>
                        ))
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            {/* 活动预算与消耗 */}
            <Col span={8}>
              <div>
                <Text strong>活动预算与消耗：</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text>预算：</Text>
                    <Text strong style={{ color: '#1890ff' }}>
                      ¥{(currentActivity.budget / 10000).toFixed(1)}万
                    </Text>
                  </div>
                  <div>
                    <Text>消耗：</Text>
                    <Text strong style={{ color: '#52c41a' }}>
                      ¥{(currentActivity.consumed / 10000).toFixed(1)}万
                    </Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Progress 
                      percent={Math.round((currentActivity.consumed / currentActivity.budget) * 100)}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </Col>
            {/* 门店报名进度 */}
            <Col span={8}>
              <div>
                <Text strong>门店报名进度：</Text>
                <div style={{ marginTop: 8 }}>
                  {/* 计划门店数 */}
                  <div style={{ marginBottom: 8 }}>
                    <Text>计划门店数：</Text>
                    <Text strong style={{ color: '#3f8600' }}>
                      {(currentActivity as any).targetStores || 300}家
                    </Text>
                  </div>
                  
                  {/* 完成进度条 */}
                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <Text>完成进度：</Text>
                        <Text strong style={{ color: '#52c41a' }}>
                          {(currentActivity as any).registeredStores || 229}/{(currentActivity as any).targetStores || 300}
                        </Text>
                      </div>
                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => setUnregisteredStoresDrawerVisible(true)}
                      >
                        查看未报名门店清单
                      </Button>
                    </div>
                    <Progress 
                      percent={Math.round((((currentActivity as any).registeredStores || 229) / ((currentActivity as any).targetStores || 300)) * 100)}
                      size="small"
                      strokeColor="#52c41a"
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* 3. 核心指标 */}
      <Card title="核心指标" style={{ marginBottom: 0, borderBottom: 'none' }}>
        <Row gutter={16} style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 报名门店数 */}
          <Col flex="1">
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>报名门店数（个）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div>参与活动报名的门店总数</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={(currentActivity as any).registeredStores || 229}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>环比：</span>
                {(() => {
                  const current = (currentActivity as any).registeredStores || 229;
                  const previous = 210; // 模拟上期数据
                  const change = ((current - previous) / previous * 100).toFixed(1);
                  const isPositive = parseFloat(change) >= 0;
                  return (
                    <span style={{ 
                      fontSize: '12px', 
                      color: isPositive ? '#f5222d' : '#52c41a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(parseFloat(change))}%
                    </span>
                  );
                })()}
              </div>
            </Card>
          </Col>
          
          {/* 动销门店数 */}
          <Col flex="1">
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>动销门店数（个）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div>实际产生销售的门店数量</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={(currentActivity as any).activeStores || 192}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>环比：</span>
                {(() => {
                  const current = (currentActivity as any).activeStores || 192;
                  const previous = 180; // 模拟上期数据
                  const change = ((current - previous) / previous * 100).toFixed(1);
                  const isPositive = parseFloat(change) >= 0;
                  return (
                    <span style={{ 
                      fontSize: '12px', 
                      color: isPositive ? '#f5222d' : '#52c41a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(parseFloat(change))}%
                    </span>
                  );
                })()}
              </div>
            </Card>
          </Col>
          
          {/* 动销门店占比 */}
          <Col flex="1">
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>动销门店占比</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div>动销门店数占报名门店数的比例</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={(() => {
                  const registered = (currentActivity as any).registeredStores || 229;
                  const active = (currentActivity as any).activeStores || 192;
                  return registered > 0 ? ((active / registered) * 100).toFixed(1) : '0.0';
                })()}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>环比：</span>
                {(() => {
                  const registered = (currentActivity as any).registeredStores || 229;
                  const active = (currentActivity as any).activeStores || 192;
                  const current = registered > 0 ? ((active / registered) * 100) : 0;
                  const previous = 85.7; // 模拟上期数据
                  const change = ((current - previous) / previous * 100).toFixed(1);
                  const isPositive = parseFloat(change) >= 0;
                  return (
                    <span style={{ 
                      fontSize: '12px', 
                      color: isPositive ? '#f5222d' : '#52c41a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(parseFloat(change))}%
                    </span>
                  );
                })()}
              </div>
            </Card>
          </Col>
          
          {/* 核销份数 */}
          <Col flex="1">
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>核销份数（份）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div>活动期间实际核销的优惠券份数</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={(currentActivity as any).redeemCount || 3200}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>环比：</span>
                {(() => {
                  const current = (currentActivity as any).redeemCount || 3200;
                  const previous = 2900; // 模拟上期数据
                  const change = ((current - previous) / previous * 100).toFixed(1);
                  const isPositive = parseFloat(change) >= 0;
                  return (
                    <span style={{ 
                      fontSize: '12px', 
                      color: isPositive ? '#f5222d' : '#52c41a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(parseFloat(change))}%
                    </span>
                  );
                })()}
              </div>
            </Card>
          </Col>

          {/* 店均产出 */}
          <Col flex="1">
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>店均产出（份）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div>平均每个动销门店的核销份数</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={(() => {
                  const active = (currentActivity as any).activeStores || 192;
                  const redeemCount = (currentActivity as any).redeemCount || 3200;
                  return active > 0 ? (redeemCount / active).toFixed(1) : '0.0';
                })()}
                precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>环比：</span>
                {(() => {
                  const active = (currentActivity as any).activeStores || 192;
                  const redeemCount = (currentActivity as any).redeemCount || 3200;
                  const current = active > 0 ? (redeemCount / active) : 0;
                  const previous = 15.5; // 模拟上期数据
                  const change = ((current - previous) / previous * 100).toFixed(1);
                  const isPositive = parseFloat(change) >= 0;
                  return (
                    <span style={{ 
                      fontSize: '12px', 
                      color: isPositive ? '#f5222d' : '#52c41a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(parseFloat(change))}%
                    </span>
                  );
                })()}
              </div>
            </Card>
          </Col>

          {/* 店均日产出 */}
          <Col flex="1">
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>店均日产出（份）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div>平均每个门店每日的核销份数</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={(currentActivity as any).avgDailyOutput || 2.08}
                precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>环比：</span>
                {(() => {
                  const current = (currentActivity as any).avgDailyOutput || 2.08;
                  const previous = 1.95; // 模拟上期数据
                  const change = ((current - previous) / previous * 100).toFixed(1);
                  const isPositive = parseFloat(change) >= 0;
                  return (
                    <span style={{ 
                      fontSize: '12px', 
                      color: isPositive ? '#f5222d' : '#52c41a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(parseFloat(change))}%
                    </span>
                  );
                })()}
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 3.5. 指标趋势 */}
      <Card style={{ marginBottom: 16, marginTop: 0, borderTop: 'none' }}>
        {/* 指标选择器 */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { key: 'registeredStores', label: '报名门店数', color: '#1890ff' },
            { key: 'activeStores', label: '动销门店数', color: '#40a9ff' },
            { key: 'activeStoreRatio', label: '动销门店占比', color: '#096dd9' },
            { key: 'redeemCount', label: '核销份数', color: '#69c0ff' },
            { key: 'avgOutput', label: '店均产出', color: '#91d5ff' },
            { key: 'avgDailyOutput', label: '店均日产出', color: '#bae7ff' }
          ].map(metric => (
            <div 
              key={metric.key} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                backgroundColor: visibleLines[metric.key as keyof typeof visibleLines] ? 'rgba(0,0,0,0.02)' : 'transparent',
                 opacity: visibleLines[metric.key as keyof typeof visibleLines] ? 1 : 0.5
              }}
              onClick={() => setVisibleLines({
                registeredStores: false,
                activeStores: false,
                activeStoreRatio: false,
                redeemCount: false,
                avgOutput: false,
                avgDailyOutput: false,
                [metric.key]: true
              })}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = visibleLines[metric.key as keyof typeof visibleLines] ? 'rgba(0,0,0,0.02)' : 'transparent';
               }}
            >
              <div 
                style={{ 
                  width: '12px', 
                  height: '2px', 
                  backgroundColor: visibleLines[metric.key as keyof typeof visibleLines] ? metric.color : '#ccc',
                  marginRight: '8px',
                  borderRadius: '1px',
                  transition: 'background-color 0.2s ease'
                }} 
              />
              <span style={{ 
                color: visibleLines[metric.key as keyof typeof visibleLines] ? '#333' : '#999',
                 fontSize: '14px',
                 fontWeight: visibleLines[metric.key as keyof typeof visibleLines] ? '500' : '400',
                transition: 'all 0.2s ease'
              }}>
                {metric.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* 折线图 */}
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                const metricLabels: {[key: string]: string} = {
                  'registeredStores': '报名门店数',
                  'activeStores': '动销门店数',
                  'activeStoreRatio': '动销门店占比',
                  'redeemCount': '核销份数',
                  'avgOutput': '店均产出',
                  'avgDailyOutput': '店均日产出'
                };
                
                if (name === 'activeStoreRatio') {
                  return [`${(value as number).toFixed(1)}%`, metricLabels[name as string]];
                } else if (name === 'registeredStores' || name === 'activeStores') {
                  return [`${(value as number).toLocaleString()} 个`, metricLabels[name as string]];
                } else if (name === 'redeemCount' || name === 'avgOutput' || name === 'avgDailyOutput') {
                  return [`${(value as number).toLocaleString()} 份`, metricLabels[name as string]];
                } else {
                  return [(value as number).toLocaleString(), metricLabels[name as string]];
                }
              }} />
              <Legend />
              
              {/* 动态渲染所有可见的折线 */}
              {visibleLines.registeredStores && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="registeredStores"
                  stroke="#1890ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="报名门店数"
                />
              )}
              
              {visibleLines.activeStores && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="activeStores"
                  stroke="#40a9ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="动销门店数"
                />
              )}
              
              {visibleLines.activeStoreRatio && (
                <RechartsLine
                  yAxisId="right"
                  type="monotone"
                  dataKey="activeStoreRatio"
                  stroke="#096dd9"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="动销门店占比"
                />
              )}
              
              {visibleLines.redeemCount && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="redeemCount"
                  stroke="#69c0ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="核销份数"
                />
              )}
              
              {visibleLines.avgOutput && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgOutput"
                  stroke="#91d5ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="店均产出"
                />
              )}
              
              {visibleLines.avgDailyOutput && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgDailyOutput"
                  stroke="#bae7ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="店均日产出"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3.6. 消费者触达数量 */}
      <Card title="消费者触达数量" style={{ marginBottom: 16 }}>
        <Row gutter={24}>
          {/* 左侧：饼图 */}
          <Col span={12}>
            <div style={{ height: 400, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => {
                      const name = entry.name || '';
                      const percent = (entry as any).percent || 0;
                      return `${name} ${(percent * 100).toFixed(1)}%`;
                    }}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data: any) => {
                      // 点击饼图段，更新选中的段和明细数据
                      setSelectedPieSegment(data.name === selectedPieSegment ? '' : data.name);
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        style={{ 
                          cursor: 'pointer',
                          opacity: selectedPieSegment && selectedPieSegment !== entry.name ? 0.5 : 1
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`触达消费者数: ${value.toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '20px',
                pointerEvents: 'none'
              }}>
                <div style={{ fontSize: '16px', color: '#666', marginBottom: 4 }}>
                  触达总数：
                </div>
                <div style={{ fontSize: '20px', color: '#1890ff', fontWeight: 'bold' }}>
                  {totalReachCount.toLocaleString()}
                </div>
              </div>
            </div>
          </Col>
          {/* 右侧：明细表格 */}
          <Col span={12}>
            <Table
              columns={[
                {
                  title: '营销所',
                  dataIndex: 'marketingOffice',
                  key: 'marketingOffice',
                  width: 150,
                  ellipsis: true,
                },
                {
                  title: '已报名业代人员',
                  dataIndex: 'repCount',
                  key: 'repCount',
                  width: 120,
                  render: (value: number) => value.toLocaleString(),
                  ellipsis: true,
                },
                {
                  title: '触达消费者数量',
                  dataIndex: 'reachCount',
                  key: 'reachCount',
                  width: 130,
                  render: (value: number) => value.toLocaleString(),
                  sorter: (a: any, b: any) => a.reachCount - b.reachCount,
                  ellipsis: true,
                },
                {
                  title: '1次触达数量',
                  dataIndex: 'reach1',
                  key: 'reach1',
                  width: 120,
                  render: (value: number) => value.toLocaleString(),
                  sorter: (a: any, b: any) => a.reach1 - b.reach1,
                  ellipsis: true,
                },
                {
                  title: '2次触达数量',
                  dataIndex: 'reach2',
                  key: 'reach2',
                  width: 120,
                  render: (value: number) => value.toLocaleString(),
                  sorter: (a: any, b: any) => a.reach2 - b.reach2,
                  ellipsis: true,
                },
                {
                  title: '3次及以上触达数量',
                  dataIndex: 'reach3Plus',
                  key: 'reach3Plus',
                  width: 150,
                  render: (value: number) => value.toLocaleString(),
                  sorter: (a: any, b: any) => a.reach3Plus - b.reach3Plus,
                  ellipsis: true,
                },
              ]}
              dataSource={getDetailData()}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              size="small"
              scroll={{ y: 320 }}
            />
          </Col>
        </Row>
      </Card>

      {/* 4. 时段分析热力图 */}
      <Card title="时段分析" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: '20px', height: 500 }}>
          {/* 左侧热力图 */}
          <div style={{ flex: 1, position: 'relative', padding: '50px 20px 30px 60px' }}>
          {/* 热力图容器 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(24, 1fr)', 
            gridTemplateRows: 'repeat(7, 1fr)', 
            gap: '2px',
            height: 'calc(100% - 80px)',
            width: 'calc(100% - 80px)',
            position: 'relative'
          }}>
            {/* Y轴标签 */}
            <div style={{ 
              position: 'absolute', 
              left: '-40px', 
              top: '0', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-around',
              fontSize: '12px',
              color: '#666'
            }}>
              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
                <div key={day} style={{ textAlign: 'right', lineHeight: '1' }}>{day}</div>
              ))}
            </div>
            
            {/* X轴标签 - 显示在上方 */}
            <div style={{ 
              position: 'absolute', 
              top: '-25px', 
              left: '0', 
              width: '100%', 
              display: 'grid',
              gridTemplateColumns: 'repeat(24, 1fr)',
              fontSize: '11px',
              color: '#666'
            }}>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '0 1px', lineHeight: '1' }}>
                  {`${i}`}
                </div>
              ))}
            </div>
            
            {/* 热力图数据点 */}
            {Array.from({ length: 7 }, (_, dayIndex) => 
              Array.from({ length: 24 }, (_, hourIndex) => {
                // 模拟时段销售额数据
                const mockSales = mockActivities.reduce((sum: number, activity: ActivityData) => {
                  const baseValue = (activity.gmv || 0) / 1000; // 基础值
                  const dayFactor = dayIndex < 5 ? 1.2 : 0.8; // 工作日vs周末
                  const hourFactor = hourIndex >= 9 && hourIndex <= 21 ? 1.5 : 0.3; // 营业时间
                  const randomFactor = 0.5 + Math.random() * 0.5; // 随机因子
                  return sum + (baseValue * dayFactor * hourFactor * randomFactor);
                }, 0);
                
                const maxSales = 500; // 最大销售额
                const intensity = Math.min(mockSales / maxSales, 1);
                const size = 8 + intensity * 12; // 圆圈大小 8-20px
                const opacity = 0.3 + intensity * 0.7; // 透明度 0.3-1.0
                
                return (
                  <AntTooltip
                    key={`${dayIndex}-${hourIndex}`}
                    title={
                      <div>
                        <div>{['周一', '周二', '周三', '周四', '周五', '周六', '周日'][dayIndex]} {hourIndex}:00</div>
                        <div>销售额: {mockSales.toFixed(0)}元</div>
                        <div>活跃度: {(intensity * 100).toFixed(1)}%</div>
                      </div>
                    }
                    placement="top"
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          borderRadius: '50%',
                          backgroundColor: dayIndex < 5 ? '#1890ff' : '#52c41a',
                          opacity: opacity,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  </AntTooltip>
                );
              })
            ).flat()}
          </div>
          
          {/* 图例说明 */}
          <div style={{ 
            marginTop: '12px', 
            paddingTop: '12px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '11px',
            color: '#8c8c8c'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#1890ff',
                borderRadius: '2px'
              }}></div>
              <span>工作日</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#52c41a',
                borderRadius: '2px'
              }}></div>
              <span>周末</span>
            </div>
          </div>
        </div>
        

        </div>
      </Card>

      {/* 5. 零售商分析 */}
     <Card 
       title="门店"
       style={{ marginBottom: 16 }}
     >
       <Table
         dataSource={currentSmallStores}
         columns={smallStoreColumns}
         pagination={false}
         size="small"
         scroll={{ x: 800 }}
       />
       <div style={{ marginTop: 16, textAlign: 'center' }}>
         <Pagination
           current={smallStorePage}
           pageSize={smallStorePageSize}
           total={smallStores.length}
           onChange={setSmallStorePage}
           showSizeChanger={false}
           showQuickJumper
           showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
         />
       </div>
     </Card>

     {/* 趋势弹窗 - 时段分析气泡图 */}
     <Modal
       title={`${selectedRetailerTrend?.name} - 时段分析`}
       open={trendModalVisible}
       onCancel={closeTrendModal}
       footer={null}
       width={1000}
     >
       {selectedRetailerTrend && (
         <div style={{ height: 600 }}>
           {/* 指标卡片 */}
           <div style={{ marginBottom: 24 }}>
             <Row gutter={16}>
               <Col span={6}>
                 <Card size="small" style={{ textAlign: 'center' }}>
                   <Statistic
                     title="销售额（元）"
                     value={selectedRetailerTrend.gmv}
                     precision={0}
                     prefix=""
                     valueStyle={{ color: '#1890ff', fontSize: 18 }}
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card size="small" style={{ textAlign: 'center' }}>
                   <Statistic
                     title="优惠金额（元）"
                     value={selectedRetailerTrend.discount}
                     precision={0}
                     prefix=""
                     valueStyle={{ color: '#52c41a', fontSize: 18 }}
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card size="small" style={{ textAlign: 'center' }}>
                   <Statistic
                     title="订单数（笔）"
                     value={selectedRetailerTrend.usedCount}
                     precision={0}
                     suffix=""
                     valueStyle={{ color: '#722ed1', fontSize: 18 }}
                   />
                 </Card>
               </Col>
               <Col span={6}>
                 <Card size="small" style={{ textAlign: 'center' }}>
                   <Statistic
                     title="日均订单数（笔）"
                     value={Math.round(selectedRetailerTrend.usedCount / 30)}
                     precision={0}
                     suffix=""
                     valueStyle={{ color: '#fa8c16', fontSize: 18 }}
                   />
                 </Card>
               </Col>
             </Row>
           </div>
           
           {/* 时段分析热力图 */}
           <div style={{ display: 'flex', gap: 24 }}>
             {/* 左侧热力图 */}
             <div style={{ flex: 1 }}>
               <div style={{ marginBottom: 16 }}>
                 <Text strong style={{ fontSize: 16 }}>时段销售热力图</Text>
               </div>
               <div style={{ 
                 display: 'grid', 
                 gridTemplateColumns: 'auto repeat(24, 1fr)', 
                 gap: 2, 
                 alignItems: 'center',
                 fontSize: 12,
                 position: 'relative',
                 paddingTop: 30
               }}>
                 {/* 表头 - 小时 - 显示在上方 */}
                 <div style={{ 
                   position: 'absolute',
                   top: 0,
                   left: 60,
                   right: 0,
                   display: 'grid',
                   gridTemplateColumns: 'repeat(24, 1fr)',
                   gap: 2,
                   fontSize: 10,
                   color: '#666'
                 }}>
                   {Array.from({ length: 24 }, (_, hour) => (
                     <div key={hour} style={{ textAlign: 'center', padding: '4px 2px' }}>
                       {hour}
                     </div>
                   ))}
                 </div>
                 
                 {/* 数据行 - 每天 */}
                 {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, dayIndex) => (
                   <React.Fragment key={day}>
                     <div style={{ padding: '4px 8px', fontSize: 11, fontWeight: 500, width: 50 }}>{day}</div>
                     {Array.from({ length: 24 }, (_, hour) => {
                       // 模拟该小店在不同时段的销售额数据
                       const baseAmount = selectedRetailerTrend.gmv / 1000; // 基础销售额
                       const hourFactor = hour >= 7 && hour <= 22 ? 
                         (hour >= 11 && hour <= 13 ? 1.8 : // 午餐时间
                          hour >= 18 && hour <= 20 ? 2.2 : // 晚餐时间
                          hour >= 9 && hour <= 17 ? 1.2 : 0.6) : 0.3; // 其他时间
                       const dayFactor = dayIndex >= 5 ? 1.5 : 1.0; // 周末因子
                       const randomFactor = 0.7 + Math.random() * 0.6; // 随机因子
                       const amount = baseAmount * hourFactor * dayFactor * randomFactor;
                       
                       // 计算圆圈大小和透明度
                       const maxAmount = baseAmount * 2.2 * 1.5;
                       const size = Math.max(8, Math.min(24, (amount / maxAmount) * 24));
                       const opacity = Math.max(0.2, Math.min(1, amount / maxAmount));
                       
                       // 区分工作日和周末颜色
                       const isWeekend = dayIndex >= 5;
                       const color = isWeekend ? '#52c41a' : '#1890ff';
                       
                       return (
                         <AntTooltip
                           key={`${day}-${hour}`}
                           title={
                             <div>
                               <div>{day} {hour}:00</div>
                               <div>销售额: ¥{amount.toFixed(0)}</div>
                               <div>类型: {isWeekend ? '周末' : '工作日'}</div>
                             </div>
                           }
                         >
                           <div style={{ 
                             display: 'flex', 
                             justifyContent: 'center', 
                             alignItems: 'center',
                             height: 28,
                             cursor: 'pointer'
                           }}>
                             <div style={{
                               width: size,
                               height: size,
                               borderRadius: '50%',
                               backgroundColor: color,
                               opacity: opacity,
                               transition: 'all 0.2s'
                             }} />
                           </div>
                         </AntTooltip>
                       );
                     })}
                   </React.Fragment>
                 ))}
               </div>
               
               {/* 图例 */}
               <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 24 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <div style={{ 
                     width: 12, 
                     height: 12, 
                     borderRadius: '50%', 
                     backgroundColor: '#1890ff' 
                   }} />
                   <Text style={{ fontSize: 12 }}>工作日</Text>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <div style={{ 
                     width: 12, 
                     height: 12, 
                     borderRadius: '50%', 
                     backgroundColor: '#52c41a' 
                   }} />
                   <Text style={{ fontSize: 12 }}>周末</Text>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </Modal>

     {/* 未报名门店清单侧边栏 */}
     <Drawer
       title="未报名门店清单"
       placement="right"
       width={600}
       open={unregisteredStoresDrawerVisible}
       onClose={() => setUnregisteredStoresDrawerVisible(false)}
     >
       <Table
         columns={[
           {
             title: '门店编码',
             key: 'storeCode',
             width: 150,
             render: (record: any) => {
               const storeInfo = storeCodeAndRepMap[record.name] || { code: '未分配', repName: '未分配' };
               return storeInfo.code;
             },
           },
           {
             title: '门店名称',
             dataIndex: 'name',
             key: 'name',
             width: 200,
           },
         ]}
         dataSource={(() => {
           // 生成未报名门店数据（模拟数据，实际应该从API获取）
           const targetStores = (currentActivity as any).targetStores || 300;
           const registeredStores = (currentActivity as any).registeredStores || 229;
           const unregisteredCount = targetStores - registeredStores;
           
           // 生成未报名门店列表（基于已有门店数据生成一些示例）
           const unregisteredStores = [];
           const allStoreNames = [
             '总站平价', '便民超市', '利一分', '红豆超市', '伯惠超市', '新一村超市',
             '王先枝商店', '旺明超市', '芙蓉兴盛添添福商行', '运前批发部', '惠民超市',
             '蔚然锦和依依', '明禧', '芙蓉兴盛', '怡福百货', '众和食杂', '浩林便利店',
             '一号门士多', '文发士多', '嘉利烟酒店', '美惠佳', '好运来超市'
           ];
           
           // 获取已报名的门店名称（从smallStores中）
           const registeredStoreNames = new Set(smallStores.map((store: any) => store.name));
           
           // 从未报名门店中随机选择
           const unregisteredStoreNames = allStoreNames.filter(name => !registeredStoreNames.has(name));
           
           // 生成未报名门店数据
           for (let i = 0; i < Math.min(unregisteredCount, unregisteredStoreNames.length); i++) {
             const storeName = unregisteredStoreNames[i] || `未报名门店${i + 1}`;
             unregisteredStores.push({
               key: `unregistered-${i}`,
               name: storeName,
             });
           }
           
           // 如果未报名门店数量超过已有门店名称，补充一些模拟门店
           if (unregisteredStores.length < unregisteredCount) {
             for (let i = unregisteredStores.length; i < unregisteredCount; i++) {
               unregisteredStores.push({
                 key: `unregistered-${i}`,
                 name: `未报名门店${i + 1}`,
               });
             }
           }
           
           return unregisteredStores;
         })()}
         pagination={{
           pageSize: 20,
           showSizeChanger: true,
           showQuickJumper: true,
           showTotal: (total) => `共 ${total} 条记录`,
         }}
         size="small"
       />
     </Drawer>

  </div>
);
};

export default SmallStoreActivityAnalysis;