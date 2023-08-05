<template>
  <div class="mod-log__httprequestlog">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.requestBody" placeholder="请求参数包含" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.responseBody" placeholder="响应参数包含" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="url" label="请求地址" header-align="center" align="center"></el-table-column>
      <el-table-column prop="method" label="请求方法" header-align="center" align="center"></el-table-column>
      <el-table-column prop="headers" label="请求头" header-align="center" align="center"></el-table-column>
      <el-table-column prop="requestBody" show-overflow-tooltip label="请求参数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="responseBody" show-overflow-tooltip label="响应参数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
      <!--      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('log:httprequestlog:info')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">查看</el-button>
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
import AddOrUpdate from "./httprequestlog-add-or-update.vue";

const view = reactive({
  getDataListURL: "/log/httprequestlog/page",
  getDataListIsPage: true,
  exportURL: "/log/httprequestlog/export",
  deleteURL: "/log/httprequestlog",
  deleteIsBatch: true,
  dataForm: {
    requestBody: "",
    responseBody: ""
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
