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
    -> manage crud <pageName> 通过指定的 BUILD JSON 文件直接生成 CRUD 页面
    -> manage category <pageName> <scope> [...opt] 通过指定的 BUILD JSON 文件生成带有分类功能的 CRUD 页面
  swagger <action> [arguments]  swagger 工具
    -> swagger ls [filter] 列出 swagger 可用的 API
    -> swagger format 重新 format swagger.json 文件
    -> swagger json [fileName] 生成一个 BUILD JSON 文件
```

### 示例: 如何生成 CRUD 页面

一般来说, 需要通过特定格式的 `BUILD JSON` 文件来生成页面

#### 通过 swagger 生成 `BUILD JSON` 文件

除了直接手写以外, 推荐通过 `swagger.json` 文件来生成 `BUILD JSON`

先拷贝 `swagger.json` 于目录 `./swagger/swagger.json` 

然后通过命令生成

``` bash
$ zero-json swagger json myJSON --API /api/example
```

> 这里的 API 的值应当为 `swagger.js` 里面的 get list record 的 API

> 上面的命令会在当前工作目录输出文件 `./myJSON.json` , 你也可以通过 `-o ~/work/myJSON.js` 来输出到其它路径

#### 通过 json 生成 crud 页面

于当前目录下, 创建一个 `BUILD JSON` 格式的文件 `build.json` , 然后通过命令生成

``` bash
$ zero-json manage crud 页面名称
```

或者通过参数 `-i` 指定其它目录的 json 文件

``` bash
$ zero-json manage crud 页面名称 -i ~/work/myJSON.json
```

##### 用于生成文件的 json ( `BUILD JSON` ) 格式参考

配置了 `map` 的话, formFields type 为 `radio` 或者 `select` 的字段会自动补充上映射关系, tableFields 的同名字段也会自动补充上映射关系

``` json
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
