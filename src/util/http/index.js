
import { request } from './axios';

export function GET (obj) {
  let { url, params, config } = obj;
  config = config || {};
  config = {...config, ...this};

  return request({
    method: 'get',
    url,
    params,
    ...config
  }, obj);
}

export function POST (obj) {
  let { url, params, config, query } = obj;
  config = config || {};
  config = {...config, ...this};

  return request({
    method: 'post',
    url,
    params: query, // 单独处理文件上传
    data: params, // data 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    ...config
  }, obj);
}

export function DELETE (obj) {
  let { url, params, config } = obj;
  config = config || {};
  config = {...config, ...this};

  return request({
    method: 'delete',
    url,
    params, // DELTE 参数放在路由 query
    ...config
  }, obj);
}

export function PUT (obj) {
  let { url, params, config } = obj;
  config = config || {};
  config = {...config, ...this};

  return request({
    method: 'put',
    url,
    data: params, // data 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    ...config
  }, obj);
}

