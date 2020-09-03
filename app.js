//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser =require('body-parser');
const ejs=require('ejs');
const app=express();
const mongoose= require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static(__dirname +'/public'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/buydb',{useNewUrlParser:true });
mongoose.set('useCreateIndex',true)
const userSchema=new mongoose.Schema({
    username:String,
    pwd:String,
    address:String,
    type:String,
    email:String,
    purchased:Array,
    cart:Array
})
const productSchema=new mongoose.Schema({
    name:String,
    seller:String,
    quantity:Number,
    price:Number,
    desc:String
})
userSchema.plugin(passportLocalMongoose);

const User =new mongoose.model('user',userSchema);
const Product =new mongoose.model('product',productSchema);

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',function(req,res){
        res.render('login',);
})
app.get('/users/:name',function(req,res){
User.findOne({username:req.params.name},function(err,obj){
    res.send(obj)
})
})
app.get('/register',function(req,res){
    res.render('register');
})
app.get('/dashboard/:name',async function(req,res){
    if(req.isAuthenticated()){
        res.render('dashboard',{name:req.params.name})
    }
    else{
        res.redirect('/');
    }
    
})
app.get('/logout',function(req,res){
    req.logOut();
    res.redirect('/');
})
app.post('/register',function(req,res){
    
    User.register({username:req.body.username,type:req.body.type,email:req.body.email, active: false}, req.body.password, function(err, user) {
        if (err) { 
            console.log(err);
            res.redirect('/')
         }
         else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/');
            })
         }
      });

})
app.post('/login',function(req,res){
    user =new User({
        username:req.body.username,
        pwd:req.body.password
    })
    req.login(user,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/dashboard/'+req.body.username);
            })
        }
    })
})
app.listen(3000,function(){
    console.log('Server started on port 3000');
})
