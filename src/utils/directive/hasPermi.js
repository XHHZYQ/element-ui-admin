import store from '@/store'

/**
 * 操作权限处理
 */

const hasPermi = {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*";

    if (!store) {
      store = { getters: { permissions: [] } }
    }
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      console.log(`请设置操作权限标签值`)
    }
  }
}

 export default  function install (Vue) {
   Vue.directive('hasPermi', hasPermi)
 }
