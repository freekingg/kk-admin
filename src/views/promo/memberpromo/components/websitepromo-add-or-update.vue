<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="1100px">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="子任务名称" prop="websitePromoName">
        <el-input v-model="dataForm.websitePromoName" placeholder="子任务名称" :disabled="dataForm.id ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="任务金额" prop="amount">
        <el-input v-model="dataForm.amount" placeholder="任务金额" :disabled="dataForm.id ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="websitePromoType">
        <ren-select v-model="dataForm.websitePromoType" :disabled="dataForm.id ? true : false" dict-type="promo_type" placeholder="类型"></ren-select>
      </el-form-item>
      <el-form-item label="完成状态" prop="flag">
        <ren-select v-model="dataForm.flag" dict-type="promo_flag" placeholder="完成状态" :disabled="dataForm.id ? true : false"></ren-select>
      </el-form-item>
      <el-form-item label="结算状态" prop="settleFlag">
        <ren-select v-model="dataForm.settleFlag" dict-type="promo_settle_flag" placeholder="结算状态" :disabled="dataForm.id ? true : false"></ren-select>
      </el-form-item>
      <el-form-item label="收益人" prop="beneficiaryMemberUname">
        <el-input v-model="dataForm.beneficiaryMemberUname" placeholder="收益人" :disabled="dataForm.id ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="被邀请人" prop="eventUname">
        <el-input v-model="dataForm.eventUname" placeholder="被邀请人" :disabled="dataForm.id ? true : false"></el-input>
      </el-form-item>
    </el-form>

    <otherTable v-if="+dataForm.websitePromoType === 1" ref="otherTableRef" :tableList="dataForm.subList" />
    <!-- <selfTable v-if="+dataForm.websitePromoType === 2" ref="selfTableRef" :tableList="dataForm.subList" /> -->

    <template v-slot:footer>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import otherTable from "./other-table.vue";
import selfTable from "./self-table.vue";
const { t } = useI18n();
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);

const dataFormRef = ref();
const otherTableRef = ref();
const selfTableRef = ref();

const dataForm = reactive({
  id: "",
  websitePromoName: "",
  websitePromoType: "",
  flag: "",
  settleFlag: "",
  amount: "",
  beneficiaryMemberUname: "",
  eventUname: "",
  subList: []
});

const rules = ref({
  websitePromoName: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  websitePromoType: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  status: [{ required: true, message: t("validate.required"), trigger: "blur" }]
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
    let subList = res.data.subList;
    for (const iterator of subList) {
      iterator.ruleType = iterator.ruleType + "";
      try {
        let rule = iterator.rule ? JSON.parse(iterator.rule) : {};
        iterator.rule = rule;
      } catch (error) {
        console.log("error: ", error);
        iterator.rule = { count: 1, amount: "" };
      }
    }
    // 自己完成的任务，数据格式需要特殊处理
    if (res.data.websitePromoType === 2 && subList.length) {
      const selfData = subList[0];
      if (selfData.rule && Array.isArray(selfData.rule)) {
        res.data.subList = JSON.parse(selfData.rule);
      }
    }
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  visible.value = false;
};

defineExpose({
  init
});
</script>
