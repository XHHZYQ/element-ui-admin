
import Vue from 'vue';
import { request } from './axios';

const GET = (obj) => {
  let {url, params, config} = obj;
  config = config || {};
  return request({
    method: 'get',
    url,
    params,
    ...config
  }, obj);
};

const POST = obj => {
  let {url, params, config, query} = obj;
  config = config || {};
  return request({
    method: 'post',
    url,
    params: query, // 单独处理文件上传
    data: params, // data 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    ...config
  }, obj);
};

const DELETE = obj => {
  let {url, params, config} = obj;
  config = config || {};
  return request({
    method: 'delete',
    url,
    params, // DELTE 参数放在路由 query
    ...config
  }, obj);
};

const PUT = (obj) => {
  let {url, params, config} = obj;
  config = config || {};
  return request({
    method: 'put',
    url,
    data: params, // data 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    ...config
  }, obj);
};

Vue.prototype.$get = GET;
Vue.prototype.$post = POST;
Vue.prototype.$delete = DELETE;
Vue.prototype.$put = PUT;

export { POST, GET, DELETE, PUT };
