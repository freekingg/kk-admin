<template>
  <div class="mod-app__websitepromo">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="settingUpdateHandle()">提取设置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="name" label="子任务名称" min-width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" min-width="150" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("promo_type", scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="enabled_status" :dict-value="scope.row.status" :status="{ 0: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('app:websitepromo:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <!-- <el-button v-if="state.hasPermission('app:websitepromo:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
    <!-- 弹窗, 提取金额限制 -->
    <setting-update :key="addKey" ref="settingUpdateRef" @refreshDataList="state.getDataList"></setting-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./components/websitepromo-add-or-update.vue";
import SettingUpdate from "./components/setting-update.vue";

const view = reactive({
  getDataListURL: "/app/websitepromo/page",
  getDataListIsPage: true,
  exportURL: "/app/websitepromo/export",
  deleteURL: "/app/websitepromo",
  deleteIsBatch: true,
  dataForm: {}
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
const settingUpdateRef = ref();
const settingUpdateHandle = () => {
  nextTick(() => {
    settingUpdateRef.value.init();
  });
};
</script>
