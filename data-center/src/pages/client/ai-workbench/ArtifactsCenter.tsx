import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Empty, Input, Modal, Row, Segmented, Space, Tag, Typography } from 'antd';
import {
  DownloadOutlined,
  FileExcelOutlined,
  FileMarkdownOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  INITIAL_ARTIFACTS,
  ArtifactItem,
  ArtifactFormat,
  FORMAT_LABEL,
} from '../../../services/aiMock';
import './aiWorkbench.css';

const { Text, Paragraph, Title } = Typography;

const FORMAT_ICON: Record<ArtifactFormat, React.ReactNode> = {
  html: <FileTextOutlined />,
  md: <FileMarkdownOutlined />,
  xlsx: <FileExcelOutlined />,
};

function renderMdPreview(content: string) {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

const ArtifactsCenter: React.FC = () => {
  const [list] = useState<ArtifactItem[]>(INITIAL_ARTIFACTS);
  const [filter, setFilter] = useState<string>('全部');
  const [keyword, setKeyword] = useState('');
  const [preview, setPreview] = useState<ArtifactItem | null>(null);

  const filtered = useMemo(
    () =>
      list.filter((a) => {
        const formatOk =
          filter === '全部' ||
          (filter === 'HTML' && a.format === 'html') ||
          (filter === 'Markdown' && a.format === 'md') ||
          (filter === 'Excel' && a.format === 'xlsx') ||
          a.type === filter;
        if (!formatOk) return false;
        const q = keyword.trim().toLowerCase();
        if (!q) return true;
        return (
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          (a.type || '').toLowerCase().includes(q)
        );
      }),
    [list, filter, keyword]
  );

  const downloadMd = (art: ArtifactItem) => {
    const blob = new Blob([art.content || art.summary], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = art.title.endsWith('.md') ? art.title : `${art.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadXlsxStub = (art: ArtifactItem) => {
    const csv = `指标,数值\n标题,${art.title}\n摘要,${art.summary}\n来源,${art.source}\n`;
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = art.title.replace(/\.xlsx$/i, '') + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ai-wb-page">
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }} wrap>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            产物仓库
          </Title>
          <Text type="secondary">Agent 生成的 HTML / Markdown / Excel 产物，点击可预览</Text>
        </div>
        <Space wrap>
          <Input.Search
            allowClear
            placeholder="搜索产物标题 / 摘要 / 来源"
            style={{ width: 260 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Segmented
            value={filter}
            onChange={(v) => setFilter(String(v))}
            options={['全部', 'HTML', 'Markdown', 'Excel']}
          />
        </Space>
      </Space>

      {filtered.length === 0 ? (
        <Empty description="暂无产出物" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((a) => (
            <Col xs={24} sm={12} lg={8} key={a.id}>
              <Card
                size="small"
                hoverable
                title={a.title}
                extra={
                  <Tag icon={a.format ? FORMAT_ICON[a.format] : undefined}>
                    {a.format ? FORMAT_LABEL[a.format] : a.type}
                  </Tag>
                }
                onClick={() => setPreview(a)}
              >
                <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                  {a.summary}
                </Paragraph>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  来自「{a.source}」 · {a.createdAt}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        open={!!preview}
        title={preview?.title}
        onCancel={() => setPreview(null)}
        width={preview?.format === 'html' ? '90vw' : 720}
        style={{ top: 24 }}
        styles={{ body: { padding: 0, height: preview?.format === 'html' ? '75vh' : 'auto' } }}
        footer={
          preview?.format === 'md' ? (
            <Button icon={<DownloadOutlined />} onClick={() => preview && downloadMd(preview)}>
              下载 Markdown
            </Button>
          ) : preview?.format === 'xlsx' ? (
            <Button
              icon={<DownloadOutlined />}
              onClick={() => preview && downloadXlsxStub(preview)}
            >
              下载 CSV（模拟 Excel）
            </Button>
          ) : preview?.format === 'html' && preview.url ? (
            <Button type="primary" href={preview.url} target="_blank" rel="noreferrer">
              新窗口打开
            </Button>
          ) : null
        }
        destroyOnClose
      >
        {preview?.format === 'html' && preview.url ? (
          <iframe
            title={preview.title}
            src={preview.url}
            style={{ width: '100%', height: '75vh', border: 'none' }}
          />
        ) : preview?.format === 'md' ? (
          <div
            className="ai-wb-md-preview"
            dangerouslySetInnerHTML={{
              __html: renderMdPreview(preview.content || preview.summary),
            }}
          />
        ) : preview?.format === 'xlsx' ? (
          <div style={{ padding: 24 }}>
            <Paragraph>
              <FileExcelOutlined style={{ color: '#217346', marginRight: 8 }} />
              Excel 产物：{preview.title}
            </Paragraph>
            <Paragraph type="secondary">{preview.summary}</Paragraph>
          </div>
        ) : (
          <div style={{ padding: 24 }}>
            <Paragraph>{preview?.summary}</Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ArtifactsCenter;
