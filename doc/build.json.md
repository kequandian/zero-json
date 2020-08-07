# BUILD JSON

`BUILD JSON` 是 `zero-json` 所使用的特殊 json 格式, 里面包含了生成 CRUD 页面所需要的基本信息

> 一个标准的 [`BUILD JSON`](./BUILD%20JSON.json) 文件

除了直接手写以外, 推荐通过 `swagger.json` 文件来生成 `BUILD JSON`

先拷贝 `swagger.json` 于目录 `./swagger/swagger.json`

然后通过命令生成

```bash
$ zero-json swagger json build.json --API /api/example
```

> 这里的 API 的值应当为 `swagger.js` 里面的 get list record 的 API

> 上面的命令会在当前工作目录输出文件 `./build.json` , 你也可以通过 `-o ~/work/myJSON.js` 来输出到其它路径
