const fs = require('fs-extra');
const path = require('path');

module.exports = {
  generateIndex,
  generateTableConfig,
  generateCategoryTableConfig,
  generateAddFormConfig,
  generateEditFormConfig,
  generateDetailConfig,
  generateSettingFile,

  generateAutoReport,
};

function generateIndex({ filePath, namespace, type }) {

  return fs.writeFile(filePath,
    `import React from 'react';
import ZEle from 'zero-element';
import config from './config/${type}';

export default () => <ZEle namespace="${namespace}" config={config} />;
`
  )
}

function generateTableConfig({ filePath, name }) {

  return fs.writeFile(filePath,
    `const setting = require('./${name}-setting.json');

module.exports = {
  layout: setting.layout.table,
  title: setting.pageName.table,
  items: [
    {
      component: 'Search',
      config: {
        fields: setting.searchFields,
      },
    },
    {
      component: 'Table',
      config: {
        API: {
          listAPI: setting.listAPI,
          deleteAPI: setting.deleteAPI,
        },
        actions: setting.tableActions,
        fields: setting.tableFields,
        operation: setting.tableOperation,
      },
    },
  ],
};
`
  )
}

function generateCategoryTableConfig({ filePath, name, scope }) {

  return fs.writeFile(filePath,
    `const setting = require('./${name}-setting.json');

module.exports = {
  layout: setting.layout.table,
  title: setting.pageName.table,
  items: [
    {
      component: 'TreeList',
      config: {
        API: {
          listAPI: setting.listAPI,
          deleteAPI: setting.deleteAPI,
        },
        tree: {
          API: {
            initAPI: '/api/category/categories/all/tree?scope=${scope}',
          }
        },
        actions: [
          {
            title: '新增', type: 'path',
            options: {
              path: '${name}/${name}-add',
            },
          }
        ],
        fields: setting.tableFields,
        operation: [
          {
            title: '编辑', type: 'path',
            options: {
              outside: true,
              path: '${name}/${name}-edit',
            },
          },
          {
            title: '删除', type: 'delete',
          },
        ]
      },
    },
  ],
};
`
  )
}

function generateAddFormConfig({ filePath, name }) {

  return fs.writeFile(filePath,
    `const setting = require('./${name}-setting.json');

module.exports = {
  layout: setting.layout.form,
  title: setting.pageName.new,
  items: [
    {
      component: 'Form',
      config: {
        API: {
          createAPI: setting.createAPI,
        },
        layout: 'Grid',
        layoutConfig: {
          value: Array(setting.columns).fill(~~(24 / setting.columns)),
        },
        fields: setting.createFields || setting.formFields,
      },
    },
  ],
};
`
  )
}

function generateEditFormConfig({ filePath, name }) {

  return fs.writeFile(filePath,
    `const setting = require('./${name}-setting.json');

module.exports = {
  layout: setting.layout.form,
  title: setting.pageName.edit,
  items: [
    {
      component: 'Form',
      config: {
        API: {
          getAPI: setting.getAPI,
          updateAPI: setting.updateAPI,
        },
        layout: 'Grid',
        layoutConfig: {
          value: Array(setting.columns).fill(~~(24 / setting.columns)),
        },
        fields: setting.updateFields || setting.formFields,
      },
    },
  ],
};
`
  )
}

function generateDetailConfig({ filePath, namespace, name }) {

  return fs.writeFile(filePath,
    `import React from 'react';
import DetailsTemplate from '@/components/Details/DetailsTemplate';
import setting from './config/${name}-setting';
    
export default () => {

  return <DetailsTemplate
    namespace="${namespace}"
    setting={setting}
    config={setting.viewConfig}
  />
}
    
`
  )
}

function generateSettingFile({ filePath, data }) {
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeJson(filePath, data, {
    spaces: 2,
  })
}

function generateAutoReport({ filePath, name }) {

  return fs.writeFile(filePath,
    `const setting = require('./${name}-setting.json');

module.exports = {
  layout: setting.layout.form,
  title: setting.pageName.table,
  items: [
    {
      component: 'AutoReportSearch',
      config: {},
    },
    {
      component: 'AutoReport',
      config: {
        pageSize: 20,
        API: {
          listAPI: setting.listAPI,
        },
        actions: setting.tableActions,
        fields: [],
        operation: []
      },
    },
  ],
};
`
  )
}