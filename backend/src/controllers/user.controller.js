import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import path from 'path'

const registerUser = asyncHandler( async (req, res) => {
    // get the user details 
    const {fullName, email, username, password} = req.body;

    // validation - not empty
    if (
        [fullName, email, username, password].some((feild) =>
            feild?.trim() === "")
    ){
        throw new ApiError (400, "All fields are required")
    }

    // check whether the user already exists or not 
    let existingUser = await User.findOne({email})
    if ( existingUser ) throw new ApiError( 409, "User with the same email exists")

    existingUser = await User.findOne({username})
    if ( existingUser ) throw new ApiError( 409, "User with the same username exists")
    
    // check for avatar
    const avatarLocalPath = path.normalize(req.files?.avatar[0]?.path)
    if (!avatarLocalPath ) throw new ApiError( 400, "Avatar is required")

    // upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar ) throw new ApiError( 400, "Failed To Upload Avatar")
    
    // create the user object
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        email, 
        password,
        username
    })

    // remove password and refresh token feild from response
    // check for user creation
    const createdUser = await User.findById( user._id ).select( "-password -refreshToken")
    if (!createdUser ) throw new ApiError(500, "An error occured during registring the user")

    // return the reponse
    return res.status(201).json(
        new ApiResponse ( 200, createdUser, "Registered User Successfully")
    )
})

export {
    registerUser,
}