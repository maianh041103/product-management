const express = require('express');
require("dotenv").config();

//Connect database
const database = require('./config/database.js'); //Nhúng hàm connect trong file database.js
database.connect();

//Nhúng các router vào
const routeAdmin = require('./routes/admin/index.route.js');
const route = require('./routes/client/index.route'); // giữ phím ctrl + click

const app = express();
const port = parseInt(process.env.PORT) || 3000

//Dùng pug
app.set('views', './views');
app.set('view engine', 'pug');

//Nhúng file tĩnh
app.use(express.static('public'));

//Route
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log("App listening on port : " + port);
})


