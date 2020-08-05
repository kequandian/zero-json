const Router = require('koa-router');
const fs = require('fs-extra');
const shortid = require('shortid');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

const apiRouter = new Router();

function genAPIPath(API, dbFilePath) {
  apiRouter.get(`${API}`, async (ctx) => {
    return fs.readJson(dbFilePath)
      .then(data => {
        ctx.body = {
          code: 200,
          message: 'success',
          data: data
        };
      })
  });
  apiRouter.get(`${API}/:id`, async (ctx) => {
    const { id } = ctx.params;

    return fs.readJson(dbFilePath)
      .then(data => {
        const find = data.find(i => i.id === id);
        if (find) {
          ctx.body = {
            code: 200,
            message: 'success',
            data: find,
          };
        } else {
          throw Error('未找到数据');
        }
      })
  });
  apiRouter.post(`${API}`, async (ctx) => {
    return fs.readJson(dbFilePath)
      .then(data => {
        return fs.writeJson(dbFilePath, [
          ...data,
          {
            ...ctx.request.body,
            id: shortid.generate(),
          }
        ])
          .then(_ => {
            ctx.body = {
              code: 200,
              message: 'success',
            };
          })
      })
  });
  apiRouter.put(`${API}/:id`, async (ctx) => {
    const { id } = ctx.params;

    return fs.readJson(dbFilePath)
      .then(data => {
        const index = data.findIndex(i => i.id === id);
        if (index > -1) {
          data.splice(index, 1, {
            ...ctx.request.body,
            id,
          });
          return fs.writeJson(dbFilePath, data)
            .then(_ => {
              ctx.body = {
                code: 200,
                message: 'success',
              };
            })
        } else {
          throw Error('未找到数据, 无法更新');
        }
      })
  });
  apiRouter.delete(`${API}/:id`, async (ctx) => {
    const { id } = ctx.params;

    return fs.readJson(dbFilePath)
      .then(data => {
        const index = data.findIndex(i => i.id === id);
        if (index > -1) {
          data.splice(index, 1);
          return fs.writeJson(dbFilePath, data)
            .then(_ => {
              ctx.body = {
                code: 200,
                message: 'success',
              };
            })
        } else {
          throw Error('未找到数据, 无法删除');
        }
      })
  });

  return apiRouter.routes();
}

module.exports = {
  apiRouter,
  genAPIPath,
};