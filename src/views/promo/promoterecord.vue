<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-promo__promoterecord">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.billNo" placeholder="订单号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.receiveUname" placeholder="领取人会员账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.rebateUname" placeholder="返佣会员账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('promo:promoterecord:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('promo:promoterecord:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="billNo" label="订单号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="receiveUname" label="领取人会员账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="rebateUname" label="返佣会员账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="rebate" label="返佣金额" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDatetime" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template v-slot="scope">
            <el-button v-if="$hasPermission('promo:promoterecord:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
            <el-button v-if="$hasPermission('promo:promoterecord:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import AddOrUpdate from "./promoterecord-add-or-update.vue";
export default {
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/promo/promoterecord/page",
        getDataListIsPage: true,
        exportURL: "/promo/promoterecord/export",
        deleteURL: "/promo/promoterecord",
        deleteIsBatch: true
      },
      dataForm: {
        billNo: "",
        receiveUname: "",
        rebateUname: ""
      }
    };
  },
  watch: {},
  components: {
    AddOrUpdate
  }
};
</script>
