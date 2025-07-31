import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    contactNumber: {
        type:Number,
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dateandTime: {
        type: Date,
        required: true
    },
    reasonforvisit: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
        required: true
    }
})

AppointmentSchema.index({
    doctor: 1,
    dateandTime: 1
}, { unique: true })

AppointmentSchema.index({ patient: 1, status: 1 })
AppointmentSchema.index({ doctor: 1, status: 1 })

export const Appointments = mongoose.model("Appointments", AppointmentSchema)