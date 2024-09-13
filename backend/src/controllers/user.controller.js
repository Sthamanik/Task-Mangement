import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import path from 'path'
import jwt from "jsonwebtoken"
import { deleteOnCloudinary } from "../utils/DeleteCloudinary.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId)
        if (!user) throw new ApiError(401, "Invalid user id ")

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    }catch(err){
        throw new ApiError ( 500, "Something went wrong whiile generating tokens")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get the user details 
    const {email, username, password} = req.body;

    // validation - not empty
    if (
        [email, username, password].some((feild) =>
            feild?.trim() === "")
    ){
        throw new ApiError (400, "All fields are required")
    }

    // check whether the user already exists or not 
    let existingUser = await User.findOne({email})
    if ( existingUser ) throw new ApiError( 409, "User with the same email exists")
    
    // create the user object
    const user = await User.create({
        email, 
        password,
        username
    })

    // remove password and refresh token feild from response
    // check for user creation
    const createdUser = await User.findById( user._id ).select( "-password -refreshToken")
    if (!createdUser ) throw new ApiError(500, "An error occured during registring the user")

    return res.status(201).json(
        new ApiResponse ( 200, createdUser, "Registered User Successfully")
    )
})

const loginUser = asyncHandler ( async (req, res) => {
    const {email, password} = req.body;

    if ( !email) {
        throw new ApiError( 400, "Email cannot be empty")
    }

    const user = await User.findOne ({email})

    if (!user) throw new ApiError(404, "User doesn't exist")
    
    const matchPassword = await user.isPasswordCorrect(password)
    if(!matchPassword) throw new ApiError(401, "Invalid user credentials")
    
    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie ("refreshToken", refreshToken, options)
    .json(
        new ApiResponse( 200, {user: loggedInUser, accessToken, refreshToken}, "Logged In Successfully")
    )
})

const logoutUser = asyncHandler( async ( req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, 
        { $set : {refreshToken: ""} },
        { new: true }
    )
    
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options).
    json( new ApiResponse (200, {}, "Logged Out Successfully"))
})

const refreshAccessToken = asyncHandler ( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized Acess!!")

    try {
        const decodedToken = jwt.verify (incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        if (!user ) throw new ApiError(401, "Invalid token")
    
        if ( incomingRefreshToken !== user?.refreshToken ) 
            throw new ApiError (401, "Refresh token is expired or used")
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens( user._id )
        return res.status(200)
        .cookie( "accessToken", accessToken, options)
        .cookie( "refreshToken", newRefreshToken, options)
        .json( new ApiResponse (200, {accessToken, refreshToken: newRefreshToken}, " Refreshed accessToken successfully "))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler ( async ( req, res) => {
    const {oldPassword , newPassword } = req.body;

    if ( oldPassword === newPassword ) throw new ApiError(400, "passwords must be different")

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid Password")

    user.password = newPassword
    await user.save( {validateBeforeSave: false} )

    return res.status(200)
    .json( new ApiResponse (200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler ( async ( req, res )=> {
    return res.status(200)
    .json(new ApiResponse (200, req.user, "current user fetched successfully"))
})

const changeAccountDetails = asyncHandler ( async (req, res) => {
    const {username, email}= req.body

    if (!username || !email) throw new ApiError(400, "All feilds are required")

    const user = await User.findByIdAndUpdate( 
        req.user?._id,
        {
            $set: {username, email}
        },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200)
    .json (new ApiResponse(200, user, "Updated Account Details"))
})

const setUserAvatar = asyncHandler( async (req, res) => {
    const avatarLocalPath = path.normalize(req.files?.avatar[0]?.path)

    if ( !avatarLocalPath) throw new ApiError( 400, "Avatar file is missing")

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    if (user.avatar !== 'none') {
        const parts = user.avatar.split('/');
        const publicIdWithExtension = parts[parts.length - 1]; 
        const publicId = publicIdWithExtension.split('.')[0];
        const deleteResponse = await deleteOnCloudinary(publicId);
        if (deleteResponse.result !== 'ok') {
            throw new ApiError(400, "Error while deleting the old avatar");
        }
    }
    
    const avatar = await uploadOnCloudinary (avatarLocalPath)

    if (!avatar.url) throw new ApiError(400, "Error while uploading avatar")
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {avatar: avatar.url}
        },
        {new: true}
    ).select("-password -refreshToken")
    return res.status(200)
    .json(new ApiResponse(200, updatedUser, "Updated Avatar Successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    changeAccountDetails,
    setUserAvatar
}