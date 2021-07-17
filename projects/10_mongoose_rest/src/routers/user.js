const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/user',async (req,res)=>{
    // response.send(req.body)
    const user = new User(req.body)
    try
    {
        await user.save()
        res.status(200).send({"Message":"Data Successfully Saved"})
    }
    catch(e){
        res.status(400).send(e.message)
    }
    // user.save().then(()=>{
    //     response.send(user)
    // }).catch((e)=>{
    //     response.send(e.message)
    // })
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

    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.send(e)
    // })
})

router.get('/user/:id',async (req,res)=>{
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
    // User.findById(_id).then((user)=>{
    //     if(!user)
    //     {
    //         return res.send({"message":"No User Found"})
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.send(e)
    // })
})

router.patch('/user/:id',async (req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email','age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try
    {
        const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        if(!user)
        {
            return res.status.send(400)
        }

        return res.status(201).send(user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.delete('/user/:id',async (req,res)=>{
    const _id = req.params.id
    
    try
    {
        const user = await User.findByIdAndDelete(_id,req.body)
        if(!user)
        {
            return res.status(400).send({"msg":"User not found"})
        }

        return res.status(201).send(user)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

module.exports = router