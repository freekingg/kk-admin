<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" width="1100px">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="子任务名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="子任务名称"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <ren-select v-model="dataForm.type" :disabled="dataForm.id ? true : false" dict-type="promo_type" placeholder="类型"></ren-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <ren-select v-model="dataForm.status" dict-type="enabled_status" placeholder="状态"></ren-select>
      </el-form-item>
    </el-form>

    <otherTable v-if="+dataForm.type === 1" ref="otherTableRef" :tableList="dataForm.subList" />
    <selfTable v-if="+dataForm.type === 2" ref="selfTableRef" :tableList="dataForm.subList" />
    <firstRechargeTable v-if="+dataForm.type === 3" ref="firstRechargeTableRef" :tableList="dataForm.subList" />

    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
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
import firstRechargeTable from "./first-recharge-table.vue";
const { t } = useI18n();
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const loading = ref(false);

const dataFormRef = ref();
const otherTableRef = ref();
const selfTableRef = ref();
const firstRechargeTableRef = ref();

const dataForm = reactive({
  id: "",
  name: "",
  type: "",
  sort: "",
  status: "",
  subList: []
});

const rules = ref({
  name: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  type: [{ required: true, message: t("validate.required"), trigger: "blur" }],
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
  baseService.get("/app/websitepromo/" + id).then((res) => {
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
    if (res.data.type === 2 && subList.length) {
      const selfData = subList[0];
      res.data.subList = selfData.rule;
    }

    // 首次充值任务，数据格式需要特殊处理
    if (res.data.type === 3 && subList.length) {
      const rechargeData = subList[0];
      res.data.subList = rechargeData.rule;
    }
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return false;
    }
    let table = null;
    let tableData = [];
    if (+dataForm.type === 2) {
      table = selfTableRef.value;
      tableData = selfTableRef.value.getTableData();
    } else if (+dataForm.type === 3) {
      table = firstRechargeTableRef.value;
      tableData = firstRechargeTableRef.value.getTableData();
    } else if (+dataForm.type === 1) {
      table = otherTableRef.value;
      tableData = otherTableRef.value.getTableData();
    }

    let validEventRes = await table.validEvent();
    if (!validEventRes) {
      return false;
    }
    for (const item of tableData) {
      if (item.rule) {
        item.rule = JSON.stringify(item.rule);
      }
    }
    let _dataForm = {
      ...dataForm,
      subList: tableData
    };
    loading.value = true;
    (!dataForm.id ? baseService.post : baseService.put)("/app/websitepromo", _dataForm)
      .then(() => {
        ElMessage.success({
          message: t("prompt.success"),
          duration: 500,
          onClose: () => {
            visible.value = false;
            emit("refreshDataList");
          }
        });
        loading.value = false;
      })
      .catch(() => {
        visible.value = false;
      });
  });
};

defineExpose({
  init
});
</script>
