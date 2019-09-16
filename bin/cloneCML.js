const shell = require('shelljs');
const ora = require('ora');

module.exports = function (name, path) {
  const spinner = ora(`正在 clone 项目 ${name}`).start();

  return cloneGit(name, path).then((msg) => {
    spinner.succeed(msg);
    return path;
  }).catch((err) => {
    spinner.fail(err);
    return err;
  });
}
function cloneGit(name, path) {
  return new Promise((res, rej) => {
    shell.exec(`git clone ${path} ${name}`, function (code) {
      if (code === 0) {
        res(`模板 ${name} clone 完成`);
      } else {
        rej(`初始化失败，退出码: ${code}`);
      }
    });
  })
}