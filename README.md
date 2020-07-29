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