import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv, UserConfig, UserConfigExport } from "vite";
import html from "vite-plugin-html";
import tsconfigPaths from "vite-tsconfig-paths";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
const prefix = `monaco-editor/esm/vs`;

function createServerOptions(env: any): any {
  const { VITE_PORT, VITE_PROXY_API_TARGET } = env;
  return {
    open: false, // 自动启动浏览器
    host: "0.0.0.0", // localhost
    https: false,
    port: VITE_PORT,
    hmr: { overlay: false },
    proxy: {
      "/api": {
        target: VITE_PROXY_API_TARGET,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, "")
      }
    }
  };
}

/**
 * package env type
 */
function packageEnv(mode: string, root: string): any {
  const ret: any = {};
  const envConf = loadEnv(mode, root);

  Object.keys(envConf).forEach((envName) => {
    let conf: unknown = envConf[envName];

    // format port to number
    if (envName === "VITE_PORT") {
      conf = Number(conf);
    }

    ret[envName] = conf;
  });

  return ret;
}

export default (config: UserConfig): UserConfigExport => {
  const mode = config.mode as string;
  const root = process.cwd();
  const env = packageEnv(mode, root);
  return defineConfig({
    base: "./",
    optimizeDeps: {
      include: [
        `${prefix}/language/json/json.worker`,
        `${prefix}/language/css/css.worker`,
        `${prefix}/language/html/html.worker`,
        `${prefix}/language/typescript/ts.worker`,
        `${prefix}/editor/editor.worker`,
        "@/../lib/vform/designer.umd.js"
      ]
    },
    plugins: [
      vue(),
      html({
        inject: {
          injectData: {
            apiURL: loadEnv(mode, process.cwd()).VITE_APP_API,
            socketURL: loadEnv(mode, process.cwd()).VITE_APP_SOCKET,
            title: ""
          }
        },
        minify: true
      }),
      tsconfigPaths(),
      createSvgIconsPlugin({
        iconDirs: [resolve(__dirname, "src/assets/icons/svg")],
        symbolId: "icon-[dir]-[name]"
      })
    ],
    build: {
      chunkSizeWarningLimit: 1024,
      commonjsOptions: {
        include: /node_modules|lib/
      },
      rollupOptions: {
        output: {
          sourcemap: false,
          manualChunks: {
            monacoeditor: ["monaco-editor"],
            quill: ["quill"],
            lodash: ["lodash"],
            lib: ["sortablejs", "vxe-table", "xe-utils"],
            vlib: ["vue", "vue-router", "vue-i18n", "element-plus"]
          }
        }
      }
    },
    resolve: {
      alias: {
        // 配置别名
        "@": resolve(__dirname, "./src"),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    server: createServerOptions(env)
  });
};
