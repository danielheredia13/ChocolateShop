import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler( async (req, res, next) => {

    const token = req.headers.authorization

    const tokenClean = token && token.split(" ")[1]

    if(token && token.split(" ")[0] === "Bearer"){

        try {
            const decoded = jwt.verify(tokenClean, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password")

            next()
            
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error("Not Authorizated, Invalid Token")
        }

    } 
    
    if(!token) {

        res.status(401)
        throw new Error("Not Authorized, No Token")
    }


  
})

const admin = asyncHandler( async ( req, res, next ) => {

    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error("Not Authorized as an Admin")
    }


})

export { protect, admin }