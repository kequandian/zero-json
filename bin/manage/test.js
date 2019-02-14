const init = require('./init');
const add = require('./add');

module.exports = function (API) {
  return init('web', './').then(() => {
    return add('test/page', './web', API);
  })
}