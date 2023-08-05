<template>
  <div class="mod-demo__news">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.title" :placeholder="$t('news.title')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" @sort-change="state.dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="member_level_status" :dict-value="scope.row.status" :status="{ 0: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="paramJsonObj" label="扩展信息" header-align="center" align="center">
        <template v-slot="{ row }">
          {{ row.paramJsonObj ? JSON.stringify(row.paramJsonObj) : "-" }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="primary" link @click="addOrUpdateHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./level-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/level/all",
  getDataListIsPage: false,
  deleteURL: "/member/level",
  deleteIsBatch: true,
  daterange: null,
  dataForm: {
    title: "",
    startDate: null as number | null,
    endDate: null as number | null
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

watch(
  () => state.daterange,
  (val: number[] | null) => {
    if (val === null) {
      state.dataForm.startDate = null;
      state.dataForm.endDate = null;
    } else {
      state.dataForm.startDate = val[0];
      state.dataForm.endDate = val[1];
    }
  }
);

const addOrUpdateRef = ref();
const addKey = ref(0);
const addOrUpdateHandle = (row?: any) => {
  addKey.value++;
  nextTick(() => {
    addOrUpdateRef.value.init(row);
  });
};
</script>
