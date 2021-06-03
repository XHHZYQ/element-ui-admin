<template>
  <div class="table-container" :class="{'table-box': !isNest}" :style="{'min-width': tableWidth}">
    <!--搜索项-->
    <el-form :model="formModel" ref="tableSearch">
      <el-row :gutter="24">

        <el-col :span="8" v-for="(item, index) of searchList" :key="item.model"
                :style="{display: index < count ? 'block' : 'none'}">

          <!--input 输入框-->
          <template v-if="item.inputType==='input'">
            <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
            <el-form-item
              v-if="!item.slot && !item.isHidden"
              :label="item.label"
              :prop="item.model"
            >
              <!--type 属性可选为input、textarea等元素属性-->
              <el-input
                v-model.trim="formModel[item.model]"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                @keyup.enter.native="formSearch"
                @blur="e => item.blur && item.blur(e)"
                @change="e => item.change && item.change(e)"
                :type="item.type || 'input'"
                clearable
              ></el-input>
            </el-form-item>
          </template>

          <!--select选择框-->
          <template v-if="item.inputType==='select'">
            <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
            <el-form-item
              v-if="!item.slot && !item.isHidden"
              :label="item.label"
              :prop="item.model"
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
                  :value="ele.value || ele.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </template>

          <!--级联选择框-->
          <template v-if="item.inputType==='cascader'">
            <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
            <el-form-item
              v-if="!item.slot && !item.isHidden"
              :label="item.label"
              :prop="item.model"
            >
              <el-cascader
                @change=" e => item.change && item.change(e)"
                v-model="formModel[item.model]"
                :options="item.options"
                :props="cascaderProps(item.props)"
                clearable
                filterable
                :filter-method="cascaderFilter"
                :placeholder="item.placeholder"></el-cascader>
            </el-form-item>
          </template>

          <!--日期选择框-->
          <template v-if="['date', 'datetime'].some(part => part === item.inputType)">
            <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
            <el-form-item
              v-if="!item.slot && !item.isHidden"
              :label="item.label"
              :prop="item.model"
            >
              <!--type = date/datetime-->
              <el-date-picker
                @change="e => item.change && item.change(e)"
                v-model="formModel[item.model]"
                :type="item.inputType"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :format="item.valueFormat || 'yyyy-MM-dd'"
                :value-format="item.valueFormat || 'yyyy-MM-dd'"
                :picker-options="{disabledDate: date => disabledDate(date, item.disDate)}"
                :clearable="item.clearable || true"
              >
              </el-date-picker>
            </el-form-item>
          </template>

          <!--日期范围选择框-->
          <template v-if="['datetimerange', 'daterange'].some(part => part === item.inputType)">
            <slot v-if="item.slot" :name="item.slot" :formItem="item"></slot>
            <el-form-item
              v-if="!item.slot && !item.isHidden"
              :label="item.label"
              :prop="item.model"
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
                :format="item.valueFormat || 'yyyy-MM-dd'"
                :value-format="item.valueFormat || 'yyyy-MM-dd'"
                :picker-options="{disabledDate: date => disabledDate(date, item.disDate)}"
                :clearable="item.clearable || true"
              >
              </el-date-picker>
            </el-form-item>
          </template>

        </el-col>

