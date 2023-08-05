<template>
  <div class="mod-tron__trondelegaterecord">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.trx" placeholder="委托个数" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.type" dict-type="tron_resource_code" placeholder="类型"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.ownerAddress" placeholder="拥有者地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.receiverAddress" placeholder="接收者地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.status" dict-type="tron_delegate_states" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="trx" label="委托个数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="类型 " header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("tron_resource_code", scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="ownerAddress" label="拥有者地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="receiverAddress" label="接收者地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("tron_delegate_states", scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="undelegateTime" label="撤销时间" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./trondelegaterecord-add-or-update.vue";

const view = reactive({
  getDataListURL: "/tron/trondelegaterecord/page",
  getDataListIsPage: true,
  exportURL: "/tron/trondelegaterecord/export",
  deleteURL: "/tron/trondelegaterecord",
  deleteIsBatch: true,
  dataForm: {
    trx: "",
    type: "",
    ownerAddress: "",
    receiverAddress: "",
    status: "",
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
