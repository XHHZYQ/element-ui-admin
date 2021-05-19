<template>
  <span v-hasPermi="item.permi">
    <el-button
      @click="item.handle(row)"
      :disabled="item.rowOptAble ? item.rowOptAble(row, item) : optAble(row, item)"
      type="text"
    >
      {{ item.rowOptText ? item.rowOptText(row) : optText(row, item) }}
    </el-button>
  <el-divider v-if="index < (len - 1)" direction="vertical"/>
  </span>
</template>

<script>
export default {
  name: 'rowButton',
  props: {
    index: {
      type: Number
    },
    len: {
      type: Number
    },
    item: {
      type: Object,
      default: () => ({})
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  created () {
  },
  methods: {
    /* 操作按钮禁用判断 */
    optAble (row, item) {
      let text = item.label;
      return false;
    },
    /* 处理状态字符 */
    optText (row, item) {
      let key;
      let hasKey = ['status_desc', 'status_str'].some(item => {
        if (row.hasOwnProperty(item)) {
          key = item;
        }
        return row.hasOwnProperty(item);
      });
      return hasKey ? row[key] : item.label;
    }
  }
};
</script>

<style scoped>

</style>
