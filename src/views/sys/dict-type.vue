<template>
  <div class="mod-sys__dict">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.name" :placeholder="$t('dict.dictName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="state.hasPermission('/config/dict/add')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border @selection-change="state.dataListSelectionChangeHandle" @sort-change="state.dataListSortChangeHandle" style="width: 100%">
      <el-table-column prop="name" :label="$t('dict.dictName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="uniqueKey" :label="$t('dict.dictType')" header-align="center" align="center">
        <template v-slot="scope">
          <el-button type="primary" link @click="showTypeList(scope.row)">{{ scope.row.uniqueKey }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" :label="$t('dict.sort')" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" :label="$t('dict.remark')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="updateTime" :label="$t('dict.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="180">
        <template v-slot="scope">
          <el-button type="primary" link @click="showTypeList(scope.row)">字典配置</el-button>
          <el-button v-if="state.hasPermission('/config/dict/update')" type="primary" link @click="addOrUpdateHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button v-if="state.hasPermission('/config/dict/delete')" type="primary" link @click="state.deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="[10, 20, 50, 100]" :page-size="state.limit" :total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle" @current-change="state.pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update :key="addKey" ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
    <!-- 字典类型数据 -->
    <el-drawer v-if="dictDataVisible" v-model="dictDataVisible" :title="state.focusDictTypeTitle" :size="800" :close-on-press-escape="false" class="rr-drawer"> <DictTypeList :dictTypeId="state.focusDictTypeId"></DictTypeList></el-drawer>
  </div>
</template>

<script lang="ts" setup>
import useView from "@/hooks/useView";
import { reactive, ref, toRefs, nextTick } from "vue";
import AddOrUpdate from "./dict-type-add-or-update.vue";
import DictTypeList from "./dict-data.vue";
import { IObject } from "@/types/interface";
import { useRoute } from "vue-router";
const route = useRoute();

const dictDataVisible = ref(false);

const view = reactive({
  getDataListURL: "/config/dict/page",
  getDataListIsPage: true,
  deleteURL: "/config/dict/delete",
  dataForm: {
    id: "0",
    name: "",
    dictType: ""
  },
  focusDictTypeId: "",
  focusDictTypeTitle: ""
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const showTypeList = (row: IObject) => {
  dictDataVisible.value = true;
  state.focusDictTypeId = row.id;
  state.focusDictTypeTitle = `${route.meta.title} - ${row.uniqueKey}`;
};

const addOrUpdateRef = ref();
const addKey = ref(0);
const addOrUpdateHandle = (row: any = {}) => {
  addKey.value++;
  let body = JSON.parse(JSON.stringify(row));
  nextTick(() => {
    addOrUpdateRef.value.init(body);
  });
};
</script>
