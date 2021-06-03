
import './theme.scss';
import form from './Form';
import table from './Table';
import { GET, POST, DELETE, PUT } from '../util/http';
import { hasPermi } from '../util/hasPermi';

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

export { GET, POST, DELETE, PUT };

export default install;
