<template>
  <div>
    <div class="header-info">
      <el-button type="primary" plain size="small" :icon="Plus" @click="addRateHandle"> 新增 </el-button>
    </div>

    <el-table :data="tableList" border size="small">
      <el-table-column prop="initVal" label="单笔数量(USDT)" align="center" width="150">
        <template #default="scope">
          <div style="display: flex; justify-content: center; align-items: center">
            <span style="padding: 0 5px"> ≥ </span>
            <!-- v-if="scope.$index !== 0" -->
            <el-input-number v-model="scope.row.count" :min="scope.row.min || 0" :precision="2" controls-position="right" placeholder="请输入" />
            <!-- <span v-else>{{ scope.row.count }}</span> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="任务规则" align="center">
        <template #default="scope">
          {{ computedFee(scope.$index, "usdtNightRateList") }}
        </template>
      </el-table-column>
      <el-table-column label="完成奖励(U)" align="center" width="180">
        <template #default="scope">
          <el-input-number v-model="scope.row.amount" :min="0" :precision="2" controls-position="right" placeholder="请输入" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template #default="scope">
          <el-button type="danger" v-if="scope.$index !== 0" :plain="true" @click="removeRateHandle(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
const props = defineProps({
  tableList: Array
});

// 添加条件
const addRateHandle = async () => {
  let intervalList = props.tableList;
  const len = intervalList.length;
  let data = {
    count: len == 0 ? 0 : intervalList[len - 1].count,
    min: len == 0 ? 0 : intervalList[len - 1].count,
    amount: null
  };
  intervalList.push(data);
};

// 删除条件
const removeRateHandle = async (index) => {
  let intervalList = props.tableList;
  intervalList.splice(index, 1);
};

// 实时计算费率显示
const computedFee = (index) => {
  let list = props.tableList;
  if (index !== list.length) {
    if (list[index + 1]) {
      return `大于等于 ${list[index]["count"]} 小于 ${list[index + 1]["count"]}`;
    } else {
      return `大于等于 ${list[index]["count"]}`;
    }
  }
  return "-";
};

const validEvent = async () => {
  let list = props.tableList;
  let result = list.filter((item) => !item.amount);
  return new Promise((resolve) => {
    if (result.length) {
      ElMessage.error("校验不通过！请检查输入的值");
      resolve(false);
    } else {
      resolve(true);
    }
  });
};

const getTableData = () => {
  let arr = [];
  let list = props.tableList;
  arr.push({ rule: list, ruleType: 3 });
  return arr;
};

defineExpose({
  validEvent,
  getTableData
});
</script>

<style lang="scss" scoped>
.header-info {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  .el-alert {
    :deep(.el-icon) {
      font-size: 16px;
    }
    :deep(.el-alert__content) {
      padding-left: 0;
    }

    margin-left: 10px;
    margin-top: 0;
    padding: 0;
  }
}
</style>
