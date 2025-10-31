import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Select, Typography, Button, Table, Pagination, Radio, Tag, Tooltip as AntTooltip, DatePicker, Modal } from 'antd';
import { ShoppingOutlined, DollarOutlined, TagOutlined, AppstoreOutlined, QuestionCircleOutlined, SearchOutlined, PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import { ScatterChart, Scatter, LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { useLocation, useParams } from 'react-router-dom';

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// 模拟活动数据
const mockActivities = [
  {
    id: '1',
    name: '2025年9-10月康师傅红烧牛肉面全国促销活动',
    startDate: '2025-09-01',
    endDate: '2025-10-31',
    mechanisms: {
      '微信优惠券': ['满5减0.5', '满8减0.8', '满10减1', '满12减1.2'],
      '支付宝优惠券/碰一下': ['满15减1.5', '满18减1.8', '满20减2', '满22减2.2'],
      '微信小店': ['2元乐享', '新品立减2元']
    },
    budget: 50000,
    consumed: 32500,
    gmv: 142500,
    usedCount: Math.round(12500 * 1.5),
    batchCount: 8 * 15,
    discount: 32500,
    usageRate: 78.5,
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
  },
  {
    id: '2',
    name: '2025年8月康师傅冰红茶夏季促销活动',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    mechanisms: {
      '微信优惠券': ['满4减0.4', '满6减0.6', '满8减0.8', '满10减1'],
      '支付宝优惠券/碰一下': ['满12减1.2', '满14减1.4', '满16减1.6', '满18减1.8'],
      '抖音到店': ['满20减2', '满22减2.2', '满24减2.4', '满26减2.6'],
      '美团到店': ['满28减2.8', '满30减3', '满32减3.2', '满34减3.4'],
      '天猫校园': ['满36减3.6', '满38减3.8', '满40减4', '满50减5'],
      '微信小店': ['2元乐享', '新品立减2元']
    },
    budget: 40000,
    consumed: 26000,
    gmv: 97500,
    usedCount: Math.round(8500 * 1.5),
    batchCount: 5 * 15,
    discount: 26000,
    usageRate: 82.3,
    batches: [
      { id: 'b1', name: '指定品满4元减0.4元', gmv: 21000, discount: 1600 },
      { id: 'b2', name: '指定品满6元减0.6元', gmv: 19000, discount: 1400 },
      { id: 'b3', name: '指定品满8元减0.8元', gmv: 22500, discount: 1750 },
      { id: 'b4', name: '指定品满10元减1元', gmv: 17500, discount: 1300 },
      { id: 'b5', name: '指定品满12元减1.2元', gmv: 17500, discount: 1250 }
    ]
  },
  {
    id: '3',
    name: '2025年7月康师傅方便面全国促销活动',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    mechanisms: {
      '微信优惠券': ['满3减0.3', '满5减0.5', '满6减0.6', '满8减0.8'],
      '支付宝优惠券/碰一下': ['满9减0.9', '满10减1', '满12减1.2', '满14减1.4'],
      '抖音到店': ['满15减1.5', '满16减1.6', '满18减1.8', '满20减2'],
      '美团到店': ['满21减2.1', '满24减2.4', '满25减2.5', '满27减2.7'],
      '天猫校园': ['满30减3', '满32减3.2', '满35减3.5', '满40减4'],
      '微信小店': ['2元乐享', '新品立减2元']
    },
    budget: 30000,
    consumed: 24000,
    gmv: 82500,
    usedCount: Math.round(9200 * 1.5),
    batchCount: 6 * 15,
    discount: 24000,
    usageRate: 85.1,
    batches: [
      { id: 'b1', name: '指定品满3元减0.3元', gmv: 16000, discount: 1200 },
      { id: 'b2', name: '指定品满5元减0.5元', gmv: 14000, discount: 1050 },
      { id: 'b3', name: '指定品满6元减0.6元', gmv: 14500, discount: 1100 },
      { id: 'b4', name: '指定品满8元减0.8元', gmv: 12500, discount: 950 },
      { id: 'b5', name: '指定品满9元减0.9元', gmv: 13000, discount: 1000 },
      { id: 'b6', name: '指定品满10元减1元', gmv: 12500, discount: 900 }
    ]
  }
];

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

const ActivityAnalysis: React.FC = () => {
  const location = useLocation();
  const { activityId } = useParams<{ activityId?: string }>();
  const [selectedActivity, setSelectedActivity] = useState<string>('1');
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
  
  // 处理URL参数，设置默认选中的活动
  useEffect(() => {
    // 优先使用路由参数中的activityId
    if (activityId) {
      // 根据activityId映射到对应的活动ID
      const activityMapping: { [key: string]: string } = {
        'ACT001': '1',
        'ACT002': '2', 
        'ACT003': '3',
        'ACT004': '1', // 待开始活动映射到第一个活动
        'ACT005': '1', // 待开始活动映射到第一个活动
        'ACT006': '3'  // 已结束活动映射到第三个活动
      };
      const mappedId = activityMapping[activityId] || '1';
      setSelectedActivity(mappedId);
    } else {
      // 如果没有路由参数，则检查查询参数
      const searchParams = new URLSearchParams(location.search);
      const queryActivityId = searchParams.get('activityId');
      if (queryActivityId) {
        // 根据activityId映射到对应的活动ID
        const activityMapping: { [key: string]: string } = {
          'ACT001': '1',
          'ACT002': '2', 
          'ACT003': '3',
          'ACT004': '1', // 待开始活动映射到第一个活动
          'ACT005': '1', // 待开始活动映射到第一个活动
          'ACT006': '3'  // 已结束活动映射到第三个活动
        };
        const mappedId = activityMapping[queryActivityId] || '1';
        setSelectedActivity(mappedId);
      }
    }
  }, [location.search, activityId]);
  
  // 折线图可见性状态
  const [visibleLines, setVisibleLines] = useState({
    gmv: true,
    orderCount: false,
    avgPrice: false,
    roi: false,
    discount: false
  });

  // 获取当前选中的活动数据
  const currentActivity = mockActivities.find(activity => activity.id === selectedActivity) || mockActivities[0];
  
  // 模拟趋势数据
  const mockTrends = [
    { date: '2025-01-01', gmv: 120000, orderCount: 5500, avgPrice: 21.8, roi: 3.7, discount: 25000 },
    { date: '2025-01-02', gmv: 135000, orderCount: 6200, avgPrice: 21.8, roi: 4.1, discount: 28000 },
    { date: '2025-01-03', gmv: 142500, orderCount: 6500, avgPrice: 21.9, roi: 4.4, discount: 32500 },
    { date: '2025-01-04', gmv: 138000, orderCount: 6300, avgPrice: 21.9, roi: 4.2, discount: 30000 },
    { date: '2025-01-05', gmv: 145000, orderCount: 6600, avgPrice: 22.0, roi: 4.3, discount: 33500 },
    { date: '2025-01-06', gmv: 152000, orderCount: 6900, avgPrice: 22.0, roi: 4.3, discount: 35000 },
    { date: '2025-01-07', gmv: 148000, orderCount: 6700, avgPrice: 22.1, roi: 4.4, discount: 34000 }
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

  // 小店表格列定义（与零售商表格列定义相同，但序号需要重新计算）
  const smallStoreColumns = [
    {
      title: '序号',
      key: 'rank',
      width: 60,
      render: (_: any, __: any, index: number) => smallStoreStartIndex + index + 1,
    },
    {
      title: '小店名称',
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
          <Title level={2} style={{ margin: 0, marginRight: 8 }}>活动分析</Title>
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <Text type="secondary">数据更新时间：2025-01-27 14:30:00</Text>
            <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
              该数据仅作业务分析参考，不作为最终结算依据。
            </Text>
          </div>
        </div>

        {/* 筛选条件 */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
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
              <Select
                style={{ width: 400 }}
                placeholder="选择活动"
                value={selectedActivity}
                onChange={setSelectedActivity}
                showSearch
              >
                {mockActivities.map(activity => (
                  <Option key={activity.id} value={activity.id}>
                    {activity.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

      {/* 2. 活动详情 */}
      {currentActivity && (
        <Card title="活动详情" style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col span={16}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div>
                    <Text strong>活动名称：</Text>
                    <Text>{currentActivity.name}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动周期：</Text>
                    <Text>{currentActivity.startDate} 至 {currentActivity.endDate}</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <Text strong>活动机制：</Text>
                    <div style={{ marginTop: 8 }}>
                      {typeof currentActivity.mechanisms === 'object' && !Array.isArray(currentActivity.mechanisms) ? (
                        Object.entries(currentActivity.mechanisms).map(([platform, mechanisms]) => (
                          <div key={platform} style={{ marginBottom: 16 }}>
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: 500, 
                              color: '#1890ff',
                              marginBottom: 6,
                              paddingBottom: 2,
                              borderBottom: '1px solid #f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <span>{platform}</span>
                              {platform === '微信小店' && (
                                <Button 
                                  type="link" 
                                  size="small"
                                  onClick={() => window.location.href = '/client/small-store-activity-analysis'}
                                  style={{ 
                                    fontSize: '12px',
                                    padding: '0 8px',
                                    height: '20px'
                                  }}
                                >
                                  查看分析
                                </Button>
                              )}
                            </div>
                            <div style={{ paddingLeft: 12 }}>
                              {mechanisms.map((mechanism: string, index: number) => (
                                <Tag key={index} style={{ margin: '2px 4px 2px 0' }}>
                                  {mechanism}
                                </Tag>
                              ))}
                            </div>
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
          </Row>
        </Card>
      )}

      {/* 3. 核心指标 */}
      <Card title="核心指标" style={{ marginBottom: 0, borderBottom: 'none' }}>
        <Row gutter={0} style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 销售额 */}
          <Col style={{ width: 'calc(25% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>销售额（元）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝平台：</strong></div>
                      <div style={{ marginBottom: 8 }}>所有订单的订单商品数量×商品价格之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.gmv}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          {/* 优惠金额 */}
          <Col style={{ width: 'calc(25% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>优惠金额（元）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>该数据仅供参考，不作为最终结算依据</div>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝平台：</strong></div>
                      <div style={{ marginBottom: 8 }}>所有订单的优惠金额之和（已扣除退款）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.discount}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          {/* ROI */}
          <Col style={{ width: 'calc(25% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>ROI</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div>销售额 ÷ 优惠金额</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.gmv / currentActivity.discount}
                precision={1}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          {/* 订单数 */}
          <Col style={{ width: 'calc(25% - 8px)' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '14px', color: '#000000' }}>订单数（笔）</span>
                <AntTooltip 
                  title={
                    <div style={{ maxWidth: 300 }}>
                      <div style={{ marginBottom: 4 }}><strong>微信/支付宝：</strong></div>
                      <div style={{ marginBottom: 8 }}>平台下载的正向账单数量之和（无账单活动，取活动详情中统计的订单数量）</div>
                      <div style={{ marginBottom: 4 }}><strong>抖音到店：</strong></div>
                      <div>待补充</div>
                    </div>
                  }
                  placement="topLeft"
                >
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#000000', cursor: 'help' }} />
                </AntTooltip>
              </div>
              <Statistic
                title=""
                value={currentActivity.usedCount}
                precision={0}
                valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 3.5. 指标趋势 */}
      <Card style={{ marginBottom: 16, marginTop: 0, borderTop: 'none' }}>
        {/* 指标选择器 */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { key: 'gmv', label: '销售额', color: '#40a9ff' },
            { key: 'discount', label: '优惠金额', color: '#096dd9' },
            { key: 'roi', label: 'ROI', color: '#91d5ff' },
            { key: 'orderCount', label: '订单数', color: '#69c0ff' }
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
                gmv: false,
                orderCount: false,
                avgPrice: false,
                roi: false,
                discount: false,
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
                  'gmv': '销售额',
                  'discount': '优惠金额',
                  'roi': 'ROI',
                  'orderCount': '订单数'
                };
                
                if (name === 'roi') {
                  return [`${value}`, metricLabels[name as string]];
                } else if (name === 'gmv' || name === 'discount') {
                  return [`${(value as number).toLocaleString()} 元`, metricLabels[name as string]];
                } else {
                  return [(value as number).toLocaleString(), metricLabels[name as string]];
                }
              }} />
              <Legend />
              
              {/* 动态渲染所有可见的折线 */}
              {visibleLines.orderCount && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="orderCount"
                  stroke="#1890ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="订单数"
                />
              )}
              
              {visibleLines.gmv && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="gmv"
                  stroke="#40a9ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="销售额"
                />
              )}
              
              {visibleLines.discount && (
                <RechartsLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="discount"
                  stroke="#096dd9"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="优惠金额"
                />
              )}
              
              {visibleLines.roi && (
                <RechartsLine
                  yAxisId="right"
                  type="monotone"
                  dataKey="roi"
                  stroke="#91d5ff"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  name="ROI"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. 批次对比 */}
      <Card title="批次对比" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12, fontSize: '14px', color: '#666' }}>
          <strong>销售额占比说明：</strong>单批次销售额占活动总销售额的占比
        </div>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              data={currentActivity?.batches?.map(batch => ({
                ...batch,
                contributionRate: ((batch.gmv / currentActivity.gmv) * 100).toFixed(1),
                roi: (batch.gmv / batch.discount).toFixed(2)
              })) || []}
              margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="roi" 
                type="number" 
                name="ROI"
                tickFormatter={(value) => `${value}`}
                label={{ value: 'ROI', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis 
                dataKey="contributionRate" 
                type="number" 
                name="销售额占比"
                tickFormatter={(value) => `${value}%`}
                label={{ value: '销售额占比(%)', angle: 0, position: 'insideTopLeft', textAnchor: 'start', offset: 10, dx: -50 }}
              />
              <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ 
                          backgroundColor: 'white', 
                          padding: '8px 12px', 
                          border: '1px solid #ccc', 
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data.name}</div>
                          <div>销售额占比：{data.contributionRate}%</div>
                          <div>ROI：{data.roi}</div>
                          <div>销售额：{(data.gmv / 10000).toFixed(1)}万元</div>
                          <div>优惠金额：{(data.discount / 10000).toFixed(1)}万元</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              <Scatter dataKey="contributionRate" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4.5. 时段分析热力图 */}
      <Card title="时段分析" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: '20px', height: 500 }}>
          {/* 左侧热力图 */}
          <div style={{ flex: 1, position: 'relative', padding: '20px 0' }}>
          {/* 热力图容器 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '60px repeat(24, 1fr)', 
            gridTemplateRows: 'repeat(8, 1fr)', 
            gap: '2px',
            height: '100%',
            width: '100%'
          }}>
            {/* 空白角落 */}
            <div></div>
            
            {/* 小时标签 */}
            {Array.from({ length: 24 }, (_, i) => (
              <div 
                key={`hour-${i}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#8c8c8c',
                  fontWeight: '500'
                }}
              >
                {i}
              </div>
            ))}
            
            {/* 星期和数据点 */}
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, dayIndex) => {
              // 模拟时段分析数据
              const mockTimeAnalysisData = Array.from({ length: 7 * 24 }, (_, index) => {
                const dayIdx = Math.floor(index / 24);
                const hourIdx = index % 24;
                // 基于活动数据生成模拟的时段销售额
                const baseGmv = currentActivity.gmv / (7 * 24);
                const hourMultiplier = hourIdx >= 9 && hourIdx <= 21 ? 1.5 : 0.5; // 白天销售更好
                const dayMultiplier = dayIdx === 5 || dayIdx === 6 ? 1.2 : 1.0; // 周末销售更好
                const randomFactor = 0.5 + Math.random() * 1.5; // 随机因子
                return {
                  dayIndex: dayIdx,
                  hourIndex: hourIdx,
                  gmv: baseGmv * hourMultiplier * dayMultiplier * randomFactor
                };
              });

              // 计算当天所有时段的销售额总和
              const dayTotalGmv = mockTimeAnalysisData
                .filter(item => item.dayIndex === dayIndex)
                .reduce((sum, item) => sum + item.gmv, 0);
              
              return (
                <React.Fragment key={day}>
                  {/* 星期标签 */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#262626',
                    fontWeight: '500'
                  }}>
                    {day}
                  </div>
                  
                  {/* 24小时数据点 */}
                  {Array.from({ length: 24 }, (_, hour) => {
                    const dataPoint = mockTimeAnalysisData.find(
                      item => item.dayIndex === dayIndex && item.hourIndex === hour
                    );
                    
                    if (!dataPoint) return <div key={`${day}-${hour}`}></div>;
                    
                    // 计算圆圈大小和颜色深度
                    const maxGmv = Math.max(...mockTimeAnalysisData.map(item => item.gmv));
                    const minGmv = Math.min(...mockTimeAnalysisData.map(item => item.gmv));
                    const normalizedValue = (dataPoint.gmv - minGmv) / (maxGmv - minGmv);
                    
                    // 圆圈大小：最小8px，最大28px
                    const circleSize = 8 + normalizedValue * 20;
                    
                    // 颜色深度：基于销售额比例
                    const opacity = 0.3 + normalizedValue * 0.7;
                    
                    // 计算该时段在当日的占比
                    const dayPercentage = ((dataPoint.gmv / dayTotalGmv) * 100).toFixed(1);
                    
                    return (
                       <AntTooltip
                         key={`${day}-${hour}`}
                         title={
                           <div style={{ textAlign: 'center' }}>
                             <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                               {day} {hour}:00
                             </div>
                             <div style={{ color: '#1890ff', fontSize: '14px', fontWeight: 'bold' }}>
                               销售额: ¥{dataPoint.gmv.toFixed(2)}
                             </div>
                             <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>
                               当日占比: {dayPercentage}%
                             </div>
                           </div>
                         }
                         placement="top"
                         overlayStyle={{
                           maxWidth: '200px'
                         }}
                       >
                         <div 
                           style={{ 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             position: 'relative',
                             cursor: 'pointer'
                           }}
                         >
                           <div
                             style={{
                               width: `${circleSize}px`,
                               height: `${circleSize}px`,
                               borderRadius: '50%',
                               backgroundColor: `rgba(24, 144, 255, ${opacity})`,
                               transition: 'all 0.2s ease',
                               border: '1px solid rgba(24, 144, 255, 0.3)'
                             }}
                             onMouseEnter={(e) => {
                               e.currentTarget.style.transform = 'scale(1.2)';
                               e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.4)';
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.transform = 'scale(1)';
                               e.currentTarget.style.boxShadow = 'none';
                             }}
                           />
                         </div>
                       </AntTooltip>
                     );
                  })}
                </React.Fragment>
              );
            })}
          </div>
          
          {/* 图例 */}
          <div style={{ 
            position: 'absolute', 
            bottom: '10px', 
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#8c8c8c'
          }}>
            <span>销售额:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(24, 144, 255, 0.3)' 
              }}></div>
              <span>低</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(24, 144, 255, 0.6)' 
              }}></div>
              <span>中</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(24, 144, 255, 1)' 
              }}></div>
              <span>高</span>
            </div>
          </div>
          </div>
          
          {/* 右侧周销售额图表 */}
          <div style={{ width: '300px', padding: '20px 0' }}>
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid #f0f0f0',
              borderRadius: '6px',
              padding: '16px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#262626',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                销售额周内占比
              </div>
              
              {/* 周销售额柱状图 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, dayIndex) => {
                  // 模拟每天的销售额数据
                  const baseDayGmv = currentActivity.gmv / 7;
                  const dayMultiplier = dayIndex === 5 || dayIndex === 6 ? 1.2 : 1.0; // 周末销售更好
                  const randomFactor = 0.8 + Math.random() * 0.4; // 随机因子
                  const dayTotalGmv = baseDayGmv * dayMultiplier * randomFactor;
                  
                  // 计算一周的销售额总和，用于占比计算
                  const weekTotalGmv = currentActivity.gmv;
                  
                  const percentage = weekTotalGmv > 0 ? (dayTotalGmv / weekTotalGmv) * 100 : 0;
                  const barWidth = Math.max(percentage, 5); // 最小宽度5%
                  
                  return (
                    <div key={day} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      height: '32px'
                    }}>
                      <div style={{ 
                        width: '32px', 
                        fontSize: '12px', 
                        color: '#595959',
                        textAlign: 'right'
                      }}>
                        {day}
                      </div>
                      
                      <div style={{ 
                        flex: 1, 
                        height: '20px', 
                        backgroundColor: '#f5f5f5',
                        borderRadius: '10px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${barWidth}%`,
                          height: '100%',
                          backgroundColor: dayIndex === 5 || dayIndex === 6 ? '#52c41a' : '#1890ff', // 周末用绿色
                          borderRadius: '10px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        />
                      </div>
                      
                      <div style={{ 
                        width: '60px', 
                        fontSize: '11px', 
                        color: '#8c8c8c',
                        textAlign: 'right'
                      }}>
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
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
        </div>
      </Card>

      {/* 5. 零售商 */}
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title="零售商" 
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={retailerColumns}
              dataSource={currentRetailers}
              pagination={false}
              size="small"
              rowKey="id"
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Pagination
                current={retailerPage}
                total={filteredRetailers.length}
                pageSize={retailerPageSize}
                onChange={setRetailerPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 5.5. 小店 */}
      {smallStores.length > 0 && (
        <Row gutter={16}>
          <Col span={24}>
            <Card 
              title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>门店</span>
                {/* 排序功能说明，仅对精明购业务角色可见，客户账号不可见 */}
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal' }}>
                  （仅支付宝活动有阔店维度，平台回传，仅供参考）
                </Text>
              </div>
            } 
              style={{ marginBottom: 16 }}
            >
              <Table
                 columns={smallStoreColumns}
                 dataSource={currentSmallStores}
                 pagination={false}
                 size="small"
                 rowKey="id"
               />
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Pagination
                  current={smallStorePage}
                  total={smallStores.length}
                  pageSize={smallStorePageSize}
                  onChange={setSmallStorePage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                />
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* 6. 商品 */}
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>商品</span>
                {/* 排序功能说明，仅对精明购业务角色可见，客户账号不可见 */}
                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal' }}>
                  （排序功能为精明购业务角色可用，客户账号只可见排序结果）
                </Text>
              </div>
            } 
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={productColumns}
              dataSource={currentProducts}
              pagination={false}
              size="small"
              rowKey="id"
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Pagination
                current={productPage}
                total={sortedProducts.length}
                pageSize={productPageSize}
                onChange={setProductPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 趋势弹窗 */}
      <Modal
        title={`${selectedRetailerTrend?.name} - 趋势分析`}
        open={trendModalVisible}
        onCancel={closeTrendModal}
        footer={null}
        width={800}
      >
        {selectedRetailerTrend && dateRange && dateRange[0] && dateRange[1] && (
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={selectedRetailerTrend.trend.sales.map((sales: number, index: number) => {
                  const startDate = dateRange[0]!;
                  const endDate = dateRange[1]!;
                  const totalDays = endDate.diff(startDate, 'day');
                  const intervalDays = Math.floor(totalDays / (selectedRetailerTrend.trend.sales.length - 1));
                  const currentDate = startDate.add(index * intervalDays, 'day');
                  
                  // 计算销售额占比（当前零售商销售额占总销售额的百分比）
                  const totalGmv = mockRetailers.reduce((sum, retailer) => sum + retailer.gmv, 0);
                  const contributionRate = ((sales * 10000) / totalGmv) * 100;
                  
                  return {
                    period: currentDate.format('MM-DD'),
                    sales: sales * 10000,
                    discount: selectedRetailerTrend.trend.discount[index] * 10000,
                    contributionRate: contributionRate
                  };
                })}
                margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" label={{ value: '销售额 (万元)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '销售额占比 (%)', angle: 90, position: 'insideRight' }} />
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => {
                    const dataKey = props.dataKey;
                    if (dataKey === 'sales') {
                      return [`${(value / 10000).toFixed(1)}万元`, '销售额'];
                    } else if (dataKey === 'contributionRate') {
                      return [`${value.toFixed(2)}%`, '销售额占比'];
                    }
                    return [`${(value / 10000).toFixed(1)}万元`, '优惠金额'];
                  }}
                />
                <Legend />
                <RechartsLine 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  name="销售额"
                  strokeWidth={2}
                />
                <RechartsLine 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="contributionRate" 
                  stroke="#ff7300" 
                  name="销售额占比"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>

      {/* 商品趋势弹窗 */}
      <Modal
        title={`${selectedProductTrend?.name} - 趋势分析`}
        open={productTrendModalVisible}
        onCancel={closeProductTrendModal}
        footer={null}
        width={800}
      >
        {selectedProductTrend && dateRange && dateRange[0] && dateRange[1] && (
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={selectedProductTrend.trend.sales.map((sales: number, index: number) => {
                  const startDate = dateRange[0]!;
                  const endDate = dateRange[1]!;
                  const totalDays = endDate.diff(startDate, 'day');
                  const intervalDays = Math.floor(totalDays / (selectedProductTrend.trend.sales.length - 1));
                  const currentDate = startDate.add(index * intervalDays, 'day');
                  
                  // 计算销售额占比（当前商品销售额占总销售额的百分比）
                  const totalGmv = mockProducts.reduce((sum, product) => sum + product.gmv, 0);
                  const contributionRate = ((sales * 10000) / totalGmv) * 100;
                  
                  return {
                    period: currentDate.format('MM-DD'),
                    sales: sales * 10000,
                    discount: selectedProductTrend.trend.discount[index] * 10000,
                    contributionRate: contributionRate
                  };
                })}
                margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" label={{ value: '销售额 (万元)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: '销售额占比 (%)', angle: 90, position: 'insideRight' }} />
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => {
                    const dataKey = props.dataKey;
                    if (dataKey === 'sales') {
                      return [`${(value / 10000).toFixed(1)}万元`, '销售额'];
                    } else if (dataKey === 'contributionRate') {
                      return [`${value.toFixed(2)}%`, '销售额占比'];
                    }
                    return [`${(value / 10000).toFixed(1)}万元`, '优惠金额'];
                  }}
                />
                <Legend />
                <RechartsLine 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  name="销售额"
                  strokeWidth={2}
                />
                <RechartsLine 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="contributionRate" 
                  stroke="#ff7300" 
                  name="销售额占比"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActivityAnalysis;