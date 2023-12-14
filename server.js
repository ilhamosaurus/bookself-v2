const express = require('express');
const app = express();
const cors = require('cors');
const route = require('./src/route');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./src/passportConfig');

initializePassport(passport);
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.session());
app.use(passport.initialize());

app.set('view engine', 'ejs');

app.use(route);

const listener = app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running on port ${listener.address().port}`);
});
