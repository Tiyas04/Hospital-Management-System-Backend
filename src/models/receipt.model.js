import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
    apppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointments",
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dateandTime: {
        type: Date,
        required: true
    },
    medicines: [{
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        frequency: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true})

export const Receipt = mongoose.model("Receipt", receiptSchema)