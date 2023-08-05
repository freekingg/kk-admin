<template>
  <div class="mod-member__member">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.uname" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('member:member:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('member:member:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="uname" min-width="150" label="用户名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="pid" label="邀请人ID" header-align="center" align="center"></el-table-column>
      <el-table-column prop="referralCode" label="推荐码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="balance" label="余额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="commission" label="佣金" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" width="155" label="注册时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="member_status" :dict-value="scope.row.status" :status="{ 2: 'warning', 3: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="levelId" label="等级" header-align="center" align="center"></el-table-column>
      <el-table-column prop="flagIds" label="标签" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('member:member:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('member:member:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./components/add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/member/page",
  getDataListIsPage: true,
  exportURL: "/member/member/export",
  deleteURL: "/member/member",
  deleteIsBatch: true,
  dataForm: {
    uname: "",
    pwd: "",
    agentId: "",
    agentUname: "",
    channelId: "",
    pid: "",
    referralCode: "",
    mobile: "",
    name: "",
    createDate: "",
    status: "",
    levelId: "",
    flagIds: ""
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
