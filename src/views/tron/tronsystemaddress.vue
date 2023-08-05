<template>
  <div class="mod-tron__tronsystemaddress">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()"> </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="address" show-overflow-tooltip label="系统地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="地址类型" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("system_address_type", scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="usdt" label="usdt 余额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="trx" label="trx 余额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="是否启用" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="yes_no" :dict-value="scope.row.status" :status="{ 0: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="钱包创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="{ row }">
          <el-button type="primary" link @click="syncBlanaceHandle(row)">同步余额</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import baseService from "@/service/baseService";
import AddOrUpdate from "./tronsystemaddress-add-or-update.vue";

const view = reactive({
  getDataListURL: "/tron/tronsystemaddress/page",
  getDataListIsPage: true,
  exportURL: "/tron/tronsystemaddress/export",
  deleteURL: "/tron/tronsystemaddress",
  deleteIsBatch: true,
  dataForm: {}
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const loading = ref(0);
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
          .get(`/tron/tronsystemaddress/sync_address/${row?.id}`)
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
</script>
