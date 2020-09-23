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

function generateDetailConfig({ filePath, namespace, name, viewOthers, viewItems }) {

  return fs.writeFile(filePath,
    `import React from 'react';
import setting from './config/${name}-setting';
import Card from '@/components/Card';
import Details from '@/components/Details';
import useDetails from '@/components/Details/hooks';
import { Flex } from 'layout-flex';
import { Button } from 'antd';
import ImageCardList from '@/components/Details/components/ImageCardList';
import Statuslog from '@/components/Details/components/Statuslog';

const { FlexItem } = Flex;

export default () => {
  const [data, loading] = useDetails('${namespace}', setting.getAPI);

  return <Flex align="flex-start">
  <FlexItem flex={1}>
    <Card title={setting.pageName.view}>
      <Details namespace="${namespace}"
        fields={setting.viewFields}
        map={setting.map}
        col={setting.columns}
        data={data}
        loading={loading}
      />
    </Card>
    <br />
    ${viewItems ? `<ImageCardList
      title="${viewItems.title}"
      namespace="${namespace}"
      API="${viewItems.api}"
      map={${JSON.stringify(viewItems.map, null, 6)}}
      format={${JSON.stringify(viewItems.format, null, 6)}}
      operation={${JSON.stringify(viewItems.operation, null, 6)}}
    />` : ''}
    <br /><br />
  </FlexItem>
  ${viewOthers && viewOthers.length ?
      `<FlexItem className="Details-other">
${viewOthers.map(({ title, type, api }, i) =>
        type === 'statusList' ? detailStatusList(title, api)
          : detailPlain(namespace, title, i))
        .join('\n    <br />\n')
      }
  </FlexItem>`
      : ''}
</Flex>
}
`
  )
}

function detailPlain(namespace, title, index) {
  return `    <Card title="${title}">
      <Details namespace="${namespace}"
        fields={setting.viewOthers[${index}].fields}
        map={setting.map}
        col={setting.columns}
        data={data}
        loading={loading}
      />
    </Card>`
}

function detailStatusList(title, API) {
  return `    <Statuslog
      title="${title}"
      API="${API}"
      map={setting.map.status.map}
    >
    </Statuslog>`
}

function generateSettingFile({ filePath, data }) {
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeJson(filePath, data, {
    spaces: 2,
  })
}