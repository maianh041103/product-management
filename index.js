const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require('moment');

require("dotenv").config();

//Connect database
const database = require('./config/database.js'); //Nhúng hàm connect trong file database.js
database.connect();

//Nhúng các router vào
const routeAdmin = require('./routes/admin/index.route.js');
const route = require('./routes/client/index.route'); // giữ phím ctrl + click

const app = express();
const port = parseInt(process.env.PORT) || 3000

//Nhúng flash : Dùng để hiện thị thông báo
app.use(cookieParser('maianh20'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

//Nhúng methodOverride
app.use(methodOverride('_method'))

//Nhúng body-parser : Nhung truoc route
app.use(bodyParser.urlencoded({ extended: false }));

//Nhúng systemConfig 
const systemConfig = require('./config/system.js');

//App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

//Nhúng tinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//Dùng pug
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//Nhúng file tĩnh
app.use(express.static(`${__dirname}/public`));

//Route
route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log("App listening on port : " + port);
})


