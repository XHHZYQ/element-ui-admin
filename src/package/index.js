import Vue from 'vue';
import './theme.scss';
import form from './Form';
import table from './Table';
import hasPermi from '../utils/hasPermi';
import { DELETE, GET, POST, PUT } from '../utils/http';
import { setBaseUrl } from '../utils/http/axios';

console.log('setBaseUrl: ', setBaseUrl);

const component = {
  form,
  table
};

const install = Vue => {
  Object.keys(component).forEach(key => {
    Vue.component(`x-${key}`, component[key]);
  })

  Vue.directive('hasPermi', hasPermi);

  Vue.prototype.$get = GET;
  Vue.prototype.$post = POST;
  Vue.prototype.$delete = DELETE;
  Vue.prototype.$put = PUT;
};

export default Object.assign({}, component, setBaseUrl, { install });
