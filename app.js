//Bringing all our dependencies modules
const express=require('express');
const ejs=require('ejs');
const paypal=require('paypal-rest-sdk');

//setting the app to express

const app=express();

//setting the view engine to ejs

app.set('view engine','ejs');

//created a index route thats gonna route index template

app.get('/',(req,res)=>{
    res.render('index');
});

//starting our server on port 3000...

app.listen(3000,()=>console.log('Server Started'));
