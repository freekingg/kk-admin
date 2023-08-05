<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="用户别名" prop="memberUname">
        <el-input v-model="dataForm.memberUname" placeholder="用户别名"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="地址"></el-input>
      </el-form-item>
      <el-form-item label="usdt 余额" prop="usdt">
        <el-input v-model="dataForm.usdt" placeholder="usdt 余额"></el-input>
      </el-form-item>
      <el-form-item label="trx 余额" prop="trx">
        <el-input v-model="dataForm.trx" placeholder="trx 余额"></el-input>
      </el-form-item>
      <el-form-item label="钱包创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="钱包创建时间"></el-input>
      </el-form-item>
      <el-form-item label="最近一次同步" prop="lastSyncTime">
        <el-input v-model="dataForm.lastSyncTime" placeholder="最近一次同步"></el-input>
      </el-form-item>
      <el-form-item label="最近一次归集" prop="lastCollectTome">
        <el-input v-model="dataForm.lastCollectTome" placeholder="最近一次归集"></el-input>
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
  address: "",
  activated: "",
  usdt: "",
  trx: "",
  secretkey: "",
  createTime: "",
  lastSyncTime: "",
  lastCollectTome: "",
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
  baseService.get("/tron/tronaddress/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/tron/tronaddress", dataForm).then((res) => {
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