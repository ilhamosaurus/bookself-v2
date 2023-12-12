const bcrypt = require('bcrypt');
const { pool } = require('./db-config');

const homePage = (req, res) => {
  res.render("index");
};

const loginPage = (req, res) => {
  res.render("login");
};

const regisPage = (req, res) => {
  res.render("register");
};

const dashPage = (req, res) => {
  res.render("dashboard");
};

const postReg = async (req, res) => {
  const { name, email, password, password2 } = req.body;

  console.log(name, email, password, password2);

  let errors = [];

  if (!name || !password || !email || !password2) {
    errors.push({ message: 'Please enter all fields.' });
  }

  if (password.length < 8) {
    errors.push({ message: 'Password must be at least 8 character.' });
  }

  if (password != password2) {
    errors.push({ message: 'Password did not match' });
  }

  if (errors.length > 0) {
    res.render('register', { errors });
  }

  else {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM users
      WHERE email = $1`, [email], (err, result) =>{
        if (err) {
          throw err
        }
        console.log(result.rows);

        if (result.rows.length > 0) {
          errors.push({ message: "Email already registered "});
          res.render('register', {errors});
        }
      }
    )
  }
}

module.exports = { homePage, loginPage, regisPage, dashPage, postReg };
