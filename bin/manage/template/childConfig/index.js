import formConfig from './formConfig';

export default {
  layout: 'Grid',
  title: '管理列表',
  items: [
    {
      span: 24,
      layout: 'DefaultSearch',
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
                  layout: 'DefaultForm',
                  component: 'BaseForm',
                  config: {
                    API: {
                      createAPI: 'ZERO_API',
                    },
                    fields: formConfig.fields,
                  },
                }
              ],
            },
          }
        ],
      },
    },
    {
      span: 24,
      layout: 'DefaultList',
      component: 'BaseList',
      config: {
        API: {
          listAPI: 'ZERO_API',
          deleteAPI: 'ZERO_API/(id)',
        },
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
                  layout: 'FormExclusive',
                  component: 'BaseForm',
                  config: {
                    API: {
                      getAPI: 'ZERO_API/(id)',
                      updateAPI: 'ZERO_API/(id)',
                    },
                    fields: formConfig.fields,
                  },
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