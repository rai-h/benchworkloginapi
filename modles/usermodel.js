const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isMatch } = require('lodash');

const userSchema = new mongoose.Schema({
    name: { type:String,
            // required: true,
            minlenght:3,
            maxlength:100,
        },
    phone: {
        type : String,
        required: true,
        unique: true,
        minlenght: 10,
        maxlength: 10,
    },
    password: {
        type: String,
        required: true,
        minlenght: 8,
    }
})

userSchema.pre('save',async function (next){
const salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password,salt)
next();
});

userSchema.methods.comparePassword = (password,userPass ,cb)=>{
    bcrypt.compare(password,userPass,(err,isMatch)=>{
        if(err){
            console.log('<<<<-------Erorrrrrrr---------->>>>')
            return cb(err)
        }else return cb(err,isMatch)
    })
}

const user = mongoose.model('user',userSchema);
module.exports = user