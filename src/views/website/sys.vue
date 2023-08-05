<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__sys">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="系统配置" name="sys">
          <el-form :model="dataSysForm" label-width="180px">
            <el-form-item label="QQ最大添加人数：">
              <el-input style="width: 400px" v-model="dataSysForm.maxQQCount" placeholder="QQ最大添加人数"></el-input>
            </el-form-item>
            <el-form-item label="在线客服：">
              <el-input style="width: 400px" v-model="dataSysForm.liveChatLink" placeholder="在线客服"></el-input>
            </el-form-item>
            <el-form-item label="APP下载域名：">
              <el-input style="width: 400px" v-model="dataSysForm.appDownloadUrl" placeholder="APP下载域名">
                <el-button slot="append" icon="el-icon-upload" @click="$refs.ossUpload.visible = true">文件上传</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="渠道：">
              <el-tag :key="tag" v-for="tag in dataSysForm.channel" closable :disable-transitions="false" @close="handleClose(tag)">
                {{ tag }}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"> </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">添加渠道</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSysClick">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- <oss-upload ref="ossUpload" @refreshDataList="refreshDataList"></oss-upload> -->
    </div>
  </el-card>
</template>

<script>
// import ossUpload from "@/components/oss-upload/oss-upload";
// import { getSysInfo, saveSysInfo } from '@/api/sys/sys'
export default {
  data() {
    return {
      activeName: "sys",
      dataSysForm: {
        maxQQCount: "",
        liveChatLink: "",
        appDownloadUrl: "",
        channel: []
      },
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: ""
    };
  },
  // components: { ossUpload },
  created() {
    this.getSettings();
  },
  methods: {
    getSettings() {
      getSysInfo().then((res) => {
        this.dataSysForm = res.data.data;
      });
    },
    handleSysClick() {
      saveSysInfo(this.dataSysForm).then((res) => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });
      });
    },
    refreshDataList(url) {
      this.dataSysForm.appDownloadUrl = url;
    },
    handleAddClick() {
      if (!this.value) return this.$message.error("渠道不能为空");
    },
    handleClose(tag) {
      this.dataSysForm.channel.splice(this.dataSysForm.channel.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dataSysForm.channel.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
