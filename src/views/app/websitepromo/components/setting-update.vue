<template>
  <el-dialog v-model="visible" title="提取设置" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="140px">
      <el-form-item label="最低赏金划转金额" prop="minTransferBounty">
        <el-input-number v-model="dataForm.minTransferBounty" :min="1" :precision="2" controls-position="right" placeholder="最低赏金划转金额" />
      </el-form-item>
      <el-form-item label="最低佣金划转金额" prop="minTransferCommission">
        <el-input-number v-model="dataForm.minTransferCommission" :min="0" :precision="2" controls-position="right" placeholder="最低佣金划转金额" />
      </el-form-item>
    </el-form>

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
const { t } = useI18n();
const emit = defineEmits(["refreshDataList"]);
const visible = ref(false);

const dataFormRef = ref();

const dataForm = reactive({
  minTransferBounty: null,
  minTransferCommission: null
});

const rules = ref({
  minTransferBounty: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  minTransferCommission: [{ required: true, message: t("validate.required"), trigger: "blur" }]
});

const init = () => {
  visible.value = true;
  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }
  getInfo();
};

// 获取信息
const getInfo = async () => {
  const info = await baseService.get("/app/setting/financial_setting");
  Object.assign(dataForm, info.data);
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false;
    }

    baseService.post("/app/setting/financial_setting", dataForm).then((res) => {
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
