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
app.set('port', process.env.PORT || config.port);

// Middleware
app.use(express.static('public'));

// Routing
app.use('/', mainRouter);
app.use('/job', jobRouter);
app.use('/admin', adminRouter);

// 404
app.use((req, res) => {
  console.log(`Error 404 occured at ${req.path}`);
  res.status(404);
  res.render('error', config.httpErrors.e404);
});

// Errors
app.use((err, req, res, next) => {
  if (typeof err === 'string') {
    res.send(err);
  } else {
    console.error(`Error 500 occured. Stack: ${err.stack}`);
    res.status(500);
    res.render('error', config.httpErrors.e500);
  }
});

app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});
