<template>
  <div class="mod-order__fundthirdnotifylog">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.thirdName" placeholder="三方名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.thirdOrderNo" placeholder="三方单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.platformOrderId" placeholder="平台单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.amount" placeholder="金额" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.time" placeholder="创建时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <!--      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('order:fundthirdnotifylog:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('order:fundthirdnotifylog:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>-->
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="thirdName" label="三方名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="thirdOrderNo" label="三方单号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="platformOrderId" label="平台单号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="amount" label="金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="msg" label="通知结果" header-align="center" align="center"></el-table-column>
      <el-table-column prop="content" show-overflow-tooltip label="内容" header-align="center" align="center"></el-table-column>
      <el-table-column prop="time" width="155" label="创建时间" header-align="center" align="center"></el-table-column>
      <!--      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('order:fundthirdnotifylog:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('order:fundthirdnotifylog:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./fundthirdnotifylog-add-or-update.vue";

const view = reactive({
  getDataListURL: "/order/fundthirdnotifylog/page",
  getDataListIsPage: true,
  exportURL: "/order/fundthirdnotifylog/export",
  deleteURL: "/order/fundthirdnotifylog",
  deleteIsBatch: true,
  dataForm: {
    thirdName: "",
    thirdOrderNo: "",
    platformOrderId: "",
    amount: "",
    time: ""
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
