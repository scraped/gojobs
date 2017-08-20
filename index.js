const config = require('./config');
const express = require('express');
const hbars = require('express-handlebars').create(config.handlebars);

const mainRouter = require('./routers/main/main');
const jobRouter = require('./routers/main/job');
const adminRouter = require('./routers/admin');

const app = express();

app.engine('.hbs', hbars.engine);
app.disable('x-powered-by');
app.set('view engine', '.hbs');
app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.use('/', mainRouter);
app.use('/job', jobRouter);
app.use('/admin', adminRouter);

// 404
app.use((req, res) => {
  res.status(404);
  res.render('error', {
    code: 404,
    name: 'Not Found',
    cssClass: 'info',
    image: true,
  });
});

// 500
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500);
  res.render('error', {
    code: 500,
    name: 'Internal Server Error',
    cssClass: 'warning',
    image: true,
  });
});

app.listen(app.get('port'), () => {
  console.log('Server is running at http://localhost:' + app.get('port'));
});
