const bcrypt = require('bcrypt');
const {pool} = require('./db-config');
const passport = require('passport');

const homePage = (req, res) => {
  res.render('index');
};

const loginPage = (req, res) => {
  res.render('login');
};

const regisPage = (req, res) => {
  res.render('register');
};

const dashPage = (req, res) => {
  if (req.user && req.user.name) {
    const email = req.user.email;

    pool.query(
        `SELECT * FROM books WHERE email = $1`, [email],
        (err, result) => {
          if (err) {
            throw err;
          }

          const books = result.rows;

          res.render('dashboard', {user: req.user.name, books: books});
        },
    );
  } else {
    res.status(500).send('User data is missing or incomplete');
  }
};


const logOutPage = (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err); // Handle error if it occurs during logout
    }
    req.flash('success_msg', 'You have logged out');
    res.redirect('/login');
  });
};

const postReg = async (req, res) => {
  const {name, email, password, password2} = req.body;

  console.log(name, email, password, password2);

  const errors = [];

  if (!name || !password || !email || !password2) {
    errors.push({message: 'Please enter all fields.'});
  }

  if (password.length < 8) {
    errors.push({message: 'Password must be at least 8 character.'});
  }

  if (password !== password2) {
    errors.push({message: 'Password did not match'});
  }

  if (errors.length > 0) {
    res.render('register', {errors});
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
        `SELECT * FROM users
      WHERE email = $1`, [email], (err, result) => {
          if (err) {
            throw err;
          }
          console.log(result.rows);

          if (result.rows.length > 0) {
            errors.push({message: 'Email already registered'});
            res.render('register', {errors});
          } else {
            pool.query(
                `INSERT INTO users(name, email, password)
              VALUES($1, $2, $3)
              RETURNING user_id, password`, [name, email, hashedPassword],
                (err, result) => {
                  if (err) {
                    throw err;
                  }
                  console.log(result.rows);
                  // eslint-disable-next-line max-len
                  req.flash('success_msg', 'Your are now registered. Please login!');
                  res.redirect('/login');
                },
            );
          }
        },
    );
  }
};

const postBook = (req, res) => {
  const {title, year, summary, publisher, pageCount, pageRead} = req.body;
  const email = req.user.email;
  const user = req.user.name;
  const insertedAt = new Date().toISOString();
  const reading = false;
  const finished = false;
  const errors = [];
  const pageReadValue = pageRead ? parseInt(pageRead, 10): 0;
  // let bookExists = false;

  pool.query(
      `SELECT * FROM books
    WHERE email = $1`,
      [email], (err, result) => {
        if (err) {
          console.log('Error selecting books: ', err);
          return res.status(500).send('Internal Server error');
        }

        const books = result.rows;

        books.forEach((book) => {
          if (title === book.title) {
            errors.push({message: 'You already have that book!'});
          }
        });

        if (pageCount < pageReadValue) {
          errors.push({message: 'Page Read cannot be greater than Page!'});
        }

        if (year < 1900) {
          errors.push({message: 'Your book is too old'});
        }

        if (errors.length > 0) {
          res.render('dashboard', {errors, user: user, books: books});
        } else {
          if (pageReadValue > 0) {
            reading = true;
          }

          if (pageCount === pageReadValue) {
            finished = true;
          }
          pool.query(
              `INSERT INTO books(title, year, summary, publisher, page_count,
    page_read, reading, finished, inserted_at, email)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
              [title, year, summary, publisher, pageCount,
                pageReadValue, reading, finished, insertedAt, email],
              (err, result) => {
                if (err) {
                  throw err;
                }
                console.log(result.rows);
                req.flash('success_msg', 'Your new book is now on the list');
                res.redirect('/users');
              },
          );
        }
      },

  );
};

const postLogin = passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login',
  failureFlash: true,
});

module.exports = {
  homePage,
  loginPage,
  regisPage,
  dashPage,
  postReg,
  postLogin,
  logOutPage,
  postBook,
};
