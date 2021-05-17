
import { request } from './axios';

function AxiosInstance (obj) {
  this.config = obj;
}

AxiosInstance.prototype.GET = function (obj) {
  let { url, params, config } = obj;
  config = config || {};
  config = {...config, ...this.config};
  console.log('instance url: ', this.config, url);

  return request({
    method: 'get',
    url,
    params,
    ...config
  }, obj);
};

AxiosInstance.prototype.POST = function (obj) {
  let { url, params, config, query } = obj;
  config = config || {};
  config = {...config, ...this.config};

  return request({
    method: 'post',
    url,
    params: query, // 单独处理文件上传
    data: params, // data 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    ...config
  }, obj);
};

AxiosInstance.prototype.DELETE = function (obj) {
  let { url, params, config } = obj;
  config = config || {};
  config = {...config, ...this.config};

  return request({
    method: 'delete',
    url,
    params, // DELTE 参数放在路由 query
    ...config
  }, obj);
};

AxiosInstance.prototype.PUT = function (obj) {
  let { url, params, config } = obj;
  config = config || {};
  config = {...config, ...this.config};

  return request({
    method: 'put',
    url,
    data: params, // data 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
    ...config
  }, obj);
};

export default AxiosInstance;
