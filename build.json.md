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