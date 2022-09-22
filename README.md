## vite + vue3.0 + ts + vite + pinia + uni-app

配置的插件
sass

## 安装

```sh
npm i
```

## 运行、发布 uni-app

```
npm run dev:%PLATFORM%
npm run build:%PLATFORM%
```

%PLATFORM% 可取值如下：

| 值                      | 平台                                                                                                             |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------- |
| app-plus                | app 平台生成打包资源（支持 npm run build:app-plus，可用于持续集成。不支持 run，运行调试仍需在 HBuilderX 中操作） |
| h5                      | h5                                                                                                               |
| mp-alipay               | 支付宝小程序                                                                                                     |
| mp-baidu                | 百度小程序                                                                                                       |
| mp-weixin               | 微信小程序                                                                                                       |
| mp-toutiao              | 字节跳动小程序                                                                                                   |
| mp-lark                 | 飞书小程序                                                                                                       |
| mp-qq                   | QQ 小程序                                                                                                        |
| mp-360                  | 360 小程序                                                                                                       |
| mp-kuaishou             | 快手小程序                                                                                                       |
| quickapp-webview        | 快应用(webview)                                                                                                  |
| quickapp-webview-union  | 快应用联盟                                                                                                       |
| quickapp-webview-huawei | 快应用华为                                                                                                       |

参考的 git：
https://ext.dcloud.net.cn/plugin?id=200
https://github.com/stavyan/TinyShop-UniApp
https://github.com/kuizuo/vite-vue3-uniapp

DONE: 1.移除 uni_modules 目录规范
2.http 请求：luch-request 3.分包的使用 4.登录注册授权的逻辑添加

TODO:
