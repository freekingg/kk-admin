<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="menuType" :label="$t('menu.type')">
        <el-radio-group v-model="dataForm.menuType" :disabled="!!dataForm.id">
          <el-radio :label="0">{{ $t("menu.type0") }}</el-radio>
          <el-radio :label="1">{{ $t("menu.type1") }}</el-radio>
          <el-radio :label="2">{{ $t("menu.type2") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" :label="$t('menu.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('menu.name')"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" :label="$t('menu.parentName')" class="menu-list">
        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" :width="400" popper-class="popover-pop">
          <template v-slot:reference>
            <el-input v-model="dataForm.parentName" :readonly="true" :placeholder="$t('menu.parentName')">
              <template v-slot:suffix>
                <el-icon v-if="dataForm.pid !== '0'" @click.stop="deptListTreeSetDefaultHandle()" class="el-input__icon"><circle-close /></el-icon
              ></template>
            </el-input>
          </template>
          <div class="popover-pop-body">
            <el-tree :data="menuList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="menuListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="menuListTreeCurrentChangeHandle"> </el-tree>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item v-if="dataForm.menuType !== 2" prop="router" label="路由">
        <el-input v-model="dataForm.router" :placeholder="$t('menu.url')"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.menuType === 1" prop="url" label="视图路径">
        <el-input v-model="dataForm.url" placeholder="视图路径"></el-input>
      </el-form-item>
      <el-form-item prop="sort" :label="$t('menu.sort')">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t('menu.sort')"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.menuType === 0" prop="openStyle" :label="$t('menu.openStyle')">
        <el-radio-group v-model="dataForm.openStyle">
          <el-radio :label="0">{{ $t("menu.openStyle0") }}</el-radio>
          <el-radio :label="1">{{ $t("menu.openStyle1") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataForm.menuType === 1" prop="openStyle" label="状态">
        <el-radio-group v-model="dataForm.isShow">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataForm.menuType === 2" prop="permissions" :label="$t('menu.permissions')">
        <el-select v-model="dataForm.permissions" multiple filterable allow-create default-first-option :reserve-keyword="false">
          <el-option v-for="item in permissions" :key="item.value" :label="item.value" :value="item.value" />
        </el-select>

        <!-- <el-input v-model="dataForm.permissions" :placeholder="$t('menu.permissionsTips')"></el-input> -->
      </el-form-item>
      <el-form-item v-if="dataForm.menuType === 0" prop="icon" :label="$t('menu.icon')" class="icon-list">
        <el-popover ref="iconListPopover" placement="top-start" trigger="click" popper-class="popover-pop mod-sys__menu-icon-popover">
          <template v-slot:reference> <el-input v-model="dataForm.icon" :readonly="true" :placeholder="$t('menu.icon')"></el-input></template>
          <div class="mod-sys__menu-icon-inner">
            <div class="mod-sys__menu-icon-list">
              <el-button v-for="(item, index) in props.iconList" :key="index" @click="iconListCurrentChangeHandle(item)" :class="{ 'is-active': dataForm.icon === item }">
                <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${item}`"></use></svg>
              </el-button>
            </div>
          </div>
        </el-popover>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const props = defineProps({
  menuList: {
    type: Array,
    default: () => []
  },
  iconList: {
    type: Array,
    default: () => []
  }
});

const { t } = useI18n();

const emit = defineEmits(["refreshDataList"]);

const visible = ref(false);
const dataFormRef = ref();
const menuListTree = ref();
const menuListPopover = ref();
const iconListPopover = ref();

const menuList = computed(() => props.menuList);
const permissions: any = ref([]);

const dataForm = reactive({
  id: "",
  menuType: 0,
  name: "",
  pid: "0",
  parentName: "",
  url: "",
  permissions: "",
  sort: 0,
  icon: "",
  router: "",
  openStyle: 0,
  isShow: 1
});

const rules = ref({
  name: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  router: [{ required: true, message: t("validate.required"), trigger: "blur" }],
  parentName: [{ required: true, message: t("validate.required"), trigger: "change" }]
});

const init = (info?: any) => {
  visible.value = true;
  dataForm.id = "";

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  dataForm.pid = "0";
  dataForm.parentName = t("menu.parentNameDefault");
  dataForm.router = "";
  dataForm.url = "";

  if (info) {
    getInfo(info);
  }
};

const init2 = (row: IObject) => {
  visible.value = true;
  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  dataForm.id = "";
  dataForm.pid = row.id;
  dataForm.parentName = row.name;
};

// 获取信息
const getInfo = (info?: any) => {
  Object.assign(dataForm, info);
  if (+dataForm.pid === 0) {
    return deptListTreeSetDefaultHandle();
  }
  if (dataForm.pid) {
    menuListTree.value?.setCurrentKey(dataForm.pid);
  }
};

// 上级菜单树, 设置默认值
const deptListTreeSetDefaultHandle = () => {
  dataForm.pid = "0";
  dataForm.parentName = t("menu.parentNameDefault");
};

// 上级菜单树, 选中
const menuListTreeCurrentChangeHandle = (data: IObject) => {
  dataForm.pid = data.id;
  dataForm.parentName = data.name;
  menuListPopover.value.hide();
};

// 图标, 选中
const iconListCurrentChangeHandle = (icon: string) => {
  dataForm.icon = icon;
  iconListPopover.value.hide();
};

// 表单提交
const dataFormSubmitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    let body = {
      id: dataForm.id || "",
      name: dataForm.name,
      parentId: dataForm.pid,
      type: dataForm.menuType,
      icon: dataForm.icon,
      perms: dataForm.permissions || "",
      router: dataForm.router || "",
      viewPath: dataForm.url,
      openStyle: dataForm.openStyle,
      isShow: dataForm.isShow,
      orderNum: dataForm.sort
    };
    console.log(body);
    const isUpdate = !dataForm.id ? false : true;
    baseService.post(isUpdate ? "/sys/perm/menu/update" : "/sys/perm/menu/add", body).then((res) => {
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
  init,
  init2
});
</script>

<style lang="less">
.el-popover.el-popper {
  overflow-x: hidden;
}
.mod-sys__menu {
  .menu-list,
  .icon-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  &-icon-popover {
    width: 458px !important;
    overflow-y: hidden !important;
  }
  &-icon-inner {
    width: 100%;
    max-height: 260px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-icon-list {
    width: 458px !important;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
</style>
