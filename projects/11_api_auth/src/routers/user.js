const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
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

module.exports = router