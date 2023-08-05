<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="主键" prop="id">
        <el-input v-model="dataForm.id" placeholder="主键"></el-input>
      </el-form-item>
      <el-form-item label="会员ID" prop="memberId">
        <el-input v-model="dataForm.memberId" placeholder="会员ID"></el-input>
      </el-form-item>
      <el-form-item label="归属会员" prop="member_uname">
        <el-input v-model="dataForm.member_uname" placeholder="归属会员"></el-input>
      </el-form-item>
      <el-form-item label="收款方式" prop="type">
        <ren-select v-model="dataForm.type" dict-type="platform_payment_methods" placeholder="收款方式"></ren-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <ren-select v-model="dataForm.status" dict-type="yes_no" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item label="卡信息 " prop="jsonData">
        <el-input v-model="dataForm.jsonData" placeholder="卡信息 "></el-input>
      </el-form-item>
      <el-form-item label="" prop="unique">
        <el-input v-model="dataForm.unique" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="paymentMethodsExt2">
        <el-input v-model="dataForm.paymentMethodsExt2" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="time">
        <el-input v-model="dataForm.time" placeholder="创建时间"></el-input>
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
  member_uname: "",
  type: "",
  status: "",
  jsonData: "",
  unique: "",
  paymentMethodsExt2: "",
  time: "",
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
  baseService.get("/member/memberpaymentmethods/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/member/memberpaymentmethods", dataForm).then((res) => {
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
