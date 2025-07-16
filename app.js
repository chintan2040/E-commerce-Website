const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const db= require('./config/mongoose_connect');
require('dotenv').config();
const flash = require('connect-flash');
const expressSession = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require('./routes/userRouter');
const ownerRouter = require('./routes/ownerRouter');
const productRouter = require('./routes/productRouter');
const indexRouter= require('./routes/index');

app.use(cookieParser());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
})
);
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/',indexRouter);
app.use('/users',userRouter);
app.use('/owners', ownerRouter);
app.use('/products', productRouter);

app.listen(3000);