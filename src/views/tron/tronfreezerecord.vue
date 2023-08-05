<template>
  <div class="mod-tron__tronfreezerecord">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.ownerAddress" placeholder="拥有者地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('tron:tronsystemaddress:freeze')" type="primary" @click="dialogFreezeVisible = true">质押</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getFreezeCountHandle">可质押数量</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCanWithdrawUnfreezeAmount">查询可提取的解质押本金数量</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('tron:tronsystemaddress:withdraw')" type="primary" @click="withdrawExpireUnfreeze">提取锁定期的质押本金</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="ownerAddress" show-overflow-tooltip label="拥有者地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("tron_resource_code", scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="trx" label="质押个数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("freeze_status", scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" header-align="center" align="center"></el-table-column>
      <el-table-column prop="unfreezeTime" label="撤销时间" width="160" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="{ row }">
          <el-button v-if="row.status === 1" type="primary" link @click="unFreezeHandle(row)">取消质押</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>

    <!-- 质押弹窗 -->
    <el-dialog v-model="dialogFreezeVisible" title="质押" :close-on-click-modal="false">
      <el-form :model="freezeForm" :rules="rulesFreeze" ref="ruleFormRef" label-width="100px">
        <el-form-item label="类型" prop="resourceCode">
          <el-radio-group v-model="freezeForm.resourceCode">
            <el-radio :label="1">能量</el-radio>
            <el-radio :label="0">带宽</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="质押trx数量" prop="trx">
          <el-input-number v-model="freezeForm.trx" :min="1" placeholder="数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFreezeVisible = false">Cancel</el-button>
          <el-button type="primary" :loading="loading" @click="submitFreezeHandle(ruleFormRef)"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import baseService from "@/service/baseService";
import AddOrUpdate from "./tronfreezerecord-add-or-update.vue";
const { t } = useI18n();
const view = reactive({
  getDataListURL: "/tron/tronfreezerecord/page",
  getDataListIsPage: true,
  exportURL: "/tron/tronfreezerecord/export",
  deleteURL: "/tron/tronfreezerecord",
  deleteIsBatch: true,
  dataForm: {
    ownerAddress: "",
    receiverAddress: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const addKey = ref(0);
const addOrUpdateRef = ref();
const addOrUpdateHandle = (id?: number) => {
  addKey.value++;
  nextTick(() => {
    addOrUpdateRef.value.init(id);
  });
};

const loading = ref(false);
const ruleFormRef = ref();
let dialogFreezeVisible = ref(false);
let freezeForm = reactive({
  resourceCode: 1,
  trx: null
});
const rulesFreeze = reactive({
  resourceCode: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  trx: [{ required: true, message: t("validate.required"), trigger: ["blur", "change"] }]
});
// 提交
const submitFreezeHandle = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      loading.value = true;
      try {
        await baseService.post("/tron/tronfreezerecord/freeze", freezeForm);
        loading.value = false;
        dialogFreezeVisible.value = false;
        ElMessage.success("提交成功");
        formEl.resetFields();
      } catch (error) {
        loading.value = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 查询可质押数量
const getFreezeCountHandle = () => {
  baseService.get(`/tron/tronfreezerecord/can_freeze_count`).then((res) => {
    ElMessage({
      type: "success",
      message: `可质押数量为：${res.data}`
    });
  });
};

// 提取锁定期的质押本金
const withdrawExpireUnfreeze = () => {
  baseService.get(`/tron/tronfreezerecord/withdraw_expire_unfreeze`).then((res) => {
    ElMessage({
      type: "success",
      message: `可提取质押本金数量为：${res.data}`
    });
  });
};

// 查询可提取的解质押本金数量
const getCanWithdrawUnfreezeAmount = () => {
  baseService.get(`/tron/tronfreezerecord/can_withdraw_unfreeze_amount`).then((res) => {
    ElMessage({
      type: "success",
      message: `操作成功：${res.data}`
    });
  });
};

const unFreezeHandle = (row?: any) => {
  ElMessageBox.confirm("请确认是否进行解除质押操作. 继续?", "提示", {
    type: "warning",
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        baseService
          .post(`/tron/tronfreezerecord/unfreeze/${row?.id}`)
          .then(() => {
            done();
            instance.confirmButtonLoading = false;
            ElMessage({
              type: "success",
              message: "操作成功"
            });
          })
          .catch(() => {
            done();
            instance.confirmButtonLoading = false;
          });
      } else {
        done();
      }
    }
  }).then(async () => {
    state.getDataList();
  });
};
</script>
