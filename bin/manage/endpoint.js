
const os = require('os');
const cwd = process.cwd();
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

module.exports = function (endpoint) {
  return new Promise(function (res, rej) {
    const filePath = path.join(cwd, 'src', 'global.js');
    const fileContent = [];
    let lineCount = 0;
    const target = [];
    const setEndponitString = `setEndpoint('${endpoint}');`;

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    rl.on('line', function (data) {
      if (/setEndpoint/.test(data)) {
        target.push({
          line: lineCount,
          commented: /^\/\//.test(data),
        });
      }
      fileContent.push(data);
      lineCount++;
    });

    rl.on('close', function () {
      if (target.length) {
        const unCommented = target.findIndex(t => t.commented === false);
        if (unCommented === -1) {
          const line = target[target.length - 1].line;
          fileContent[line] = setEndponitString;
        } else {
          const line = target[unCommented].line;
          fileContent[line] = setEndponitString;
        }
      } else {
        fileContent.push(setEndponitString);
      }
      fs.writeFileSync(filePath, fileContent.join(os.EOL));
      res();
    });
  })
}
