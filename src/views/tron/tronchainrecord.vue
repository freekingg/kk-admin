<template>
  <div class="mod-tron__tronchainrecord">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.id" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.hash" placeholder="Hash" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.type" dict-type="chain_biz_type" placeholder="业务类型"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.relatedId" placeholder="关联ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.fromAddr" placeholder="发送地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.toAddr" placeholder="目标地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="id" show-overflow-tooltip label="ID" header-align="center" align="center"></el-table-column>
      <el-table-column prop="hash" show-overflow-tooltip label="Hash" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="业务类型" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("chain_biz_type", scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="relatedId" show-overflow-tooltip label="关联ID" header-align="center" align="center"></el-table-column>
      <el-table-column prop="fromAddr" show-overflow-tooltip label="发送地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="toAddr" show-overflow-tooltip label="目标地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="chainTime" width="160" label="链上时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createTime" width="160" label="同步时间" header-align="center" align="center"></el-table-column>
      <!--      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('tron:tronchainrecord:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('tron:tronchainrecord:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./tronchainrecord-add-or-update.vue";

const view = reactive({
  getDataListURL: "/tron/tronchainrecord/page",
  getDataListIsPage: true,
  exportURL: "/tron/tronchainrecord/export",
  deleteURL: "/tron/tronchainrecord",
  deleteIsBatch: true,
  dataForm: {
    id: "",
    hash: "",
    type: "",
    relatedId: "",
    fromAddr: "",
    toAddr: ""
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
