# zero-json

## 安装

```shell
$ npm i -g 

## or below two lines after clone

$ npm install
$ npm link
```

安装成功

```shell
$ zero-json -V
2.8.0
```

主要命令

```
$ zero-json -h
Usage: zero-json Commands [Options]

用于 zero-json 的初始化项目、页面管理

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
    -> manage crud <pageName> 通过指定的 BUILD JSON 文件直接生成 CRUD 页面
    -> manage category <pageName> <scope> [...opt] 通过指定的 BUILD JSON 文件生成带有分类功能的 CRUD 页面
  swagger <action> [arguments]  swagger 工具
    -> swagger ls [filter] 列出 swagger 可用的 API
    -> swagger format 重新 format swagger.json 文件
    -> swagger json [fileName] [--API] 生成一个 BUILD JSON 文件
    -> swagger yaml [fileName] [--API] 生成一个 crudless.yml 文件
  mock <port>                   基于 BUILD JSON 来启动一个简单的 mock 服务器
  router <action> [arguments]   router 文件处理工具
    -> router create [routePath] [routeName] 创建一条新路由, 或修改已有路由的名称
    -> router remove [routePath] 移除已有的路由
```

## 使用

[生成项目并测试页面](./doc/README.md)

[BUILD JSON 文件的生成](./doc/build.json.md)

[crueless 文件的生成](./doc/crudless.md)

[BUILD JSON 文件的格式](./doc/BUILD%20JSON.json)
