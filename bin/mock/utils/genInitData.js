import mockjs from "mockjs";

const typeMap = {
  'input': () => mockjs.Random.word(),
  'number': () => mockjs.Random.integer(),
  'date': () => mockjs.Random.now("yyyy-MM-dd"),
};
/**
 * 
 * @param {array} fields 
 */
export default function genInitData(fields) {
  const data = {
    id: 1,
  };

  fields.forEach(item => {
    const { field, type = 'input' } = item;
    if (typeMap[type]) {
      data[field] = typeMap[type]();
    }
  });
  return [data];
}