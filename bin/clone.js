const ora = require('ora');
const download = require('download-git-repo');

module.exports = function (name, path) {
  const spinner = ora('正在 clone 项目 kequandian/zero-layout').start();

  return cloneGit('kequandian/zero-layout', 'layout').then((msg) => {
    spinner.succeed(msg);
  }).catch((err) => {
    spinner.fail(err);
  });
}
function cloneGit(name, path) {
  return new Promise((res, rej) => {
    download(
      name,
      `${__dirname}/../template/${path}`,
      function (err) {
        if (err) {
          rej(err);
        } else {
          res(`模板 ${name} 更新完成`);
        }
      }
    );
  })
}