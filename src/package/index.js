import Vue from 'vue';
import './theme.scss';
import form from './Form';
import table from './Table';
import hasPermi from '../utils/directive/hasPermi';

Vue.use(hasPermi);

const component = {
  form,
  table
};

const install = Vue => {
  Object.keys(component).forEach(key => {
    Vue.component(`x-${key}`, component[key]);
  })
};

export default Object.assign({}, component, { install });
