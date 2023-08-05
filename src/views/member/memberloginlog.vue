<template>
  <div class="mod-member__memberloginlog">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.uname" placeholder="会员" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.ip" placeholder="ip地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.imei" placeholder="ip地址" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.clientType" dict-type="client_type" placeholder="客户端"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.loginTime" placeholder="登录日期" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="uname" label="会员" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="ip" label="ip地址" width="150" header-align="center" align="center"></el-table-column>
      <el-table-column prop="imei" label="手机唯一标识" header-align="center" align="center"></el-table-column>
      <el-table-column prop="clientType" label="客户端" width="150" header-align="center" align="center">
        <template v-slot="scope">
          {{ state.getDictLabel("client_type", scope.row.clientType) }}
        </template>
      </el-table-column>
      <el-table-column prop="userAgent" show-overflow-tooltip label="userAgent" header-align="center" align="center"></el-table-column>
      <el-table-column prop="loginTime" label="登录日期" width="160" header-align="center" align="center"></el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs, watch } from "vue";
import AddOrUpdate from "./memberloginlog-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/memberloginlog/page",
  getDataListIsPage: true,
  exportURL: "/member/memberloginlog/export",
  deleteURL: "/member/memberloginlog",
  deleteIsBatch: true,
  dataForm: {
    uname: "",
    ip: "",
    imei: "",
    clientType: "",
    loginTime: ""
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
