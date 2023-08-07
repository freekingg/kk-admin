import { CacheToken } from "@/constants/cacheKey";
import { IObject } from "@/types/interface";
import { getSysRouteMap } from "@/router";
import baseService from "@/service/baseService";
import { removeCache } from "@/utils/cache";
import { mergeServerRoute, routeToTree } from "@/utils/router";
import { defineStore } from "pinia";

export const useAppStore = defineStore("useAppStore", {
  state: () => ({
    state: {
      appIsLogin: false, //是否登录
      appIsReady: false, //app数据是否就绪
      appIsRender: false, //app是否开始渲染内容
      permissions: [], //权限集合
      user: {
        createDate: "",
        deptId: "",
        deptName: "",
        email: "",
        gender: 0,
        headUrl: "",
        id: "",
        mobile: "",
        postIdList: "",
        realName: "",
        roleIdList: "",
        status: 0,
        superAdmin: 0,
        username: ""
      }, //用户信息
      dicts: [], //字典
      routes: [], //最终的路由集合
      menus: [], //菜单集合
      routeToMeta: {}, //url对应标题meta信息
      tabs: [], //tab标签页集合
      activeTabName: "", //tab当前焦点页
      closedTabs: [] //存储已经关闭过的tab
    } as IObject
  }),
  actions: {
    updateState(data: IObject) {
      Object.keys(data).forEach((x: string) => {
        this.state[x] = data[x];
      });
    },
    initApp() {
      return Promise.all([
        baseService.get("/user/permmenu"), //加载菜单
        baseService.get("/user/info"), //加载用户信息
        baseService.get("/config/dict/all") //加载字典
      ]).then(([permmenu, user, dicts]: any) => {
        const { menus, perms }: any = permmenu;

        const [routes, routeToMeta] = mergeServerRoute(
          (routeToTree(menus) as any) || [],
          getSysRouteMap()
        );
        this.updateState({
          permissions: perms || [],
          user: user || {},
          dicts: dicts.list || [],
          routeToMeta: routeToMeta || {},
          menus: []
        });
        return routes;
      });
    },
    //退出
    logout() {
      removeCache(CacheToken, true);
      this.updateState({
        appIsLogin: false,
        permissions: [],
        user: {},
        dicts: [],
        menus: [],
        routes: [],
        tabs: [],
        activeTabName: ""
      });
    }
  }
});
