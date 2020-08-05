#zero-json

推荐直接使用 cli [zero-json](https://github.com/kequandian/zero-json) 工具来初始化一个新的后台管理项目

## 安装

``` bash
$ git clone git@github.com:kequandian/zero-json.git

$ npm install 

$ npm link
```

## 使用

####一、初始化web后台管理项目

在项目的根目录下, 通过命令zero-json manage init [目录名称，例如web] 初始化一个后台管理项目

``` bash
$ zero-json manage init web 
```


####二、新建json配置文件

在项目下新建一个目录存放json配置文件: 例如 [config.json存放目录]/config.json

 - [config.json](../zero-json/config.json.md)

####三、通过json配置文件生成CRUD页面代码

在后台管理项目pages目录下 web/src/pages

通过命令zero-json manage gen [目录名称，例如test] -i [config.json文件所在目录]/config.json 生成 CRUD 页面代码
  
生成的CRUD页面代码在test目录里面
  
提示：生成的CRUD代码目录必须放在目录web/src/pages下

``` bash
$ cd web/src/pages

$ zero-json manage gen test -i [config.json文件所在目录]/config.json 
```

####四、后台管理项目布局设置
1、全局设置  web/public/config.js
- [config](../zero-json/config.md)

``` 
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
```

2、树形菜单设置  web/src/config/router.config.js

提示：

如要设置多级菜单，需要在pages目录下创建一个父菜单目录（例如tests）

然后把生成的CRUE代码目录放在父菜单目录里面

- [router.config](../zero-json/router.config.md)
``` 
module.exports = [
  {
    name: '测试管理',   //一级菜单名
    path: '/tests',    //父菜单目录路径
    items: [
      {
        name: '测试列表1',      //二级菜单名
        path: '/tests/test1',  //子菜单目录路径
      },
      {
        name: '测试列表2',      //二级菜单名
        path: '/tests/test2',  //子菜单目录路径    
      },
    ],
  },
  /*{
    name: '一级菜单',
    path: '/b',
    items: [
      {
        path: '/b/c',
        name: '二级菜单',
      },
    ],
  },*/
]
```
3、页面布局设置 web/src/pages/test/config/*.js

- [layout](../zero-json/layout.md)

``` 
const setting = require('./test-setting.json');

module.exports = {
  layout: 'TitleContent',
  title: '新增' + setting.pageName,  //设置标题名称
  items: [
    {
      component: 'Form',
      config: {
        API: {
          createAPI: setting.createAPI,
        },
		layout: "Grid",                //layout设置，调整表单布局     
		layoutConfig: {
			value: [12,12]
		},
        fields: setting.formFields,
      },
    },
  ],
};
```

最后启动项目
``` 
$ npm start
```
