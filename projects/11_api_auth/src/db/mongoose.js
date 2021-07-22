const mongoose = require('mongoose')
const validator = require('validator')
const databseUrl = 'mongodb://127.0.0.1/task-manager-api-auth'

mongoose.connect(databseUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})



//const me = new User({name:'Argha',email:'argha@gmail.com',age:30})

//me.save().then(()=>{console.log(me)}).catch((error)=>{console.log(error)})