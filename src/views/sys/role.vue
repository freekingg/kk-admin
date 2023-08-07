<template>
  <div class="mod-sys__role">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.name" :placeholder="$t('role.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('/sys/role/add')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="name" :label="$t('role.name')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="uniqueKey" label="角色标识" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" :label="$t('role.remark')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" :label="$t('role.createDate')" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('/sys/role/update')" type="primary" link @click="addOrUpdateHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('/sys/role/delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./role-add-or-update.vue";

const view = reactive({
  getDataListURL: "/sys/role/list",
  deleteURL: "/sys/role",
  dataForm: {
    name: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const addOrUpdateRef = ref();
const addOrUpdateHandle = (row?: any) => {
  let info = null;
  if (row) {
    info = {
      id: row.id,
      name: row.name,
      remark: row.remark,
      parentId: row.parentId,
      status: row.status,
      uniqueKey: row.uniqueKey,
      menuIdList: row.permMenuIds
    };
  }
  addOrUpdateRef.value.init(info);
};
</script>
