const express = require('express');
const router = express.Router();
const ownermodel = require('../models/ownerModel');

if(process.env.NODE_ENV === "development"){
    router.post('/create',async(req,res)=>{
       let owner = await ownermodel.find();
       if(owner.length > 0){
        return res.status(501).send('no more owners can be created');
       }
       let {fullname,email,password}= req.body;
       let createdOwner = await ownermodel.create({
        fullname,
        email,
        password
       })
       res.status(201).send(createdOwner);
    })
}



router.get('/admin',(req,res)=>{
    let success = req.flash('success');
    res.render('createproducts',{success});
})

module.exports = router;