<template>
  <div class="mod-report__reportdatedata">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.date" placeholder="日期" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="date" label="日期" header-align="center" align="center"></el-table-column>
      <el-table-column prop="registerCount" label="注册人数" header-align="center" align="center"></el-table-column>
<!--
      <el-table-column prop="kycCount" label="实名人数" header-align="center" align="center"></el-table-column>
-->
      <el-table-column prop="bountyAmount" label="赠送金额" header-align="center" align="center"></el-table-column>
<!--
      <el-table-column prop="commissionAmount" label="佣金派发金额" header-align="center" align="center"></el-table-column>
-->
      <el-table-column prop="firstBuyCount" label="首次买币人数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="buyCount" label="买入人数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="buyAmount" label="买入USDT" header-align="center" align="center"></el-table-column>
      <el-table-column prop="sellCount" label="卖出人数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="sellAmount" label="卖出USDT" header-align="center" align="center"></el-table-column>
      <el-table-column prop="sellFbAmount" label="卖出INR" header-align="center" align="center"></el-table-column>
      <el-table-column prop="totalBalance" label="会员总余额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="buySellSub" label="（买入-卖出）" header-align="center" align="center"></el-table-column>
<!--
      <el-table-column prop="reportDateDataExt2" label="member_ext2拓展" header-align="center" align="center"></el-table-column>
      <el-table-column prop="reportDateDataExt3" label="member_ext3拓展" header-align="center" align="center"></el-table-column>
      <el-table-column prop="reportDateDataExt4" label="member_ext4拓展" header-align="center" align="center"></el-table-column>
      <el-table-column prop="reportDateDataExt5" label="member_ext5拓展" header-align="center" align="center"></el-table-column>-->
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";

const view = reactive({
  getDataListURL: "/report/reportdatedata/page",
  getDataListIsPage: true,
  exportURL: "/report/reportdatedata/export",
  deleteURL: "/report/reportdatedata",
  deleteIsBatch: true,
  dataForm: {
    date: "",
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });


const addKey = ref(0);
const addOrUpdateRef = ref();
const addOrUpdateHandle = (date?: number) => {
  addKey.value++;
  nextTick(() => {
    addOrUpdateRef.value.init(date);
  });
};
</script>
