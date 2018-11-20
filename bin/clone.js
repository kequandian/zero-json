const download = require('download-git-repo');

module.exports = function (name,path) {
  return new Promise( (res,rej) => {
    download(
      name,
      `${__dirname}/../template/${path}`,
      function (err) {
        if(err){
          rej(err);
        }else{
          res(`模板 ${name} 更新完成`);
        }
      }
    );
  } )
}