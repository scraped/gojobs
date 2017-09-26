const config = require('./config');
const express = require('express');
const hbars = require('express-handlebars').create(config.handlebars);
const logger = require('morgan');

const mainRouter = require('./routers/main');
const jobRouter = require('./routers/job');
const adminRouter = require('./routers/admin');

const app = express();

app.engine('.hbs', hbars.engine);
app.disable('x-powered-by');
app.set('view engine', '.hbs');
app.set('port', process.env.PORT || config.port);

//
// Middleware
//
app.use(logger('combined'));
app.use(express.static('public'));

//
// Routing
//
app.use('/', mainRouter);
app.use('/job', jobRouter);
app.use('/admin', adminRouter);

//
// 404
//
app.use((req, res) => {
  console.log(`Error 404 occured at ${req.path}`);
  res.status(404).render('error', config.httpErrors.e404);
});

//
// Errors
//
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);

  if (req.xhr) {
    res.json({ error: err });
  } else {
    res.render('error', config.httpErrors.e500);
  }
});

//
// Run server
//
app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});
