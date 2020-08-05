# build.json 格式参考
  简单模板格式例子
``` 
{
  "pageName": "测试实体",     
  "crudAPI": "/api/crud/testsaas/entities",   
  "searchFields":[
    {
      "label": "名称",
      "field": "name",
      "type": "input"
    },
    {
      "label": "状态",
      "field": "status",
      "type": "select",
      "options": [
        {
          "label": "开启",
          "value": "open"
        },
        {
          "label": "提交",
          "value": "submit"
        },
        {
          "label": "审核",
          "value": "underview"
        },
        {
          "label": "关闭",
          "value": "close"
        }
      ]
    }
  ],
  "tableFields": [
	  {
	    "label": "名称",
		"field": "name"
      },
	  {
	    "label": "状态",
		"field": "status",
        "valueType": "tag",
        "options": {
          "map": {
            "open": "开启",
            "submit": "提交",
            "underview": "审核",
            "close": "关闭"
        },
        "color": {
          "open": "#1890ff",
          "submit": "#1891ff",
          "underview": "#1892ff",
          "close": "#1893ff"
        }
      }
      },
	  {
	    "label": "创建时间",
		"field": "createdTime",
        "type":"date"
      }
  ],
  "formFields": [
    {
      "label": "名称",
      "field": "name",
      "type": "input"
    },
	{
      "label": "状态",
      "field": "status",
      "type": "select",
      "options": [
          {
            "label": "开启",
            "value": "open"
          },
          {
            "label": "提交",
            "value": "submit"
          },
          {
            "label": "审核",
            "value": "underview"
          },
          {
            "label": "关闭",
            "value": "close"
          }
        ]
    }
  ]
}
 ``` 
### 模版 searchFields属性:
>[ ]中可以放入需要搜索的元素，用于索引
 ``` 
"searchFields":[
    {
      "label": "名称",   //元素名称
      "field": "name",  //字段
      "type": "input"   //组件类型
    }
]
 ``` 
### 模版 tableFields属性:
>[ ]中可以放入需要显示的元素，用于列表显示
 ``` 
"tableFields":[
    {
        "label": "名称",   //元素名称
        "field": "name"   //字段
    },
    {
	    "label": "创建时间",       //元素名称
		"field": "createdTime",  //字段
        "type":"date"            //组件类型
    }
]
 ```

### 模版 formFields属性:
>[ ]中可以放入需要输入的表单元素，用于添加或者编辑
 ``` 
"searchFields":[
    {
        "label": "名称",  //元素标签
        "field": "name"  //字段
    },
    {
	    "label": "创建时间",       //元素标签
		"field": "createdTime",  //字段
        "type":"date"            //组件类型
    }
]
 ```

### 模板元素组件属性：
>常用type组件类型有：`input`, `select`, `date`, `text-area`, `pcd`

input：基本输入框
```
   {
      "label": "名称",   
      "field": "name",  
      "type": "input"  
    }
```
select：列表单选框，需要配置options
```
    {
      "label": "状态",
      "field": "status",
      "type": "select",
      "options": [
          {
            "label": "开启",
            "value": "open"
          },
          {
            "label": "提交",
            "value": "submit"
          },
          {
            "label": "审核",
            "value": "underview"
          },
          {
            "label": "关闭",
            "value": "close"
          }
        ]
    }
```
date：日期选择框
```
    {
	   "label": "创建时间",       //元素标签
	   "field": "createdTime",  //字段
       "type":"date"            //组件类型
    }
```
text-area：文本域
```
  {
      "label": "顾客简介",
      "span": 24,
      "field": "description",
      "type": "text-area",
      "span": 10,               //设置文本域大小
      "props": {
        "autoSize": {
          "minRows": 4
        },
        "placeholder": "请输入……"   
      }
  }
```
pcd：区域设置
```
   {
      "label": "名称",   
      "field": "name",  
      "type": "pcd"  
    }
```
提示：在tableFields中要显示select组件的元素，需要将valueType设置为tag，并且配置映射
```
  {
    "label": "状态",
    "field": "status",
    "valueType": "tag",         //valueType设置为tag
    "options": {
      "map": {                  //配置映射
        "open": "开启",
        "submit": "提交",
        "underview": "审核",
        "close": "关闭"
    },
    "color": {                  //配置显示元素的颜色
      "open": "#1890ff",
      "submit": "#1891ff",
      "underview": "#1892ff",
      "close": "#1893ff"
    }
  }
```