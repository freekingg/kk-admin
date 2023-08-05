<template>
  <div class="mod-member__membernotice">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.title" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
<!--
      <el-table-column prop="noticeType" label="通知类型" header-align="center" align="center"></el-table-column>
-->
      <el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
      <el-table-column prop="content"  show-overflow-tooltip  label="内容" header-align="center" align="center"></el-table-column>
<!--      <el-table-column prop="levelId" label="会员等级" header-align="center" align="center"></el-table-column>
      <el-table-column prop="flagIds" label="标签" header-align="center" align="center"></el-table-column>-->
      <el-table-column prop="status" label="发送状态" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="enabled_status" :dict-value="scope.row.status" :status="{ 0: 'warning', 1: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <!--
            <el-table-column prop="senderName" label="发送者" header-align="center" align="center"></el-table-column>
      -->
      <el-table-column prop="sendDate" width="155" label="发送时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="deadlyDate" label="过期时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
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
import AddOrUpdate from "./membernotice-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/membernotice/page",
  getDataListIsPage: true,
  exportURL: "/member/membernotice/export",
  deleteURL: "/member/membernotice",
  deleteIsBatch: true,
  dataForm: {
    title: "",
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
