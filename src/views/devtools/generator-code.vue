<template>
  <div class="generator-code">
    <el-dialog v-model="visible" title="生成代码" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="dataForm" :rules="rules" ref="dataFormRef" label-width="110px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="表名" prop="tableName">
              <el-input v-model="dataForm.tableName" disabled placeholder="表名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功能名" prop="tableComment">
              <el-input v-model="dataForm.tableComment" placeholder="功能名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类名" prop="className">
              <el-input v-model="dataForm.className" placeholder="类名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="baseclassId" label="基类">
              <el-select v-model="dataForm.baseclassId" placeholder="基类" class="w-percent-100" clearable>
                <el-option v-for="item in baseClassList" :key="item.id" :label="item.code" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模块名" prop="moduleName">
              <el-input v-model="dataForm.moduleName" placeholder="模块名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子模块名" prop="subModuleName">
              <el-input v-model="dataForm.subModuleName" placeholder="子模块名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目包名" prop="packageName">
              <el-input v-model="dataForm.packageName" placeholder="项目包名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="dataForm.version" placeholder="版本号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="默认作者" prop="author">
              <el-input v-model="dataForm.author" placeholder="默认作者"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者邮箱" prop="email">
              <el-input v-model="dataForm.email" placeholder="作者邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="后端生成路径" prop="backendPath">
          <el-input v-model="dataForm.backendPath" placeholder="后端生成路径"></el-input>
        </el-form-item>
        <el-form-item label="前端生成路径" prop="frontendPath">
          <el-input v-model="dataForm.frontendPath" placeholder="前端生成路径"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="visible = false" size="small">取消</el-button>
        <el-button type="primary" @click="dataFormSubmitHandle" size="small">保存</el-button>
        <el-button type="danger" @click="generatorCodeHandle" size="small">生成代码</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { t } = useI18n();
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const baseClassList = ref<any[]>([]);
const dataFormRef = ref();

const dataForm = reactive({
  id: "",
  baseclassId: "",
  backendPath: "",
  frontendPath: "",
  packageName: "",
  email: "",
  author: "",
  version: "",
  subModuleName: "",
  moduleName: "",
  className: "",
  tableComment: "",
  tableName: ""
});

const rules = ref({
  tableName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  tableComment: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  className: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  moduleName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  packageName: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  author: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  backendPath: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  frontendPath: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

const init = (id: string) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  getBaseClassList();
  getTableInfo(id);
};

const getBaseClassList = () => {
  baseService.get("/devtools/baseclass/list").then((res) => {
    baseClassList.value = res.data;
  });
};

const getTableInfo = (id: string) => {
  baseService.get("/devtools/table/" + id).then((res) => {
    Object.assign(dataForm, res.data);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    baseService.put("/devtools/table", dataForm).then((res) => {
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

// 表单提交
const generatorCodeHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    baseService.post("/devtools/generator", dataForm).then((res) => {
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

<style scoped>
.generator-code .el-dialog__body {
  padding: 15px 30px 0 20px;
}
</style>
