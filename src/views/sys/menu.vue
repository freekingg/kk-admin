<template>
  <div class="mod-sys__menu">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-button v-if="state.hasPermission('/sys/perm/menu/add')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="dataList" row-key="id" border style="width: 100%">
      <el-table-column prop="name" :label="$t('menu.name')" header-align="center" min-width="150"></el-table-column>
      <el-table-column prop="icon" :label="$t('menu.icon')" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <svg class="iconfont" aria-hidden="true">
            <use :xlink:href="`#${scope.row.icon}`"></use>
          </svg>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" :label="$t('menu.type')" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.menuType === 0">{{ $t("menu.type0") }}</el-tag>
          <el-tag v-else-if="scope.row.menuType === 1" type="info">{{ $t("menu.type1") }}</el-tag>
          <el-tag v-else-if="scope.row.menuType === 2" type="info">{{ $t("menu.type2") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="openStyle" :label="$t('menu.openStyle')" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <el-tag type="info" v-if="scope.row.menuType === 1 && scope.row.openStyle === 0">{{ $t("menu.openStyle0") }}</el-tag>
          <el-tag type="info" v-else-if="scope.row.menuType === 1 && scope.row.openStyle === 1">{{ $t("menu.openStyle1") }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="$t('menu.sort')" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="url" :label="$t('menu.url')" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="permissions" :label="$t('menu.permissions')" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="170">
        <template v-slot="scope">
          <el-button v-if="state.hasPermission('/sys/perm/menu/add') && scope.row.menuType === 0" type="primary" link @click="addHandle(scope.row)">{{ $t("add") }}</el-button>
          <el-button v-if="state.hasPermission('/sys/perm/menu/update')" type="primary" link @click="addOrUpdateHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('/sys/perm/menu/delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList" :menuList="menuList" :iconList="iconList"></add-or-update>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { reactive, ref, toRefs, computed, onMounted, nextTick } from "vue";
import AddOrUpdate from "./menu-add-or-update.vue";
import { getIconList } from "@/utils/utils";

const view = reactive({
  getDataListURL: "/sys/perm/menu/list",
  deleteURL: "/sys/perm/menu/delete"
});

const state = reactive({ ...useView(view), ...toRefs(view) });
const iconList = ref<string[]>([]);
const dataList = computed(() => {
  let list1 = transformData(state.dataList);
  let list2 = filterMenu(list1);
  return list2;
});

const menuList = computed(() => {
  let list1 = transformData(state.dataList);
  let list2 = filterMenu2(list1);
  return list2;
});

const addOrUpdateRef = ref();
const addOrUpdateHandle = (row?: any) => {
  addOrUpdateRef.value.init(row);
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

const filterMenu2 = (menus: any = [], parentId = 0, menusList = []): any => {
  menus.forEach((menu: any) => {
    if (menu.pid === parentId) {
      if (menu.menuType !== 2) {
        menu.children = filterMenu2(menus, menu.id);
        menusList.push(menu as never);
      }
    }
  });
  return menusList;
};

const addKey = ref(0);
const addHandle = (row: any) => {
  addKey.value++;
  nextTick(() => {
    addOrUpdateRef.value.init2(row);
  });
};

onMounted(() => {
  iconList.value = getIconList();
});
</script>
