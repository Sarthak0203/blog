const mongoose = require('mongoose');
const {schema, model} = mongoose;

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:4,
        unique:false
    },
    password:{
        type:String,
        required:true,
    }
})

const userModel = mongoose.model('Users', userSchema,);
module.exports = userModel;