<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="会员" prop="memberUname">
        <el-input v-model="dataForm.memberUname" placeholder="会员"></el-input>
      </el-form-item>
      <el-form-item label="收款方式" prop="memberPaymentMethod">
        <ren-select v-model="dataForm.memberPaymentMethod" dict-type="platform_payment_methods" placeholder="收款方式"></ren-select>
      </el-form-item>
      <el-form-item label="会员收款账号id" prop="memberPaymentMethodId">
        <el-input v-model="dataForm.memberPaymentMethodId" placeholder="会员收款账号id"></el-input>
      </el-form-item>
      <el-form-item label="付款方式" prop="platformPaymentMode">
        <ren-select v-model="dataForm.platformPaymentMode" dict-type="platform_payment_methods" placeholder="付款方式"></ren-select>
      </el-form-item>
      <el-form-item label="平台付款账号id" prop="platformPaymentId">
        <el-input v-model="dataForm.platformPaymentId" placeholder="平台付款账号id"></el-input>
      </el-form-item>
      <el-form-item label="付款账号" prop="platformPaymentName">
        <el-input v-model="dataForm.platformPaymentName" placeholder="付款账号"></el-input>
      </el-form-item>
      <el-form-item label="订单金额" prop="amount">
        <el-input v-model="dataForm.amount" placeholder="订单金额"></el-input>
      </el-form-item>
      <el-form-item label="平台汇率" prop="platformToFbRate">
        <el-input v-model="dataForm.platformToFbRate" placeholder="平台汇率"></el-input>
      </el-form-item>
      <el-form-item label="币安汇率" prop="binanToFbRate">
        <el-input v-model="dataForm.binanToFbRate" placeholder="币安汇率"></el-input>
      </el-form-item>
      <el-form-item label="实收金额" prop="receiptAmount">
        <el-input v-model="dataForm.receiptAmount" placeholder="实收金额"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <ren-select v-model="dataForm.status" dict-type="member_sell_order_st" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item label="凭证ID" prop="payCertificateId">
        <el-input v-model="dataForm.payCertificateId" placeholder="凭证ID"></el-input>
      </el-form-item>
      <el-form-item label="支付凭证" prop="payCertificate">
        <el-input v-model="dataForm.payCertificate" placeholder="支付凭证"></el-input>
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
      <el-form-item label="完成时间" prop="finishDate">
        <el-input v-model="dataForm.finishDate" placeholder="完成时间"></el-input>
      </el-form-item>
      <!--      <el-form-item label="拓展字段1" prop="sellOrderExt1">
        <el-input v-model="dataForm.sellOrderExt1" placeholder="拓展字段1"></el-input>
      </el-form-item>
      <el-form-item label="拓展字段2" prop="sellOrderExt2">
        <el-input v-model="dataForm.sellOrderExt2" placeholder="拓展字段2"></el-input>
      </el-form-item>-->
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
  memberPaymentMethod: "",
  memberPaymentMethodId: "",
  platformPaymentMode: "",
  platformPaymentId: "",
  platformPaymentName: "",
  amount: "",
  platformToFbRate: "",
  binanToFbRate: "",
  receiptAmount: "",
  status: "",
  payCertificateId: "",
  payCertificate: "",
  remark: "",
  createDate: "",
  updater: "",
  updateDate: "",
  finishDate: "",
  sellOrderExt1: "",
  sellOrderExt2: ""
});

const rules = ref({});

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
  baseService.get("/order/membersellorder/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/order/membersellorder", dataForm).then((res) => {
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
