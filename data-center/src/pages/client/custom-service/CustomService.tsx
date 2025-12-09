import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Typography, Select, Tooltip } from 'antd';
import { SearchOutlined, LinkOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

// 报表数据接口
interface ReportItem {
  id: string;
  name: string;
  description: string;
  url: string;
  createTime: string;
  validTime: string; // 报表有效时间
  category: string; // 业务分类：到店营销、即时零售、物码营销
}

// 可用的报表链接
const reportUrls = [
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=2b2a4ccf-582e-4072-a98e-f6411df63f68&accessTicket=76ff1515-8996-4659-b057-460e87cdf378&dd_orientation=auto',
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=03189d09-d197-443f-8294-7408abeffff5&accessTicket=c0eb7673-cc3e-4187-a374-2bc7a2894e75&dd_orientation=auto',
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=e26f92d1-2c6d-4f97-920a-a2027bb79b8e&accessTicket=75df7a5b-1bdb-409e-ab26-b06d606c2d8f&dd_orientation=auto',
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=f16ff422-d0c6-4578-a698-7e7cf431128c&accessTicket=58eb5fd8-7a51-4882-af2c-1c32b8795410&dd_orientation=auto',
  'https://quickbi.ismartgo.cn/token3rd/dashboard/view/pc.htm?pageId=246be602-44ff-46b1-9857-afde762b264d&accessTicket=1d7a294f-386d-4ecc-b98a-c69019f3b91b&dd_orientation=auto',
];

// 随机选择链接的函数
const getRandomUrl = () => {
  return reportUrls[Math.floor(Math.random() * reportUrls.length)];
};

// 模拟报表数据
const mockReports: ReportItem[] = [
  {
    id: '1',
    name: '到店营销销售数据分析看板',
    description: '全面展示到店营销活动的销售数据、核销情况、渠道分布等关键指标',
    url: getRandomUrl(),
    createTime: '2025-12-01',
    validTime: '2025-12-01 至 2026-12-01',
    category: '到店营销',
  },
  {
    id: '2',
    name: '即时零售平台运营报表',
    description: '美团闪购、饿了么等即时零售平台的订单分析、GMV趋势、ROI分析',
    url: getRandomUrl(),
    createTime: '2025-11-28',
    validTime: '2025-11-28 至 2026-11-28',
    category: '即时零售',
  },
  {
    id: '3',
    name: '物码营销用户行为分析',
    description: '扫码用户行为轨迹、转化漏斗、地域分布等深度分析',
    url: getRandomUrl(),
    createTime: '2025-11-25',
    validTime: '2025-11-25 至 2026-11-25',
    category: '物码营销',
  },
  {
    id: '4',
    name: '全渠道营销效果对比看板',
    description: '对比分析不同渠道的营销效果，包括微信、支付宝、抖音等平台数据',
    url: getRandomUrl(),
    createTime: '2025-11-20',
    validTime: '2025-11-20 至 2026-11-20',
    category: '到店营销',
  },
  {
    id: '5',
    name: '门店核销明细报表',
    description: '详细展示各门店的核销数据、排名、趋势分析',
    url: getRandomUrl(),
    createTime: '2025-11-15',
    validTime: '2025-11-15 至 2026-11-15',
    category: '到店营销',
  },
  {
    id: '6',
    name: '即时零售商品销售排行',
    description: '实时展示即时零售平台商品销售排行、库存预警、价格监控',
    url: getRandomUrl(),
    createTime: '2025-11-10',
    validTime: '2025-11-10 至 2026-11-10',
    category: '即时零售',
  },
];

const CustomService: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState<ReportItem[]>([]);
  const [allReports, setAllReports] = useState<ReportItem[]>([]); // 所有报表（已排序）
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string>('');

  // 初始化：按创建时间倒序排序
  useEffect(() => {
    const sorted = [...mockReports].sort((a, b) => {
      return dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf();
    });
    setAllReports(sorted);
    setFilteredReports(sorted);
  }, []);

  // 组件卸载时清理全屏预览类名
  useEffect(() => {
    return () => {
      // 组件卸载时确保移除全屏预览类名
      document.body.classList.remove('fullscreen-preview');
    };
  }, []);

  // 筛选报表
  const handleSearch = (value: string) => {
    setSearchText(value);
    let filtered = [...mockReports];
    
    if (value) {
      filtered = filtered.filter(report => 
        report.name.toLowerCase().includes(value.toLowerCase())
      );
    }
    
    // 按创建时间倒序排序
    filtered.sort((a, b) => {
      return dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf();
    });
    
    setFilteredReports(filtered);
  };

  // 在新窗口打开报表
  const handleOpenInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 进入全屏预览（默认选择第一个报表）
  const handleEnterFullscreen = () => {
    if (allReports.length > 0) {
      const firstReport = allReports[0];
      setSelectedReport(firstReport);
      setSelectedReportId(firstReport.id);
      setIsFullscreen(true);
      // 隐藏系统菜单（通过添加类名到 body）
      document.body.classList.add('fullscreen-preview');
    }
  };

  // 退出全屏预览
  const handleExitFullscreen = () => {
    // 先恢复系统菜单
    document.body.classList.remove('fullscreen-preview');
    // 然后更新状态
    setIsFullscreen(false);
    setSelectedReport(null);
    setSelectedReportId('');
  };

  // 在全屏模式下切换报表
  const handleSwitchReport = (reportId: string) => {
    const report = allReports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setSelectedReportId(reportId);
    }
  };

  // 表格列定义
  const columns: ColumnsType<ReportItem> = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text: string) => (
        <div style={{ fontWeight: 500 }}>{text}</div>
      ),
    },
    {
      title: '报表有效时间',
      dataIndex: 'validTime',
      key: 'validTime',
      width: '25%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      render: (text: string) => {
        const maxLength = 20;
        const displayText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        return (
          <Tooltip title={text.length > maxLength ? text : ''}>
            <div style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}>
              {displayText}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (_: any, record: ReportItem) => (
        <Button
          type="link"
          icon={<LinkOutlined />}
          size="small"
          onClick={() => handleOpenInNewTab(record.url)}
        >
          查看
        </Button>
      ),
    },
  ];

  // 全屏预览模式
  if (isFullscreen && selectedReport) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 全屏预览头部 */}
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
          zIndex: 10000
        }}>
          <Space size="middle">
            <Select
              value={selectedReportId}
              onChange={handleSwitchReport}
              style={{ width: 300 }}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {allReports.map(report => (
                <Option key={report.id} value={report.id}>
                  {report.name}
                </Option>
              ))}
            </Select>
            <span style={{ color: '#8c8c8c' }}>{selectedReport.validTime}</span>
          </Space>
          <Button
            icon={<FullscreenExitOutlined />}
            onClick={handleExitFullscreen}
          >
            退出全屏
          </Button>
        </div>
        
        {/* 报表内容区域 */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <iframe
            src={selectedReport.url}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title={selectedReport.name}
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // 正常列表模式
  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>专属定制报表</Title>
        <Button
          icon={<FullscreenOutlined />}
          onClick={handleEnterFullscreen}
          disabled={allReports.length === 0}
        >
          全屏预览
        </Button>
      </div>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <Input
            placeholder="搜索报表名称"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        </Space>
      </Card>

      {/* 报表列表 */}
      <Card>
        <Table<ReportItem>
          columns={columns}
          dataSource={filteredReports}
          rowKey="id"
          pagination={{
            total: filteredReports.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default CustomService;
