<template>
  <div>
    <vxe-toolbar perfect>
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus" status="perfect" @click="insertEvent(-1)">新增</vxe-button>
        <vxe-button icon="fa fa-trash-o" status="perfect" @click="removeEvent">删除</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table border show-overflow ref="xTable" class="my_table_insert" max-height="400" :data="props.tableList" :edit-config="{ trigger: 'click', mode: 'row' }" :edit-rules="validRules">
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column field="sort" title="排序" width="100" sortable :edit-render="{}">
        <template #default="{ row }">
          <span>{{ row.sort }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-input v-model="row.sort" type="text" placeholder="序号"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="ruleType" title="任务类型" :edit-render="{}" width="140">
        <template #default="{ row }"> {{ getDictLabel(store.state.dicts, "promo_rule_type", row.ruleType) }} </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.ruleType" transfer>
            <vxe-option v-for="item in promo_rule_type" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="name" title="任务名称" width="180" :edit-render="{ name: 'input', defaultValue: '', placeholder: '请输入任务名称' }"></vxe-column>
      <vxe-column field="rule" title="任务规则" :edit-render="{}">
        <template #default="{ row }">
          <template v-if="+row.ruleType === 1"> 成功注册 </template>
          <template v-if="+row.ruleType === 2">
            <div style="display: flex; align-items: center; font-size: 12px; line-height: 14px">
              <span style="padding: 0 2px">单人绑定</span>
              <span style="color: #17b3a3">{{ row.rule.count || "-" }}</span>
              <span style="padding: 0 2px">张卡</span>
            </div>
          </template>
          <template v-if="+row.ruleType === 3">
            <div style="display: flex; align-items: center; font-size: 12px; line-height: 14px">
              <span style="padding: 0 2px">单人充值</span>
              <span style="color: #17b3a3">{{ row.rule.count || "-" }}</span>
              <span style="padding: 0 2px">笔,</span>
              <span style="padding: 0 2px">单笔达到</span>
              <span style="color: #17b3a3">{{ row.rule.amount || "-" }}</span>
              <span style="padding: 0 2px">U</span>
            </div>
          </template>
          <template v-if="+row.ruleType === 4">
            <div style="display: flex; align-items: center; font-size: 12px; line-height: 14px">
              <span style="padding: 0 2px">单人卖出</span>
              <span style="color: #17b3a3">{{ row.rule.count || "-" }}</span>
              <span style="padding: 0 2px">笔,</span>
              <span style="padding: 0 2px">单笔达到</span>
              <span style="color: #17b3a3">{{ row.rule.amount || "-" }}</span>
              <span style="padding: 0 2px">U</span>
            </div>
          </template>
        </template>
        <template #edit="{ row }">
          <template v-if="+row.ruleType === 1"> 成功注册 </template>
          <template v-if="+row.ruleType === 2">
            <div style="display: flex; align-items: center; font-size: 12px; line-height: 14px">
              <span style="padding: 0 2px">单人绑定</span>
              <vxe-input v-model="row.rule.count" style="width: 60px" type="number" placeholder="数量" size="mini"></vxe-input>
              <span style="padding: 0 2px">张卡</span>
            </div>
          </template>
          <template v-if="+row.ruleType === 3">
            <div style="display: flex; align-items: center; font-size: 12px; line-height: 14px">
              <span style="padding: 0 2px">单人充值</span>
              <vxe-input v-model="row.rule.count" style="width: 60px" type="number" placeholder="数量" size="mini"></vxe-input>
              <span style="padding: 0 2px">笔,</span>
              <span style="padding: 0 2px">单笔达到</span>
              <vxe-input v-model="row.rule.amount" style="width: 60px" type="number" placeholder="数量" size="mini"></vxe-input>
              <span style="padding: 0 2px">U</span>
            </div>
          </template>
          <template v-if="+row.ruleType === 4">
            <div style="display: flex; align-items: center; font-size: 12px; line-height: 14px">
              <span style="padding: 0 2px">单人卖出</span>
              <vxe-input v-model="row.rule.count" style="width: 60px" type="number" placeholder="数量" size="mini"></vxe-input>
              <span style="padding: 0 2px">笔,</span>
              <span style="padding: 0 2px">单笔达到</span>
              <vxe-input v-model="row.rule.amount" style="width: 60px" type="number" placeholder="数量" size="mini"></vxe-input>
              <span style="padding: 0 2px">U</span>
            </div>
          </template>
        </template>
      </vxe-column>
      <vxe-column field="amount" title="完成奖励(U)" width="130" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.amount" type="number" placeholder="奖励数量"></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { getDictDataList, getDictLabel } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { VXETable } from "vxe-table";
import { useAppStore } from "@/store";
const store = useAppStore();
const promo_rule_type = computed(() => getDictDataList(store.state.dicts, "promo_rule_type"));

const props = defineProps({
  tableList: Array
});

const xTable = ref();

const validEvent = async () => {
  const $table = xTable.value;
  const errMap = await $table.validate();
  return new Promise((resolve) => {
    if (errMap) {
      VXETable.modal.message({ status: "error", message: "校验不通过！" });
      resolve(false);
    } else {
      resolve(true);
    }
  });
};

const insertEvent = async (row: number) => {
  let record = {
    rule: {
      count: 1,
      amount: 1
    }
  };
  let { row: newRow } = await xTable.value.insertAt(record, row);
  await xTable.value.setActiveCell(newRow, "sort");
};

const removeEvent = () => {
  const selectRecords = xTable.value.getCheckboxRecords();
  if (selectRecords.length) {
    xTable.value.removeCheckboxRow();
  } else {
    ElMessage.error("请至少选择一条数据");
  }
};

const getTableData = () => {
  return xTable.value.getTableData().tableData;
};

const validRules = ref({
  sort: [{ required: true, message: "必填项" }],
  name: [{ required: true, message: "必填项" }],
  ruleType: [{ required: true, message: "必填项" }],
  amount: [{ required: true, message: "必填项" }]
});

defineExpose({
  xTable,
  validEvent,
  getTableData
});
</script>

<style lang="scss" scoped></style>
