<template>
  <div class="mod-tron__troncollectrecord">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.memberUname" placeholder="用户" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.chainId" placeholder="链上ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.amount" placeholder="金额" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.symbol" placeholder="symbol" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.fromAddr" placeholder="用户地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.toAddr" placeholder="目标地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.state" dict-type="tron_collect_state" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.createTime" placeholder="创建时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="memberUname" label="用户" header-align="center" align="center"></el-table-column>
      <el-table-column prop="chainId" show-overflow-tooltip label="链上ID" header-align="center" align="center"></el-table-column>
      <el-table-column prop="amount" label="金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="symbol" label="symbol" header-align="center" align="center"></el-table-column>
      <el-table-column prop="fromAddr" show-overflow-tooltip label="用户地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="toAddr" show-overflow-tooltip label="目标地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="tron_collect_state" :dict-value="scope.row.state" :status="{ 2: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" width="160" label="创建时间" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./troncollectrecord-add-or-update.vue";

const view = reactive({
  getDataListURL: "/tron/troncollectrecord/page",
  getDataListIsPage: true,
  exportURL: "/tron/troncollectrecord/export",
  deleteURL: "/tron/troncollectrecord",
  deleteIsBatch: true,
  dataForm: {
    memberUname: "",
    chainId: "",
    amount: "",
    symbol: "",
    fromAddr: "",
    toAddr: "",
    state: "",
    createTime: ""
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
