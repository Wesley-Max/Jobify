module.exports = (dbConnection) => {
    const Router = require('koa-router');

    const router = new Router();
    
    // Routing imports
    const admin = require('./admin')(dbConnection);

    router.use('/admin', admin.routes(), admin.allowedMethods());
    
    router.get('/', async (ctx) => {
        const db = await dbConnection;

        const categories = await db.all('SELECT * FROM categories;');
        const roles = await db.all('SELECT * FROM roles;');

        const data = categories.map(category => ({
            ...category,
            roles: roles.filter(role => role.category_id === category.id)
        }));

        await ctx.render('index', {categories: data});
    });

    router.get('/vaga/:id', async (ctx) => {
        const db = await dbConnection;

        const id = parseInt(ctx.params.id);

        // security
        if (id.toString() === 'NaN'){
            ctx.status = 404;
            return;
        }

        const role = await db.get(`SELECT * FROM roles WHERE id=${id};`);

        if (!role){
            ctx.status = 404;
            return;
        }
        
        await ctx.render('role', {role});
    });

    return router;
}