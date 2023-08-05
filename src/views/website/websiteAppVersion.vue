<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-member__task">
      <el-form :inline="true" size="mini" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.title" placeholder="应用包名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-select clearable style="width: 160px" placeholder="升级类型" v-model="dataForm.upgradeType" label-width="80px">
            <el-option v-for="item in pkgTypes" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
            <el-select clearable style="width: 160px;" placeholder="所有状态" v-model="dataForm.status"  label-width="80px"  >
                <el-option
                  v-for="item in statusArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item> -->
        <el-form-item>
          <el-button @click="getDataList()" type="primary">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column prop="title" label="应用名称"></el-table-column>
      <el-table-column prop="versionName" label="版本号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="upgradeType" label="版本类型" header-align="center" align="center"></el-table-column>
      <el-table-column label="更新内容">
        <template v-slot="scope">
          <div v-html="scope.row.upgradeContext"></div>
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="发布时间"></el-table-column>
      <el-table-column prop="updater" label="更新人"></el-table-column>
      <el-table-column prop="event" label="发布类型" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag :type="scope.row.event == 1 ? 'success' : 'primary'">{{ scope.row.event == 1 ? "热更新" : "整包更新" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag :type="scope.row.status == 1 ? 'danger' : 'success'">{{ scope.row.status == 1 ? "未发布" : "已发布" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button type="text" size="small" v-if="scope.row.status == 1" @click="sendHandle(scope.row.id)">发布</el-button>
          <!--            <el-button type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-footer>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </el-footer>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </el-card>
</template>

<script>
import AddOrUpdate from "./websiteAppVersion-add-or-update.vue";
export default {
  data() {
    return {
      mixinViewModuleOptions: {
        getDataListURL: "/website/appversion/page",
        getDataListIsPage: true,
        deleteURL: "/website/appversion",
        deleteIsBatch: true
      },
      dataForm: {
        title: "",
        upgradeType: ""
      },
      pkgTypes: ["android", "ios"],
      statusArray: [
        {
          label: "未发布",
          value: 1
        },
        {
          label: "已发布",
          value: 2
        }
      ]
    };
  },
  components: {
    AddOrUpdate
  },
  methods: {
    sendHandle(id) {
      this.$confirm("你确定发布此版本么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.put(`/website/appversion/send/${id}`).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            }
            this.query();
          });
        })
        .catch(() => {});
    }
  }
};
</script>
