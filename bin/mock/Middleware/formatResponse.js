const messageMap = {
  '404': 'Not Found',
  '405': 'Method Not Allowed',
};

async function formatResponse(ctx, next) {
  const { response } = ctx;

  try {
    await next();
  } catch (e) {
    const { code, message } = e || {};
    if (typeof code === 'number') {
      ctx.status = code;
    } else {
      ctx.status = 500;
    }
    ctx.body = {
      code: code || ctx.body && ctx.body.code || 500,
      message: message || ctx.body && ctx.body.message || 'Internal Server Error',
    };

    return false;
  }

  if (response.header['content-type'] === undefined ||
    response.header['content-type'] === 'application/json') {
    if (response.status >= 400) {
      ctx.status = response.status;
    }
    if (messageMap[response.status]) {
      ctx.body = {
        code: response.status,
        message: messageMap[response.status] || response.message,
      };
    }

  }
}

module.exports = formatResponse;