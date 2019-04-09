module.exports = (dbConnection) => {
    const Router = require('koa-router') 

    const router = new Router();

    router.get('/', async (ctx) => {
        const db = await dbConnection;
        const roles = await db.all('SELECT * FROM roles;');
        await ctx.render('admin/roles', {roles});
    });

    router.get('/excluir/:id', async (ctx) => {
        const db = await dbConnection;
        const {id} = ctx.params;

        await db.run(`DELETE FROM roles WHERE id=${id}`);
        ctx.redirect('/admin/vagas');
    });

    router.get('/nova', async (ctx) => {
        const db = await dbConnection;
        const categories = await db.all('SELECT * FROM categories;')
        await ctx.render('admin/new-role', {categories});
    });

    router.post('/nova', async (ctx) => {
        const db = await dbConnection;

        const {title, description, category} = ctx.request.body;

        await db.run(`INSERT INTO roles(name, description, category_id) VALUES('${title}','${description}', ${category});`);
        ctx.redirect('/admin/vagas');
    })

    router.get('/editar/:id', async (ctx) => {
        const db = await dbConnection;
        const {id} = ctx.params;

        const role = await db.get(`SELECT * FROM roles WHERE id=${id}`)
        const categories = await db.all('SELECT * FROM categories;')
        await ctx.render('admin/edit-role', {
            categories,
            role
        });
    });

    router.post('/editar/:id', async (ctx) => {
        const db = await dbConnection;
        
        const {id} = ctx.params;
        const {title, description, category} = ctx.request.body;

        await db.run(`UPDATE roles SET name='${title}', description='${description}', category_id=${category} WHERE id=${id};`);
        ctx.redirect('/admin/vagas');
    })

    return router;
}