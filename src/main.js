import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import hasPermi from './utils/directive/hasPermi';

// import Form from '../dist'; // todo 测试打包结果引入 dist
import Form from './package';
import xhhPkg from 'xhh-test-pkg';

import App from './example/form-demo.vue';
// import App from './example/table-demo.vue';

Vue.use(ElementUI);
// Vue.use(Form);
Vue.use(hasPermi);
Vue.use(xhhPkg);

new Vue({
  el: '#app',
  render: h => h(App)
});
