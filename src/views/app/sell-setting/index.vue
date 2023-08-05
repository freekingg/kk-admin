<template>
  <div class="container">
    <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" label-width="120px" class="ruleForm">
      <el-divider content-position="left">
        <el-tooltip class="box-item" effect="dark" content="若卖出范围不设定,卖出时就没有范围,若设定最低未设定最高,那就没有最高限制,反之亦然" placement="top-start">
          <div style="display: flex; align-items: center">
            <span style="margin-right: 3px">卖出范围 </span> <el-icon><Warning /></el-icon>
          </div>
        </el-tooltip>
      </el-divider>
      <el-form-item label="最低卖出" prop="platformMinSellAmount">
        <el-input-number v-model="state.dataForm.platformMinSellAmount" :precision="0" controls-position="right" placeholder="最低卖出数量" />
      </el-form-item>
      <el-form-item label="最高卖出" prop="platformMaxSellAmount">
        <el-input-number v-model="state.dataForm.platformMaxSellAmount" :precision="0" :max="2000" controls-position="right" placeholder="最高卖出数量" />
      </el-form-item>
      <el-form-item label="每日交易笔数" prop="dailySellLimit" style="margin-bottom: 30px">
        <el-input-number v-model="state.dataForm.dailySellLimit" :precision="0" controls-position="right" placeholder="单人每天可卖出的笔数" />
      </el-form-item>
      <el-divider content-position="left">交易时间</el-divider>
      <el-form-item label="交易时间" style="margin-bottom: 30px">
        <el-time-picker v-model="state.dataForm.date" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
      </el-form-item>
      <el-divider content-position="left">费率设置</el-divider>
      <el-form-item prop="intervalList">
        <div class="header-info">
          <el-button type="primary" plain :icon="Plus" @click="addRateHandle"> 新增 </el-button>
          <el-alert show-icon type="info" :closable="false">
            <span>币安买入对比单价：₹{{ state.dataForm.binanToFbBuyRate }} </span>
            <span style="padding-left: 12px">币安卖出对比单价：₹{{ state.dataForm.binanToFbSellRate }}</span>
          </el-alert>
        </div>

        <el-table :data="state.dataForm.intervalList" border size="small">
          <el-table-column prop="initVal" label="数量(USDT)" align="center" width="150">
            <template #default="scope">
              <div style="display: flex; justify-content: center; align-items: center">
                <span style="padding: 0 5px"> ≥ </span>
                <el-input-number v-if="scope.$index !== 0" v-model="scope.row.amount" :min="state.dataForm.intervalList[scope.$index - 1]['amount'] + 1 || 0" :precision="2" controls-position="right" placeholder="请输入" />
                <span v-else>{{ scope.row.amount }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="区间" align="center">
            <template #default="scope">
              {{ computedFee(scope.$index, "usdtNightRateList") }}
            </template>
          </el-table-column>
          <el-table-column label="加点" align="center" width="180">
            <template #default="scope">
              <el-input-number v-model="scope.row.rate" :min="0" :precision="2" controls-position="right" placeholder="请输入" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="卖出对比单价(₹)" align="center" width="140">
            <template #header>
              <el-tooltip class="box-item" effect="dark" content="取买入对比单价和卖出对比单价中的最大值" placement="top-start">
                <p style="display: flex; align-items: center; justify-content: center">
                  <span>卖出对比单价(₹)</span> <el-icon><Warning /></el-icon>
                </p>
              </el-tooltip>
            </template>
            <template #default="scope">
              <p>{{ state.dataForm.binanToFbBuyRate + scope.row.rate }}</p>
            </template>
          </el-table-column> -->
          <el-table-column label="BW卖出单价(₹)" align="center" width="140">
            <template #default="scope">
              <p>{{ (state.dataForm.binanToFbBuyRate + scope.row.rate).toFixed(2) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="每日可卖出笔数" align="center" width="180">
            <template #default="scope">
              <el-input-number v-model="scope.row.dailySellLimit" :min="0" :precision="0" controls-position="right" placeholder="请输入" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template #default="scope">
              <el-button type="danger" v-if="scope.$index !== 0" :plain="true" @click="removeRateHandle(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)"> {{ $t("confirm") }} </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { Plus, Warning } from "@element-plus/icons-vue";
const state = reactive({
  dataForm: {
    platformMinSellAmount: null,
    platformMaxSellAmount: null,
    date: "",
    intervalList: []
  }
});

const ruleFormRef = ref();
const rules = reactive({});
const loading = ref(false);

const getInfo = async () => {
  const info = await baseService.get("/app/setting/usdt_rate_setting");
  state.dataForm = info.data;
};

// 添加条件
const addRateHandle = async () => {
  let intervalList = state.dataForm.intervalList;
  const len = intervalList.length;
  let data = {
    amount: len == 0 ? 0 : intervalList[len - 1].amount,
    min: len == 0 ? 0 : intervalList[len - 1].amount,
    rate: null,
    dailySellLimit: null
  };
  state.dataForm.intervalList.push(data);
};

// 删除条件
const removeRateHandle = async (index) => {
  let intervalList = state.dataForm.intervalList;
  intervalList.splice(index, 1);
};

// 实时计算费率显示
const computedFee = (index) => {
  let list = state.dataForm.intervalList;
  if (index !== list.length) {
    if (list[index + 1]) {
      return `大于等于 ${list[index]["amount"]} 小于 ${list[index + 1]["amount"]}`;
    } else {
      return `大于等于 ${list[index]["amount"]}`;
    }
  }
  return "-";
};

// 提交
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      try {
        await baseService.post("/app/setting/usdt_rate_setting", state.dataForm);
        loading.value = false;
        ElMessage.success("提交成功");
      } catch (error) {
        loading.value = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(() => {
  getInfo();
});
</script>
<style lang="scss" scoped>
.ruleForm {
  width: 1000px;
}
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
