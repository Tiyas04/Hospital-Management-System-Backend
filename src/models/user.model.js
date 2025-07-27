import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        index: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        trim: true,
        unique: true
    },
    contactNumber: {
        type: Number,
        required: true,
        unique: true
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["Doctor", "Patient"]
    },
    avatar: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    refreshToken: {
        type: String
    },
    disease: {
        type: Schema.Types.ObjectId,
        ref: "Disease",
        default: null
    },
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: "Appointments",
        default: []
    }]
}, { timestamps: true })

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            contactNumber: this.contactNumber,
            dateofbirth: this.dateofbirth,
            role: this.role,
            address: this.address
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema)