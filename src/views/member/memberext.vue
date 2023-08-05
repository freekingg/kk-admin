<template>
  <div class="mod-member__memberext">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.uname" placeholder="账号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.deviceId" placeholder="设备id" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.createDate" placeholder="注册时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.lastOnlineDate" placeholder="最后上线时间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.totalBounty" placeholder="总赏金" clearable></el-input>
      </el-form-item>
<!--      <el-form-item>
        <el-input v-model="state.dataForm.memberExt2" placeholder="member_ext2拓展" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.memberExt3" placeholder="member_ext3拓展" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.memberExt4" placeholder="member_ext4拓展" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.memberExt5" placeholder="member_ext5拓展" clearable></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-input v-model="state.dataForm.totalBuyCount" placeholder="总充值次数" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.totalBuyAmount" placeholder="总充值金额" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.totalSellCount" placeholder="总卖出次数" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.totalSellAmount" placeholder="总卖出金额" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.totalInviteCount" placeholder="总邀请人数" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="state.exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" style="width: 100%">
<!--
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
-->
      <el-table-column prop="uname" label="账号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="regIp" label="注册ip" header-align="center" align="center"></el-table-column>
<!--
      <el-table-column prop="lastLoginIp" label="" header-align="center" align="center"></el-table-column>
-->
<!--      <el-table-column prop="redbagCount" label="领取红包次数" header-align="center" align="center"></el-table-column>-->
      <el-table-column prop="deviceId" label="设备id" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="注册时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="lastOnlineDate" label="最后上线时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="totalBounty" label="总赏金" header-align="center" align="center"></el-table-column>
<!--      <el-table-column prop="memberExt2" label="member_ext2拓展" header-align="center" align="center"></el-table-column>
      <el-table-column prop="memberExt3" label="member_ext3拓展" header-align="center" align="center"></el-table-column>
      <el-table-column prop="memberExt4" label="member_ext4拓展" header-align="center" align="center"></el-table-column>
      <el-table-column prop="memberExt5" label="member_ext5拓展" header-align="center" align="center"></el-table-column>
      <el-table-column prop="memberExt6" label="member_ext6拓展" header-align="center" align="center"></el-table-column>-->
      <el-table-column prop="totalBuyCount" label="总充值次数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="totalBuyAmount" label="总充值金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="totalSellCount" label="总卖出次数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="totalSellAmount" label="总卖出金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="totalInviteCount" label="总邀请人数" header-align="center" align="center"></el-table-column>
<!--      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('member:memberext:update')" type="primary" link @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('member:memberext:delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./memberext-add-or-update.vue";

const view = reactive({
  getDataListURL: "/member/memberext/page",
  getDataListIsPage: true,
  exportURL: "/member/memberext/export",
  deleteURL: "/member/memberext",
  deleteIsBatch: true,
  dataForm: {
    uname: "",
    deviceId: "",
    createDate: "",
    lastOnlineDate: "",
    totalBounty: "",
    memberExt2: "",
    memberExt3: "",
    memberExt4: "",
    memberExt5: "",
    totalBuyCount: "",
    totalBuyAmount: "",
    totalSellCount: "",
    totalSellAmount: "",
    totalInviteCount: "",
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
