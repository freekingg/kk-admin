<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="CODE" prop="code">
        <el-input v-model="dataForm.code" placeholder="CODE"></el-input>
      </el-form-item>
      <el-form-item label="后台地址" prop="bgGateway">
        <el-input v-model="dataForm.bgGateway" placeholder="后台地址"></el-input>
      </el-form-item>
      <el-form-item label="后台用户名" prop="bgUname">
        <el-input v-model="dataForm.bgUname" placeholder="后台用户名"></el-input>
      </el-form-item>
      <el-form-item label="后台密码" prop="bgPwd">
        <el-input v-model="dataForm.bgPwd" placeholder="后台密码"></el-input>
      </el-form-item>
      <el-form-item label="api商户号" prop="apiMerchantNo">
        <el-input v-model="dataForm.apiMerchantNo" placeholder="api商户号"></el-input>
      </el-form-item>
      <el-form-item label="api秘钥" prop="apiKey">
        <el-input v-model="dataForm.apiKey" placeholder="api秘钥"></el-input>
      </el-form-item>
      <el-form-item label="api网关" prop="apiGateway">
        <el-input v-model="dataForm.apiGateway" placeholder="api网关"></el-input>
      </el-form-item>
      <el-form-item label="代收费率" prop="dsFeeRate">
        <el-input v-model="dataForm.dsFeeRate" placeholder="代收费率"></el-input>
      </el-form-item>
      <el-form-item label="代付费率" prop="dfFeeRate">
        <el-input v-model="dataForm.dfFeeRate" placeholder="代付费率"></el-input>
      </el-form-item>
      <el-form-item label="代付单笔费用" prop="dfSingleFee">
        <el-input v-model="dataForm.dfSingleFee" placeholder="代付单笔费用"></el-input>
      </el-form-item>
      <el-form-item label="代付速率" prop="rateInterval">
        <ren-select v-model="dataForm.rateInterval" dict-type="rate_interval" placeholder="代付速率"></ren-select>
      </el-form-item>
      <el-form-item label="其他配置" prop="jsonData">
        <el-input type="textarea" v-model="dataForm.jsonData"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="扩展字段1" prop="fundThirdExt1">
        <el-input v-model="dataForm.fundThirdExt1" placeholder="扩展字段1"></el-input>
      </el-form-item>
      <el-form-item label="扩展字段1" prop="fundThirdExt2">
        <el-input v-model="dataForm.fundThirdExt2" placeholder="扩展字段1"></el-input>
      </el-form-item>
      <el-form-item label="扩展字段1" prop="fundThirdExt3">
        <el-input v-model="dataForm.fundThirdExt3" placeholder="扩展字段1"></el-input>
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
  name: "",
  code: "",
  bgGateway: "",
  bgUname: "",
  bgPwd: "",
  apiMerchantNo: "",
  apiKey: "",
  apiGateway: "",
  dsFeeRate: "",
  dfFeeRate: "",
  dfSingleFee: "",
  rateInterval: "",
  jsonData: "",
  creator: "",
  createDate: "",
  remark: "",
  fundThirdExt1: "",
  fundThirdExt2: "",
  fundThirdExt3: "",
});

const rules = ref({
  name: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  code: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  apiMerchantNo: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  apiKey: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  apiGateway: [{ required: true, message: t("validate.required"), trigger: "blur" }],
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
  baseService.get("/third/fundthird/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/third/fundthird", dataForm).then((res) => {
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