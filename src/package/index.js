
import form from './form';

const install = Vue => {
  Vue.component(`x-form`, form);
}

export default Object.assign({}, { form, install })
