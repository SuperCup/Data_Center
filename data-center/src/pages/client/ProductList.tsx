import React, { useState } from 'react';
import { Card, Table, Input, Select, Button, Space, Tag, Typography, Modal } from 'antd';
import { SearchOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

// 零售商内码数据接口
interface RetailerCode {
  retailer: string;
  region: string;
  province: string;
  city: string;
  code: string;
}

// 零售商价格数据接口
interface RetailerPrice {
  retailer: string;
  region: string;
  code: string;
  price: number;
}

interface ProductData {
  key: string;
  productCode69: string;        // 商品69码
  productName: string;          // 商品名称
  retailerCodes: RetailerCode[];  // 零售商内码（一对多）
  brand: string;                // 品牌
  internationalBrand: string;   // 国际品牌
  packaging: string;            // 包装
  specification: string;        // 规格
  specificationUnit: string;    // 规格单位
  category: string;             // 品类
  standardPrice: number;        // 标准价格
  retailerPrices: RetailerPrice[]; // 零售商价格（一对多）
  isKeyMainUPC: boolean;        // 是否重点主UPC
}

const mockProductData: ProductData[] = [
  {
    key: '1',
    productCode69: '6901028089303',
    productName: '康师傅红烧牛肉面',
    retailerCodes: [
      { retailer: '华润万家', region: '华东', province: '上海', city: '上海市', code: 'HR001' },
      { retailer: '永辉超市', region: '华东', province: '江苏', city: '南京市', code: 'YH001' },
      { retailer: '家乐福', region: '华南', province: '广东', city: '深圳市', code: 'JLF001' }
    ],
    brand: '康师傅',
    internationalBrand: 'Master Kong',
    packaging: '袋装',
    specification: '100',
    specificationUnit: 'g',
    category: '方便面',
    standardPrice: 4.5,
    retailerPrices: [
      { retailer: '华润万家', region: '华东', code: 'HR001', price: 4.2 },
      { retailer: '永辉超市', region: '华东', code: 'YH001', price: 4.3 },
      { retailer: '家乐福', region: '华南', code: 'JLF001', price: 4.0 }
    ],
    isKeyMainUPC: true
  },
  {
    key: '2',
    productCode69: '6901028089306',
    productName: '康师傅鲜虾鱼板面',
    retailerCodes: [
      { retailer: '沃尔玛', region: '华东', province: '上海', city: '上海市', code: 'WM002' },
      { retailer: '大润发', region: '华北', province: '北京', city: '北京市', code: 'DRF002' }
    ],
    brand: '康师傅',
    internationalBrand: 'Master Kong',
    packaging: '袋装',
    specification: '105',
    specificationUnit: 'g',
    category: '方便面',
    standardPrice: 5.0,
    retailerPrices: [
      { retailer: '沃尔玛', region: '华东', code: 'WM002', price: 4.8 },
      { retailer: '大润发', region: '华北', code: 'DRF002', price: 4.9 }
    ],
    isKeyMainUPC: false
  },
  {
    key: '3',
    productCode69: '6901028089312',
    productName: '康师傅冰红茶',
    retailerCodes: [
      { retailer: '芙蓉兴盛', region: '华东', province: '浙江', city: '杭州市', code: 'FRXS003' },
      { retailer: '华润万家', region: '华东', province: '江苏', city: '苏州市', code: 'HR003' },
      { retailer: '永辉超市', region: '华南', province: '广东', city: '广州市', code: 'YH003' },
      { retailer: '家乐福', region: '华北', province: '北京', city: '北京市', code: 'JLF003' }
    ],
    brand: '康师傅',
    internationalBrand: 'Master Kong',
    packaging: '瓶装',
    specification: '500',
    specificationUnit: 'ml',
    category: '饮料',
    standardPrice: 3.5,
    retailerPrices: [
      { retailer: '芙蓉兴盛', region: '华东', code: 'FRXS003', price: 3.2 },
      { retailer: '华润万家', region: '华东', code: 'HR003', price: 3.3 },
      { retailer: '永辉超市', region: '华南', code: 'YH003', price: 3.0 },
      { retailer: '家乐福', region: '华北', code: 'JLF003', price: 3.1 }
    ],
    isKeyMainUPC: true
  },
  {
    key: '4',
    productCode69: '6901028089311',
    productName: '康师傅绿茶',
    retailerCodes: [
      { retailer: '沃尔玛', region: '华东', province: '上海', city: '上海市', code: 'WM004' },
      { retailer: '大润发', region: '华南', province: '广东', city: '深圳市', code: 'DRF004' }
    ],
    brand: '康师傅',
    internationalBrand: 'Master Kong',
    packaging: '瓶装',
    specification: '500',
    specificationUnit: 'ml',
    category: '饮料',
    standardPrice: 3.0,
    retailerPrices: [
      { retailer: '沃尔玛', region: '华东', code: 'WM004', price: 2.8 },
      { retailer: '大润发', region: '华南', code: 'DRF004', price: 2.9 }
    ],
    isKeyMainUPC: false
  },
  {
    key: '5',
    productCode69: '6901028089305',
    productName: '康师傅酸菜牛肉面',
    retailerCodes: [
      { retailer: '华润万家', region: '华东', province: '江苏', city: '南京市', code: 'HR005' },
      { retailer: '永辉超市', region: '华东', province: '江苏', city: '南京市', code: 'YH005' },
      { retailer: '芙蓉兴盛', region: '华北', province: '北京', city: '北京市', code: 'FRXS005' }
    ],
    brand: '康师傅',
    internationalBrand: 'Master Kong',
    packaging: '袋装',
    specification: '110',
    specificationUnit: 'g',
    category: '方便面',
    standardPrice: 4.8,
    retailerPrices: [
      { retailer: '华润万家', region: '华东', code: 'HR005', price: 4.5 },
      { retailer: '永辉超市', region: '华东', code: 'YH005', price: 4.6 },
      { retailer: '芙蓉兴盛', region: '华北', code: 'FRXS005', price: 4.3 }
    ],
    isKeyMainUPC: true
  }
];

const ProductList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredData, setFilteredData] = useState<ProductData[]>(mockProductData);
  const [retailerCodeModalVisible, setRetailerCodeModalVisible] = useState(false);
  const [retailerPriceModalVisible, setRetailerPriceModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, selectedCategory);
  };

  const filterData = (search: string, category: string) => {
    let filtered = mockProductData;

    if (search) {
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.productCode69.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }

    setFilteredData(filtered);
  };

  const showRetailerCodeModal = (product: ProductData) => {
    setSelectedProduct(product);
    setRetailerCodeModalVisible(true);
  };

  const showRetailerPriceModal = (product: ProductData) => {
    setSelectedProduct(product);
    setRetailerPriceModalVisible(true);
  };

  const retailerCodeColumns = [
    {
      title: '零售商名称',
      dataIndex: 'retailer',
      key: 'retailer',
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '内码',
      dataIndex: 'code',
      key: 'code',
    },
  ];

  const retailerPriceColumns = [
    {
      title: '零售商名称',
      dataIndex: 'retailer',
      key: 'retailer',
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '内码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '价格(元)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
  ];

  const columns = [
    {
      title: '商品69码',
      dataIndex: 'productCode69',
      key: 'productCode69',
      width: 120,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: '零售商内码',
      key: 'retailerCodes',
      width: 120,
      render: (record: ProductData) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => showRetailerCodeModal(record)}
        >
          查看({record.retailerCodes.length})
        </Button>
      ),
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
    },
    {
      title: '国际品牌',
      dataIndex: 'internationalBrand',
      key: 'internationalBrand',
      width: 120,
    },
    {
      title: '包装',
      dataIndex: 'packaging',
      key: 'packaging',
      width: 80,
    },
    {
      title: '规格',
      key: 'specification',
      width: 100,
      render: (record: ProductData) => `${record.specification}${record.specificationUnit}`,
    },
    {
      title: '品类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '标准价格(元)',
      dataIndex: 'standardPrice',
      key: 'standardPrice',
      width: 120,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '零售商价格',
      key: 'retailerPrices',
      width: 120,
      render: (record: ProductData) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => showRetailerPriceModal(record)}
        >
          查看({record.retailerPrices.length})
        </Button>
      ),
    },
    {
      title: '是否重点主UPC',
      dataIndex: 'isKeyMainUPC',
      key: 'isKeyMainUPC',
      width: 120,
      render: (isKeyMainUPC: boolean) => (
        <Tag color={isKeyMainUPC ? 'green' : 'default'}>
          {isKeyMainUPC ? '是' : '否'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>商品清单</Title>
      </div>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <Input
            placeholder="搜索商品名称或69码"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="选择品类"
            value={selectedCategory}
            onChange={(value) => {
              setSelectedCategory(value);
              filterData(searchText, value);
            }}
            style={{ width: 150 }}
            allowClear
          >
            <Option value="方便面">方便面</Option>
            <Option value="饮料">饮料</Option>
          </Select>
          <Button icon={<DownloadOutlined />}>导出</Button>
        </Space>
      </Card>

      {/* 商品表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 零售商内码弹窗 */}
      <Modal
        title={selectedProduct ? `${selectedProduct.productName} (${selectedProduct.productCode69}) - 零售商内码` : '零售商内码'}
        visible={retailerCodeModalVisible}
        onCancel={() => setRetailerCodeModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={retailerCodeColumns}
          dataSource={selectedProduct?.retailerCodes || []}
          pagination={false}
          size="small"
        />
      </Modal>

      {/* 零售商价格弹窗 */}
      <Modal
        title={selectedProduct ? `${selectedProduct.productName} (${selectedProduct.productCode69}) - 零售商价格` : '零售商价格'}
        visible={retailerPriceModalVisible}
        onCancel={() => setRetailerPriceModalVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          columns={retailerPriceColumns}
          dataSource={selectedProduct?.retailerPrices || []}
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default ProductList;