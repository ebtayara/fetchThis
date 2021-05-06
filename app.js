const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const { sessionSecret } = require('./config');
console.log(sessionSecret)
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const listRouter = require('./routes/lists');
// const searchRouter = require('./routes/search');
const taskRouter = require('./routes/tasks');
const { restoreUser } = require('./auth.js');
const summaryRouter  = require('./routes/summary');
const app = express();

// view engine setup
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessionSecret));
app.use(express.static(path.join(__dirname, 'public')));
// set up session middleware
const store = new SequelizeStore({ db: sequelize });
app.use(
  session({
    secret: 'fetchThisSecret',
    store,
    saveUninitialized: false,
    resave: false,
  })
);
// create Session table if it doesn't already exist
store.sync();
app.use(restoreUser);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/summary', summaryRouter);
app.use('/lists', listRouter);
app.use('/tasks', taskRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
