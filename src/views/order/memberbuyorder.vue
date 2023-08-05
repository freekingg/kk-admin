<template>
  <div class="mod-order__memberbuyorder">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.memberUname" placeholder="会员账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.payMode" dict-type="platform_payment_methods" placeholder="购买方式"></ren-select>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.status" dict-type="order_status" placeholder="订单状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.payCertificateId" placeholder="凭证ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.createDate" placeholder="创建时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" @sort-change="state.dataListSortChangeHandle" style="width: 100%">
      <el-table-column prop="id" label="订单ID" min-width="175" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="memberUname" label="会员账号" min-width="100" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("", scope.row.memberUname) }}
        </template>
      </el-table-column>
      <el-table-column prop="payMode" label="购买方式" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("platform_payment_methods", scope.row.payMode) }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="充值金额" header-align="center" align="center"></el-table-column>
      <!--
      <el-table-column prop="platformToFbRate" label="平台汇率" header-align="center" align="center"></el-table-column>
-->
      <!--
      <el-table-column prop="subsidyAmount" label="补贴金额" header-align="center" align="center"></el-table-column>
-->
      <el-table-column prop="binanToFbRate" label="币安汇率" header-align="center" align="center"></el-table-column>
      <!--
      <el-table-column prop="binanToFbAmount" label="币安" header-align="center" align="center"></el-table-column>
-->
      <el-table-column prop="profitRate" label="赠送" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="订单状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="order_status" :dict-value="scope.row.status" :status="{ 0: 'danger', '-1': 'warning' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="payCertificateId" label="凭证ID" min-width="155" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" width="155" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('order:memberbuyorder:info')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">查看</el-button>
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
import AddOrUpdate from "./memberbuyorder-add-or-update.vue";

const view = reactive({
  getDataListURL: "/order/memberbuyorder/page",
  getDataListIsPage: true,
  exportURL: "/order/memberbuyorder/export",
  deleteURL: "/order/memberbuyorder",
  deleteIsBatch: true,
  dataForm: {
    memberUname: "",
    payMode: "",
    status: "",
    payCertificateId: "",
    createDate: ""
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
