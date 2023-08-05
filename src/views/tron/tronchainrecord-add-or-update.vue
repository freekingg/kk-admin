<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="Hash" prop="hash">
        <el-input v-model="dataForm.hash" placeholder="Hash"></el-input>
      </el-form-item>
      <el-form-item label="业务类型" prop="type">
        <ren-select v-model="dataForm.type" dict-type="chain_biz_type" placeholder="业务类型"></ren-select>
      </el-form-item>
      <el-form-item label="symbol" prop="symbol">
        <el-input v-model="dataForm.symbol" placeholder="symbol"></el-input>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input v-model="dataForm.amount" placeholder="金额"></el-input>
      </el-form-item>
      <el-form-item label="关联ID" prop="relatedId">
        <el-input v-model="dataForm.relatedId" placeholder="关联ID"></el-input>
      </el-form-item>
      <el-form-item label="发送地址" prop="fromAddr">
        <el-input v-model="dataForm.fromAddr" placeholder="发送地址"></el-input>
      </el-form-item>
      <el-form-item label="目标地址" prop="toAddr">
        <el-input v-model="dataForm.toAddr" placeholder="目标地址"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { t } = useI18n();
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  hash: "",
  type: "",
  symbol: "",
  amount: "",
  relatedId: "",
  fromAddr: "",
  toAddr: "",
  contractAddr: "",
  chainType: "",
  height: "",
  bandwidth: "",
  energy: "",
  trxFee: "",
  blockInfo: "",
  state: "",
  errMsg: "",
  remark: "",
  chainTime: "",
  createTime: "",
  updateTime: "",
});

const rules = ref({
});

const init = (id?: number) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  if (id) {
    getInfo(id);
  }
};

// 获取信息
const getInfo = (id: number) => {
  baseService.get("/tron/tronchainrecord/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/tron/tronchainrecord", dataForm).then((res) => {
      ElMessage.success({
        message: t("prompt.success"),
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit("refreshDataList");
        }
      });
    });
  });
};

defineExpose({
  init
});
</script>