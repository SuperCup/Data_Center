import React, { useState } from 'react';
import { Table, Card, Typography, Button, Space, Tag, Pagination } from 'antd';
import { DownloadOutlined, EyeOutlined, FolderOutlined, FileOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

// 文件数据接口
interface FileItem {
  key: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string; // 文件类型：png, zip等
  createTime: string;
  creator: string;
  children?: FileItem[]; // 子文件/文件夹
}

// 模拟文件数据
const mockFileData: FileItem[] = [
  {
    key: '1',
    name: '测试',
    type: 'folder',
    createTime: '2025-12-09 09:58:32',
    creator: '赵露明',
    children: [
      {
        key: '1-1',
        name: '子文件1',
        type: 'file',
        fileType: 'txt',
        createTime: '2025-12-09 10:00:00',
        creator: '赵露明',
      },
      {
        key: '1-2',
        name: '子文件2',
        type: 'file',
        fileType: 'pdf',
        createTime: '2025-12-09 10:01:00',
        creator: '赵露明',
      },
    ],
  },
  {
    key: '2',
    name: 'bg',
    type: 'file',
    fileType: 'png',
    createTime: '2025-12-09 09:58:51',
    creator: '赵露明',
  },
  {
    key: '3',
    name: '大文件测试',
    type: 'file',
    fileType: 'zip',
    createTime: '2025-06-13 11:41:34',
    creator: '赵露明',
  },
  {
    key: '4',
    name: 'ai_project',
    type: 'file',
    fileType: 'zip',
    createTime: '2025-06-09 10:42:52',
    creator: '赵露明',
  },
];

const FileDelivery: React.FC = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 处理展开/收起
  const handleExpand = (expanded: boolean, record: FileItem) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.key]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.key));
    }
  };

  // 获取文件类型标签颜色
  const getFileTypeColor = (fileType?: string) => {
    const colorMap: { [key: string]: string } = {
      folder: 'orange',
      png: 'blue',
      zip: 'purple',
      pdf: 'red',
      txt: 'default',
    };
    return colorMap[fileType || 'default'] || 'default';
  };

  // 表格列定义
  const columns: ColumnsType<FileItem> = [
    {
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text: string, record: FileItem) => (
        <Space>
          {record.type === 'folder' ? (
            <FolderOutlined style={{ color: '#fa8c16' }} />
          ) : (
            <FileOutlined style={{ color: '#1890ff' }} />
          )}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '文件类型',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
      render: (type: string, record: FileItem) => {
        const displayType = type === 'folder' ? '文件夹' : (record.fileType || '未知');
        return (
          <Tag color={getFileTypeColor(record.type === 'folder' ? 'folder' : record.fileType)}>
            {displayType}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '25%',
    },
    {
      title: '创建用户',
      dataIndex: 'creator',
      key: 'creator',
      width: '15%',
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (_: any, record: FileItem) => {
        if (record.type === 'folder') {
          return null; // 文件夹不显示操作按钮
        }
        return (
          <Space size="middle">
            <Button
              type="link"
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => {
                console.log('下载文件:', record.name);
                // 实现下载逻辑
              }}
            >
              下载文件
            </Button>
            <Button
              type="link"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                console.log('预览文件:', record.name);
                // 实现预览逻辑
              }}
            >
              预览文件
            </Button>
          </Space>
        );
      },
    },
  ];

  // 计算当前页的数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = mockFileData.slice(startIndex, endIndex);

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>我的文件</Title>
      </div>

      {/* 文件列表 */}
      <Card>
        <Table<FileItem>
          columns={columns}
          dataSource={currentData}
          rowKey="key"
          pagination={false}
          expandable={{
            expandedRowKeys,
            onExpand: (expanded, record) => {
              handleExpand(expanded, record as FileItem);
            },
            expandIcon: ({ expanded, onExpand, record }) => {
              if ((record as FileItem).type !== 'folder') {
                return null;
              }
              return (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand(record, e);
                  }}
                  style={{ cursor: 'pointer', marginRight: 8 }}
                >
                  {expanded ? <DownOutlined /> : <RightOutlined />}
                </span>
              );
            },
            childrenColumnName: 'children',
          }}
        />

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={currentPage}
            total={mockFileData.length}
            pageSize={pageSize}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `共 ${total} 条记录`}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Card>
    </div>
  );
};

export default FileDelivery;
