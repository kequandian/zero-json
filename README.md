## 安装

``` shell
$ npm i -g 

## or below two lines

$ npm install
$ npm link
```

安装成功:

``` shell
$ zero-json -V
2.3.0
```

## 使用方式

``` 
$ zero-json -h
Usage: zero-json Commands [Options]

用于 zero-element 的初始化项目、页面管理

Options:
  -V, --version                output the version number
  -i, --inputPath [inputPath]  指定输入文件
  -o, --outPath [outPath]      命令输出的目录 (default: "当前目录")
  -d, --direct [direct]        直接进行操作，不提示确认 (default: false)
  --API [API]                   指定操作的 API (default: "")
  --swagger [swagger]           指定操作的 swagger 文件目录 (default: "当前目录/swagger/swagger.json")
  -h, --help                    output usage information

Commands:
  manage <action> [arguments]   后台管理项目 工具
    -> manage init <projectName> 初始化一个后台管理项目
    -> manage gen <pageName> 通过路径所在的 json 文件直接生成 CRUD 页面
  swagger <action> [arguments]  swagger 工具
    -> swagger ls [filter] 列出 swagger 可用的 API
    -> swagger format 重新 format swagger.json 文件
```
###初始化web后台管理项目

在项目的根目录下, 通过命令zero-json manage init `[目录名称，例如web]` 初始化一个后台管理项目

``` bash
$ zero-json manage init web 
```

### 示例: 如何生成 CRUD 页面

一般来说, 需要通过特定格式的 `build.json` 文件来生成页面

####通过 swagger 生成 build.json 文件

除了直接手写以外, 推荐通过`swagger.json`文件来生成 `build.json`

先拷贝 `swagger.json` 于目录 `./swagger/swagger.json` 

然后通过命令生成

``` bash
$ zero-json swagger json myJSON --API /api/example
```

> 这里的 API 的值应当为 `swagger.js` 里面的 get list record 的 API

> 上面的命令会在当前工作目录输出文件 `./myJSON.json` , 你也可以通过 `-o ~/work/myJSON.js` 来输出到其它路径

####通过json配置文件生成CRUD页面代码

在项目下新建一个目录存放json配置文件: 例如 `[build.json存放目录]/build.json`

 - [build.json](../zero-json/build.json.md)
 
 用于生成文件的 json ( build.json ) 格式参考
 配置了 map 的话, formFields type 为 radio 或者 select 的字段会自动补充上映射关系, tableFields 的同名字段也会自动补充上映射关系
 ``` 
 {
   "pageName": "测试页面",
   "crudAPI": "/api/example",
   "map": {
     "sex": {
       "0": "男",
       "1": "女"
     }
   },
   "searchFields": [
     { "field": "search", "label": "搜索", "type": "input" }
   ],
   "tableFields": [
     {
       "label": "姓名",
       "field": "name"
     },
     {
       "label": "性别",
       "field": "sex",
       "options": {
         "color": {
           "0": "lightblue",
           "1": "#fc7ebe"
         }
       }
     }
   ],
   "formFields": [
     {
       "label": "姓名",
       "field": "name",
       "type": "input"
     },
     {
       "label": "性别",
       "field": "sex",
       "type": "radio"
     }
   ]
 }
 ```

在后台管理项目pages目录下 web/src/pages

通过命令zero-json manage gen [目录名称，例如test] -i [build.json文件所在目录]/build.json 生成 CRUD 页面代码
  
生成的CRUD页面代码在test目录里面
  
提示：生成的CRUD代码目录必须放在目录web/src/pages下

``` bash
$ cd web/src/pages

$ zero-json manage gen test -i [build.json文件所在目录]/build.json 
```

###示例：后台管理项目布局设置
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

