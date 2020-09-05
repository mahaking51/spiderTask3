//jshint esversion:6
require('dotenv').config();
var express=require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser =require('body-parser');
const ejs=require('ejs');
const mongoose= require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
app.set('view engine','ejs');
const https = require('https');

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
})
const productSchema=new mongoose.Schema({
    name:String,
    seller:String,
    quantity:Number,
    sold:Number,
    price:Number,
    desc:String,
    img:String
})
const cartSchema=new mongoose.Schema({
    username:String,
    pid:String,
    name:String,
    quantity:Number,
    price:Number,
})
const purchaseSchema=new mongoose.Schema({
    username:String,
    pid:String,
    quantity:Number,
})
userSchema.plugin(passportLocalMongoose);

const User =new mongoose.model('user',userSchema);
const Product =new mongoose.model('product',productSchema);
const Cart =new mongoose.model('cart',cartSchema);
const Purchase =new mongoose.model('purchase',purchaseSchema);

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',function(req,res){
        res.render('login');
        const url='https://pixabay.com/api/?key=18163249-030c794f94b190a9cfe26d956&q=yellow+flowers&image_type=photo&per_page=3&pretty=false';
})
app.get('/users/:name',function(req,res){
User.findOne({username:req.params.name},function(err,obj){
    res.send(obj)
})
})
app.get('/products/:seller',function(req,res){
    Product.find({seller:req.params.seller},function(err,arr){
        res.send(arr)
    })
})
app.get('/available',function(req,res){
    Product.find({},function(err,arr){
        res.send(arr);
    })
})
app.get('/cart/:name',function(req,res){
    Cart.find({username:req.params.name},function(err,arr){
        res.send(arr);
    })
})
app.get('/register',function(req,res){
    res.render('register');
})
app.get('/dashboard/:name',async function(req,res){
    src="https://ui-avatars.com/api/?name="+req.params.name+"&rounded=true&bold=true&size=128&background=f6f5f5&color=393b44"
    if(req.isAuthenticated()){
        res.render('dashboard',{name:req.params.name,link:src});
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
io.on('connection', function(socket) {
    socket.on('addProduct',function(data){
        console.log(data);
        product= new Product({
            name:data.name,
            seller:data.seller,
            quantity:data.quantity,
            sold:0,
            price:data.price,
            desc:data.desc,
            img:data.img
        })
        product.save();
        
    })
    socket.on('addCart',function(data){
        console.log(data);
        Cart.find({pid:data.id,username:data.user},function(err,arr){
            if(arr.length==0){
                cart = new Cart({
                    username:data.user,
                    pid:data.id,
                    name:data.name,
                    quantity:data.quantity,
                    price:data.price,
                    purchased:false
                })
                cart.save();
            }
            else{
                Cart.updateOne({pid:data.id},{$inc:{quantity:data.quantity}},function(err,succ){

                })
            }
        })
        
        Product.updateOne({_id:data.id},{$inc:{quantity:-1*(data.quantity)}},function(err,succ){

        })
    })
    socket.on('cartUpdate',function(data){
        Cart.find({username:data},function(err,arr){
            socket.emit('itemUpdate',arr.length)
        })
    })
    socket.on('productName',function(data){
        Cart.findOne({_id:data},function(err,obj){
            socket.emit('returnName',obj);
        })
    })
    socket.on('removeItem',function(data){
        Cart.findOne({pid:data.pid,username:data.user},function(err,obj){
            Product.updateOne({_id:data.pid},{$inc:{quantity:obj.quantity}},function(err,succ){

            })
        })

        Cart.remove({pid:data.pid,username:data.user},function(err,succ){

        })
       
    })
    socket.on('cartNumber',function(data){
        Cart.find({username:data},function(err,arr){
            socket.emit('cartLength',arr.length);
        })
    })
    socket.on('purchase',function(data){
        console.log(data);
        Cart.find({username:data},function(err,arr){
            for(var i=0;i<arr.length;i++){
                purchase =new Purchase({
                    username:arr[i].username,
                    pid:arr[i].pid,
                    quantity:arr[i].quantity
                })
                purchase.save();
                Product.updateOne({_id:arr[i].pid},{$inc:{sold:arr[i].quantity}},function(err,succ){

                })
            }

        })
        Cart.deleteMany({username:data},function(err,succ){

        })
    })

})
http.listen(3000, function() {
    console.log('listening on *:3000');
 });