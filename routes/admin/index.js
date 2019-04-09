module.exports = (dbConnection) => {
    const Router = require('koa-router');

    const categories = require('./categories')(dbConnection);
    const roles = require('./roles')(dbConnection);

    const router = new Router();

    router.use('/categorias', categories.routes(), categories.allowedMethods());
    router.use('/vagas', roles.routes(), roles.allowedMethods());
    
    // security
    router.use(async (ctx, next) => {
        console.log(ctx.hostname)
        if (ctx.hostname === '127.0.0.1' || ctx.hostname === 'localhost'){
            await next();
        }
        ctx.status = 403;
    });

    router.get('/', async (ctx, next) => {
        await ctx.render('admin/index');
        await next();
    });

    return router;
}