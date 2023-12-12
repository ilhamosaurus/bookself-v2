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

module.exports = { homePage, loginPage, regisPage, dashPage };
