<template>
  <div id="app">
    <x-form
      ref="addEdit"
      :formModel="formModel"
      :formRules="formRules"
      :formList="formList"
    />
  </div>
</template>

<script>
import form from '../package/index';
export default {
  name: 'form-demo',
  components: {
    'x-form': form
  },
  data () {
    return {
      formModel: {
        orgId: undefined,
        templateName: undefined,
        noticeType: undefined,
        telephone: undefined,
        playCount: undefined,
        templateCode: undefined,
        serviceProvider: undefined,
        signName: undefined
      },
      formRules: {
        orgId: { required: true, message: '请选择组织' },
        templateName: [
          { required: true, message: '请输入模板名称' }
        ],
        noticeType: { required: true, message: '请选择通知类型' },
        telephone: { required: false, message: '请输入被叫显号' },
        playCount: { required: true, message: '请输入语音播放次数' },
        templateCode: [
          { required: true, message: '请输入模板编码' },
          { min: 0, max: 250, message: '模板编码长度为1-250位' }
        ],
        serviceProvider: [{ required: true, message: '请选择服务商' }],
        signName: [
          { required: true, message: '请选输入短信签名' }
        ]
      },
      formList: [
        {
          label: '组织',
          inputType: 'select',
          options: [],
          handle: '',
          placeholder: '请选择组织',
          isHidden: false,
          model: 'orgId'
        },
        {
          label: '模板名称',
          inputType: 'input',
          options: [],
          handle: '',
          placeholder: '请输入模板名称',
          maxlength: 20,
          model: 'templateName'
        },
        {
          label: '通知类型',
          inputType: 'select',
          options: [],
          change: this.typeChange,
          placeholder: '请选择通知类型',
          model: 'noticeType'
        },
        { // 阿里云: 1; 华为云: 2; 创蓝: 3
          label: '服务商',
          inputType: 'select',
          options: [],
          isHidden: true,
          change: this.providerChange,
          placeholder: '请选择服务商',
          model: 'serviceProvider'
        },
        {
          label: '短信签名',
          inputType: 'input',
          options: [],
          isHidden: true,
          placeholder: '请选输入短信签名',
          maxlength: 50,
          model: 'signName'
        },

        {
          isHidden: true,
          label: '被叫显号',
          inputType: 'input',
          options: [],
          handle: '',
          placeholder: '请输入被叫显号',
          maxlength: 20,
          model: 'telephone'
        },
        {
          isHidden: true,
          label: '播放次数',
          inputType: 'inputNum',
          options: [],
          handle: '',
          placeholder: '请输入播放次数',
          min: 1,
          max: 3,
          model: 'playCount'
        },

        {
          label: '模板编码',
          inputType: 'input',
          options: [],
          handle: '',
          placeholder: '请输入模板编码',
          maxlength: 100,
          model: 'templateCode'
        },
        {
          slot: 'otherConfig',
          label: '其他配置',
          inputType: 'input'
        }
      ]
    };
  },
  created () {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
