##json格式配置文件示例

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
		  "field": "createdTime"
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
