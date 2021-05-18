import Vue from 'vue';
import './theme.scss';
import form from './Form';
import table from './Table';
import hasPermi from '../utils/hasPermi';
import { DELETE, GET, POST, PUT } from '../utils/http';

const component = {
  form,
  table
};

const install = Vue => {
  Object.keys(component).forEach(key => {
    Vue.component(`x-${key}`, component[key]);
  })

  Vue.directive('hasPermi', hasPermi);
};

export { GET, POST, PUT, DELETE }

export default Object.assign({}, component, { install });
