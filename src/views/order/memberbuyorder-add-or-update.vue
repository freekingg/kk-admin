<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="订单ID" prop="id">
        <el-input v-model="dataForm.id" placeholder="订单ID"></el-input>
      </el-form-item>
      <el-form-item label="会员的id" prop="memberId">
        <el-input v-model="dataForm.memberId" placeholder="会员的id"></el-input>
      </el-form-item>
      <el-form-item label="会员账号" prop="memberUname">
        <el-input v-model="dataForm.memberUname" placeholder="会员账号"></el-input>
      </el-form-item>
      <el-form-item label="购买方式" prop="payMode">
        <ren-select v-model="dataForm.payMode" dict-type="platform_payment_methods" placeholder="购买方式"></ren-select>
      </el-form-item>
      <el-form-item label="充值金额" prop="amount">
        <el-input v-model="dataForm.amount" placeholder="充值金额"></el-input>
      </el-form-item>
      <el-form-item label="平台汇率" prop="platformToFbRate">
        <el-input v-model="dataForm.platformToFbRate" placeholder="平台汇率"></el-input>
      </el-form-item>
      <el-form-item label="补贴金额" prop="subsidyAmount">
        <el-input v-model="dataForm.subsidyAmount" placeholder="补贴金额"></el-input>
      </el-form-item>
      <el-form-item label="币安汇率" prop="binanToFbRate">
        <el-input v-model="dataForm.binanToFbRate" placeholder="币安汇率"></el-input>
      </el-form-item>
      <el-form-item label="币安汇率" prop="binanToFbAmount">
        <el-input v-model="dataForm.binanToFbAmount" placeholder="币安汇率"></el-input>
      </el-form-item>
      <el-form-item label="赠送" prop="profitRate">
        <el-input v-model="dataForm.profitRate" placeholder="赠送"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <ren-select v-model="dataForm.status" dict-type="order_status" placeholder="订单状态"></ren-select>
      </el-form-item>
      <el-form-item label="支付凭证" prop="payCertificate">
        <el-input v-model="dataForm.payCertificate" placeholder="支付凭证"></el-input>
      </el-form-item>
      <el-form-item label="凭证ID" prop="payCertificateId">
        <el-input v-model="dataForm.payCertificateId" placeholder="凭证ID"></el-input>
      </el-form-item>
      <el-form-item label="订单备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="订单备注"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="审核人" prop="updater">
        <el-input v-model="dataForm.updater" placeholder="审核人"></el-input>
      </el-form-item>
      <el-form-item label="审核时间" prop="updateDate">
        <el-input v-model="dataForm.updateDate" placeholder="审核时间"></el-input>
      </el-form-item>
      <el-form-item label="订单时间" prop="finishDate">
        <el-input v-model="dataForm.finishDate" placeholder="订单时间"></el-input>
      </el-form-item>
      <el-form-item label="备注字段1" prop="buyOrderExt1">
        <el-input v-model="dataForm.buyOrderExt1" placeholder="备注字段1"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
<!--
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
-->
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
  payMode: "",
  amount: "",
  platformToFbRate: "",
  subsidyAmount: "",
  binanToFbRate: "",
  binanToFbAmount: "",
  profitRate: "",
  status: "",
  payCertificate: "",
  payCertificateId: "",
  remark: "",
  createDate: "",
  updater: "",
  updateDate: "",
  finishDate: "",
  buyOrderExt1: "",
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
  baseService.get("/order/memberbuyorder/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/order/memberbuyorder", dataForm).then((res) => {
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
