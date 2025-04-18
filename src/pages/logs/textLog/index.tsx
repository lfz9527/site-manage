import {
  getLogGetTextLogDetails,
  getLogGetTextLogList,
  postLogDeleteTextLog,
} from '@/services/api/log';
import { formatSize } from '@/utils';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import { useRef, useState } from 'react';

interface TableItem {
  fileName: string;
  size: string;
}

export default () => {
  const actionRef = useRef<ActionType>();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [logItem, setLogItem] = useState<TableItem>({} as TableItem);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleDeleteLog = async (record: TableItem) => {
    Modal.confirm({
      title: '提示',
      content: '确定删除该日志文件吗？',
      centered: true,
      onOk: async () => {
        await postLogDeleteTextLog({ filename: record.fileName });
        messageApi.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const handleDownloadLog = async (record: TableItem) => {
    const a = document.createElement('a');
    a.href = `/api/Log/GetTextLogDetails?filename=${record.fileName}`;
    a.download = record.fileName;
    a.click();
  };

  const handlePreviewLog = async (record: TableItem) => {
    setLogItem(record);
    try {
      const { data } = await getLogGetTextLogDetails({
        filename: record.fileName,
      });
      // 提取并格式化日志内容
      const logContent = data
        .split('\n')
        .map((line: string) => {
          // 匹配时间戳部分
          const timeMatch = line.match(/\[(.*?)\]/);
          if (timeMatch) {
            return line.replace(
              timeMatch[0],
              `<span style="color: #1677ff">${timeMatch[0]}</span>`,
            );
          }
          return line;
        })
        .join('<br/>');

      setPreviewContent(logContent);
      setPreviewTitle(record.fileName);
      setPreviewVisible(true);
    } catch (error) {
      messageApi.error('获取日志内容失败');
    }
  };

  const refreshLog = () => {
    handlePreviewLog(logItem);
  };

  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '日志文件',
      dataIndex: 'fileName',
      search: false,
    },
    {
      title: '日志文件大小',
      dataIndex: 'size',
      search: false,
      render: (_, record) => formatSize(record.size),
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 150,
      render: (_, record) =>
        [
          <a key="preview" onClick={() => handlePreviewLog(record)}>
            预览
          </a>,
          <a key="download" onClick={() => handleDownloadLog(record)}>
            下载
          </a>,
          <a
            key="delete"
            style={{ color: 'red' }}
            onClick={() => handleDeleteLog(record)}
          >
            删除
          </a>,
        ].filter(Boolean),
    },
  ];

  return (
    <>
      <ProTable<TableItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          const { data } = await getLogGetTextLogList({
            page: params.current,
            count: params.pageSize,
          });
          return {
            data: data.map((file: any) => {
              return {
                ...file,
              };
            }),
            success: true,
            total: data.length,
          };
        }}
        rowKey="fileName"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: () => {
            actionRef.current?.clearSelected?.();
          },
        }}
        search={false}
        dateFormatter="string"
      />
      <Modal
        title={previewTitle}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={1200}
        centered
      >
        <div
          dangerouslySetInnerHTML={{ __html: previewContent }}
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: '14px',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            maxHeight: '70vh',
            overflow: 'auto',
            lineHeight: '1.6',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 20,
          }}
        >
          <Button type="primary" onClick={refreshLog}>
            刷新日志
          </Button>
        </div>
      </Modal>
      {messageContextHolder}
    </>
  );
};
