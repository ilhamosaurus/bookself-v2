const express = require('express');
const app = express();
const cors = require('cors');
const route = require('./src/route');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");

app.use(route);

const listener = app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is running on port ${listener.address().port}`);
})