import { Image, ImageWall } from '@/components';
import {
  getGoodGetGoodCategoryById,
  getGoodGetGoodCategoryList,
  getGoodGetGoodCategoryListParent,
  postGoodDeleteGoodCategory,
  postGoodHotGoodCategory,
  postGoodSaveGoodCategory,
} from '@/services/api/good';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {
  Button,
  Cascader,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Space,
  Tag,
} from 'antd';
import { useEffect, useRef, useState } from 'react';

interface TableItem {
  goodCategoryId: number;
  categoryName: string;
  parentId: number;
  image: {
    imgSrc: string;
    imageId: number;
  };
  isHot: boolean;
  goodCount: number;
  isAdult: boolean;
  createTime: string;
}

type FileType = {
  goodCategoryId: number;
  categoryName: string;
  parentId: number;
  imageId: string;
  isHot: boolean;
  isAdult: boolean;
};

type CategoryOptionItem = {
  value: string;
  label: string;
  isLeaf: boolean;
  children: CategoryOptionItem[];
};

export default () => {
  const actionRef = useRef<ActionType>();

  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [selectedRows, setSelectedRows] = useState<TableItem[]>([]);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);

  // 当前选择/编辑的分类
  const [category, setCategory] = useState<TableItem[]>([]);

  // 分类选项
  const [cateOptList, setCateOptList] = useState<CategoryOptionItem[]>([]);
  // 分类图片
  const [categoryImage, setCategoryImage] = useState<
    { url: string; id: string }[]
  >([]);

  // 获取分类选项
  const fetchCateOptList = async (
    parentId: number = 0,
    isLeaf: boolean = false,
  ): Promise<CategoryOptionItem[]> => {
    const { data } = await getGoodGetGoodCategoryListParent({
      parentId,
    });
    return data.map((item: TableItem) => ({
      value: item.goodCategoryId,
      label: item.categoryName,
      children: [],
      isLeaf,
    }));
  };
  // 初始化分类选项
  const initCategoryOption = async () => {
    const data = await fetchCateOptList(0, false);
    setCateOptList(data);
  };

  // 获取分类详情
  const fetchCategoryById = async (id: number) => {
    const { data } = await getGoodGetGoodCategoryById({
      id,
    });
    return data;
  };

  useEffect(() => {
    initCategoryOption();
  }, []);

  // 上热门
  const handleHotGoodCategory = async (
    category: TableItem[],
    isHot: boolean,
  ) => {
    const ids = category.map((item) => item.goodCategoryId);
    const params = {
      ids,
      isHot,
    };
    try {
      await postGoodHotGoodCategory(params);
      messageApi.success(isHot ? '上热门成功' : '下热门成功');
      actionRef.current?.reload();
    } catch (error) {}
  };

  // 删除分类
  const handleDeleteCategory = async (id: number) => {
    try {
      modal.confirm({
        title: '提示',
        content: '确定删除该分类吗？',
        centered: true,
        onOk: async () => {
          await postGoodDeleteGoodCategory({ ids: [id] });
          messageApi.success('删除成功');
          actionRef.current?.reload();
        },
      });
    } finally {
    }
  };

  // 级联懒加载
  const loadCateOption = async (selOption: CategoryOptionItem[]) => {
    const targetOption = selOption[selOption.length - 1];
    const parentId = targetOption.value;
    const data = await fetchCateOptList(Number(parentId), true);
    targetOption.children = data;
    targetOption.isLeaf = data.length === 0 || !data;
    setCateOptList([...cateOptList]);
  };

  const editCategory = async (category: TableItem) => {
    setCategory([category]);
    setDialog(true);

    // 获取爷爷级分类
    const { parentId: grandParentId } = await fetchCategoryById(
      category.parentId,
    );

    form.setFieldsValue({
      categoryName: category.categoryName,
      parentId: [grandParentId, category.parentId].filter(Boolean),
      isHot: category.isHot,
      isAdult: category.isAdult,
      imageId: category.image.imageId,
    });
    // 回显分类图片
    setCategoryImage([
      {
        url: category.image.imgSrc,
        id: category.image.imageId.toString(),
      },
    ]);
    // 懒加载回显
    const targetOption = cateOptList.find(
      (option) => option.value === grandParentId,
    );
    if (targetOption) {
      loadCateOption([targetOption]);
    }
  };

  const columns: ProColumns<TableItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'ID',
      dataIndex: 'goodCategoryId',
      search: false,
      width: 100,
    },
    {
      title: '分类图片',
      dataIndex: 'imageId',
      search: false,
      render: (_, record) => {
        return record?.image?.imgSrc ? (
          <Image src={record.image.imgSrc} />
        ) : (
          '-'
        );
      },
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      search: true,
    },
    {
      title: '父级Id',
      dataIndex: 'parentId',
      search: true,
    },
    {
      title: '是否成人用品',
      dataIndex: 'isAdult',
      search: false,
      width: 200,
      render: (_, record) => {
        return record.isAdult ? <Tag color="red">是</Tag> : <Tag>否</Tag>;
      },
    },
    {
      title: '是否热门',
      dataIndex: 'isHot',
      width: 200,
      search: false,
      render: (_, record) => {
        return record.isHot ? <Tag color="red">是</Tag> : '';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 220,
      ellipsis: true,
      render: (_, record) =>
        [
          <a
            key="edit"
            onClick={() => {
              editCategory(record);
            }}
          >
            编辑
          </a>,
          !record.isHot && (
            <a
              key="upHot"
              onClick={() => {
                handleHotGoodCategory([record], true);
              }}
            >
              上热门
            </a>
          ),
          record.isHot && (
            <a
              key="downHot"
              onClick={() => {
                handleHotGoodCategory([record], false);
              }}
            >
              下热门
            </a>
          ),
          <a
            key="delete"
            style={{ color: 'red' }}
            onClick={() => {
              handleDeleteCategory(record.goodCategoryId);
            }}
          >
            删除
          </a>,
        ].filter(Boolean),
    },
  ];

  // 重置表单
  const resetForm = () => {
    form.resetFields();
    setCategory([]);
    setCategoryImage([]);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    const { imageId, parentId } = values;

    if (!imageId) {
      form.setFields([{ name: 'imageId' }]);
      return;
    }
    const [first] = categoryImage;
    setLoading(true);
    const params = {
      ...values,
      goodCategoryId: category[0]?.goodCategoryId || 0,
      categoryName: values.categoryName,
      parentId: parentId[parentId.length - 1],
      isHot: values.isHot,
      imageId: first.id,
    };

    console.log(params);
    try {
      await postGoodSaveGoodCategory(params);
      messageApi.success('保存成功');
      setDialog(false);
      actionRef.current?.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProTable<TableItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowSelection={{}}
        tableAlertOptionRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => {
          setSelectedRows(selectedRows);
          return (
            <Space size={16}>
              <a
                onClick={() => {
                  handleHotGoodCategory(selectedRows, true);
                }}
              >
                批量上热门
              </a>
              <a
                onClick={() => {
                  handleHotGoodCategory(selectedRows, false);
                }}
              >
                批量下热门
              </a>
            </Space>
          );
        }}
        request={async (params) => {
          const searchParams = {
            page: params.current,
            count: params.pageSize,
            parentId: params.parentId,
          } as Record<string, any>;
          const { data } = await getGoodGetGoodCategoryList(searchParams);
          const { list = [], total } = data;
          return {
            data: list,
            success: true,
            total,
          };
        }}
        rowKey="goodCategoryId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: () => {
            actionRef.current?.clearSelected?.();
          },
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setDialog(true)}
            type="primary"
          >
            新增
          </Button>,
        ]}
      />

      <Modal
        title={category[0]?.goodCategoryId ? '编辑分类' : '新增分类'}
        centered
        open={dialog}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setDialog(false)}
        afterClose={resetForm}
        okButtonProps={{
          loading: loading,
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          onFinish={handleSubmit}
          labelAlign="left"
          initialValues={{
            isAdult: false,
            isHot: false,
          }}
        >
          <Form.Item<FileType>
            label="分类名称"
            name="categoryName"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item<FileType>
            label="父级分类"
            name="parentId"
            rules={[{ required: true, message: '请选择父级分类' }]}
          >
            <Cascader
              placeholder="请选择父级分类"
              options={cateOptList}
              loadData={loadCateOption}
            />
          </Form.Item>
          <Form.Item<FileType>
            label="是否热门"
            name="isHot"
            rules={[{ required: true, message: '请选择是否热门' }]}
          >
            <Radio.Group>
              <Radio value={true}>热门</Radio>
              <Radio value={false}>非热门</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item<FileType>
            label="是否成人用品"
            name="isAdult"
            rules={[{ required: true, message: '请选择是否成人用品' }]}
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item<FileType>
            label="分类图片"
            name="imageId"
            rules={[{ required: true, message: '请上传分类图片' }]}
          >
            <ImageWall
              fileList={categoryImage}
              maxCount={1}
              onChange={(files) => {
                const fileList = files.map((item) => {
                  const file = item.response.data;
                  return {
                    url: file.url,
                    id: file.imageId,
                  };
                });
                setCategoryImage(fileList);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
      {messageContextHolder}
    </>
  );
};
