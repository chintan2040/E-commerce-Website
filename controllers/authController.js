const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../utils/generateToken');
module.exports.RegisterUser = async(req,res)=>{
        try {
            let {fullname, email,password}=req.body;
            let user = await userModel.findOne({email:email});
            if(user) {
                req.flash("error", "User already exists, please login.");
                return res.redirect('/');
            }
            bcrypt.genSalt(10,async(err,salt)=>{
                bcrypt.hash(password,salt,async(err,hash)=>{
                    if(err)return res.status(500).send(err.message);

                   else{
                    let user = await userModel.create({
                        fullname,
                        password: hash,
                        email,
                    });
                    let token = generateToken(user);
                    res.cookie('token',token);
                    req.flash("success", "Registration successful, please login.");
                    return res.redirect('/');

                }
                })
            })


        } catch (err) {
            req.flash("error", err.message);
        }
}

module.exports.LoginUser = async(req,res)=>{
    let {email,password}= req.body;
    let user = await userModel.findOne({email:email});
    if(!user){
        req.flash("error", "Email or password is incorrect.");
        return res.redirect('/');
    }
    bcrypt.compare(password,user.password,async(err,result)=>{
        if(result){
            let token = generateToken(user);
            res.cookie('token',token);
            res.redirect('/shop');
            
        }
        else{
            req.flash("error", "Email or password is incorrect.");
            return res.redirect('/');
        }
    })
}

module.exports.logout = async(req,res)=>{
    res.cookie('token',"");
    res.redirect('/');
};