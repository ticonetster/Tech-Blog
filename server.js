
const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./controllers');

const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');

//Set up handlebars.js engine with custom helpers
const hbs = exphbs.create({ 
  helpers:  helpers ,
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
});

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));



const sess = {
  secret: 'supersecret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Custom title
app.use(function (req, res, next) {
  var area;
  if(req.path.includes("/dashboard")){
    area = "dashboard";
  }
  switch (area) {
      case 'dashboard':
          res.locals.title = 'Your Dashboard';
          break;
      default:
          res.locals.title = 'The Tech Blog';
  }
  next();
});

app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(process.env.PORT || 3000, () => console.log('Now listening'));
});