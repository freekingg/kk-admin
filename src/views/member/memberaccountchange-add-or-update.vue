<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="会员" prop="memberUname">
        <el-input v-model="dataForm.memberUname" placeholder="会员"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="operateType">
        <ren-select v-model="dataForm.operateType" dict-type="member_account_type" placeholder="类型"></ren-select>
      </el-form-item>
      <el-form-item label="关联订单号" prop="relationOrderId">
        <el-input v-model="dataForm.relationOrderId" placeholder="关联订单号"></el-input>
      </el-form-item>
      <el-form-item label="账变前" prop="oldBalance">
        <el-input v-model="dataForm.oldBalance" placeholder="账变前"></el-input>
      </el-form-item>
      <el-form-item label="账变金额" prop="amount">
        <el-input v-model="dataForm.amount" placeholder="账变金额"></el-input>
      </el-form-item>
      <el-form-item label="账变后" prop="newBalance">
        <el-input v-model="dataForm.newBalance" placeholder="账变后"></el-input>
      </el-form-item>
      <el-form-item label="账变前冻结" prop="oldFrozenBalance">
        <el-input v-model="dataForm.oldFrozenBalance" placeholder="账变前冻结"></el-input>
      </el-form-item>
      <el-form-item label="账变冻结金额" prop="frozenAmount">
        <el-input v-model="dataForm.frozenAmount" placeholder="账变冻结金额"></el-input>
      </el-form-item>
      <el-form-item label="账变后冻结" prop="newFrozenBalance">
        <el-input v-model="dataForm.newFrozenBalance" placeholder="账变后冻结"></el-input>
      </el-form-item>
      <el-form-item label="账变时间" prop="createDate">
        <el-input v-model="dataForm.createDate" placeholder="账变时间"></el-input>
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
  memberId: "",
  memberUname: "",
  operateType: "",
  relationOrderId: "",
  oldBalance: "",
  amount: "",
  newBalance: "",
  oldFrozenBalance: "",
  frozenAmount: "",
  newFrozenBalance: "",
  createDate: "",
  creator: "",
  remarks: "",
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
  baseService.get("/member/memberaccountchange/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/member/memberaccountchange", dataForm).then((res) => {
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