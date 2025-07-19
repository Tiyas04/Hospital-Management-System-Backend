import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    name: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    contactNumber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    nameoftheDoctor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    dateandTime: {
        type: Date,
        required: true
    }
})

export const Appointments = mongoose.model("Appointments", AppointmentSchema)