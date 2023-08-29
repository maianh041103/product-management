const express = require('express');
require("dotenv").config();

//Nhung connect database
const database = require('./config/database.js');
database.connect();

//Nhung cac router vao
const route = require('./routes/client/index.route'); // giu phim ctrl + click

const app = express();
const port = parseInt(process.env.PORT) || 3000

app.set('views', './views');
app.set('view engine', 'pug');

//Nhung file tinh
app.use(express.static('public'));

//Route
route(app);

app.listen(port, () => {
    console.log("App listening on port : " + port);
})


