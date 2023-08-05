<template>
  <div class="mod-order__fundthirdorder">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.platformOrderId" placeholder="平台单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.payDirection" dict-type="in_out" placeholder="方向"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.thirdName" placeholder="三方名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.thirdOrderNo" placeholder="三方单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.orderStatus" dict-type="third_order_status" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.createDate" placeholder="创建时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.finishDate" placeholder="完成时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <!--      <el-form-item>
        <el-button v-if="state.hasPermission('order:fundthirdorder:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('order:fundthirdorder:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>-->
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="platformOrderId" min-width="150" label="平台单号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="payDirection" label="方向" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("in_out", scope.row.payDirection) }}
        </template>
      </el-table-column>
      <el-table-column prop="thirdName" label="三方名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="thirdOrderNo" min-width="150" label="三方单号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="orderStatus" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="third_order_status" :dict-value="scope.row.orderStatus" :status="{ 2: 'warning', 3: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="feeRate" label="费用比例" header-align="center" align="center"></el-table-column>
      <el-table-column prop="feeValue" label="费用" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" width="155" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="finishDate" width="155" label="完成时间" header-align="center" align="center"></el-table-column>
      <!--      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('order:fundthirdorder:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('order:fundthirdorder:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./fundthirdorder-add-or-update.vue";

const view = reactive({
  getDataListURL: "/order/fundthirdorder/page",
  getDataListIsPage: true,
  exportURL: "/order/fundthirdorder/export",
  deleteURL: "/order/fundthirdorder",
  deleteIsBatch: true,
  dataForm: {
    platformOrderId: "",
    payDirection: "",
    thirdName: "",
    thirdOrderNo: "",
    orderStatus: "",
    createDate: "",
    finishDate: ""
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
