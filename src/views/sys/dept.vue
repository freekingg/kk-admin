<template>
  <div class="mod-sys__dept">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-button v-if="state.hasPermission('/sys/dept/add')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="dataList" row-key="id" border style="width: 100%">
      <el-table-column prop="name" :label="$t('dept.name')" header-align="center"></el-table-column>
      <el-table-column prop="uniqueKey" label="部门标识" header-align="center" align="center"></el-table-column>
      <el-table-column prop="fullName" label="部门全称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="部门类型" header-align="center" align="center">
        <template v-slot="scope">
          {{ formatterType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center"> </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('/sys/dept/update')" type="primary" link @click="addOrUpdateHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('/sys/dept/delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, computed } from "vue";
import AddOrUpdate from "./dept-add-or-update.vue";
import useView from "@/hooks/useView";
import { listToTree } from "@/utils/tree";

const view = reactive({
  getDataListURL: "/sys/dept/list",
  deleteURL: "/sys/dept/delete"
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const dataList = computed(() => {
  let list: any = listToTree(state.dataList as any);
  return list;
});

const formatterType = (type: number) => {
  switch (type) {
    case 1:
      return "公司";
    case 2:
      return "子公司";
    case 3:
      return "部门";
  }
};

const addOrUpdateRef = ref();
const addOrUpdateHandle = (row?: any) => {
  addOrUpdateRef.value.init(row);
};
</script>
