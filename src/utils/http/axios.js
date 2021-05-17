/* axios config配置 */
import axios from 'axios';
import Qs from 'qs';
import { Message } from 'element-ui';
import { closeLoading, handleCode, handleTip } from './utils';
import { getOrgId, getToken } from '../index'

/** 组织账号请求参数统一添加 orgId */
function handleOrgIdParam (config) {
  let orgId = getOrgId();
  if (orgId && orgId !== '0') {
    let paramMethod = ['get', 'delete'];
    let dataMethod = ['post', 'put'];
    if (paramMethod.some(el => el === config.method)) {
      !config.params && (config.params = {});
      config.params.orgId = orgId;
    } else if (dataMethod.some(el => el === config.method)) {
      !config.data && (config.data = {});
      config.data.orgId = orgId;
    }
  }
}

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  params: {},
  timeout: 1000 * 30,
  headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformResponse: [function (data) {
    return data;
  }],
  paramsSerializer: function (params) {
    // return Qs.stringify(params, {arrayFormat: 'brackets'});
    return Qs.stringify(params, {arrayFormat: 'comma'});
  },
  withCredentials: false,
  responseType: 'json',
  maxContentLength: 2000,
  maxRedirects: 5,
  validateStatus: function (status) {
    return status === 200; // 状态码为200时，为成功，否则失败
  }
});

// 请求拦截器
instance.interceptors.request.use(config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    handleOrgIdParam(config);
    return config;
}, error => {
  return Promise.reject(error);
}
);

// 响应拦截器
instance.interceptors.response.use((res) => {
  if (typeof res.data === 'string') {
    res.data = JSON.parse(res.data);
  }
  return res;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 封装请求方法
 * @param options, 配置参数
 * @param obj, 整个参数
 * @returns {Promise}
 */
export function request (options, obj) {
  return new Promise((resolve, reject) => {
    let { loading, spinning, localeText } = obj;
    localeText && (localeText.emptyText = '加载中...');
    spinning && (spinning.spinning = true);
    loading && (loading.loading = true);

    delete options.loading;

    instance(options).then((res) => {
      closeLoading(spinning, loading);
      handleTip(res, localeText, 'success');
      handleCode(res, resolve, reject);
      // console.log('request res: ', res, options.url);
    }).catch((err) => {
      closeLoading(spinning, loading);
      handleTip(err, localeText, 'err');

      let errData = (err.response || {}).data;
      reject(errData);
      if (err.response) {
        /* 错误提示信息 */
        errData && errData.msg && Message.error(errData.msg);
      } else {
        Message.error('网络不给力，请刷新重试');
      }
      // console.log('request err: ', err, options.url);
    });
  });
}
