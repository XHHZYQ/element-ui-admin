
import { Message } from 'element-ui';

/** 关闭loading */
export function closeLoading (spinning, loading) {
  spinning && setTimeout(() => { spinning.spinning = false; }, 300);
  loading && setTimeout(() => { loading.loading = false; }, 300);
}

/** 处理返回不同的code */
export function handleCode (res, resolve, reject) {
  let resData = res.data;
  switch (resData.code) {
    case 200: // 200：成功，
      resolve(resData); // 注意：resolve只接收一个参数
      break;

    case 500:
      resData.msg && Message.error(resData.msg);
      reject(resData);
      break;

    default:
      resData.msg && Message.error(resData.msg); // 错误提示信息
      reject(res);
  }
}

/** 处理table 暂无数据 提示 */
export function handleTip (res, localeText, isSuccess) {
  if (localeText) {
    if (isSuccess === 'success') {
      let resData = res.data;
      if (resData.data) {
        let list = resData.data.list;
        if (!list || !list.length) {
          localeText.emptyText = '暂无数据';
        }
      }
    } else {
      localeText.emptyText = '暂无数据';
    }
  }
}
