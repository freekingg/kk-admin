<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-agent__agent">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="代理账号：">
          <el-input v-model="dataForm.uname" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
        <el-table-column prop="uname" label="代理账号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="unitPrice" label="单个任务奖金" header-align="center" align="center"></el-table-column>
        <!--        <el-table-column prop="balance" label="代理余额" header-align="center" align="center"></el-table-column>-->
        <!--        <el-table-column prop="totalWithdrawal" label="累计提现" header-align="center" align="center"></el-table-column>-->
        <el-table-column prop="teamCount" label="下级人数" header-align="center" align="center"></el-table-column>
        <el-table-column prop="teamTotalTask" label="下级累计完成任务" header-align="center" align="center"></el-table-column>
        <!--        <el-table-column prop="teamTotalWithdrawal" label="下级累计提现" header-align="center" align="center"></el-table-column>-->
        <el-table-column prop="status" label="状态" header-align="center" align="center">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" @change="changeItem(scope.row)" :active-value="1" :inactive-value="2"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template v-slot="scope">
            <el-button v-if="$hasPermission('agent:agent:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
            <!-- <el-button v-if="$hasPermission('agent:agent:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button> -->
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
import AddOrUpdate from "./agent-add-or-update.vue";
// import { modifyAgent } from "@/api/agent/agent";
export default {
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/agent/agent/page",
        getDataListIsPage: true,
        exportURL: "/agent/agent/export",
        deleteURL: "/agent/agent",
        deleteIsBatch: true
      },
      dataForm: {
        uname: "",
        status: "",
        createDate: ""
      }
    };
  },
  watch: {},
  components: {
    AddOrUpdate
  },
  methods: {
    changeItem(item) {
      this.$confirm("此操作将修改代理状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          modifyAgent(item).then((res) => {
            this.$message({
              type: "success",
              message: "成功"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
            duration: 500,
            onClose: () => {
              item.isEnable = item.isEnable === 1 ? 2 : 1;
            }
          });
        });
    }
  }
};
</script>
