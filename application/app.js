/* eslint-disable no-console */
require('dotenv').config();

// Import dependencies
const Express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const passport = require('./backend/config/passport');
const db = require('./backend/config/database').pool;

// Import routers
const indexRouter = require('./frontend/routes/index');
const authRouter = require('./backend/routes/auth');
const searchRouter = require('./backend/routes/search');
const listingRouter = require('./backend/routes/listing');
const favoriteRouter = require('./backend/routes/favorite');
const userRouter = require('./backend/routes/user');
const photoRouter = require('./backend/routes/photo');

// Create express app
const app = new Express();
app.options('*', cors());
app.use(cors());
app.set('views', [
  path.join(__dirname, 'frontend/views'),
  path.join(__dirname, 'frontend/views/pages'),
]);
app.set('view engine', 'pug');
app.use(Express.static(path.join(__dirname, 'frontend/public')));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(morgan(process.env.LOGS_TYPE));


// Configuring sessions
app.use(session({
  key: 'did',
  secret: process.env.SESSION_SECRET,
  store: new MySQLStore({}, db),
  resave: false,
  saveUninitialized: false,
}));

// Connecting passport
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/search', searchRouter);
app.use('/listings', listingRouter);
app.use('/favorite', favoriteRouter);
app.use('/user', userRouter);
app.use('/photo', photoRouter);

// Global error handler
app.use('/', (req, res, next) => {
  //console.error(err.stack);
  res.render('error', { title: "DormMates | 404 " });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`DormMates application now running on port ${process.env.PORT}.`);
});

module.exports = app;
