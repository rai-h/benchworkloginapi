const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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

const Luser = mongoose.model('user',userSchema);
module.exports = Luser