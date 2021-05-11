import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import hasPermi from './utils/directive/hasPermi';

import Form from './package'; // 直接引入文件
// import Form from '../dist'; // 打包结果引入 dist
// import xhhPkg from 'element-ui-admin-x'; // npm包引入

import App from './example/form-demo.vue';
// import App from './example/table-demo.vue';

Vue.use(ElementUI);
Vue.use(hasPermi);

Vue.use(Form);
// Vue.use(xhhPkg);

new Vue({
  el: '#app',
  render: h => h(App)
});
