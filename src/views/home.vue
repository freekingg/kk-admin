<template>
  <div class="mod-home">
    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
        <table>
          <tr>
            <th>{{ $t("home.sysInfo.name") }}</th>
            <td>{{ $t("home.sysInfo.nameVal") }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.version") }}</th>
            <td>{{ $t("home.sysInfo.versionVal") }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.osName") }}</th>
            <td>{{ sysInfo.osName }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.osVersion") }}</th>
            <td>{{ sysInfo.osVersion }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.osArch") }}</th>
            <td>{{ sysInfo.osArch }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.processors") }}</th>
            <td>{{ sysInfo.processors }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.totalPhysical") }}</th>
            <td>{{ sysInfo.totalPhysical }}MB</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.freePhysical") }}</th>
            <td>{{ sysInfo.freePhysical }}MB</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.memoryRate") }}</th>
            <td>{{ sysInfo.memoryRate }}%</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.userLanguage") }}</th>
            <td>{{ sysInfo.userLanguage }}</td>
          </tr>
        </table>
      </el-col>
      <el-col :span="12" :xs="24">
        <table>
          <tr>
            <th>{{ $t("home.sysInfo.jvmName") }}</th>
            <td>{{ sysInfo.jvmName }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.javaVersion") }}</th>
            <td>{{ sysInfo.javaVersion }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.javaHome") }}</th>
            <td>{{ sysInfo.javaHome }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.userDir") }}</th>
            <td>{{ sysInfo.userDir }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.javaTotalMemory") }}</th>
            <td>{{ sysInfo.javaTotalMemory }}MB</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.javaFreeMemory") }}</th>
            <td>{{ sysInfo.javaFreeMemory }}MB</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.javaMaxMemory") }}</th>
            <td>{{ sysInfo.javaMaxMemory }}MB</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.userName") }}</th>
            <td>{{ sysInfo.userName }}</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.systemCpuLoad") }}</th>
            <td>{{ sysInfo.systemCpuLoad }}%</td>
          </tr>
          <tr>
            <th>{{ $t("home.sysInfo.userTimezone") }}</th>
            <td>{{ sysInfo.userTimezone }}</td>
          </tr>
        </table>
      </el-col>
    </el-row>
    <el-card shadow="never" style="margin-top: 10px">
      <template #header>
        <h2 style="margin: 0">数据统计</h2>
      </template>
      <v-chart :option="bar" :autoresize="true" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, provide } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import VChart, { THEME_KEY } from "vue-echarts";
import { BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart } from "echarts/charts";
import { GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, ToolboxComponent, DataZoomComponent } from "echarts/components";
import baseService from "@/service/baseService";
import { ElMessage } from "element-plus";

onMounted(() => {
  // getSysInfo();
});

const sysInfo = reactive({
  osName: "",
  osVersion: "",
  osArch: "",
  processors: 0,
  totalPhysical: 0,
  freePhysical: 0,
  memoryRate: 0,
  userLanguage: "",
  jvmName: "",
  javaVersion: "",
  javaHome: "",
  userDir: "",
  javaTotalMemory: 0,
  javaFreeMemory: 0,
  javaMaxMemory: 0,
  userName: "",
  systemCpuLoad: 0,
  userTimezone: ""
});

const getSysInfo = () => {
  baseService.get("/sys/info").then((res) => {
    if (res.code !== 0) {
      return ElMessage.error(res.msg);
    }
    Object.assign(sysInfo, res.data);
  });
};
use([BarChart, LineChart, PieChart, MapChart, RadarChart, ScatterChart, EffectScatterChart, LinesChart, GridComponent, PolarComponent, GeoComponent, TooltipComponent, LegendComponent, TitleComponent, VisualMapComponent, DatasetComponent, CanvasRenderer, ToolboxComponent, DataZoomComponent]);

provide(THEME_KEY, "westeros");
const random = () => {
  return Math.round(300 + Math.random() * 700) / 10;
};

const bar = ref({
  textStyle: {
    fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif'
  },
  title: {
    text: "Traffic Sources",
    left: "center"
  },
  tooltip: {
    trigger: "item"
    // formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  dataset: {
    dimensions: ["Product", "2015", "2016", "2017"],
    source: [
      {
        Product: "Matcha Latte",
        2015: random(),
        2016: random(),
        2017: random()
      },
      {
        Product: "Milk Tea",
        2015: random(),
        2016: random(),
        2017: random()
      },
      {
        Product: "Cheese Cocoa",
        2015: random(),
        2016: random(),
        2017: random()
      },
      {
        Product: "Walnut Brownie",
        2015: random(),
        2016: random(),
        2017: random()
      }
    ]
  },
  xAxis: { type: "category" },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
});
</script>

<style lang="less">
.mod-home {
  table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    th,
    td {
      padding: 12px 10px;
      border: 1px solid #ebeef5;
    }
    th {
      width: 30%;
    }
  }
}

.echarts {
  width: 100%;
  height: 300px;
}
</style>
