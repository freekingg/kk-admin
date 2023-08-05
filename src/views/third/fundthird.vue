<template>
  <div class="mod-third__fundthird">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.code" placeholder="CODE" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.apiMerchantNo" placeholder="api商户号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <!--      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>-->
      <el-form-item>
        <el-button v-if="state.hasPermission('third:fundthird:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('third:fundthird:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <!--
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
-->
      <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="code" label="CODE" header-align="center" align="center"></el-table-column>
      <el-table-column prop="apiMerchantNo" min-width="150" label="api商户号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dsFeeRate" label="代收费率" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dfFeeRate" label="代付费率" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dfSingleFee" label="代付单笔费用" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" width="155" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('third:fundthird:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('third:fundthird:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./fundthird-add-or-update.vue";

const view = reactive({
  getDataListURL: "/third/fundthird/page",
  getDataListIsPage: true,
  exportURL: "/third/fundthird/export",
  deleteURL: "/third/fundthird",
  deleteIsBatch: true,
  dataForm: {
    name: "",
    code: "",
    apiMerchantNo: ""
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
