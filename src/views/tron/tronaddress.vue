<template>
  <div class="mod-tron__tronaddress">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.memberUname" placeholder="用户别名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.address" placeholder="地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.usdt" placeholder="usdt 余额" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.trx" placeholder="trx 余额" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
        <el-button type="warning" @click="dialogWithdrawVisible = true">转出到钱包(测试用)</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="memberUname" label="用户名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="address" show-overflow-tooltip label="地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="activated" width="100" label="是否激活" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="yes_no" :dict-value="scope.row.activated" :status="{ 0: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="usdt" label="usdt 余额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="trx" label="trx 余额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" width="160" label="钱包创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="lastSyncTime" width="160" label="最近一次同步" header-align="center" align="center"></el-table-column>
      <el-table-column prop="lastCollectTome" width="160" label="最近一次归集" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="160">
        <template v-slot="{ row }">
          <el-button type="primary" link @click="collectHandle(row)">归集</el-button>
          <el-button type="primary" link @click="syncBlanaceHandle(row)">余额同步</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>

    <!-- 转出到钱包弹窗 -->
    <el-dialog v-model="dialogWithdrawVisible" title="转出到钱包" :close-on-click-modal="false">
      <el-form :model="withdrawForm" :rules="rulesWithdraw" ref="ruleFormRef">
        <el-form-item label="收款地址" prop="address">
          <el-input v-model="withdrawForm.address" autocomplete="off" placeholder="请输入收款地址" />
        </el-form-item>
        <el-form-item label="usdt数量" prop="usdt">
          <el-input-number v-model="withdrawForm.usdt" :min="1" placeholder="请输入usdt数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogWithdrawVisible = false">Cancel</el-button>
          <el-button type="primary" :loading="loading" @click="submitWithdrawHandle(ruleFormRef)"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import baseService from "@/service/baseService";
import AddOrUpdate from "./tronaddress-add-or-update.vue";
const { t } = useI18n();
const view = reactive({
  getDataListURL: "/tron/tronaddress/page",
  getDataListIsPage: true,
  exportURL: "/tron/tronaddress/export",
  deleteURL: "/tron/tronaddress",
  deleteIsBatch: true,
  dataForm: {
    memberUname: "",
    address: "",
    usdt: "",
    trx: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const loading = ref(false);
const ruleFormRef = ref();
let dialogWithdrawVisible = ref(false);
let withdrawForm = reactive({
  address: "",
  usdt: null
});
const rulesWithdraw = reactive({
  address: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  usdt: [{ required: true, message: t("validate.required"), trigger: "blur" }]
});
// 提交
const submitWithdrawHandle = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      loading.value = true;
      try {
        await baseService.post("/tron/tronaddress/withdraw", withdrawForm);
        loading.value = false;
        dialogWithdrawVisible.value = false;
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

const addKey = ref(0);
const addOrUpdateRef = ref();
const addOrUpdateHandle = (id?: number) => {
  addKey.value++;
  nextTick(() => {
    addOrUpdateRef.value.init(id);
  });
};

// 余额同步
const syncBlanaceHandle = (row?: any) => {
  ElMessageBox.confirm("请确认是否进行余额同步操作. 继续?", "提示", {
    type: "warning",
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        baseService
          .get(`/tron/tronaddress/sync_address/${row?.id}`)
          .then(() => {
            done();
            instance.confirmButtonLoading = false;
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
    ElMessage({
      type: "success",
      message: "同步成功"
    });
  });
};

// 归集
const collectHandle = (row?: any) => {
  ElMessageBox.confirm("请确认是否进行归集操作. 继续?", "提示", {
    type: "warning",
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;
        baseService
          .get(`/tron/tronaddress/collect_address/${row?.id}`)
          .then(() => {
            done();
            instance.confirmButtonLoading = false;
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
    ElMessage({
      type: "success",
      message: "归集成功"
    });
  });
};

// 转出到钱包 测试用
const withdrawHandle = () => {};
</script>
