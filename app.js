const express = require('express');
const  jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./modles/usermodel');
// const loginUser = require('./modles/loginmodel');
var secretKey = 'BenchWorkKey'

const mongoUrl = 'mongodb+srv://himanshu:test123@cluster0.uswik.mongodb.net/BenchWork?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
console.log('connected to the database')
});

app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
console.log(PORT)
app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV}`));

app.post('/',(req,res)=>{
    console.log(req.body);
    res.json({success:true});
})

app.post('/signup',async (req,res)=>{
    const {name ,phone, password}=req.body;
    console.log(req.body);
    const userExist = await User.exists({phone:req.body.phone});
    console.log(userExist);
    if (userExist) res.json({success:false, msg:'user already exist with this phone number', code: 'user exist'})
    else{
    user = await User.create({name,phone,password});
    userId = user._id
    var token = jwt.sign({userId},secretKey)
    res.json({success:true,token:token,name:req.body.name,phone:req.body.phone})
}})

app.post('/login', async (req,res)=>{
    const {phone,password}=req.body;
    console.log(req.body)
    User.findOne({
        phone:req.body.phone
    },(err,user)=>{
        if(!user){
            res.status(403).send({success:false, msg:'user not found'})
        }else{
            console.log(user.password)
            user.comparePassword(req.body.password,user.password,(err, isMatch)=>{
                if(isMatch && !err){
                    userId = user._id
                    var token = jwt.sign({userId},secretKey)
                    res.json({success:true,token:token,name:user.name,phone:user.phone})
                }else if(err){
                    console.log(err)
                }
                else{
                    res.json({success:false, msg: 'Authenticaton Failed Wrong PassWord'})
                }
            })
            // res.send({success:true,user: user})
        }
    })
})