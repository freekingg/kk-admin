<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="value" :label="$t('dict.dictValue')">
        <el-input v-model="dataForm.value" :placeholder="$t('dict.dictValue')"></el-input>
      </el-form-item>
      <el-form-item prop="name" :label="$t('dict.dictLabel')">
        <el-input v-model="dataForm.name" :placeholder="$t('dict.dictLabel')"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="orderNum" :label="$t('dict.sort')">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" :label="$t('dict.sort')"></el-input-number>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('dict.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('dict.remark')"></el-input>
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
  parentId: "",
  name: "",
  value: "",
  uniqueKey: "",
  orderNum: 0,
  type: 2,
  status: 1,
  remark: ""
});

const rules = ref({
  name: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  value: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  orderNum: [{ required: true, message: t("validate.required"), trigger: "blur" }]
});

const init = (row: any = {}) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }
  if (row.id) {
    getInfo(row);
  }
};

// 获取信息
const getInfo = (row = {}) => {
  Object.assign(dataForm, row);
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }

    const isUpdate = !dataForm.id ? false : true;
    if (!isUpdate) {
      dataForm.uniqueKey = `${dataForm.parentId}-${dataForm.value}`;
    }
    baseService.post(isUpdate ? "/config/dict/update" : "/config/dict/add", dataForm).then((res) => {
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
  init,
  dataForm
});
</script>
