
import './theme.scss';
import form from './Form';
import table from './Table';

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
