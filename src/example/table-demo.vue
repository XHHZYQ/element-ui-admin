
<template>
  <div>
    <!--事件列表-->
    <x-table
      ref="table"
      :searchParams="searchParams"
      :searchList="searchList"
      :tableOptList="tableOptList"
      :rowOptList="rowOptList"
      :listApi="listApi"
      :columns="columns"
      :dataSource="tableData">
    </x-table>

    <el-button @click="getList">test bind</el-button>
  </div>
</template>

<script>
export default {
  name: 'table-demo',
  data () {
    return {
      searchParams: {
        productId: undefined,
        deviceCode: undefined,
        eventType: undefined,
        reportBeginTime: undefined,
        reportEndTime: undefined,
        handleBeginTime: undefined,
        handleEndTime: undefined
      },
      searchList: [
        { model: 'productId', placeholder: '产品', options: [], inputType: 'select' },
        { model: 'deviceId', placeholder: '设备', options: [], inputType: 'select' },
        { model: 'deviceCode', placeholder: '设备编号', options: [], inputType: 'input' },
        { model: 'eventType', placeholder: '事件类型', options: [], inputType: 'select' },
        { model: 'reportTime', placeholder: ['上报时间', '上报时间'], options: [], inputType: 'daterange', target: ['reportBeginTime', 'reportEndTime'] },
        { model: 'handleTime', placeholder: ['处理时间', '处理时间'], options: [], inputType: 'daterange', target: ['handleBeginTime', 'handleEndTime'] },
      ],
      tableOptList: [],
      rowOptList: [
        { label: '详情',
          handle: row => this.getEventDetail(row),
          permi: ['statist:eventList:detail']
        },
        { label: '处理',
          handle: row => this.handleOpera(row),
          rowOptAble: row => row.handleType !== '1',
          permi: ['statist:eventList:handle']
        }
      ],
      listApi: {
        url: undefined,
        resHandle: '', // this.resHandle
        searchHandle: ''
      },
      columns: [
        {
          slot: '', // 自定义列
          label: '设备编号',
          prop: 'deviceCode',
          width: undefined,
          align: 'left',
          tooltip: false,
          formatter: (row, column, cellValue) => { // 格式化数据
            return cellValue;
          }
        },
        {
          slot: '',
          label: '产品',
          prop: 'productName',
          minWidth: 100,
          align: 'left',
          tooltip: false
        },
        {
          slot: '',
          label: '事件类型',
          prop: 'eventType',
          width: 100,
          align: 'left',
          tooltip: false,
          formatter: (row, column, cellValue) => { // 格式化数据
            let eventTypeObj = {
              '1': '告警',
              '2': '故障',
              '3': '信息'
            }
            return eventTypeObj[cellValue];
          }
        },
        {
          slot: '',
          label: '事件名称',
          prop: 'eventName',
          width: undefined,
          align: 'left',
          tooltip: false
        },
        {
          slot: '',
          label: '上报时间',
          prop: 'reportTime',
          width: undefined,
          align: 'left',
          tooltip: false
        },
        {
          slot: '',
          label: '处理时间',
          prop: 'handleTime',
          width: undefined,
          align: 'left',
          tooltip: false
        },
        {
          slot: '',
          label: '处理结果',
          prop: 'handleType',
          width: 100,
          align: 'left',
          tooltip: false,
          formatter: (row, column, cellValue) => {
            return cellValue;
          }
        },
        {
          slot: '',
          label: '处理账号',
          prop: 'updateBy',
          width: 100,
          align: 'left',
          tooltip: false
        },
        {
          slot: 'action',
          label: '操作',
          align: 'left',
          width: 130
        }
      ],
      tableData: [
        {
          'logId': '1387609459252191233',
          'deviceCode': '0C2F566C',
          'productName': '13.3寸单目门禁一体机竖屏',
          'productType': 'C2',
          'deviceName': '硬件部测试设备',
          'reportTime': '2021-04-29 11:27:30',
          'eventName': '事件上报',
          'eventType': '1',
          'handleTime': null,
          'eventOutput': null,
          'handleAdvice': null,
          'handleType': '1',
          'updateBy': null
        },
        {
          'logId': '1387609459252191233',
          'deviceCode': '0C2F566C',
          'productName': '13.3寸单目门禁一体机竖屏',
          'productType': 'C2',
          'deviceName': '硬件部测试设备',
          'reportTime': '2021-04-29 11:27:30',
          'eventName': '事件上报',
          'eventType': '1',
          'handleTime': null,
          'eventOutput': null,
          'handleAdvice': null,
          'handleType': '1',
          'updateBy': null
        }
      ]
    };
  },
  created () {
    this.getPermission();
  },
  methods: {
    testBind () {
      let obj = {url: 'http://a/b/c'}
      function get () {
      }
      let newFn = get.bind(obj);
      newFn();
    },
    getList () {
      this.$get({
        url: '/iot/product/product/list',
        params: {},
        config: {
          headers: { Authorization: 'Bearer ed5b419d-82e8-42fa-a83c-60f3febc6977' }
        }
      }).then(({ data }) => {
      });
    },
    getPermission () {
      // 接口请求获取权限列表
      sessionStorage.setItem('permiList', JSON.stringify([
        // 'statist:eventList:detail',
        'statist:eventList:handle',
        'system:user:resetPwd'
      ]));
    },
    /** 处理操作项 */
    handleOpera (row) {
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


