import React from 'react';
import { Empty, List, Tabs, Tag, Button } from 'antd';
import { DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { ArtifactItem, AttachmentItem, FORMAT_LABEL } from '../../../services/aiMock';

interface Props {
  artifacts: ArtifactItem[];
  attachments: AttachmentItem[];
  onRemoveAttachment?: (id: string) => void;
  onOpenArtifact?: (item: ArtifactItem) => void;
}

/** 当前会话的产物与上传附件管理 */
const SessionAssetPanel: React.FC<Props> = ({
  artifacts,
  attachments,
  onRemoveAttachment,
  onOpenArtifact,
}) => {
  return (
    <div className="ai-wb-session-assets">
      <Tabs
        size="small"
        items={[
          {
            key: 'artifacts',
            label: `本会话产物 (${artifacts.length})`,
            children:
              artifacts.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无产物" />
              ) : (
                <List
                  size="small"
                  dataSource={artifacts}
                  renderItem={(item) => (
                    <List.Item
                      style={{ cursor: onOpenArtifact ? 'pointer' : 'default' }}
                      onClick={() => onOpenArtifact?.(item)}
                    >
                      <List.Item.Meta
                        title={
                          <span>
                            <Tag>
                              {item.format ? FORMAT_LABEL[item.format] : item.type}
                            </Tag>{' '}
                            {item.title}
                          </span>
                        }
                        description={`${item.createdAt} · ${item.summary}`}
                      />
                    </List.Item>
                  )}
                />
              ),
          },
          {
            key: 'files',
            label: `本会话附件 (${attachments.length})`,
            children:
              attachments.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无上传附件" />
              ) : (
                <List
                  size="small"
                  dataSource={attachments}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        onRemoveAttachment ? (
                          <Button
                            key="del"
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveAttachment(item.id)}
                          />
                        ) : null,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileOutlined className="ai-wb-icon-accent" style={{ fontSize: 18 }} />}
                        title={item.name}
                        description={`${item.size} · ${item.createdAt}`}
                      />
                    </List.Item>
                  )}
                />
              ),
          },
        ]}
      />
    </div>
  );
};

export default SessionAssetPanel;
