<template>
  <div class="mod-order__membersellorder">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.memberUname" placeholder="会员" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.memberPaymentMethod" dict-type="platform_payment_methods" placeholder="收款方式"></ren-select>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.platformPaymentMode" dict-type="platform_payment_mode" placeholder="代付渠道"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.platformPaymentName" placeholder="付款账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.status" dict-type="member_sell_order_st" placeholder="订单状态"></ren-select>
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
        <el-button type="primary" @click="batchDfHandle">批量代付</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" label="订单ID" min-width="175" header-align="center" align="center"></el-table-column>
      <el-table-column prop="memberUname" min-width="100" label="会员" header-align="center" align="center"></el-table-column>
      <el-table-column prop="memberPaymentMethod" min-width="100" label="收款方式" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("platform_payment_methods", scope.row.memberPaymentMethod) }}
        </template>
      </el-table-column>
      <el-table-column prop="platformPaymentMode" min-width="100" label="平台渠道" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("platform_payment_mode", scope.row.platformPaymentMode) }}
        </template>
      </el-table-column>
      <el-table-column prop="platformPaymentName" min-width="100" label="付款账号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="amount" label="订单金额" min-width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="platformToFbRate" label="平台汇率" min-width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="binanToFbRate" label="币安汇率" min-width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="receiptAmount" label="实收金额" min-width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="100" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="member_sell_order_st" :dict-value="scope.row.status" :status="{ 1: 'info', 2: 'info', 4: 'warning', 5: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <!--
      <el-table-column prop="payCertificateId" label="凭证ID" header-align="center" align="center"></el-table-column>
-->
      <!--
      <el-table-column prop="remark" label="订单备注" header-align="center" align="center"></el-table-column>
-->
      <el-table-column prop="createDate" width="155" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="pushPaymentDate" width="155" label="提到渠道时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="finishDate" width="155" label="完成时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('order:membersellorder:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
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
import baseService from "@/service/baseService";
import { ElMessage, ElMessageBox } from "element-plus";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./membersellorder-add-or-update.vue";

const view = reactive({
  getDataListURL: "/order/membersellorder/page",
  getDataListIsPage: true,
  exportURL: "/order/membersellorder/export",
  deleteURL: "/order/membersellorder",
  deleteIsBatch: true,
  dataForm: {
    memberUname: "",
    memberPaymentMethod: "",
    platformPaymentMode: "",
    platformPaymentName: "",
    createDate: "",
    finishDate: "",
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

// 批量代付
const batchDfHandle = () => {
  ElMessageBox.confirm("请确认是否进行代付操作. 继续?", "提示", {
    type: "warning",
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
        let ids: any = state.dataListSelections?.map((item: any) => state.deleteIsBatchKey && item[state.deleteIsBatchKey]);
        instance.confirmButtonLoading = true;
        baseService
          .put(`/order/membersellorder/batch_df`, ids)
          .then(() => {
            done();
            instance.confirmButtonLoading = false;
            ElMessage({
              type: "success",
              message: "操作成功"
            });
          })
          .catch(() => {
            done();
            instance.confirmButtonLoading = false;
          });
      } else {
        done();
      }
    }
  }).then(async () => {
    state.getDataList();
  });
};
</script>
