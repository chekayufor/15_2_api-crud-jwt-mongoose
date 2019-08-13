const raw = require('../../middleware/route.async.wrapper')
const bcrypt = require('bcryptjs')
const express = require('express')
const marker = require('@ajar/marker')
const router = express.Router()

const user_model = require('../user/user.model')

const { 
    verify_token, 
    false_response, 
    tokenize 
} = require('./auth.middleware')


router.use(express.json());

router.post('/register', raw( async (req, res)=> {
    
    marker.obj(req.body,'register, req.body:')
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    // marker.info('hashedPassword:',hashedPassword)
    const user_data = {
        ...req.body,
        password : hashedPassword
    }
    // create a user
    const created_user = await user_model.create(user_data) 
    // marker.obj(created_user,'register, created_user:') 
    
    // create a token
    const token = tokenize(created_user._id) 
    // marker.info('token:',token)

    return res.status(200).json({ 
        auth: true, 
        token ,
        user : created_user
    })

}))

router.post('/login', raw( async (req, res)=> {
    //extract from req.body the credentials the user entered
    marker.obj(req.body,'login body:')

    const {email,password} = req.body;

    //look for the user in db by email
    const user = await user_model.findOne({ email })

    //if no user found...
    if (!user) return res.status(401).json(false_response) 
    // marker.obj(user,'user:');
    marker.info('password',password);
    marker.v('user.password',user.password);
    // check if the password is valid
    const password_is_valid = await bcrypt.compare(password, user.password)
    if (!password_is_valid) return res.status(401).json(false_response)

    // if user is found and password is valid
    // create a fresh new token
    const token = tokenize(user._id)

    // return the information including token as JSON
    return res.status(200).json({ 
        auth: true, 
        token 
    })
}))

router.get('/logout', raw( async (req, res)=> {
    return res.status(200).json(false_response)
}))

router.get('/me', verify_token , raw( async (req, res)=> {
    const user = await user_model.findById(req.user_id);
    if (!user) return res.status(404).json({message:'No user found.'});
    res.status(200).json(user);
}))

module.exports = router;