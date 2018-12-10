
const fs = require('fs-extra');

/**
 * 把 swagger 里面天书一样的格式，格式化为 人类看得懂的格式
 * @returns Promise
 */
module.exports = function format() {
  return fs.readJSON(`${__dirname}/../../swagger/index.json`).then((jsonData) => {
    const rstData = {};
    const APIObject = jsonData.paths;
    Object.keys(APIObject).forEach(API => {
      const APIItem = APIObject[API];
      Object.keys(APIItem).forEach(method => {
        const current = APIItem[method];
        rstData[API] = {
          ...(rstData[API] || {}),
          API,
          summary: `${(rstData[API] && rstData[API].summary + '。') || ''}${(current.tags || []).join('')} ${current.summary}`,
          [method]: {
            fields: [],
            ref: current['responses']['200'] && current['responses']['200']['schema']['$ref'],
          },
        };
      })
    });
    Object.keys(rstData).forEach(API => {
      const current = rstData[API];
      checkRef(current, jsonData);
    });
    return fs.outputFile(`${__dirname}/../../swagger/format.json`, JSON.stringify(rstData, null, 2));
  });
}

/**
 * 找到当前 ref
 *
 * @param {*} current
 * @param {*} jsonData
 * @returns
 */
function checkRef(current, jsonData) {
  if (typeof current === 'string') {
    // children ref
    return formatRef(current, jsonData);
  }
  const methodList = ['get', 'post', 'put', 'delete'];
  methodList.forEach(method => {
    if (current[method]) {
      const ref = current[method].ref || current[method]['$ref'];
      if (!ref) {
        console.log(`警告 API ${current.API} 的 ref 非法`);
        return false;
      }
      current[method].fields = formatRef(ref, jsonData);
    }
  });
}

function formatRef(ref, jsonData) {
  const refArray = ref.replace('#/', '').split('/');
  let refObj = jsonData;
  refArray.forEach(key => {
    refObj = refObj[key];
  });
  const fields = [];
  Object.keys(refObj.properties).forEach(field => {
    fields.push(
      formatField(field, refObj.properties[field], jsonData)
    );
  });
  return fields;
}

/**
 * 从 swagger 的 definitions properties 里面返回标准的 field 配置项
 *
 * @param {*} field 当前字段
 * @param {*} options 当前字段的其它属性
 * @param {*} jsonData 原始 swagger JSON 对象
 * @returns
 */
function formatField(field, options, jsonData) {
  if (options['$ref']) {
    return checkRef(options['$ref'], jsonData);
  }
  return {
    field,
    label: field,
    type: formatType(options),
  }
}

function formatType(options) {
  const typeMap = {
    'string': 'input',
    'number': 'number',
    'integer': 'number',
    'int32': 'number',
    'int64': 'number',
    'date-time': 'date',
  };
  const type = options.format || options.type;
  return typeMap[type] || `is_undefined_${type}`;
}