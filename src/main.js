import Vue from 'vue'
// import App from './example/form-demo.vue'
import App from './example/table-demo.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Form from '../dist';

Vue.use(ElementUI);
Vue.use(Form);

new Vue({
  el: '#app',
  render: h => h(App)
})
