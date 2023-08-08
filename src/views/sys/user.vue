<template>
  <div class="mod-sys__user">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.account" :placeholder="$t('user.username')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('/sys/user/add')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" @sort-change="state.dataListSortChangeHandle" style="width: 100%">
      <el-table-column prop="account" label="账号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dept.name" :label="$t('user.deptName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="job.name" label="岗位" header-align="center" align="center"></el-table-column>
      <el-table-column prop="mobile" :label="$t('user.mobile')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="gender" :label="$t('user.gender')" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("gender", scope.row.gender) }}
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="角色标识" header-align="center" align="center" width="240">
        <template v-slot="scope">
          <el-tag style="margin-right: 4px" v-for="role in scope.row.roles" :key="role.id" type="success">
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('user.status')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t("user.status0") }}</el-tag>
          <el-tag v-else size="small" type="success">{{ $t("user.status1") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('user.createDate')" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="180">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('/sys/user/update')" type="primary" link @click="addOrUpdateHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('/sys/user/password/update')" type="primary" link @click="resetPasswordHandle(scope.row.id)">修改密码</el-button>
          <el-button v-if="state.hasPermission('/sys/user/delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
    <reset-password ref="resetPasswordRef"></reset-password>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./user-add-or-update.vue";
import ResetPassword from "./user-reset-password.vue";

const view = reactive({
  getDataListURL: "/sys/user/page",
  getDataListIsPage: true,
  deleteURL: "/sys/user/delete",
  dataForm: {
    username: "",
    deptId: "",
    postId: "",
    gender: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const addOrUpdateRef = ref();
const addOrUpdateHandle = (row: any = {}) => {
  let data: any = JSON.parse(JSON.stringify(row));
  let body: any = {};
  if (row.id) {
    body = {
      ...data,
      deptId: data.dept.id || "",
      deptName: data.dept.name || "",
      jobId: data.job.id || "",
      roleIds: data.roles.length ? data.roles.map((item: any) => item.id) : []
    };
  }
  addOrUpdateRef.value.init(body);
};

const resetPasswordRef = ref();
const resetPasswordHandle = (id: number) => {
  resetPasswordRef.value.init(id);
};
</script>
