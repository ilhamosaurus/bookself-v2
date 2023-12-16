const express = require('express');
const {
  homePage,
  loginPage,
  regisPage,
  dashPage,
  postReg,
  postLogin,
  logOutPage,
  postBook,
  getBookById,
  editBook,
  deleteBookById} =
  require('./handler');
// eslint-disable-next-line new-cap
const route = express.Router();
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/users');
  }
  next();
};
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

route.get('/', checkAuthenticated, homePage);

route.get('/login', checkAuthenticated, loginPage);

route.get('/register', checkAuthenticated, regisPage);

route.get('/users', checkNotAuthenticated, dashPage);

route.get('/logout', logOutPage);

route.post('/register', postReg);

route.post('/login', postLogin);

route.post('/add-book', checkNotAuthenticated, postBook);

route.get('/book/:id', checkNotAuthenticated, getBookById);

route.put('/book/:id/edit', checkNotAuthenticated, editBook);

route.post('/book/:id/delete', checkNotAuthenticated, deleteBookById);

module.exports = route;
