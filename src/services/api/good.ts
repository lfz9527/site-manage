// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 批量复制商品到新站点 POST /api/Good/CopyGoodToWebSite */
export async function postGoodCopyGoodToWebSite(
  body: API.FBCopyGood,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/CopyGoodToWebSite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除商品 POST /api/Good/DeleteGood */
export async function postGoodDeleteGood(
  body: API.FBIds,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/DeleteGood', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除商品分类 POST /api/Good/DeleteGoodCategory */
export async function postGoodDeleteGoodCategory(
  body: API.FBIds,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/DeleteGoodCategory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除商品分区 POST /api/Good/DeleteGoodPartition */
export async function postGoodDeleteGoodPartition(
  body: API.FBIds,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/DeleteGoodPartition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除商品标签 POST /api/Good/DeleteGoodTag */
export async function postGoodDeleteGoodTag(
  body: API.FBIds,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/DeleteGoodTag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据Id查询单件商品 GET /api/Good/GetGoodById */
export async function getGoodGetGoodById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询所有分类并以树状结构返回 GET /api/Good/GetGoodCategoryAllTree */
export async function getGoodGetGoodCategoryAllTree(options?: {
  [key: string]: any;
}) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodCategoryAllTree', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 根据ID查询单条商品分类 GET /api/Good/GetGoodCategoryById */
export async function getGoodGetGoodCategoryById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodCategoryByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodCategoryById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询商品分类列表 GET /api/Good/GetGoodCategoryList */
export async function getGoodGetGoodCategoryList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodCategoryListParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodCategoryList', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // count has a default value: 20
      count: '20',
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据父类查询所有子类 GET /api/Good/GetGoodCategoryListParent */
export async function getGoodGetGoodCategoryListParent(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodCategoryListParentParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodCategoryListParent', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 后台查询商品列表 GET /api/Good/GetGoodList */
export async function getGoodGetGoodList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodListParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 前端公共查询商品 GET /api/Good/GetGoodListPublic */
export async function getGoodGetGoodListPublic(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodListPublicParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodListPublic', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据Id查询商品分区 GET /api/Good/GetGoodPartitionById */
export async function getGoodGetGoodPartitionById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodPartitionByIdParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodPartitionById', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询商品分区列表 GET /api/Good/GetGoodPartitionList */
export async function getGoodGetGoodPartitionList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodPartitionListParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodPartitionList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询商品标签列表 GET /api/Good/GetGoodTagList */
export async function getGoodGetGoodTagList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodGetGoodTagListParams,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/GetGoodTagList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 商品上下热门 POST /api/Good/HotGood */
export async function postGoodHotGood(
  body: API.FBState,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/HotGood', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 商品分类上下热门 POST /api/Good/HotGoodCategory */
export async function postGoodHotGoodCategory(
  body: API.FBState,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/HotGoodCategory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 公共的商品添加 POST /api/Good/InsertGoodPublic */
export async function postGoodInsertGoodPublic(
  body: API.FBGoodPublic[],
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/InsertGoodPublic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑一个商品（goodId=0为新增，goodId>0为修改） POST /api/Good/SaveGood */
export async function postGoodSaveGood(
  body: API.FBGood,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/SaveGood', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增/修改商品分类 POST /api/Good/SaveGoodCategory */
export async function postGoodSaveGoodCategory(
  body: API.FBGoodCategory,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/SaveGoodCategory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑商品分区 POST /api/Good/SaveGoodPartition */
export async function postGoodSaveGoodPartition(
  body: API.FBGoodPartition,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/SaveGoodPartition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增/修改商品标签 POST /api/Good/SaveGoodTag */
export async function postGoodSaveGoodTag(
  body: API.FBGoodTag,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/SaveGoodTag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 商品上下架 POST /api/Good/ShelvesGood */
export async function postGoodShelvesGood(
  body: API.FBState,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/ShelvesGood', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 通过AI更新商品 POST /api/Good/UpdateGoodForAI */
export async function postGoodUpdateGoodForAi(
  body: API.FBId,
  options?: { [key: string]: any },
) {
  return request<API.REWebApiCallback>('/api/Good/UpdateGoodForAI', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
