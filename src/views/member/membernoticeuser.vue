<template>
  <div class="mod-member__membernoticeuser">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
<!--      <el-form-item>
        <ren-select v-model="state.dataForm.receiverId" dict-type="receiverId" :placeholder="$t('notice.receiverId')"></ren-select>
      </el-form-item>-->
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
<!--      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>-->
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
<!--
      <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
-->
      <el-table-column prop="uname" label="接收者" header-align="center" align="center"></el-table-column>
      <el-table-column prop="title" label="内容标题" header-align="center" align="center"></el-table-column>
      <el-table-column prop="noticeId" label="通知ID" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="读取时间" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./membernoticeuser-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/membernoticeuser/page",
  getDataListIsPage: true,
  exportURL: "/member/membernoticeuser/export",
  deleteURL: "/member/membernoticeuser",
  deleteIsBatch: true,
  dataForm: {
    receiverId: ""
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
