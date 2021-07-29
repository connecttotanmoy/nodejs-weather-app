const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

router.post('/user',async (req,res)=>{
    const user = new User(req.body)
    try
    {
        await user.save()
        res.status(200).send({"Message":"Data Successfully Saved"})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/user/login', async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/user/logout',auth, async (req, res) => {
    try {
        req.user.token =req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.token.save()
        res.status(201).send({"message":"Successfully logout"})
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/user/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users',async (req,res)=>{

    try
    {
        const user = await User.find({})
        res.status(200).send(user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

/*router.get('/user/:id',async (req,res)=>{
    const _id = req.params.id
    try
    {
        const user = await User.findById(_id)
        res.status(200).send(user)

    }
    catch(e)
    {
        res.status(400).send(e)
    }
   
})*/

router.patch('/user/me',auth,async (req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email','age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try
    {
        updates.forEach((update) => req.user[update] = req.body[update])
        await user.save()

        if (!user) {
            return res.status(404).send()
        }
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.delete('/user/me',auth,async (req,res)=>{ 
    try
    {
        /*const user = await User.findByIdAndDelete(req.user._id)
        if(!user)
        {
            return res.status(400).send({"msg":"User not found"})
        }*/
        await req.user.remove()
        return res.status(201).send(user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

const upload = multer({ 
    dest: 'uploads/',
    limits: {
        fileSize: 10000000 // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) { 
            return cb(new Error('Please upload a image'))
         }
        cb(undefined, true)
    }
      
})

router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send({"message":"Uploded Successfully"})
},(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router