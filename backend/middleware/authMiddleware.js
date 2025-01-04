import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async(req,res,next) => {
    let token 
    
    token = req.cookies.jwt
    
    if (token) {
        try {
            // the decoded variable will have access to the userId, it is there because we passed it as a payLoad in the jwt.sign method
            const decoded = jwt.verify(token, process.env.JWT_SECRET) 
            // the .select(-passowrd makes it so that the password won't be returned)
            req.user = await User.findById(decoded.userId).select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized, Invalid token')
        }
    } else {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})
export {protect}