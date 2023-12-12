const express = require("express");
const { homePage, loginPage, regisPage, dashPage } = require("./handler");
const route = express.Router();

route.get("/", homePage);

route.get("/login", loginPage);

route.get("/register", regisPage);

route.get("/users", dashPage);

module.exports = route;