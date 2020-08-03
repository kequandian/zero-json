
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');
const read = require('../../utils/swagger/read');
const program = require('commander');

const {
  filterFields,
  genCRUDAPI,
} = require('../../utils/formatToBuildJSON');

module.exports = function (originFieldName = 'build.json', API) {
  let fileName = originFieldName;
  if (path.extname(fileName) === '') {
    fileName = `${fileName}.json`;
  }
  const spinner = ora(`生成 build json 文件 ${fileName}`).start();
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
        const jsonData = {
          ...genCRUDAPI(API),
          tableFields: filterFields(data.get.fields),
          formFields: filterFields(data.post.fields),
        }
        return fs.writeJson(path.join(outPath, fileName), jsonData);
      })
        .then(_ => {
          spinner.succeed(`build json 文件已生成`);
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