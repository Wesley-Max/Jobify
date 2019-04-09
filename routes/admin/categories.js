module.exports = (dbConnection) => {
    const Router = require('koa-router');

    const router = new Router();

    router.get('/', async (ctx) => {
        const db = await dbConnection;
        const categories = await db.all('SELECT * FROM categories;')
        await ctx.render('admin/categories', {categories})
    });

    router.get('/excluir/:id', async (ctx) => {
        const db = await dbConnection;
        const {id} = ctx.params;

        await db.run(`DELETE FROM categories WHERE id=${id}`);
        ctx.redirect('/admin/categorias')
    });

    router.get('/nova', async (ctx) => {
        const db = await dbConnection;
        await ctx.render('admin/new-category');
    });

    router.post('/nova', async (ctx) => {
        const db = await dbConnection;

        const {name} = ctx.request.body;
        await db.run(`INSERT INTO categories(name) VALUES('${name}');`);
        ctx.redirect('/admin/categorias');
    })

    router.get('/editar/:id', async (ctx) => {
        const db = await dbConnection;

        const {id} = ctx.params;

        const category = await db.get(`SELECT name FROM categories WHERE id=${id}`)
        await ctx.render('admin/edit-category', category);
    });

    router.post('/editar/:id', async (ctx) => {
        const db = await dbConnection;

        const {name} = ctx.request.body;
        const {id} = ctx.params;

        await db.run(`UPDATE categories SET name='${name}' WHERE id=${id}`);
        ctx.redirect('/admin/categorias');
    })

    return router;
}