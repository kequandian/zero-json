##后台管理项目public目录下config.js配置示例

import {set as APIConfig} from "zero-element/lib/config/APIConfig";

if (window.ZEle === undefined) {
  window.ZEle = {};
}
window.ZEle.endpoint = "http://localhost:8089";//设置为本机地址
window.ZEle.nav = "letf";
window.ZEle.theme = "#1890ff";
window.ZEle.indexPage = "/test"; //这里设置的路径为初始化展示页面
window.ZEle.breadcrumb = true;  //面包屑设置

window.ZEle.remoteConfig = {};
