const setting = require('./test-setting.json');

module.exports = {
  layout: 'TitleContent',
  title: '新增' + setting.pageName, //设置标题名称
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