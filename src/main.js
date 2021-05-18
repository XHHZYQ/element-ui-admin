import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import xhhPkg, { AxiosInstance } from '../dist'; // 打包结果引入 dist
// import xhhPkg from 'element-ui-admin-x'; // npm包引入

// import App from './example/form-demo.vue';
import App from './example/table-demo.vue';


Vue.use(ElementUI);
Vue.use(xhhPkg);

let Request = new AxiosInstance({baseURL: 'https://iot.ehaomiao.com/api/'});

Vue.prototype.Request = Request;

new Vue({
  el: '#app',
  render: h => h(App)
});
