
import './theme.scss';
import form from './Form';
import table from './Table';
import AxiosInstance from '../utils/http';
import { hasPermi } from '../utils/hasPermi';

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

export { AxiosInstance };

export default install;
