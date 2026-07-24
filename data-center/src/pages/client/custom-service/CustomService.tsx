import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Typography, Select, Tooltip } from 'antd';
import { SearchOutlined, LinkOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { CustomReportItem, MOUNTED_CUSTOM_REPORTS } from '../../../services/customReports';

const { Title } = Typography;
const { Option } = Select;

type ReportItem = CustomReportItem;

const CustomService: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState<ReportItem[]>([]);
  const [allReports, setAllReports] = useState<ReportItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string>('');

  useEffect(() => {
    const sorted = [...MOUNTED_CUSTOM_REPORTS].sort((a, b) => {
      return dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf();
    });
    setAllReports(sorted);
    setFilteredReports(sorted);
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove('fullscreen-preview');
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    let filtered = [...MOUNTED_CUSTOM_REPORTS];

    if (value) {
      filtered = filtered.filter((report) =>
        report.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      return dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf();
    });

    setFilteredReports(filtered);
  };

  const handleOpenInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEnterFullscreen = () => {
    if (allReports.length > 0) {
      const firstReport = allReports[0];
      setSelectedReport(firstReport);
      setSelectedReportId(firstReport.id);
      setIsFullscreen(true);
      document.body.classList.add('fullscreen-preview');
    }
  };

  const handleExitFullscreen = () => {
    document.body.classList.remove('fullscreen-preview');
    setIsFullscreen(false);
    setSelectedReport(null);
    setSelectedReportId('');
  };

  const handleSwitchReport = (reportId: string) => {
    const report = allReports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setSelectedReportId(reportId);
    }
  };

  const columns: ColumnsType<ReportItem> = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text: string) => <div style={{ fontWeight: 500 }}>{text}</div>,
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
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
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
      render: (_: unknown, record: ReportItem) => (
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

  if (isFullscreen && selectedReport) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff',
            zIndex: 10000,
          }}
        >
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
              {allReports.map((report) => (
                <Option key={report.id} value={report.id}>
                  {report.name}
                </Option>
              ))}
            </Select>
            <span style={{ color: '#8c8c8c' }}>{selectedReport.validTime}</span>
          </Space>
          <Button icon={<FullscreenExitOutlined />} onClick={handleExitFullscreen}>
            退出全屏
          </Button>
        </div>

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

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          专属定制报表
        </Title>
        <Button
          icon={<FullscreenOutlined />}
          onClick={handleEnterFullscreen}
          disabled={allReports.length === 0}
        >
          全屏预览
        </Button>
      </div>

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
