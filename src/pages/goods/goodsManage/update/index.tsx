import { ImageWall, PageFooter } from '@/components';
import { getBrandGetBrandList } from '@/services/api/brand';
import {
  getGoodGetGoodById,
  getGoodGetGoodCategoryAllTree,
  getGoodGetGoodCategoryById,
  postGoodSaveGood,
  postGoodSaveGoodTag,
} from '@/services/api/good';
import { getShopSiteGetShopSiteList } from '@/services/api/shopSite';
import { getWebSiteGetWebSiteList } from '@/services/api/webSite';
import { isNull } from '@/utils';
import { history, useParams } from '@umijs/max';
import {
  Button,
  Card,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

interface FieldType extends API.FBGood {
  brandId?: number;
}

// select 选项类型
type OptionType = {
  label: string;
  value: string;
};

type ShopSiteType = {
  shopSiteName: string;
  shopSiteId: string;
};

type WebSiteItem = {
  webSiteId: string;
  name: string;
};

type BrandType = {
  brandId: string;
  brandName: string;
};

type CategoryOptionItem = {
  value: string;
  label: string;
  isLeaf: boolean;
  children: CategoryOptionItem[];
};

export default () => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const params = useParams<{ [key: string]: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [banners, setBanners] = useState<{ url: string }[]>([]);
  const [bannersIds, setBannersIds] = useState<string[]>([]);

  const [goodId, setGoodId] = useState<number>(0);

  // 站群列表
  const [webSiteList, setWebSiteList] = useState<OptionType[]>([]);

  // 站点列表
  const [shopSiteList, setShopSiteList] = useState<OptionType[]>([]);

  // 商品分类列表
  const [goodCategoryList, setGoodCategoryList] = useState<
    CategoryOptionItem[]
  >([]);
  // 商品品牌列表
  const [brandList, setBrandList] = useState<OptionType[]>([]);

  // 获取站点列表
  const getShopSiteList = async (shopSiteName: string = '') => {
    const { data } = await getShopSiteGetShopSiteList({
      shopSiteName,
      page: 1,
      count: 5000,
    });
    const { list } = data;
    setShopSiteList(
      list.map((item: ShopSiteType) => ({
        label: item.shopSiteName,
        value: item.shopSiteId,
      })),
    );
  };

  // 获取站群列表
  const getWebSiteList = async () => {
    const { data } = await getWebSiteGetWebSiteList({
      page: 1,
      count: 500,
    });
    const listData: WebSiteItem[] = data.list;
    setWebSiteList(
      listData.map((item: WebSiteItem) => {
        return {
          value: item.webSiteId,
          label: item.name,
        };
      }),
    );
  };

  // 格式化分类树
  const formatData = (data: any) => {
    return data.map((item: any) => {
      const treeItem = {
        value: item.goodCategoryId,
        label: item.categoryName,
        children: [],
      };
      if (item.childs && item.childs.length > 0) {
        treeItem.children = formatData(item.childs);
      }
      return treeItem;
    });
  };

  // 获取分类选项
  const fetchCateOptList = async (): Promise<CategoryOptionItem[]> => {
    const { data } = await getGoodGetGoodCategoryAllTree();
    return formatData(data);
  };

  // 初始化分类选项
  const initCategoryOption = async () => {
    const data = await fetchCateOptList();
    setGoodCategoryList(data);
  };

  // 获取商品分类列表
  const getGoodCategoryList = async () => {};

  // 获取商品品牌列表
  const getBrandList = async (name: string = '') => {
    const { data } = await getBrandGetBrandList({
      page: 1,
      count: 100,
      brandname: name,
    });
    const { list } = data;
    setBrandList(
      list.map((item: BrandType) => ({
        label: item.brandName,
        value: item.brandId,
      })),
    );
  };

  const backShowCategory = async (id: number) => {
    const ids: number[] = [];
    const getCateById = async (id: number) => {
      const { data } = await getGoodGetGoodCategoryById({ id });
      ids.push(id);
      const { parentId = '' } = data || {};
      if (parentId) {
        await getCateById(parentId);
      }
    };
    await getCateById(id);
    return ids.reverse();
  };

  const getGoodId = async () => {
    if (params.id) {
      setGoodId(Number(params.id));
      const { data } = await getGoodGetGoodById({
        id: Number(params.id),
      });

      const { attributes = [], tags = [], banners = [], shopSite } = data;

      getShopSiteList(shopSite.shopSiteName || '');

      const initAttributes = [
        {
          attributeName: '',
          attributeValue: '',
        },
      ];
      const formData = {
        ...data,
        tags: tags ? tags.map((item: any) => item.goodTag.tagName) : [''],
        banners: banners
          ? banners.map((item: any) => {
              return {
                response: {
                  data: {
                    imageId: item.image.imageId,
                  },
                },
                url: item.image.imgSrc,
              };
            })
          : [],
      };

      if (!attributes || attributes.length === 0) {
        formData.attributes = initAttributes;
      }
      console.log(123, formData.goodCategoryId);
      if (formData.goodCategoryId !== 0) {
        const goodCategoryId = await backShowCategory(formData.goodCategoryId);
        formData.goodCategoryId = goodCategoryId;
      } else {
        delete formData.goodCategoryId;
      }

      if (isNull(data.brandId, true)) {
        delete formData.brandId;
      }

      form.setFieldsValue({
        ...formData,
      });
    }
  };

  const init = async () => {
    await getWebSiteList();
    if (!params.id) {
      await getShopSiteList();
    }
    await getGoodCategoryList();
    await getBrandList();
    await initCategoryOption();
    await getGoodId();
  };

  useEffect(() => {
    init();
  }, []);

  // 添加标签
  const addTag = async (tagName: string) => {
    const { data } = await postGoodSaveGoodTag({
      goodTagId: 0,
      tagName,
    });
    return {
      goodTag: {
        goodTagId: 0,
        tagName: tagName,
      },
      goodTagId: data,
    };
  };

  // 批量添加标签
  const getAllTags = async (tags: string[]) => {
    return new Promise((resolve, reject) => {
      Promise.all(
        tags
          .filter(Boolean)
          .map(async (tagName: string) => await addTag(String(tagName))),
      )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  // 格式化banner图
  const formatBanner = (banners: any[]) => {
    return (
      banners?.map((banner: any) => {
        return {
          imageId: banner?.response?.data.imageId || '',
        };
      }) || []
    );
  };

  const footerBack = () => {
    history.back();
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    setLoading(true);
    // 先添加标签
    console.log(values);
    console.log(formatBanner(values.banners));

    const tags = await getAllTags(values.tags);
    const banners = formatBanner(values.banners);
    const params = {
      ...values,
      tags,
      banners,
      goodId,
      attributes: values.attributes.filter((item: any) => item.attributeValue),
      brandId: values.brandId || 0,
      goodCategoryId:
        values.goodCategoryId?.[values.goodCategoryId.length - 1] || 0,
    };

    try {
      await postGoodSaveGood(params);
      messageApi.success('添加成功');
      footerBack();
    } catch (error) {
      // messageApi.error('添加失败');
    } finally {
      setLoading(false);
    }
  };

  const onValuesChange = (errorInfo: any) => {
    console.log(errorInfo);
  };

  return (
    <div style={{ height: '100%' }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 2,
            height: 20,
            backgroundColor: '#4096ff',
          }}
        ></div>
        <div>添加商品</div>
      </div>

      <Card>
        <Form
          form={form}
          onFinish={handleSubmit}
          onValuesChange={onValuesChange}
          layout="vertical" // 设置表单布局为垂直
          labelAlign="left"
          initialValues={{
            tags: [''],
            attributes: [
              {
                attributeName: '',
                attributeValue: '',
              },
            ],
            isShelves: true,
            isHot: false,
          }}
        >
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="所属独立站点（可搜索）"
                name="shopSiteId"
                tooltip="可以直接输入搜索想要的站点"
                rules={[{ required: true, message: '请选择站点' }]}
              >
                <Select
                  placeholder="请选择站点"
                  showSearch
                  onSearch={(name) => getShopSiteList(name)}
                  filterOption={false}
                  options={shopSiteList}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="独立站点商品Id"
                name="shopSiteGoodId"
                rules={[{ required: true, message: '请输入独立站点商品Id' }]}
              >
                <Input
                  placeholder="请输入独立站点商品Id"
                  onChange={(e) => {
                    form.setFieldsValue({
                      shopSiteGoodId: e.target.value.trim(),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="站群"
                name="webSiteId"
                rules={[{ required: true, message: '请选择站群' }]}
              >
                <Select placeholder="请选择站点" options={webSiteList} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="商品名称"
                name="title"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="SEO标题"
                name="seoTitle"
                rules={[{ required: true, message: '请输入SEO标题' }]}
              >
                <TextArea placeholder="请输入SEO标题" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="SEO关键词"
                name="seoKeyword"
                rules={[{ required: true, message: '请输入SEO关键词' }]}
              >
                <TextArea placeholder="请输入SEO关键词" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="SEO描述"
                name="seoDescription"
                rules={[{ required: true, message: '请输入SEO描述' }]}
              >
                <TextArea placeholder="请输入SEO描述" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType> label="商品描述" name="content">
                <TextArea placeholder="请输入商品描述" rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="原始价格"
                name="basePrice"
                rules={[{ required: true, message: '请输入原始价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  min={0}
                  placeholder="请输入原始价格"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="实际价格"
                name="price"
                rules={[{ required: true, message: '请输入实际价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  min={0}
                  placeholder="请输入实际价格"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="价格权重"
                name="priceWeight"
                rules={[{ required: true, message: '请输入价格权重' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  min={0}
                  placeholder="请输入价格权重"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="购买链接"
                name="buyLink"
                rules={[
                  { required: true, message: '请输入购买链接' },
                  { type: 'url', message: '请输入正确的购买链接' },
                ]}
              >
                <Input placeholder="请输入购买链接" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="分销购买链接"
                name="distributionLink"
                rules={[{ type: 'url', message: '请输入正确的分销购买链接' }]}
              >
                <Input placeholder="请输入分销购买链接" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="商品分类"
                name="goodCategoryId"
                rules={[{ required: true, message: '请选择商品分类' }]}
              >
                <Cascader
                  allowClear
                  placeholder="请选择商品分类"
                  options={goodCategoryList}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType> label="商品品牌" name="brandId">
                <Select
                  optionFilterProp="label"
                  placeholder="请选择商品品牌"
                  showSearch
                  onSearch={(name) => getBrandList(name)}
                  filterOption={false}
                  options={brandList}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="库存"
                name="stock"
                rules={[{ required: true, message: '请输入库存' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  min={0}
                  placeholder="请输入库存"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="销量"
                name="stock"
                rules={[{ required: true, message: '请输入销量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  step={0.01}
                  min={0}
                  placeholder="请输入销量"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="上下架"
                name="isShelves"
                rules={[{ required: true, message: '请选择上下架' }]}
              >
                <Radio.Group>
                  <Radio value={true}>上架</Radio>
                  <Radio value={false}>下架</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="是否热门"
                name="isHot"
                rules={[{ required: true, message: '请选择上下架' }]}
              >
                <Radio.Group>
                  <Radio value={true}>热门</Radio>
                  <Radio value={false}>非热门</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.List name="tags">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        label={index === 0 ? '标签' : ''}
                        required={false}
                        key={field.key}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                          }}
                        >
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            noStyle
                          >
                            <Input
                              placeholder="请输入标签"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                          <Space
                            style={{
                              marginLeft: 8,
                              flexShrink: 0,
                              userSelect: 'none',
                            }}
                          >
                            {fields.length > 1 && (
                              <a
                                style={{
                                  color: 'red',
                                }}
                                onClick={() => remove(field.name)}
                              >
                                删除
                              </a>
                            )}
                            <a onClick={() => add()}>添加</a>
                          </Space>
                        </div>
                      </Form.Item>
                    ))}
                  </>
                )}
              </Form.List>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.List name="attributes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <div
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: index === 0 ? 'center' : 'flex-start',
                          justifyContent: 'space-between',
                          gap: 8,
                          width: '100%',
                        }}
                      >
                        <div
                          key={key}
                          style={{ display: 'flex', gap: 8, width: '100%' }}
                        >
                          <Form.Item
                            {...restField}
                            label={index === 0 ? '属性名' : ''}
                            name={[name, 'attributeName']}
                            validateTrigger={['onChange', 'onBlur']}
                            dependencies={[
                              ['attributes', name, 'attributeValue'],
                            ]}
                            style={{ width: '100%' }}
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const attributeValue = getFieldValue([
                                    'attributes',
                                    name,
                                    'attributeValue',
                                  ]);
                                  if (
                                    (!value && attributeValue) ||
                                    (value && !attributeValue)
                                  ) {
                                    return Promise.reject(
                                      '属性名和属性值必须同时填写',
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Input
                              placeholder="请输入属性名"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            label={index === 0 ? '属性值' : ''}
                            name={[name, 'attributeValue']}
                            validateTrigger={['onChange', 'onBlur']}
                            style={{ width: '100%' }}
                            dependencies={[
                              ['attributes', name, 'attributeName'],
                            ]}
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const attributeName = getFieldValue([
                                    'attributes',
                                    name,
                                    'attributeName',
                                  ]);
                                  if (
                                    (!value && attributeName) ||
                                    (value && !attributeName)
                                  ) {
                                    return Promise.reject(
                                      '属性名和属性值必须同时填写',
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <Input
                              placeholder="请输入属性值"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </div>
                        <Space
                          style={{
                            marginLeft: 8,
                            flexShrink: 0,
                            userSelect: 'none',
                            height: '32px',
                          }}
                        >
                          {fields.length > 1 && (
                            <a
                              style={{
                                color: 'red',
                              }}
                              onClick={() => remove(name)}
                            >
                              删除
                            </a>
                          )}
                          <a onClick={() => add()}>添加</a>
                        </Space>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Form.Item<FieldType>
                label="轮播图"
                name="banners"
                rules={[{ required: true, message: '请上传轮播图' }]}
              >
                <ImageWall
                  maxCount={100}
                  fileList={banners}
                  onChange={(fileList) => {
                    const ids = fileList
                      .map((item) => {
                        return item.response?.data?.imageId;
                      })
                      .filter(Boolean);
                    setBannersIds(ids);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <PageFooter
        buttons={
          <>
            <Button
              loading={loading}
              type="primary"
              onClick={() => form.submit()}
            >
              确定
            </Button>
            <Button onClick={footerBack}>返回</Button>
          </>
        }
      ></PageFooter>
      {messageContextHolder}
    </div>
  );
};
