const { mergeObject } = require('./index');


/**
 * 过滤 id, xxxxId 字段
 * @param {array} list 
 */
function filterFields(list) {
  return list.filter(
    i => (!/(id|Id)$/.test(i.field))
  )
}

function genCRUDAPI(api) {
  if (api) {
    return {
      listAPI: `${api}`,
      createAPI: `${api}`,
      getAPI: `${api}/[id]`,
      updateAPI: `${api}/[id]`,
      deleteAPI: `${api}/(id)`,
    }
  }
  return {};
}

/**
 * 生成映射关系
 * @param {object} map 
 */
function createMapObj(map) {
  const rst = {};
  Object.keys(map).forEach(key => {
    return rst[key] = {
      map: map[key],
      options: Object.keys(map[key]).map(
        k => ({ label: map[key][k], value: k })
      )
    };
  })
  return rst;
}

/**
 * 暂时只用来处理 map
 * @param {array} fields 
 */
function formatFields(fields, mapObj) {
  return fields.map(field => {
    const { type, ...rest } = field;

    if (type) {
      // 表单字段
      if (mapObj[field.field] && /^(radio|select)$/.test(type)) {
        return mergeObject(
          {
            options: mapObj[field.field].options
          },
          field
        );
      }
    } else {
      // 表格字段
      if (mapObj[field.field]) {
        return mergeObject(
          {
            valueType: 'tag',
            options: {
              map: mapObj[field.field].map
            }
          },
          field
        );
      }

    }
    return field;
  })
}

module.exports = {
  filterFields,
  genCRUDAPI,
  createMapObj,
  formatFields,
}