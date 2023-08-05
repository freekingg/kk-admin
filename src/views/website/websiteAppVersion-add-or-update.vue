<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
      <el-form-item prop="event"  label="更新类型">
        <el-radio-group v-model="dataForm.event" @change="upgradeTypeChange">
          <el-radio :label="1">热更新</el-radio>
          <el-radio :label="2">整包更新</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="upgradeType"  label="设备类型">
        <el-select clearable style="width: 160px;"  placeholder="设备类型"  v-model="dataForm.upgradeType" label-width="80px" >
          <el-option v-if="!dataForm.id" label="全部" value="all"></el-option>
          <el-option label="android" value="android"></el-option>
          <el-option label="ios" value="ios"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="title" label="应用名称">
        <el-input v-model="dataForm.title" placeholder="请输入应用名称" />
      </el-form-item>
      <el-form-item prop="versionName" label="版本号">
        <el-input v-model="dataForm.versionName" placeholder="请输入应用版本号，格式如:1.1.1" />
      </el-form-item>
      <el-form-item prop="name" label="安装包" v-if="dataForm.event === 1">
        <el-upload
          class="upload-demo"
          :action="url"
          :before-upload="beforeAvatarUpload"
          :on-success="handlesSuccess"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          ref="upload"
          :on-exceed="onExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">请上传.wgt安装包</div>
        </el-upload>
      </el-form-item>
      <el-form-item prop="downloadUrl" label="链接"  v-if="dataForm.event === 1">
        <el-input  v-model="dataForm.downloadUrl"  placeholder="请输入安装包链接~" />
      </el-form-item>
      <el-form-item prop="upgradeContext" label="更新内容">
        <el-input type="textarea" v-model="dataForm.upgradeContext"  placeholder="多条更新,请换行填写" />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import Cookies from "js-cookie";

export default {
    data() {
        return {
          visible: false,
          url:'',
          dataForm : {
            id:'',
            title: "",
            versionName: "",
            upgradeContext: "",
            upgradeType: "all",
            fileSize: 0,
            downloadUrl: "",
            event: 1,
          },
          fileList: [],
          type: "wgt",

          rules: {
            title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
            downloadUrl: [{ required: true, message: "请填写包的下载链接", trigger: "blur" }],
            versionName: [
              { required: true, message: "请输入应用版本号", trigger: "blur" },
              {
                validator: (rule, value, callback) => {
                  if (value && !/^\d+\.\d+\.\d+$/.test(value)) {
                    callback(new Error("请输入正确格式,例:1.1.1"));
                  } else {
                    callback();
                  }
                },
                trigger: "blur"
              }
            ]
          }
        }
    },
    computed: {
    },
    methods: {
      init() {
        this.url = `${window.SITE_CONFIG["apiURL"]}/sys/oss/upload?token=${Cookies.get('token')}`;
          this.visible = true;
          this.$nextTick(() => {
            this.dataForm.downloadUrl = '';
            this.fileList=[];
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.id) {
              this.getInfo()
            }
          })
      },
      getInfo () {
        this.$http.get(`/website/appversion/${this.dataForm.id}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.dataForm = res.data;
        }).catch(() => {})
      },
      upgradeTypeChange(value) {
        this.dataForm.downloadUrl = '';
        this.dataForm.fileSize = '';
        if (value===1) {
          this.$refs.upload.clearFiles();
          this.type = "wgt";
        }else{
            this.type = "app";
        }
      },
      handleRemove(file, fileList) {
        this.$refs.upload.abort();
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}?`);
      },
      onExceed() {
        this.$message({
          message: "请先删除已上传文件，再新增",
          type: "error",
          duration: 800
        });
      },
      beforeAvatarUpload(file) {
        var file = file;
        this.dataForm.fileSize = file.size;
        if (file.name) {
          var result = file.name.split(".");
          if (result.length) {
            var type = this.type;
            var extension = result[result.length - 1];
            if (type !== extension) {
              this.$message({
                message: "请上传后缀为" + type + "的文件",
                type: "error",
                duration: 1500
              });
              this.fileList = [];
            }
          }
        }
      },
      handlesSuccess(response) {
        this.$message({
          message: "安装包上传成功",
          type: "success",
          duration: 1500
        });
        this.dataForm.downloadUrl = response.data.src;
      },
      // 表单提交
      dataFormSubmitHandle: debounce(function () {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          this.$http[!this.dataForm.id ? 'post' : 'put']('/website/appversion', this.dataForm).then(({data: res}) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => {
          })
        })
      }, 1000, {'leading': true, 'trailing': false})
    }
}
</script>

<style>
  .el-table .cell {
      white-space: pre-line;
  }
</style>