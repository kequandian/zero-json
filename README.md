## 安装

```shell
npm install

npm link
```



安装成功:

```shell
zero-json -V

2.0.0
```

## 使用方式
```
$ zero-json -h
Usage: index [options] [command]

初始化项目、页面管理

Options:
  -V, --version                output the version number
  -i, --inputPath [inputPath]  指定输入文件
  -o, --outPath [outPath]      命令输出的目录 (default: "当前目录")
  -d, --direct [direct]        直接进行操作，不提示确认 (default: false)
  -h, --help                   output usage information

Commands:
  manage <action> [arguments]  后台管理项目 工具
    -> manage init <projectName> 初始化一个后台管理项目
    -> manage gen <pageName> 通过路径所在的 json 文件直接生成 CRUD 页面

```

## 用于生成文件的 json

```json
{
  "pageName": "测试页面",
  "listAPI": "/api/example",
  "createAPI": "/api/example",
  "getAPI": "/api/example/[id]",
  "updateAPI": "/api/example/[id]",
  "deleteAPI": "/api/example/(id)",
  "tableFields": [
    {
      "label": "姓名",
      "field": "name"
    }
  ],
  "formFields": [
    {
      "label": "姓名",
      "field": "name",
      "type": "input"
    }
  ]
}
```