<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="会员主键" prop="id">
        <el-input v-model="dataForm.id" placeholder="会员主键"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="uname">
        <el-input v-model="dataForm.uname" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item label="注册ip" prop="regIp">
        <el-input v-model="dataForm.regIp" placeholder="注册ip"></el-input>
      </el-form-item>
      <el-form-item label="" prop="lastLoginIp">
        <el-input v-model="dataForm.lastLoginIp" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="领取红包次数" prop="redbagCount">
        <el-input v-model="dataForm.redbagCount" placeholder="领取红包次数"></el-input>
      </el-form-item>
      <el-form-item label="设备id" prop="deviceId">
        <el-input v-model="dataForm.deviceId" placeholder="设备id"></el-input>
      </el-form-item>
      <el-form-item label="注册时间" prop="createDate">
        <el-input v-model="dataForm.createDate" placeholder="注册时间"></el-input>
      </el-form-item>
      <el-form-item label="最后上线时间" prop="lastOnlineDate">
        <el-input v-model="dataForm.lastOnlineDate" placeholder="最后上线时间"></el-input>
      </el-form-item>
      <el-form-item label="总赏金" prop="totalBounty">
        <el-input v-model="dataForm.totalBounty" placeholder="总赏金"></el-input>
      </el-form-item>
      <el-form-item label="member_ext2拓展" prop="memberExt2">
        <el-input v-model="dataForm.memberExt2" placeholder="member_ext2拓展"></el-input>
      </el-form-item>
      <el-form-item label="member_ext3拓展" prop="memberExt3">
        <el-input v-model="dataForm.memberExt3" placeholder="member_ext3拓展"></el-input>
      </el-form-item>
      <el-form-item label="member_ext4拓展" prop="memberExt4">
        <el-input v-model="dataForm.memberExt4" placeholder="member_ext4拓展"></el-input>
      </el-form-item>
      <el-form-item label="member_ext5拓展" prop="memberExt5">
        <el-input v-model="dataForm.memberExt5" placeholder="member_ext5拓展"></el-input>
      </el-form-item>
      <el-form-item label="member_ext6拓展" prop="memberExt6">
        <el-input v-model="dataForm.memberExt6" placeholder="member_ext6拓展"></el-input>
      </el-form-item>
      <el-form-item label="总充值次数" prop="totalBuyCount">
        <el-input v-model="dataForm.totalBuyCount" placeholder="总充值次数"></el-input>
      </el-form-item>
      <el-form-item label="总充值金额" prop="totalBuyAmount">
        <el-input v-model="dataForm.totalBuyAmount" placeholder="总充值金额"></el-input>
      </el-form-item>
      <el-form-item label="总卖出次数" prop="totalSellCount">
        <el-input v-model="dataForm.totalSellCount" placeholder="总卖出次数"></el-input>
      </el-form-item>
      <el-form-item label="总卖出金额" prop="totalSellAmount">
        <el-input v-model="dataForm.totalSellAmount" placeholder="总卖出金额"></el-input>
      </el-form-item>
      <el-form-item label="总邀请人数" prop="totalInviteCount">
        <el-input v-model="dataForm.totalInviteCount" placeholder="总邀请人数"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { t } = useI18n();
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  uname: "",
  regIp: "",
  lastLoginIp: "",
  redbagCount: "",
  deviceId: "",
  createDate: "",
  lastOnlineDate: "",
  totalBounty: "",
  memberExt2: "",
  memberExt3: "",
  memberExt4: "",
  memberExt5: "",
  memberExt6: "",
  totalBuyCount: "",
  totalBuyAmount: "",
  totalSellCount: "",
  totalSellAmount: "",
  totalInviteCount: "",
});

const rules = ref({
});

const init = (id?: number) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  if (id) {
    getInfo(id);
  }
};

// 获取信息
const getInfo = (id: number) => {
  baseService.get("/member/memberext/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    (!dataForm.id ? baseService.post : baseService.put)("/member/memberext", dataForm).then((res) => {
      ElMessage.success({
        message: t("prompt.success"),
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit("refreshDataList");
        }
      });
    });
  });
};

defineExpose({
  init
});
</script>