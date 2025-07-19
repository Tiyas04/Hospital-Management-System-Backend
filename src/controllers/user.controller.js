import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import ApiResponse from "../utils/apiresponse.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import { User } from "../models/user.model.js"

const generateAccessandRefreshToken = async (id) => {
    try {
        const existingUser = await User.findById(id)

        const accessToken = existingUser.generateAccessToken()
        const refreshToken = existingUser.generateRefreshToken()
        await existingUser.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, contactNumber, dateofbirth, role, password, address } = req.body

    if ([name, username, email, contactNumber, dateofbirth, role, password, address].some((field) => { field.trim() === "" })) {
        throw new ApiError(401, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { contactNumber }]
    })

    if (existingUser) {
        throw new ApiError(401, "User already exists")
    }

    const avatarlocalpath = req.files?.avatar[0]?.path

    if (!avatarlocalpath) {
        throw new ApiError(401, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath)

    if (!avatar) {
        throw new ApiError(402, "No avatar found")
    }

    User.create({
        name,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        contactNumber,
        dateofbirth,
        role,
        password,
        address,
        avatar: avatar.url
    })
        .then((user) => {
            const { password, refreshToken, _id, __v, ...userData } = user._doc

            console.log("User registered successfully\n", userData)

            res
                .status(200)
                .json(new ApiResponse(200, userData, "User Registered successfully"))
        }).catch((error) => {
            throw new ApiError(500, error.message || "Internal Server Error")
        })
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, contactNumber, password } = req.body

    if (!(username || contactNumber || password)) {
        throw new ApiError(401, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { contactNumber }]
    })

    if (!existingUser) {
        throw new ApiError(404, "No user found")
    }

    const validatePassword = await existingUser.isPasswordCorrect(password)

    if (!validatePassword) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(existingUser._id)

    const loggedinUser = await User.findById(existingUser._id).select("-password -_id -__v -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, loggedinUser, "User logged in successfully.")
        )
})

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.User._id,
        {
            $unset:{
                refreshToken: 1
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearcookie("accessToken",options)
    .clearcookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"Logged out successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
}