<!--        <el-col v-if="searchList.length" :class="{'space-right': spaceRight}" :span="searchSpan">-->
        <el-col v-if="searchList.length" :class="{'space-right': expand}" :span="expand ? 24 : 8">
          <el-form-item class="search-btn">
            <el-button type="primary" @click="formSearch">搜索</el-button>
            <el-button @click="formReset">重置</el-button>
            <el-link
              v-if="searchList.length > 2"
              @click="triggerExpand"
              type="primary"
              :underline="false">
              {{expand ? '收起' : '展开'}}
              <i :class="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-link>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <!--表格 操作项-->
    <div class="table-opt" v-if="tableOptList.length">
      <template v-for="(item, index) of tableOptList">
        <el-button
          :key="index"
          v-if="!item.isHidden"
          @click.native="btnsHandle(item)"
          v-hasPermi="item.permi"
          :disabled="item.disabled"
          type="primary"
          :loading="item.loading"
          :icon="item.icon">
          {{item.label}}
        </el-button>
      </template>
    </div>

    <template v-if="columns.length">
      <!--table 部分-->
      <el-table
        ref="table"
        @select="tableSelect"
        @select-all="tableSelect"
        @row-click="rowClick"
        :row-key="rowKey"
        v-loading="loading.loading"
        :data="tableData"
        tooltip-effect="dark"
      >

        <slot name="table-column">
          <template v-for="(item, index) of columns">
            <el-table-column
              v-if="index === 0 && item.type"
              :type="item.type"
              :align="item.align"
              :selectable="(row) => item.selectable ? item.selectable(row) : true"
              :min-width="item.minWidth"
              :width="item.width"
            >
            </el-table-column>

            <el-table-column
              v-else-if="!item.slot && !item.isHidden"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :align="item.align"
              :show-overflow-tooltip="item.tooltip"
              :formatter="(row, column, cellValue) => item.formatter ? item.formatter(row, column, cellValue) : cellValue"
              :min-width="item.minWidth"
              :width="item.width"
            >
            </el-table-column>

            <el-table-column
              v-else-if="item.slot && item.slot !== 'action' && !item.isHidden"
              :key="index"
              :label="item.label"
              :align="item.align"
              :show-overflow-tooltip="item.tooltip"
              :formatter="(row, column, cellValue) => item.formatter ? item.formatter(row, column, cellValue) : cellValue"
              :min-width="item.minWidth"
              :width="item.width"
            >
              <template slot-scope="{row}">
                <slot :name="item.slot" :row="row"></slot>
              </template>
            </el-table-column>


            <el-table-column
              v-else-if="item.slot && !item.isHidden"
              :key="index"
              :label="item.label"
              :align="item.align"
              :min-width="item.minWidth"
              :width="item.width"
            >
              <template slot-scope="{row}">

              <span v-for="(ele, index) of rowOptList" :key="index">
                <template v-if="index < rowOptLen">  <!--默认3，列表默认展示3个-->
                  <row-button :item="ele" :row="row" :len="rowOptList.length" :index="index"></row-button>
                  <!--<el-divider v-if="index < (rowOptList.length - 1)" direction="vertical"/>-->
                </template>

                <template v-if="index > rowOptLen-1">  <!--更多从第4个开始展示-->
                  <el-dropdown>
                    <el-button type="text">更多<i class="el-icon-arrow-down"/></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(part, i) of ele" :key="i">
                         <row-button :item="part" :row="row"></row-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </span>

              </template>
            </el-table-column>
          </template>
        </slot>

      </el-table>

      <!--分页-->
      <div class="pagina-box">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="paginationParam.pageNum"
          :page-size="paginationParam.pageSize"
          :total="paginationParam.total"
          :page-sizes="[5, 10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import { form } from '../../util/mixins';
