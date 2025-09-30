import React, { useState } from 'react';
import { Card, Table, Input, Select, Button, Space, Tag, Typography } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

interface ProductData {
  key: string;
  productId: string;
  productName: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  createTime: string;
}

const mockProductData: ProductData[] = [
  {
    key: '1',
    productId: '6901028089303',
    productName: '康师傅红烧牛肉面',
    category: '方便面',
    brand: '康师傅',
    price: 4.5,
    stock: 1200,
    status: '在售',
    createTime: '2024-01-15'
  },
  {
    key: '2',
    productId: '6901028089306',
    productName: '康师傅鲜虾鱼板面',
    category: '方便面',
    brand: '康师傅',
    price: 5.0,
    stock: 800,
    status: '在售',
    createTime: '2024-01-20'
  },
  {
    key: '3',
    productId: '6901028089312',
    productName: '康师傅冰红茶',
    category: '饮料',
    brand: '康师傅',
    price: 3.5,
    stock: 2000,
    status: '在售',
    createTime: '2024-02-01'
  },
  {
    key: '4',
    productId: '6901028089311',
    productName: '康师傅绿茶',
    category: '饮料',
    brand: '康师傅',
    price: 3.0,
    stock: 1500,
    status: '在售',
    createTime: '2024-02-05'
  },
  {
    key: '5',
    productId: '6901028089305',
    productName: '康师傅酸菜牛肉面',
    category: '方便面',
    brand: '康师傅',
    price: 4.8,
    stock: 0,
    status: '缺货',
    createTime: '2024-01-10'
  }
];

const ProductList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredData, setFilteredData] = useState<ProductData[]>(mockProductData);

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, selectedCategory);
  };

  const filterData = (search: string, category: string) => {
    let filtered = mockProductData;

    if (search) {
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.productId.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: '商品69码',
      dataIndex: 'productId',
      key: 'productId',
      width: 100,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
    },
    {
      title: '价格(元)',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
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
            placeholder="选择分类"
            style={{ width: 120 }}
            value={selectedCategory}
            onChange={(value) => {
              setSelectedCategory(value);
              filterData(searchText, value);
            }}
            allowClear
          >
            <Option value="方便面">方便面</Option>
            <Option value="饮料">饮料</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          >
            导出数据
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default ProductList;