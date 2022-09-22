// #ifdef VUE3
import { createSSRApp } from "vue";
import App from "./App.vue";
// import Vue from 'vue'
import * as Pinia from 'pinia';
import { http } from '@/utils/http' // 全局挂载引入，配置相关在该index.js文件里修改

// // 引入公用组件 登陆模块
// import login from "@/components/login/login.vue";
// Vue.component("login", login);

export function createApp() {
  const app = createSSRApp(App);
  app.config.globalProperties.$http =http;
  app.use(Pinia.createPinia());
 
  return {
    app,
    Pinia
  };
}
// #endif
