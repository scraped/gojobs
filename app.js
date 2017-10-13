const config = require('./config');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const session = require('express-session');
const logger = require('morgan');

// const mainRouter = require('./routers/main');
// const jobRouter = require('./routers/job');
// const adminRouter = require('./routers/admin');

const app = express();

app.disable('x-powered-by');
app.set('port', config.port);

//
// Middleware
//
app.use(logger('dev'));
app.use(bodyParser());
app.use(cookieParser());
// app.use(session());
app.use(express.static(path.resolve(__dirname, config.distDir)));

//
// Routing
//
// app.all('*', (err, req, res, next) => {
//   res.sendFile(config.distDir + 'index.html');
// });
// app.use('/', mainRouter);
// app.use('/job', jobRouter);
// app.use('/admin', adminRouter);

//
// 404
//
// app.use((req, res) => {
//   console.log(`Error 404 occured at ${req.path}`);
//   res.status(404).render('error', config.httpErrors.e404);
// });

//
// Errors
//
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500);

//   if (req.xhr) {
//     res.json({ error: err });
//   } else {
//     res.render('error', config.httpErrors.e500);
//   }
// });

//
// Run server
//
app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});
