<template>
  <div class="mod-member__memberpromochannel">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.name" placeholder="渠道名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.createDate" placeholder="注册时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.code" placeholder="渠道推广码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.openFlag" dict-type="yes_no" placeholder="是否打开"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('member:memberpromochannel:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="name" label="渠道名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="code" label="渠道推广码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="openFlag" label="是否打开" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="yes_no" :dict-value="scope.row.openFlag" :status="{ 0: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('member:memberpromochannel:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
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
import AddOrUpdate from "./memberpromochannel-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/memberpromochannel/page",
  getDataListIsPage: true,
  exportURL: "/member/memberpromochannel/export",
  deleteURL: "/member/memberpromochannel",
  deleteIsBatch: true,
  dataForm: {
    name: "",
    createDate: "",
    code: "",
    openFlag: ""
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
