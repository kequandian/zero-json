import formConfig from './formConfig';

export default {
  layout: 'Grid',
  title: '管理列表',
  items: [
    {
      span: 24,
      layout: 'SearchDefault',
      component: 'BaseSearch',
      config: {
        fields: [
          { field: 'name', label: '名称', type: 'input' }
        ],
        actions: [
          {
            title: '新增', type: 'modal',
            options: {
              items: [
                {
                  API: {
                    createAPI: '{{APIADDRESS}}',
                  },
                  layout: 'FormDefault',
                  component: 'BaseForm',
                  config: formConfig,
                }
              ],
            },
          }
        ],
      },
    },
    {
      API: {
        listAPI: '{{APIADDRESS}}',
        deleteAPI: '{{APIADDRESS}}/(id)',
      },
      span: 24,
      component: 'BaseList',
      config: {
        fields: [
          { field: 'id', label: 'ID' },
          { field: 'name', label: '名称' },
        ],
        operation: [
          {
            title: '编辑', action: 'modal',
            options: {
              outside: true,
              modalTitle: '编辑部门',
              items: [
                {
                  API: {
                    getAPI: '{{APIADDRESS}}/(id)',
                    updateAPI: '{{APIADDRESS}}/(id)',
                  },
                  layout: 'FormExclusive',
                  component: 'BaseForm',
                  config: formConfig,
                }
              ],
            },
          },
          { title: '删除', action: 'delete' },
        ],
      },
    },
  ],
}