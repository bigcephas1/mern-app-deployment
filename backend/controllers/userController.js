import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// descrip Auth user/set token
// route POST/api/users/auth
// access Public


const authUser = asyncHandler(async (req, res) => {
   const{email,password}=req.body
    const user = await User.findOne({ email })
     if (user) {
        generateToken(res,user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email
        })
         } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})
const registerUser = asyncHandler(async (req, res) => {
    const { name ,email,password} = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
       throw new Error ('user already exists')
    }

    const user = await User.create({ name, email, password })
    // note the matchPassword is a method we added to the userSchema that accepts passowrd as an argument then compares the passed password to the hashed password
    if (user&&(await user.matchPassword(password))) {
        generateToken(res,user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email
        })
    } else {
        res.status(400)
        throw new Error('invalid User data')
    }
    
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '',{
        httpOnly: true,
        expires:new Date(0)
    })
    res.status(200).json({
       message:"User logged Out"
   })
})

const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email:req.user.email
    }
    res.status(200).json(user)
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
           user.password=req.body.password 
        }
        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email:updatedUser.email
        })
    
    } else {
        res.status(404)
        throw new Error('User not Found')
    }
    
})
export {
    authUser,registerUser,logoutUser,getUserProfile,updateUserProfile
}