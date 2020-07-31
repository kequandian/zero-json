## 安装

``` shell
npm install

npm link
```

安装成功:

``` shell
zero-json -V

2.1.0
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

### 示例: 如何生成 CRUD 页面

可以通过 `输入 json 文件` 和 `指定 swagger.json 里面的 API` 两种方式生成, 二选一即可

#### 通过 json 生成

于当前目录下, 创建 `build.json` , 然后通过命令生成

``` bash
zero-json manage gen 页面名称
```

或者通过参数 `-i` 指定其它目录的 json 文件

``` bash
zero-json manage gen 页面名称 -i ~/myJSON.json
```

##### 用于生成文件的 json

``` json
{
  "pageName": "测试页面",
  "listAPI": "/api/example",
  "createAPI": "/api/example",
  "getAPI": "/api/example/[id]",
  "updateAPI": "/api/example/[id]",
  "deleteAPI": "/api/example/(id)",
  "searchFields": [
    { "field": "search", "label": "搜索", "type": "input" }
  ],
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

#### 通过 swagger 生成

拷贝 `swagger.json` 于目录 `./swagger/swagger.json` 

然后通过命令生成

``` bash
zero-json manage gen 页面名称 --API /api/example
```

> 这里的 API 的值应当为 `swagger.js` 里面的 get list record 的 API