import { resetData } from '../../util';
import rowButton from './rowButton';
export default {
  mixins: [form],
  name: 'tabulation',
  components: {
    rowButton
  },
  props: {
    tableWidth: {
      type: String,
      default: () => '1000px'
    },
    isNest: { // 外层是否有嵌套
      type: Boolean,
      default: () => false
    },
    rowClickAble: {
      type: Boolean,
      default: () => false
    },
    rowKey: {
      type: String,
      default: () => 'id'
    },
    rowOptLen: {
      type: Number,
      default: () => 3
    },
    queryParam: {
      type: Object,
      default: () => {
        return { pageNum: 1, pageSize: 20 };
      }
    },
    excludeResetKey: {
      type: Array,
      default: () => []
    },
    formModel: {
      type: Object,
      default: () => ({})
    },
    searchParams: {
      type: Object,
      default: () => ({})
    },
    searchList: {
      type: Array,
      default: () => []
    },
    tableOptList: {
      type: Array,
      default: () => []
    },
    rowOptList: {
      type: Array,
      default: () => []
    },

    listApi: {
      type: Object,
      default: () => ({})
    },
    addHandleParam: {
      type: Object,
      default: () => ({})
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchSpan: 8,
      selectionIds: [],
      selectionRows: [],
      clickRows: [],
      paginationParam: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },

      expand: false,
      loading: { loading: false },
      tableData: []
    };
  },
  watch: {
    // formModel: {
    //   deep: true,
    //   handler (val) {
    //   }
    // }
  },
  computed: {
    count () {
      return this.expand ? this.searchList.length : 2;
    },
    spaceRight () {
      return this.expand && (this.searchList.length % 3 !== 2);
    }
  },
  mounted () {
    if (this.dataSource.length) {
      this.tableData = this.dataSource;
    }
    Object.assign(this.searchParams, this.queryParam);
    this.listApi.url && this.getTableList();
  },
  methods: {
    triggerExpand () {
      this.expand = !this.expand;
      if (this.expand) {
        let result = this.searchList.length % 3;
        let spanObj = { '0': 24, '1': 16, '2': 8 };
        this.searchSpan = spanObj[result];
      } else {
        this.searchSpan = 8;
      }
    },
    /** 设置表单 */
    setForm (model, value) {
      this.formModel[model] = value;
    },
    /** table selection change 事件 */
    tableSelect (selection, others, clear) {
      this.tableOptStatus(selection);

      let ids = selection.map(item => item[this.rowKey]);
      this.selectionIds = ids;
      this.selectionRows = selection;
      this.$emit('tableSelection', ids, selection);
    },
    /** 切换table操作项状态 */
    tableOptStatus (selection) {
      this.tableOptList.forEach(item => { // 切换操作按钮状态
        if (item.hasOwnProperty('disabled')) {
          selection.length ? item.disabled = false : item.disabled = true;
        }
      });
    },
    /** table 某一行被点击 */
    rowClick (row, column, e) {
      if (!this.rowClickAble) { return; }
      let hasSelect = this.selectionRows.some((item, index) => {
        if (item[this.rowKey] === row[this.rowKey]) {
          this.clickRows.splice(index, 1);
        }
        return item[this.rowKey] === row[this.rowKey];
      });

      if (hasSelect) {
        this.$refs.table.toggleRowSelection(row, false)
        this.tableSelect(this.clickRows);
      } else {
        this.$refs.table.toggleRowSelection(row, true)
        this.clickRows.push(row);
        this.tableSelect(this.clickRows);
      }
    },
    sizeChange(val) {
      this.paginationParam.pageSize = val;
      this.searchParams.pageSize = val;
      this.paginationParam.pageNum = 1;
      this.searchParams.pageNum = 1;

      this.tableChange();
    },
    currentChange(val) {
      this.paginationParam.pageNum = val;
      this.searchParams.pageNum = val;

      this.tableChange();
    },
    tableChange () {
      this.getTableList(this.paginationParam);
    },
    /* 按钮组 */
    btnsHandle (item) {
      if (item.key === 'add') {
        let route = this.getRoute();
        if (route) {
          this.$router.push({ name: route });
        } else {
          item.handle && item.handle();
        }
      } else if (item.key === 'delete') {
        item.handle && item.handle(this.selectionIds, this.selectionRows);
        // this.showDeleteConfirm(this.selectedRows);
      } else if (item.handle) {
        item.handle(item);
        // item.handle(this.selectedId, this.selectedRows);
      }
    },
    getRoute () {
      if (this.addHandleParam.route && typeof this.addHandleParam.route === 'function') {
        return this.addHandleParam.route();
      } else {
        return this.addHandleParam.route;
      }
    },
    /** 打开删除对话框 */
    showDeleteConfirm (row) {
      let deleteParam = this.deleteParam;
      let id = this.rowKey;
      let canDelete;
      let selectedId = [];
      let isBatch = !!(Array.isArray(row) && row.length);
      if (isBatch) {
        let noKey;
        row.forEach((el) => {
          !el.hasOwnProperty('can_delete') ? noKey = true : noKey = false;
          if (noKey === true) {
            selectedId.push(el[id]);
          } else {
            if (el.can_delete === 1) { selectedId.push(el[id]); }
          }
        });
        if (noKey) {
          canDelete = true;
        } else {
          selectedId.length ? canDelete = true : canDelete = false;
        }
      } else {
        if (row.hasOwnProperty('can_delete')) {
          row.can_delete === 1 ? canDelete = true : canDelete = false;
        } else { // 列表没有can_delete字段
          canDelete = true;
        }
        selectedId = [row[id]];
        var name = row[deleteParam.key];
      }
      let msg;
      if (canDelete) {
        if (isBatch) { // 点击批量删除
          msg = `确定要删除 ${selectedId.length} 条${deleteParam.title}数据？`;
        } else { // 点击单条删除
          msg = `确定要删除${deleteParam.title}：${name}？`;
        }
      } else {
        msg = `没有可删除的数据？`;
      }
      this[canDelete ? '$confirm' : '$error']({
        title: msg,
        okType: 'danger',
        centered: true,
        onOk: () => {
          if (canDelete) {
            this.deleteSelected(selectedId);
          }
        }
      });
    },
    /* 删除所有选中 */
    deleteSelected (selectedId) {
      if (Array.isArray(selectedId)) {
        selectedId = selectedId.join(',');
      }
      this.deleteParam.param.pk_val = selectedId;
      this.$delete({
        url: this.deleteParam.url,
        params: this.deleteParam.param
      }).then((res) => {
        this.$message.success(`删除成功！`);
        this.getTableList();
        this.tableOptList.forEach((ele) => {
          if (ele.hasOwnProperty('disabled')) {
            ele.disabled = true;
          }
        });
        this.deleteParam.resHandle && this.deleteParam.resHandle();
      });
    },
    /** 清空 */
    formReset () {
      resetData(this.formModel);
      resetData(this.searchParams, this.excludeResetKey);
      Object.assign(this.paginationParam, this.queryParam);
      this.$emit('resetSearch');
      this.getTableList();
    },
    /** 查询 */
    formSearch  () {
      for (let item in this.searchParams) {
        if (this.formModel.hasOwnProperty(item)) {
          this.searchParams[item] = this.formModel[item];
        }
      }

      this.searchList.forEach((el) => {
        let isDate = ['datetimerange', 'daterange'].some(item => item === el.inputType);
        if (el.target && isDate) {
          let model = this.formModel[el.model];
          this.searchParams[el.target[0]] = model ? model[0] : undefined;
          this.searchParams[el.target[1]] = model ? model[1] : undefined;
        }
      });

      for (let item in this.searchParams) {
        if (Array.isArray(this.searchParams[item])) {
          this.searchParams[item] = this.searchParams[item].join(',');
        }
      }
      this.filterParam(this.searchParams);
      typeof this.listApi.searchHandle === 'function' && this.listApi.searchHandle();

      this.$emit('handleSearch', this.searchParams);
      this.getTableList();
    },
    /** 过滤value为空字符的参数 */
    filterParam (data) {
      for (let item in data) {
        data[item] === '' && (data[item] = undefined);
      }
      return data;
    },

    /* 获取列表 */
    getTableList (pagination = {}) {
      if (!this.listApi.url) {
        return;
      }
      this.searchParams.pageNum = pagination.pageNum || this.queryParam.pageNum;
      this.searchParams.pageSize = pagination.pageSize || this.queryParam.pageSize;
      if (!Object.keys(pagination).length) {
        this.paginationParam.pageNum = this.searchParams.pageNum;
        this.paginationParam.pageSize = this.searchParams.pageSize;
      }

      // 列表数据变动后都要重置
      this.tableSelect([], undefined, 'clear');
      this.clickRows = [];

      this.$get({
        url: this.listApi.url,
        params: this.searchParams,
        loading: this.loading
      }).then(({data}) => {
        if (this.listApi.resHandle) {
          this.tableData = this.listApi.resHandle(data.rows || data);
        } else {
          this.tableData = data.rows || data;
        }
        if (data.hasOwnProperty('total')) {
          this.paginationParam.total = data.total;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .table-container {
    background-color: #fff;
    transition: all 0.3s;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
    .search-btn {
      min-width: 240px;
    }
    .el-link {
      margin-left: 5px;
    }
    .table-opt {
      margin-bottom: 22px;
      .el-button {
        /*margin-right: 8px;*/
      }
    }
    .el-table {
      min-width: inherit;
    }
    .el-table--scrollable-x {
      .el-table__body-wrapper {
        overflow: visible;
      }
    }
    .pagina-box {
      margin-top: 20px;
      text-align: right;
    }
  }
</style>

<style lang="scss">
.el-table .el-table__header-wrapper th {
  word-break: break-word;
  background-color: #f8f8f9;
  color: #515a6e;
  height: 40px;
  font-size: 14px;
  font-weight: bold;
}
.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #e6f7ff;
}

.space-right {
  .el-form-item__content {
    text-align: right;
  }
}
</style>
