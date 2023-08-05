<template>
  <div>
    <vxe-table border show-overflow ref="xTable" class="my_table_insert" max-height="400" :data="props.tableList">
      <vxe-column field="ruleType" title="任务类型" :edit-render="{}" width="140">
        <template #default="{ row }"> {{ getDictLabel(store.state.dicts, "promo_rule_type", row.ruleType) }} </template>
        <!-- <template #edit="{ row }">
          <vxe-select v-model="row.ruleType" transfer>
            <vxe-option v-for="item in promo_rule_type" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel"></vxe-option>
          </vxe-select>
        </template> -->
      </vxe-column>
      <vxe-column field="promoName" title="任务名称" width="180" :edit-render="{ name: 'input', defaultValue: '', placeholder: '请输入任务名称' }"></vxe-column>
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
      </vxe-column>
      <vxe-column field="amount" title="完成奖励(U)" width="130" :edit-render="{}">
        <template #default="{ row }">
          <span style="padding: 0 2px">{{ row.amount }}</span>
        </template>
      </vxe-column>
      <vxe-column field="amount" title="完成" width="130" :edit-render="{}">
        <template #default="{ row }">
          <el-tag v-if="row.flag === 1">
            {{ getDictLabel(store.state.dicts, "promo_flag", row.flag) }}
          </el-tag>
          <el-tag v-else type="danger">
            {{ getDictLabel(store.state.dicts, "promo_flag", row.flag) }}
          </el-tag>
        </template>
      </vxe-column>

      <!-- flag -->
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { getDictDataList, getDictLabel } from "@/utils/utils";
import { VXETable } from "vxe-table";
import { useAppStore } from "@/store";
const store = useAppStore();

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

const getTableData = () => {
  return xTable.value.getTableData().tableData;
};

defineExpose({
  xTable,
  validEvent,
  getTableData
});
</script>

<style lang="scss" scoped></style>
