
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');
const { yamlToBuildJSON } = require('../../utils/formatToBuildJSON');
const Yaml = require('yaml');

module.exports = function (yamlFile) {
  return fs.readFile(yamlFile, 'utf-8')
    .then(data => {
      const yamlData = Yaml.parse(data);
      const { pages } = yamlData;
      const rst = {};

      Object.keys(pages).forEach(pageName => {
        if (typeof pages[pageName] === 'string') {
          ;
        } else if (String(pages[pageName]) === '[object Object]') {
          const json = yamlToBuildJSON(pages[pageName]);
          rst[pageName] = json;

        } else {
          throw new Error('未知的 yaml 格式');
        }

      })

      return Promise.resolve(rst);

    })
}