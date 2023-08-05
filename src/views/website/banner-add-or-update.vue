<template>
  <el-dialog v-model:visible="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '120px'">
      <el-form-item label="排序：" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="数字越小越靠前（不可重复）"></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="图片：" prop="url">
        <el-upload :action="uploadUrl" :multiple="false" :before-upload="uploadBeforeUploadHandle" :file-list="fileList" :on-success="uploadSuccessHandle">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">支持扩展名：.png .jpg</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="cancel('dataForm')">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Cookies from "js-cookie";
import debounce from "lodash/debounce";
// import { saveBanner } from '@/api/sys/sys'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: "",
        sort: "",
        name: "",
        url: ""
      },
      uploadUrl: `${window.SITE_CONFIG["apiURL"]}/sys/oss/upload?token=${Cookies.get("token")}`,
      fileList: []
    };
  },
  computed: {
    dataRule() {
      return {};
    }
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      this.$http
        .get("/website/banner/" + this.dataForm.id)
        .then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          };
          console.log(this.dataForm.url);
          this.fileList.push({ url: this.dataForm.url });
        })
        .catch(() => {});
    },
    // 表单提交
    dataFormSubmitHandle: debounce(
      function () {
        this.$refs["dataForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.$http[!this.dataForm.id ? "post" : "put"]("/member/member/", this.dataForm)
            .then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg);
              }
              this.$message({
                message: this.$t("prompt.success"),
                type: "success",
                duration: 500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                  this.fileList = [];
                }
              });
            })
            .catch(() => {});
        });
      },
      1000,
      { leading: true, trailing: false }
    ),
    uploadBeforeUploadHandle(file) {
      console.log(file);
      if (file.type !== "image/jpg" && file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/gif") {
        this.$message.error(this.$t("upload.tip", { format: "jpg、png、gif" }));
        return false;
      }
    },
    // 上传图片成功
    uploadSuccessHandle(res, file, fileList) {
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.dataForm.url = res.data.src;
    },
    cancel(formName) {
      this.visible = false;
      this.$refs[formName].resetFields();
      this.fileList = [];
    },
    dataFormSubmitHandle() {
      this.$refs["dataForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
        saveBanner(this.dataForm)
          .then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: "成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            }
          })
          .catch(() => {});
      });
    }
  }
};
</script>
