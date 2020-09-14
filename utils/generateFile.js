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
  title: setting.pageName,
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
  title: setting.pageName,
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
  title: '新增' + setting.pageName,
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
  title: '编辑' + setting.pageName,
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
import setting from './config/${name}-setting';
import Card from '@/components/Card';
import Details from '@/components/Details';

export default () => <Card title={\`\${setting.pageName}详情\`}>
  <Details namespace="${namespace}" 
    API={setting.getAPI}
    fields={setting.viewFields}
    map={setting.map}
    col={setting.columns}
  />
</Card>
`
  )
}

function generateSettingFile({ filePath, data }) {
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeJson(filePath, data, {
    spaces: 2,
  })
}