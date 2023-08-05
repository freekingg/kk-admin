<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-banner__banner">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="状态：">
          <el-select v-model="dataForm.status" placeholder="请选择" clearable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%">
        <el-table-column prop="sort" label="排序值" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" header-align="center" align="center">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="url" label="图片" header-align="center" align="center" min-width="200">
          <template v-slot="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.url" :preview-src-list="scope.row.url.split(',')" fit="cover"> </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" label="操作时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updater" label="操作人" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import AddOrUpdate from "./banner-add-or-update.vue";
export default {
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/website/banner/page",
        getDataListIsPage: true,
        deleteURL: "/website/banner",
        deleteIsBatch: true
      },
      dataForm: {
        status: ""
      },
      options: [
        {
          label: "启用",
          value: 1
        },
        {
          label: "禁用",
          value: 0
        }
      ]
    };
  },
  components: {
    AddOrUpdate
  }
};
</script>

<style lang="scss" scoped></style>
