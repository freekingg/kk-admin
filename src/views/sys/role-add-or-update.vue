<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" :label="$t('role.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('role.name')"></el-input>
      </el-form-item>
      <el-form-item prop="uniqueKey" label="角色标识">
        <el-input v-model="dataForm.uniqueKey" placeholder="请输入角色标识,拼音或者字母"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('role.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('role.remark')"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item size="small" :label="$t('role.menuList')">
            <el-tree :data="menuList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="menuListTree" accordion show-checkbox> </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue";
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { t } = useI18n();
const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const menuList = ref([]);
const dataFormRef = ref();
const menuListTree = ref();

const dataForm = reactive({
  id: "",
  name: "",
  parentId: 0,
  menuIdList: [] as IObject[],
  remark: "",
  uniqueKey: "",
  status: 1
});

const rules = ref({
  name: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  uniqueKey: [{ required: true, message: t("validate.required"), trigger: "blur" }]
});

const init = (row?: any) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  nextTick(() => {
    if (menuListTree.value) {
      menuListTree.value.setCheckedKeys([]);
    }

    Promise.all([getMenuList()]).then(() => {
      if (row?.id) {
        getInfo(row);
      }
    });
  });
};

// 获取菜单列表
const getMenuList = () => {
  return baseService.get("/sys/perm/menu/list").then((res: any) => {
    let list1 = transformData(res.list);
    let list2 = filterMenu(list1);
    menuList.value = list2;
  });
};

// 获取信息
const getInfo = (row?: any) => {
  Object.assign(dataForm, row);
  dataForm.menuIdList.forEach((item: IObject) => menuListTree.value.setChecked(item, true));
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    const permMenuIds = [...menuListTree.value.getHalfCheckedKeys(), ...menuListTree.value.getCheckedKeys()];
    let body = {
      ...dataForm,
      permMenuIds
    };
    console.log("dataForm: ", dataForm);
    const isUpdate = !dataForm.id ? false : true;
    baseService.post(isUpdate ? "sys/role/update" : "sys/role/add", body).then((res) => {
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

const transformData = (data: any[] = []) => {
  let list = data.map((item: any) => {
    return {
      id: item.id,
      pid: item.parentId,
      name: item.name,
      router: item.router,
      url: item.viewPath,
      menuType: item.type,
      openStyle: item.openStyle,
      icon: item.icon,
      sort: item.orderNum,
      permissions: item.perms,
      isShow: item.isShow
    };
  });
  return list;
};

const filterMenu = (menus: any = [], parentId = 0, menusList = []): any => {
  menus.forEach((menu: any) => {
    if (menu.pid === parentId) {
      menu.children = filterMenu(menus, menu.id);
      menusList.push(menu as never);
    }
  });
  return menusList;
};

defineExpose({
  init
});
</script>
