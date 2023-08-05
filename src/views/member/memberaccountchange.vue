<template>
  <div class="mod-member__memberaccountchange">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.memberUname" placeholder="会员" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.relationOrderId" placeholder="关联订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="memberUname" label="会员" header-align="center" align="center"></el-table-column>
      <el-table-column prop="operateType" label="类型" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="member_account_type" :dict-value="scope.row.operateType" :status="{ 2: 'info', 3: 'warning', 4: 'warning' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="relationOrderId" min-width="170" label="关联订单号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="oldBalance" label="账变前" header-align="center" align="center"></el-table-column>
      <el-table-column prop="amount" label="账变金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="newBalance" label="账变后" header-align="center" align="center"></el-table-column>
      <el-table-column prop="oldFrozenBalance" label="账变前冻结" header-align="center" align="center"></el-table-column>
      <el-table-column prop="frozenAmount" label="账变冻结金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="newFrozenBalance" label="账变后冻结" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" width="155" label="账变时间" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./memberaccountchange-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/memberaccountchange/page",
  getDataListIsPage: true,
  exportURL: "/member/memberaccountchange/export",
  deleteURL: "/member/memberaccountchange",
  deleteIsBatch: true,
  dataForm: {
    memberUname: "",
    relationOrderId: ""
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
