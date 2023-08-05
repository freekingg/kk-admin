<template>
  <div class="container">
    <el-form ref="ruleFormRef" :model="state.dataForm" :rules="rules" label-width="120px" class="ruleForm">
      <el-divider content-position="left">基本设置</el-divider>
      <el-form-item label="Socket域名" prop="socketDomain">
        <el-input v-model="state.dataForm.socketDomain" placeholder="请输入Socket域名" clearable />
      </el-form-item>
      <el-form-item label="邀请链接" prop="inviteLink">
        <template #label>
          <el-tooltip class="box-item" effect="dark" content="会员邀请链接(不带邀请码的部分)" placement="top-start">
            <div style="display: flex; justify-content: center; align-items: center">
              <span style="margin-right: 3px">邀请链接 </span> <el-icon><Warning /></el-icon>
            </div>
          </el-tooltip>
        </template>
        <el-input v-model="state.dataForm.inviteLink" placeholder="请输入会员邀请链接(不带邀请码的部分)" clearable />
      </el-form-item>
      <el-form-item label="App下载地址" prop="appDownload" style="margin-bottom: 30px">
        <template #label>
          <el-tooltip class="box-item" effect="dark" content="App下载地址与版本号,如：http://www.download.com?version=1.0.1" placement="top-start">
            <div style="display: flex; justify-content: center; align-items: center">
              <span style="margin-right: 3px">App下载地址 </span> <el-icon><Warning /></el-icon>
            </div>
          </el-tooltip>
        </template>
        <el-input v-model="state.dataForm.appDownload" placeholder="请输入App下载地址与版本号,如：http://www.download.com?version=1.0.1" clearable />
      </el-form-item>
      <el-divider content-position="left">新手视频</el-divider>
      <el-form-item label="视频标题" prop="beginnerVideo1Title">
        <el-input v-model="state.dataForm.beginnerVideo1Title" placeholder="请输入新手视频标题" clearable />
      </el-form-item>
      <el-form-item label="视频链接" prop="beginnerVideo1Url" style="margin-bottom: 30px">
        <el-input v-model="state.dataForm.beginnerVideo1Url" placeholder="请输入新手视频链接" clearable />
      </el-form-item>
      <el-divider content-position="left">客服</el-divider>
      <el-form-item label="在线客服" prop="liveChatLink">
        <el-input v-model="state.dataForm.liveChatLink" placeholder="请输入在线客服链接" clearable />
      </el-form-item>
      <el-form-item prop="intervalList" label="客服列表">
        <el-button type="primary" plain :icon="Plus" style="margin-bottom: 20px" @click="addRateHandle"> 新增 </el-button>
        <el-table :data="state.dataForm.customerServiceList" border size="small">
          <el-table-column prop="initVal" label="客服名称" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.name" placeholder="请输入客服名称" />
            </template>
          </el-table-column>
          <el-table-column label="账号" align="center">
            <template #header>
              <el-tooltip class="box-item" effect="dark" content="注意：What'sApp客服只需要填写手机号码,telegram客服需要填写完整链接地址" placement="top-start">
                <div style="display: flex; justify-content: center; align-items: center">
                  <span style="margin-right: 3px">账号 </span> <el-icon><Warning /></el-icon>
                </div>
              </el-tooltip>
            </template>
            <template #default="scope">
              <el-input v-model="scope.row.value" placeholder="请输入账号或者链接" />
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="180">
            <template #default="scope">
              <el-switch v-model="scope.row.remark" inline-prompt active-text="启用" :active-value="1" :inactive-value="0" inactive-text="停用" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template #default="scope">
              <el-button type="danger" size="small" :plain="true" @click="removeRateHandle(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)"> {{ $t("confirm") }} </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";
import { Plus, Warning } from "@element-plus/icons-vue";
import { isURL } from "@/utils/utils";
const state = reactive({
  dataForm: {
    socketDomain: null,
    inviteLink: null,
    appDownload: "",
    beginnerVideo1Title: "",
    beginnerVideo1Url: "",
    liveChatLink: "",
    customerServiceList: []
  }
});

const ruleFormRef = ref();
const validateUrl = (rule, value, callback) => {
  if (!value) {
    callback();
  }
  if (value && !isURL(value)) {
    return callback(new Error("请输入正确的地址"));
  }
  callback();
};
const rules = reactive({
  beginnerVideo1Url: [{ validator: validateUrl, trigger: "blur" }],
  liveChatLink: [{ validator: validateUrl, trigger: "blur" }],
  appDownload: [{ validator: validateUrl, trigger: "blur" }],
  inviteLink: [{ validator: validateUrl, trigger: "blur" }]
});
const loading = ref(false);

const getInfo = async () => {
  const info = await baseService.get("/app/setting/financial_setting");
  if (!info.data.customerServiceList) {
    info.data.customerServiceList = [];
  }
  state.dataForm = info.data;
};

// 添加条件
const addRateHandle = async () => {
  let customerServiceList = state.dataForm.customerServiceList || [];
  let data = {
    name: "",
    value: "",
    remark: 1
  };
  customerServiceList.push(data);
};

// 删除条件
const removeRateHandle = async (index) => {
  let intervalList = state.dataForm.customerServiceList;
  intervalList.splice(index, 1);
};

// 提交
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      try {
        await baseService.post("/app/setting/financial_setting", state.dataForm);
        loading.value = false;
        ElMessage.success("提交成功");
      } catch (error) {
        loading.value = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(() => {
  getInfo();
});
</script>
<style lang="scss" scoped>
.ruleForm {
  width: 1000px;
}
</style>
