<template>
  <div class="mod-sys__post">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.name" :placeholder="$t('post.postName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('/sys/job/add')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="name" :label="$t('post.postName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="orderNum" :label="$t('post.sort')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" :label="$t('post.status')" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("job_status", scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('/sys/job/update')" type="primary" link @click="addOrUpdateHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('/sys/job/delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./post-add-or-update.vue";

const view = reactive({
  getDataListURL: "/sys/job/page",
  getDataListIsPage: true,
  deleteURL: "/sys/job/delete",
  dataForm: {
    postCode: "",
    name: "",
    status: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const addOrUpdateRef = ref();
const addOrUpdateHandle = (row?: any) => {
  addOrUpdateRef.value.init(row);
};
</script>
