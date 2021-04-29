
let upload = {
  methods: {
    /* 处理获取详情fileList */
    handleFileList (data, formList) {
      formList.forEach((el, index) => {
        if (el.inputType === 'upload') {
          let fileUrl = data[el.model]; // 返回的url
          if (fileUrl && typeof fileUrl === 'string' && (fileUrl.includes('http') || fileUrl.includes('https'))) {
            let fileName = data[el.model]; // 返回的文件名
            el.fileList = [{ name: fileName, url: fileUrl }];
          }
        }
      });
    }
  }
};

let form = {
  methods: {
    /** 禁用之前的日期选择 */
    disabledDate (date, disDate) {
      if (disDate) {
        let val = new Date(date).getTime();
        return val < new Date(disDate).getTime();
      } else {
        return false;
      }
    },
    /** 级联搜索方法 */
    cascaderFilter (node, keyword) {
      console.log('cascaderFilter: ', keyword, node.pathLabels);
      return node.pathLabels.some( el => el.includes(keyword));
    },
    /** 级联 props 配置 */
    cascaderProps (props) {
      let defaConfig = {
        expandTrigger: 'hover',
        multiple: false,
        value: 'value',
        label: 'label',
        children: 'children'
      };
      if (props && Object.keys(props).length) {
        return {...defaConfig, ...props}
      } else {
        return defaConfig
      }
    }
  }
};

export { upload, form }
