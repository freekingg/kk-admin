<template>
  <div class="mod-tron__tronrechargerecord">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.memberUname" placeholder="用户别名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.fromAddr" placeholder="来源地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.toAddr" placeholder="用户平台地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.amount" placeholder="金额" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.symbol" placeholder="币种符号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.chainId" placeholder="链上关联ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.notifySt" dict-type="notify_st" placeholder="通知状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.createTime" placeholder="创建时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('tron:tronrechargerecord:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('tron:tronrechargerecord:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="memberUname" label="用户别名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="fromAddr" label="来源地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="toAddr" label="用户平台地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="amount" label="金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="symbol" label="币种符号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="chainId" label="链上关联ID" header-align="center" align="center"></el-table-column>
      <el-table-column prop="notifySt" label="通知状态" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("notify_st", scope.row.notifySt) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('tron:tronrechargerecord:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('tron:tronrechargerecord:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./tronrechargerecord-add-or-update.vue";

const view = reactive({
  getDataListURL: "/tron/tronrechargerecord/page",
  getDataListIsPage: true,
  exportURL: "/tron/tronrechargerecord/export",
  deleteURL: "/tron/tronrechargerecord",
  deleteIsBatch: true,
  dataForm: {
    memberUname: "",
    fromAddr: "",
    toAddr: "",
    amount: "",
    symbol: "",
    chainId: "",
    notifySt: "",
    createTime: "",
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
</script>