const path = require('path');

// Middleware
const Koa = require('koa');

// Database
const sqlite = require('sqlite');
const dbConnection = sqlite.open('storage.sqlite', {Promise});

// Asset folder and template rendering
const bodyParser = require('koa-bodyparser');
const statics = require('koa-static');
const views = require('koa-views');

const app = new Koa();

app.use(views(path.resolve(__dirname, 'views'), { extension: 'ejs' }));
app.use(statics(path.resolve(__dirname, 'public')));
app.use(bodyParser());

const router = require('./routes/')(dbConnection);

app.use(router.routes(), router.allowedMethods());

app.listen(process.env.PORT||3000);