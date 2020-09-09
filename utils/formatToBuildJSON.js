
/**
 * 过滤 id, xxxxId 字段
 * @param {array} list 
 */
function filterFields(list) {
  return list.filter(
    i => (!/(id|Id)$/.test(i.field))
  )
}

function genCRUDAPI(api, queryString = '') {
  if (api) {
    return {
      listAPI: `${api}${queryString}`,
      createAPI: `${api}`,
      getAPI: `${api}/[id]`,
      updateAPI: `${api}/[id]`,
      deleteAPI: `${api}/(id)`,
    }
  }
  return {};
}

module.exports = {
  filterFields,
  genCRUDAPI,
}