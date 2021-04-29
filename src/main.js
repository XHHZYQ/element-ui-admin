import Vue from 'vue';
import App from './example/form-demo.vue';
// import App from './example/table-demo.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import Form from '../dist'; // 测试打包结果引入 dist
import Form from './package';
import hasPermi from './utils/directive/hasPermi';

Vue.use(ElementUI);
Vue.use(Form);
Vue.use(hasPermi);

new Vue({
  el: '#app',
  render: h => h(App)
});
