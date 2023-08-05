<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="渠道名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="渠道名称"></el-input>
      </el-form-item>
      <el-form-item label="渠道推广码" prop="code">
        <el-input v-model="dataForm.code" :disabled="dataForm.id ? true : false" placeholder="渠道推广码"></el-input>
      </el-form-item>
      <el-form-item label="是否打开" prop="openFlag">
        <ren-select v-model="dataForm.openFlag" dict-type="yes_no" placeholder="是否打开"></ren-select>
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
  openFlag: 1
});

const validateCode = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error(t("validate.required")));
  }
  // 校验是否为6位数字
  const pattern = /^\d{6}$/;
  if (value && !pattern.test(value)) {
    return callback(new Error("渠道码应为6位数字"));
  }
  callback();
};
const rules = ref({
  name: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  code: [{ required: true, validator: validateCode, trigger: "blur" }]
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
  baseService.get("/member/memberpromochannel/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/member/memberpromochannel", dataForm).then((res) => {
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
