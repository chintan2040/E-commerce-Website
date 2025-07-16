const express = require('express');
const router = express.Router();
require('dotenv').config();
const {RegisterUser,LoginUser,logout} = require('../controllers/authController');


router.get('/',(req,res)=>{
    res.send('its working');
})

router.post('/register',RegisterUser);

router.post('/login',LoginUser);

router.get('/logout',logout);

module.exports = router;