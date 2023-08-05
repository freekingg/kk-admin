<template>
  <div class="mod-member__member">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.uname" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.channelCode" placeholder="渠道到编码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.puname" placeholder="邀请人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.referralCode" placeholder="推荐码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.balance" placeholder="余额 >" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.bounty" placeholder="赏金 >" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.createDate" placeholder="注册时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.status" dict-type="member_status" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="state.dataForm.online" dict-type="yes_no" placeholder="是否在线"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.levelId" placeholder="等级" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.flagIds" placeholder="标签" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <!--      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>-->
      <!--      <el-form-item>
        <el-button v-if="state.hasPermission('member:member:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>-->
      <!--      <el-form-item>
        <el-button v-if="state.hasPermission('member:member:delete')" type="danger" @click="state.deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>-->
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="uname" label="用户名" min-width="120" header-align="center" align="center"></el-table-column>
      <el-table-column prop="channelCode" label="获客渠道" min-width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="puname" label="邀请人" min-width="120" header-align="center" align="center"></el-table-column>
      <el-table-column prop="referralCode" label="推荐码" header-align="center" align="center"></el-table-column>
      <!--
      <el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
-->
      <el-table-column prop="balance" label="余额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="bounty" label="任务赏金" min-width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="commission" label="佣金" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="注册时间" width="160" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <dict-label dict-type="member_status" :dict-value="scope.row.status" :status="{ 2: 'warning', 3: 'danger' }"></dict-label>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="在线状态" min-width="150" header-align="center" align="center">
        <template v-slot="scope">
          <template v-if="calculateOnlineTime(scope.row.offlineTime, scope.row.onlineTime)['status'] === 'online'">
            <div style="display: flex">
              <el-tag class="ml-2" type="success">在线</el-tag>
              <p class="info">{{ calculateOnlineTime(scope.row.offlineTime, scope.row.onlineTime)["text"] }}</p>
            </div>
          </template>
          <template v-if="calculateOnlineTime(scope.row.offlineTime, scope.row.onlineTime)['status'] === 'offline'">
            <div style="display: flex">
              <el-tag class="ml-2" type="warning">离线</el-tag>
              <p class="info">{{ calculateOnlineTime(scope.row.offlineTime, scope.row.onlineTime)["text"] }}</p>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="levelId" label="等级" header-align="center" align="center"></el-table-column>
      <el-table-column prop="flagIds" label="标签" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('member:member:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-dropdown @command="moreCommandHandle($event, scope.row.id)">
            <span class="el-dropdown-link">
              更多
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="updateStatus">修改状态</el-dropdown-item>
                <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!--
          <el-button v-if="state.hasPermission('member:member:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
    <update-status ref="updateStatusRef" @refreshDataList="state.getDataList"></update-status>
    <update-pwd ref="updatePwdRef" @refreshDataList="state.getDataList"></update-pwd>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { nextTick, reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./member-add-or-update.vue";
import UpdateStatus from "./member-update-status.vue";
import UpdatePwd from "./member-update-pwd.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { getIndiaTimezone, calculateTimeDifference } from "@/utils/utils";
dayjs.extend(duration);

const view = reactive({
  getDataListURL: "/member/member/page",
  getDataListIsPage: true,
  exportURL: "/member/member/export",
  deleteURL: "/member/member",
  deleteIsBatch: true,
  dataForm: {
    uname: "",
    balance: "",
    pwd: "",
    channelId: "",
    channelCode: "",
    online: "",
    bounty: "",
    pid: "",
    puname: "",
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

const updateStatusRef = ref();
const updatePwdRef = ref();
const moreCommandHandle = (command: string, id?: number) => {
  nextTick(() => {
    if (command === "updateStatus") {
      updateStatusRef.value.init(id);
    }
    if (command === "updatePwd") {
      updatePwdRef.value.init(id);
    }
  });
};

/**
 * 计算在线时间
 * @param {string} offlineTime 离线时间
 * @param {string} onlineTime  上线时间
 */
const calculateOnlineTime = (offlineTime?: any, onlineTime?: any) => {
  if ((!offlineTime && !onlineTime) || !onlineTime) {
    return {
      status: "offline",
      text: `-`
    };
  }
  let _onlineTime = new Date(onlineTime).getTime();
  let _offlineTime = offlineTime ? new Date(offlineTime).getTime() : null;
  return calculateTimeDifference(_onlineTime, _offlineTime);
};
</script>

<style scoped>
.info {
  margin: 0;
  margin-top: 4px;
  line-height: 16px;
  font-size: 12px;
}
:deep(.el-table-fixed-column--right .cell) {
  display: flex;
  justify-content: center;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  margin-left: 10px;
}
</style>
