const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const auth = require('./routes/auth');

const tokenMiddle = auth.tokenMiddle;
const app = express();

//routers
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const saveRunRouter = require('./routes/saverun');
const getRunsRouter = require('./routes/getruns');

//middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/login', loginRouter);
app.use('/register', registerRouter)
app.use('/saverun', tokenMiddle, saveRunRouter);
app.use('/getruns', tokenMiddle, getRunsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
