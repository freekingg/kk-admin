<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="活动名称" prop="websitePromoName">
        <el-input v-model="dataForm.websitePromoName" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="收益会员的id" prop="beneficiaryMemberId">
        <el-input v-model="dataForm.beneficiaryMemberId" placeholder="收益会员的id"></el-input>
      </el-form-item>
      <el-form-item label="邀请人账号" prop="beneficiaryMemberUname">
        <el-input v-model="dataForm.beneficiaryMemberUname" placeholder="邀请人账号"></el-input>
      </el-form-item>
      <el-form-item label="事件会员的id" prop="eventMemberId">
        <el-input v-model="dataForm.eventMemberId" placeholder="事件会员的id"></el-input>
      </el-form-item>
      <el-form-item label="被邀请人账号" prop="eventMemberUname">
        <el-input v-model="dataForm.eventMemberUname" placeholder="被邀请人账号"></el-input>
      </el-form-item>
      <el-form-item label="获取任务金额" prop="amount">
        <el-input v-model="dataForm.amount" placeholder="获取任务金额"></el-input>
      </el-form-item>
      <el-form-item label="活动ID" prop="websitePromoId">
        <el-input v-model="dataForm.websitePromoId" placeholder="活动ID"></el-input>
      </el-form-item>
      <el-form-item label="任务类型 1 自己的任务 2 邀请他人完成的任务" prop="websitePromoType">
        <ren-select v-model="dataForm.websitePromoType" dict-type="promo_type" placeholder="任务类型 1 自己的任务 2 邀请他人完成的任务"></ren-select>
      </el-form-item>
      <el-form-item label="完成状态  0：未完成  1：已完成" prop="flag">
        <ren-select v-model="dataForm.flag" dict-type="yes_no" placeholder="完成状态  0：未完成  1：已完成"></ren-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="是否结算  0：未结算  1：已结算" prop="settleFlag">
        <ren-select v-model="dataForm.settleFlag" dict-type="yes_no" placeholder="是否结算  0：未结算  1：已结算"></ren-select>
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
  websitePromoName: "",
  beneficiaryMemberId: "",
  beneficiaryMemberUname: "",
  eventMemberId: "",
  eventMemberUname: "",
  amount: "",
  websitePromoId: "",
  websitePromoType: "",
  flag: "",
  createDate: "",
  settleFlag: "",
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
  baseService.get("/member/memberpromo/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/member/memberpromo", dataForm).then((res) => {
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