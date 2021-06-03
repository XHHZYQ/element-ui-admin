import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import xhhPkg, { GET, POST, DELETE, PUT } from './dist'; // 打包结果引入 dist
import xhhPkg, { GET, POST, DELETE, PUT }  from 'element-ui-admin-x'; // npm包引入
// import xhhPkg, { GET, POST, DELETE, PUT }  from './package'; // 直接引入
console.log('xhhPkg: ', xhhPkg);

// import App from './example/form-demo.vue';
import App from './example/table-demo.vue';


Vue.use(ElementUI);
Vue.use(xhhPkg);

let config = { baseURL: 'https://192.168.255/api/' };
let $get = GET.bind(config);
let $post = POST.bind(config);
let $delete = DELETE.bind(config);
let $put = PUT.bind(config);

Vue.prototype.$get = $get;
Vue.prototype.$post = $post;
Vue.prototype.$delete = $delete;
Vue.prototype.$put = $put;

new Vue({
  el: '#app',
  render: h => h(App)
});
