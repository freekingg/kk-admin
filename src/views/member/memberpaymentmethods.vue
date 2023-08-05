<template>
  <div class="mod-member__memberpaymentmethods">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.memberUname" placeholder="归属会员" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.type" dict-type="platform_payment_methods" placeholder="收款方式"></ren-select>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.status" dict-type="yes_no" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <!--      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('member:memberpaymentmethods:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('member:memberpaymentmethods:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>-->
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="memberUname" label="归属会员" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="收款方式" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("platform_payment_methods", scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="yes_no" :dict-value="scope.row.status" :status="{ 0: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="jsonData" show-overflow-tooltip label="卡信息 " header-align="center" align="center"></el-table-column>
      <el-table-column prop="time" label="创建时间" header-align="center" align="center"></el-table-column>
      <!--      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('member:memberpaymentmethods:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('member:memberpaymentmethods:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./memberpaymentmethods-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/memberpaymentmethods/page",
  getDataListIsPage: true,
  exportURL: "/member/memberpaymentmethods/export",
  deleteURL: "/member/memberpaymentmethods",
  deleteIsBatch: true,
  dataForm: {
    memberUname: "",
    type: "",
    status: ""
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
