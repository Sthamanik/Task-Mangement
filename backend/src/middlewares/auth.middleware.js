import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) throw new ApiError( 401, "Unathorized access")
    
        const decodedData = jwt.verify( token , process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedData?._id).select("-password -refreshToken")
        
        if (!user ) throw new ApiError (401, "Invalid Token")
            
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})