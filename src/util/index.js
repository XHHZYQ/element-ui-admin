
import Vue from 'vue';
import Cookies from 'js-cookie';

export function getToken() {
  return Cookies.get('Admin-Token')
}

/**
 * 清空搜索条件
 * @param selectData 重置对象
 * @param excludeKey 不重置的字段
 */
export function resetData (selectData, excludeKey = []) {
  if (selectData && Object.keys(selectData).length) {
    let arr = ['pageNum', 'pageSize'];
    excludeKey.length && (arr = [...arr, ...excludeKey]);
    for (let item in selectData) {
      if (arr.every(el => el !== item)) {
        if (Array.isArray(selectData[item])) {
          selectData[item] = [];
        } else if (typeof selectData[item] !== 'undefined') {
          selectData[item] = undefined;
        }
      }
    }
  }
  return selectData;
}

/**
 * 获取 orgId
 * @returns {any}
 */
export function getOrgId () {
  let id = localStorage.getItem('orgId');
  if (id === 'null') {
    id = JSON.parse(id);
  }
  return id;
}

let funObj = {
  resetData,
};
for (let item in funObj) {
  Vue.prototype[item] = funObj[item];
}
