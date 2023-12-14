/* eslint-disable require-jsdoc */
const LocalStrategy = require('passport-local').Strategy;
const {pool} = require('./db-config');
const bcrypt = require('bcrypt');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const results = await pool.query(
          'SELECT * FROM users WHERE email = $1', [email]);
      console.log(results.rows);

      if (results.rows.length > 0) {
        const user = results.rows[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err);
          }

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {message: 'Password is not correct'});
          }
        });
      } else {
        return done(null, false, {message: 'Email is not registered'});
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(
      new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
      },
      authenticateUser,
      ),
  );

  passport.serializeUser((user, done) => done(null, user.email));

  passport.deserializeUser((email, done) => {
    pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, result) => {
          if (err) {
            throw err;
          }
          return done(null, result.rows[0]);
        });
  });
}

module.exports = initialize;
