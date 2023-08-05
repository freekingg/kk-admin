<template>
  <div class="mod-app__websitepromo">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.beneficiaryMemberUname" placeholder="收益人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.eventName" placeholder="触发事件" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="websitePromoName" label="活动名称" min-width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="websitePromoType" label="类型" min-width="150" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="promo_type" :dict-value="scope.row.websitePromoType" :status="{ 2: 'warning' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="flag" label="完成状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="promo_flag" :dict-value="scope.row.flag" :status="{ 0: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="settleFlag" label="结算状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="promo_settle_flag" :dict-value="scope.row.settleFlag" :status="{ 0: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="任务金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="beneficiaryMemberUname" label="收益人" header-align="center" align="center"></el-table-column>
      <el-table-column prop="eventName" label="触发事件" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" width="160" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('member:memberpromo:info')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">查看</el-button>
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
import { nextTick, reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./components/websitepromo-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/memberpromo/page",
  getDataListIsPage: true,
  exportURL: "/member/memberpromo/export",
  deleteURL: "/member/memberpromo",
  deleteIsBatch: true,
  dataForm: {
    beneficiaryMemberUname: "",
    eventName: ""
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
