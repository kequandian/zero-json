
const ora = require('ora');
const clone = require('../clone');
const fs = require('fs-extra');
const cwd = process.cwd();
const path = require('path');
const { parseConfig } = require('../../utils/parseFile');
const HTMLParser = require('node-html-parser');

module.exports = function (endpoint) {
  const workDir = path.resolve('./');

  const devConfigPath = path.join(workDir, 'config/dev.config.js');
  const devConfig = parseConfig(devConfigPath);
  devConfig.copy = [
    {
      from: "./src/config.js",
      to: "./config.js"
    },
  ];

  const configFilePath = path.join(workDir, 'src/config.js');
  const documentFilePath = path.join(workDir, 'src/pages/document.ejs');

  return Promise.all([
    fs.writeFile(devConfigPath, `export default ${JSON.stringify(devConfig)}`),
    fs.ensureFile(configFilePath).then(_ => {
      return fs.writeFile(
        configFilePath,
        `if(window.ZEle === undefined) {
window.ZEle = {};
}
window.ZEle.HOST = '${endpoint}';`
      );
    }),
    fs.readFile(documentFilePath, { encoding: 'utf8' }).then((data) => {
      const root = HTMLParser.parse(data);
      if(root.querySelector('#ZEle-config') === null) {
        root.querySelector('body').appendChild('<script id="ZEle-config" src="config.js"></script>');
      }
      return fs.writeFile(documentFilePath, root.toString());
    })
  ]);
}
