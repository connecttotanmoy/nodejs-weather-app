const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid Email Id');
            }
        }
    },
    age: {
        type: Number,
        required:true,
        validate(value){
            if(value < 0)
            {
                throw new Error('Age must be poistive number');
            }
        }
    }
})

module.exports = User