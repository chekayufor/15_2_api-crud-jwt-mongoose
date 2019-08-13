const express = require('express')
const marker = require('@ajar/marker')
const raw = require('../../middleware/route.async.wrapper')
//  const mongoosePaginate = require('mongoose-paginate');

const router = express.Router()

router.use(express.json())

const user_model = require('./user.model')

//PAGINATION

user_model.paginate({}, { page: 2, limit: 5 }, function(err, result) {
    (err)?console.log(err):console.log(result.pages,result.docs)
});

// CREATES A NEW USER
router.post('/', raw( async (req, res)=> {
    marker.obj( req.body ,'create a user, req.body:')
    const user = await user_model.create(req.body)    
    res.status(200).json(user)       
}))

// GET ALL USERS
router.get('/', raw( async(req, res)=> {
    const users = await user_model.find({})
                                    .select(`-_id 
                                          first_name 
                                          last_name 
                                          email
                                          phone`) 
    res.status(200).json(users)
}))

// GET ALL USERS + Pagination
//http://localhost:3030/api/users/pagination?limit=2&skip=2
router.get('/', raw( async(req, res)=> {
    const users = await user_model.find({})
                                    .select(`-_id 
                                          first_name 
                                          last_name 
                                          email
                                          phone`) 
                                    .limit(parseInt(req.query.limit))
                                    .skip(parseInt(req.query.skip)) 

    res.status(200).json(users)
}))

// GETS A SINGLE USER
router.get('/:id', raw(async (req, res)=> {
    const user = await user_model.findById(req.params.id) 
                                .select(`-_id 
                                        first_name 
                                        last_name 
                                        email
                                        phone`) 
    if (!user) return res.status(404).json({status:"No user found."})
    res.status(200).json(user)
}))

// DELETES A USER
router.delete('/:id', raw( async (req, res) => {
    const user = await user_model.findByIdAndRemove(req.params.id)
    res.status(200).json(user)
}))

// UPDATES A SINGLE USER
router.put('/:id', raw( async (req, res)=> {
    const user = await user_model.findByIdAndUpdate(req.params.id, 
                                                    req.body, 
                                                    {new: true,upsert:true})
    res.status(200).json(user)
}))


module.exports = router