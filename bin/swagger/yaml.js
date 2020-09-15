
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');
const read = require('../../utils/swagger/read');
const program = require('commander');
const baseSetting = require('../utils/baseSetting');
const Yaml = require('yaml');

const {
  filterFields,
  genCRUDAPI,
} = require('../../utils/formatToBuildJSON');

module.exports = function (originFieldName = 'crudless.yml', API) {
  let fileName = originFieldName;
  if (path.extname(fileName) === '') {
    fileName = `${fileName}.yml`;
  }
  const spinner = ora(`生成 crudless yml 文件 ${fileName}`).start();
  const { direct, outPath } = program;

  if (!API) {
    spinner.fail('必须通过 --API /api/example 来指定一个 swagger.js 里面的 api');
    return;
  }

  const outFilePath = path.join(outPath, fileName);

  confirm(
    fs.existsSync(outFilePath),
    function () {
      return read(API).then(data => {
        if (data instanceof Error) {
          throw data;
        }
        const fieldsObj = {};

        filterFields(data.get.fields).forEach(field => {
          fieldsObj[field.field] = {
            field: field.label,
            scope: ['list', 'new', 'edit', 'view'],
          };
        })

        const jsonData = {
          pages: {
            [path.basename(fileName, '.yml')]: {
              api: API,
              title: path.basename(fileName, '.yml'),
              layout: {
                table: 'Content',
                form: 'TitleContent',
              },
              list: {
                search: {
                  fields: [
                    { label: '搜索', field: 'search', type: 'input' }
                  ]
                },
                actions: [
                  { title: '新建', type: 'add', scope: 'top' },
                  { title: '编辑', type: 'edit', scope: 'item' },
                  { title: '删除', type: 'delete', scope: 'item' },
                ]
              },
              form: {
                columns: 2,
                viewExtra: [],
              },
              fields: fieldsObj,
            }
          },
        }
        return fs.writeFile(path.join(outPath, fileName), Yaml.stringify(jsonData));
      })
        .then(_ => {
          spinner.succeed(`crudless yml 文件已生成`);
          process.exit();
        })
        .catch(e => {
          spinner.fail(e.message);
          process.exit();
        })
    },
    {
      message: `文件 ${outFilePath} 已存在, 是否覆盖?`,
      direct: direct,
    }
  );
}