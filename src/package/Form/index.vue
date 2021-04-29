
<template>
  <div class="form-container" :class="{'form-box': !isNest}">
    <!--status-icon="true"-->
    <el-form
      :model="formModel"
      :rules="formRules"
      ref="form"
      :label-width="labelWidth"
      label-suffix=" :"
      :show-message="showMessage"
      :disabled="formDisabled"
    >
      <template v-for="(item, index) of formList">

        <template v-if="item.inputType==='text'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :key="index"
          >
            <template v-if="Array.isArray(formModel[item.model])">
              <p v-for="(ele, i) of formModel[item.model]" :key="i">{{ele}}</p>
            </template>
            <span v-else>{{formModel[item.model]}}</span>
          </el-form-item>
        </template>

        <template v-if="item.inputType==='img'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :key="index"
          >
            <div @click="() => item.click ? item.click(item) : showImg(item)" class="img-wrapper">
              <img :src="formModel[item.model]" alt="">
            </div>
          </el-form-item>
        </template>

        <!--input 输入框-->
        <template v-if="['input', 'textarea'].some(el => el === item.inputType)">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <!--type 属性可选为input、textarea等元素属性-->
            <el-input
              v-model.trim="formModel[item.model]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              @blur="e => item.blur && item.blur(e)"
              @change="e => item.change && item.change(e)"
              :type="item.inputType"
              :maxlength="item.maxlength"
              clearable
            ></el-input>
            <p v-if="item.extra">{{item.extra}}</p>
          </el-form-item>
        </template>

        <!--select选择框-->
        <template v-if="item.inputType==='select'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <el-select
              @change="e => item.change && item.change(e)"
              v-model="formModel[item.model]"
              :multiple="item.multiple"
              :disabled="item.disabled"
              clearable
              filterable
              :placeholder="item.placeholder">
              <el-option
                v-for="(ele, i) of item.options"
                :key="i"
                :label="ele.label || ele.dictLabel"
                :value="ele.value || ele.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>

        <!--级联选择框-->
        <template v-if="item.inputType==='cascader'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <el-cascader
              @change=" e => item.change && item.change(e)"
              v-model="formModel[item.model]"
              :options="item.options"
              :props="cascaderProps(item.props)"
              clearable
              filterable
              :filter-method="cascaderFilter"
              :disabled="item.disabled"
              :placeholder="item.placeholder"></el-cascader>
          </el-form-item>
        </template>

        <!--日期选择框-->
        <template v-if="['date', 'datetime'].some(part => part === item.inputType)">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <!--type = date/datetime-->
            <el-date-picker
              @change="e => item.change && item.change(e)"
              v-model="formModel[item.model]"
              :type="item.inputType"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :value-format="item.valueFormat || 'yyyy-MM-dd'"
              :picker-options="{disabledDate: date => disabledDate(date, item.disDate)}"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </template>

        <!--日期选择框-->
        <template v-if="['datetimerange', 'daterange'].some(part => part === item.inputType)">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <!--datetimerange/ daterange-->
            <el-date-picker
              @change="e => item.change && item.change(e)"
              v-model="formModel[item.model]"
              :type="item.inputType"
              range-separator="-"
              :start-placeholder="item.placeholder[0]"
              :end-placeholder="item.placeholder[1]"
              :disabled="item.disabled"
              :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
              :picker-options="{disabledDate: date => disabledDate(date, item.disDate)}"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </template>

        <!--checkbox多选框-->
        <template v-if="item.inputType==='checkboxGroup'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <el-checkbox-group
              @change="e => item.change && item.change(e)"
              v-model="formModel[item.model]"
              :disabled="item.disabled"
            >
              <el-checkbox v-for="(el, i) of (item.options || [])" :key="i" :label="el.value">{{el.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>

        <!--单选框组-->
        <template v-if="item.inputType==='radioGroup'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <el-radio-group
              @change="e => item.change && item.change(e)"
              v-model="formModel[item.model]"
              :disabled="item.disabled"
            >
              <el-radio v-for="(ele, i) of item.options" :key="i" :label="ele.value">{{ele.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>

        <!--文件上传-->
        <template v-if="item.inputType==='upload'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <!--show-file-list-->
            <!-- auto-upload="item.autoUpload === undefined ? true : item.autoUpload"-->
            <el-upload
              action=""
              :accept="item.accept || 'image/*'"
              :limit="item.limit"
              :file-list="item.fileList"
              :on-change="(file, fileList) => fileChange(file, fileList, item)"
              :before-upload="file => uploadBefore(file, item)"
              :http-request="() => uploadRequest(item)"
              :on-preview="(file) => uploadPreview(file)"
              :on-remove="(file, fileList) => uploadRemove(file, fileList, item)"
              :on-exceed="uploadExceed"
              :list-type="item.listType || 'picture'"
              :disabled="item.disabled"
            >
              <el-button
                size="mini"
                type="primary"
                plain
                icon="el-icon-upload"
                :disabled="item.disabled"
              >{{item.text||'上传'}}</el-button>
              <div slot="tip" class="el-upload__tip">{{item.tipTxt}}</div>
            </el-upload>
          </el-form-item>
        </template>

        <!--switch开关-->
        <template v-if="item.inputType==='switch'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >

            <el-switch
              @change="e => item.change && item.change(e)"
              v-model="formModel[item.model]"
              :disabled="item.disabled"
              :validate-event="true"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </template>

        <!--inputNumber 输入框-->
        <template v-if="item.inputType==='inputNum'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <el-input-number
              v-model="formModel[item.model]"
              @change="e => item.change && item.change(e)"
              :min="item.min"
              :max="item.max"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
            >
            </el-input-number>
          </el-form-item>
        </template>

        <!--多个输入框-->
        <template v-if="item.inputType==='multInput'">
          <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
          <el-form-item
            v-if="!item.slot && !item.isHidden"
            v-show="!item.unShow"
            :label="item.label"
            :prop="item.model"
            :key="index"
          >
            <el-row class="mult-box" type="flex" justify="space-between">
              <template v-for="(subItem, subIndex) of item.subList">
                <el-col :class="{'mult-item-space': subIndex % 2 === 0 || subIndex === 0}" :span="subItem.span || 12" :key="subIndex">

                  <template v-if="subItem.inputType==='text'">
                    <slot v-if="subItem.slot" :name="subItem.slot" :formItem="subItem"></slot>
                    <el-form-item
                      v-if="!subItem.slot && !subItem.isHidden"
                      :label="subItem.label"
                    >
                      <template v-if="Array.isArray(formModel[item.model])">
                        <p v-for="(ele, i) of formModel[item.model]" :key="i">{{ele}}</p>
                      </template>
                      <span v-else="">{{formModel[item.model]}}</span>
                    </el-form-item>
                  </template>

                  <!--input 输入框-->
                  <template v-if="subItem.inputType==='input'">
                    <slot v-if="subItem.slot" :name="subItem.slot" :formItem="subItem"></slot>
                    <el-form-item
                      :class="{ 'suffix-icon': subItem.icon }"
                      style="display: flex; align-items: center"
                      v-if="!subItem.slot && !subItem.isHidden"
                      :label="subItem.label"
                      :prop="subItem.model"
                    >
                      <el-input
                        v-model.trim="formModel[subItem.model]"
                        :placeholder="subItem.placeholder"
                        :disabled="subItem.disabled"
                        @blur="e => subItem.blur && subItem.blur(e)"
                        @change="e => subItem.change && subItem.change(e)"
                        :type="subItem.type || 'input'"
                        clearable
                      ></el-input>
                      <!-- 图标-->
                      <i v-if="subItem.icon"
                         :class="subItem.icon"
                         @click="() => subItem.iconClick && subItem.iconClick()"
                         v-hasPermi="item.permi"></i>
                    </el-form-item>
                  </template>

                  <template v-if="subItem.inputType==='btnText'">
                    <slot v-if="subItem.slot" :name="subItem.slot" :formItem="subItem"></slot>
                    <el-button
                      @click="() => subItem.click && subItem.click()"
                      v-hasPermi="item.permi"
                      type="text"
                      :disabled="subItem.disabled"
                    >{{subItem.label}}</el-button>
                  </template>

                  <!--按钮 button-->
                  <template v-if="subItem.inputType==='button'">
                    <el-button
                      @click="() => subItem.click && subItem.click()"
                      :disabled="subItem.disabled"
                      :loading="subItem.loading"
                      v-hasPermi="subItem.permi"
                      type="primary"
                      plain
                      size="small"
                    >{{subItem.label || '点击'}}</el-button>
                  </template>

                  <template v-if="subItem.inputType==='select'">
                    <el-form-item
                      :label="subItem.label"
                      :prop="subItem.model"
                    >
                      <el-select
                        @change="e => subItem.change && subItem.change(e)"
                        v-model="formModel[subItem.model]"
                        :multiple="subItem.multiple"
                        :disabled="subItem.disabled"
                        clearable
                        filterable
                        :placeholder="subItem.placeholder">
                        <el-option v-for="(ele, i) of subItem.options" :key="i" :label="ele.label" :value="ele.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-col>
              </template>
            </el-row>
          </el-form-item>
        </template>
      </template>

      <slot v-if="isSubmitBtn && formList.length" name="submitBtn">
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitLoading" size="large">确 定</el-button>
        </el-form-item>
      </slot>
    </el-form>
  </div>
</template>

<script>
import { upload, form } from '../../utils/mixins';
export default {
  mixins: [form, upload],
  name: 'formComp',
  props: {
    formDisabled: {
      type: Boolean,
      default: () => false
    },
    showMessage: {
      type: Boolean,
      default: () => true
    },
    isNest: { // 外层是否有嵌套
      type: Boolean,
      default: () => false
    },
    isSubmitBtn: {
      type: Boolean,
      default: () => true
    },
    labelWidth: {
      type: String,
      default: () => '130px'
    },
    formList: {
      type: Array,
      default: () => []
    },
    formModel: {
      type: Object,
      default: () => ({})
    },
    formRules: {
      type: Object,
      default: () => ({})
    },
    addParam: {
      type: Object,
      default: () => ({})
    },
    editParam: {
      type: Object,
      default: () => ({})
    },
    detailParam: {
      type: Object,
      default: () => ({})
    },

    isModalForm: {
      type: Boolean,
      default: () => false
    },
    setFormModel: {
      type: Object,
      default: () => ({})
    },
    initReqHandle: {
      type: Boolean,
      default: () => true
    },
    reqLoading: {
      type: Object
    }
  },
  data () {
    return {
      fileData: '',
      loading: { loading: false },
      detailId: undefined
    };
  },
  watch: {
  },
  computed: {
    submitLoading () {
      if (this.reqLoading && Object.keys(this.reqLoading).length) {
        return this.reqLoading.loading;
      } else {
        return this.loading.loading
      }
    }
  },
  created () {
    this.initForm();
  },
  methods: {
    /** 初始化 */
    initForm () {
      if (this.$route === undefined) { // 兼容没配置router
        this.$route = { query: { id: undefined } };
      }
      this.$route.query.id && (this.detailId = this.$route.query.id);
      if (this.detailId && this.initReqHandle) {
        this.getDetail();
      }
    },
    /** 创建表单 model */
    createModel (list) {
      let rulesObj = {};
      list.forEach((el) => {
        if (el.model && el.rules && Array.isArray(el.rules) && el.rules.length) {
          rulesObj[el.model] = el.rules;
        }
      });
      this.formRules = rulesObj;
    },
    /** 获取详情 */
    getDetail () {
      this.$get({
        url: `${this.detailParam.url}${this.detailId}`,
        // params: this.detailParam.params || { id: this.detailId }
        params: {}
      }).then(({data}) => {
        let resVal = {};
        if (this.detailParam.resHandle) { // 父组件有处理方法
          resVal = this.detailParam.resHandle(data);
          if (!resVal) {
            return;
          }
        }

        let values = {...data, ...resVal}; // 外部处理函数返回的值合并data的值
        this.handleFileList(values, this.formList);

        for (let item in values) {
          if (this.formModel.hasOwnProperty(item)) {
            this.formModel[item] = values[item];
          }
        }
      });
    },

    /* 表单提交 */
    submitForm  () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return; }
        if (!this.detailId && !this.addParam.url || this.detailId && !this.editParam.url) {
          this.$message.error('请求url不能为空');
          return;
        }
        let values = {...this.formModel};
        if (this.addParam.reqHandle) {
          let resVals = this.addParam.reqHandle(values);
          if (!resVals) {
            return;
          } else {
            values = resVals;
          }
        }

        // values = this.boolToNum(values);
        // this.ObjAttrArrToStr(values);
        this.detailId ? this.editForm(values) : this.addForm(values);
      });
    },
    /** 编辑类 */
    editForm (values) {
      this.$put({
        url: this.editParam.url,
        params: {
          [this.editParam.idKey || 'id']: this.detailId,
          ...values
        },
        loading: this.reqLoading ? this.reqLoading : this.loading
      }).then((res) => {
        // this.$store.commit('setOptData', true);

        this.$message.success(`编辑成功！`);
        let editParam = this.editParam;
        if (editParam.resHandle && typeof editParam.resHandle === 'function') {
          editParam.resHandle(res);
        } else if (this.isModalForm) {
        } else {
          this.handleThen();
        }
      });
    },
    /** 新增类 */
    addForm (values) {
      this.$post({
        url: this.addParam.url,
        params: values,
        loading: this.reqLoading ? this.reqLoading : this.loading
      }).then((res) => {
        this.$message.success(`新增成功！`);
        let addParam = this.addParam;
        if (addParam.resHandle && typeof addParam.resHandle === 'function') {
          addParam.resHandle(res);
        } else if (this.isModalForm) {
        } else {
          // empty.$emit('setAliveComponent');
          this.handleThen();
        }
      });
    },
    handleThen () {
      setTimeout(() => {
        this.$router.go(-1);
      }, 2000)
    },

    /** 查看图片 */
    showImg (item) {
      let imgUrl = this.formModel[item.model];
      if (imgUrl) {
        window.open(imgUrl);
      } else {
        this.$message.error('没有图片链接');
      }
    },
    /**
     * 对象某一属性值为数组，转为字符串拼接
     * @param values 要转换的对象
     * @param joinStr 拼接的符号
     * @returns {*}
     */
    ObjAttrArrToStr (values, joinStr = ',') {
      for (let item in values) {
        if (Array.isArray(values[item])) {
          values[item] = values[item].join(joinStr);
        }
      }
      return values;
    },
    /** 处理时间格式 */
    handleDate (data) {
      let pick = ['rangePick', 'rangeTimePick', 'datePick', 'dateTimePick'];
      let dateValue = {};
      this.formList.forEach((el) => {
        if (pick.includes(el.inputType)) {
          let prop = el.model;
          if (data[prop]) {
            dateValue = {...dateValue, [prop]: this.Moment(data[prop])}; // 可能有多个日期值
          }
        }
      });
      return dateValue;
    },

    /** upload change事件 */
    fileChange (file, fileList, item) {
      this.$emit('uploadChange', file, item);
    },
    /**
     *  文件上传前事件
     *  不能返回 false 不然不会执行自定义上传
     */
    uploadBefore (file, item) {
      if (!this.fileTypeValidate(file, item)) {
        return false;
      }
      if (!this.fileNameValidate(file)) {
        return false;
      }
      if(!this.fileNumValidate(file, item)) {
        return false
      }

      this.fileData = file;
    },
    /** 自定义文件上传 */
    uploadRequest (item, file) {
      if (item.autoUpload === false) {
        return false;
      }
      let formData = new FormData();
      formData.append('file', this.fileData);
      this.$post({
        url: this.paramConfig.uploadUrl,
        query: item.fileClass, // 文件名称：需通过upload参数项中提供该参数
        params: formData
      }).then(({ data }) => {
        this.formModel[item.model] = data;
      });
    },
    // 文件类型判断
    fileTypeValidate (file, item) {
      let acceptType = item.accept || 'image/*';
      let type = file.type.split('/')[0];
      let accept = acceptType.split('/')[0];
      if (type !== accept) {
        let fileTypeObj = {
          image: '图片',
          video: '视频',
          file: '文件'
        };
        let txt = fileTypeObj[accept] ? `文件格式必须为${fileTypeObj[accept]}` : '文件格式不对';
        this.$message.error(txt);
        return false;
      }

      return true;
    },
    // 文件名的格式判断
    fileNameValidate (file) {
      let strArr = file.name.split('.');
      strArr.pop();
      let fileName = strArr.join('.'); // 文件名可能有多个点
      let reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
      if (!reg.test(fileName)) {
        this.$message.error('文件名不能包含标点、特殊字符');
        return false;
      }

      return true;
    },
    // 文件数量判断
    fileNumValidate (file, item) {
      // let key = item.model;
      item.fileList = item.fileList || [];
      let len = item.fileList.length;
      let limit = item.limit || 1;
      if (len < limit) {
        item.fileList.push({
          name: file.name,
          url: URL.createObjectURL(file)
        });
        return true;
      } else {
        this.$message.error(`文件数不超过${limit}`)
        return false;
      }
    },
    /** 预览图片 */
    uploadPreview (file) {
      let fileUrl = file.url;
      if (fileUrl && typeof fileUrl === 'string' && (fileUrl.includes('http') || fileUrl.includes('https'))) {
        window.open(fileUrl);
      } else {
        this.$message.error('没有可预览的链接');
      }
    },
    /** 删除文件 */
    uploadRemove (file, fileList, item) {
      item.fileList = fileList;
      this.formModel[item.model] = undefined;
    },
    /** 文件数超出个数 */
    uploadExceed (files, fileList) {
      this.$message.error(`文件数不超过${fileList.length}`)
    }
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  min-width: 600px;
  background-color: #fff;
  transition: all 0.3s;
  .el-form {
    width: 500px;
  }
}
.img-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  img {
    width: 100%;
    height: auto;
  }
}
</style>

