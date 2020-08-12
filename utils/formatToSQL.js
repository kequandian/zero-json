
function genSQl(tableName, fields) {
  const unique = [];
  const sqlContent = [
    "`id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键id'",
    ...genSQLFields(fields, unique),
    "PRIMARY KEY (`id`)",
    unique.length ?
      `UNIQUE (${unique.map(f => "`" + f + "`").join(',')})`
      : '',
  ].join(', \n  ');

  return "DROP TABLE IF EXISTS `" + tableName + "`;\n" +
    "CREATE TABLE `" + tableName + "` (\n  "
    + sqlContent +
    "\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
}

function genSQLFields(fields, unique) {
  return fields.map(field => {
    const orderList = ['field', 'type', 'notnull', 'default', 'unique', 'comment'];
    const typeMap = {
      field: v => "`" + v + "`",
      type: v => v,
      default: v => `DEFAULT '${v}'`,
      unique: v => void unique.push(field.field),
      notnull: v => v ? 'NOT NULL' : '',
      comment: v => `COMMENT '${v}'`,
    };

    return orderList.map(key => {
      return field[key] ? typeMap[key](field[key]) : '';
    }).join(' ');
  })
}

function yamlToSQL(data) {
  const { cg, fields } = data;
  const { master } = cg;
  const fieldsFormat = [];

  Object.keys(fields).forEach(field => {
    const { sql } = fields[field];

    if (sql) {
      fieldsFormat.push({
        field,
        ...sql,
      });
    }
  })

  return genSQl(master, fieldsFormat);
}

module.exports = {
  yamlToSQL,
}