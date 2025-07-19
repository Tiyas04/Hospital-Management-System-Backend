import mongoose, { Schema } from "mongoose";

const DiseaseSchema = new mongoose.Schema({
    nameofthePatient: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    contactNumber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    nameoftheDisease: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    symptom: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    medicinesUsed: {
        type: String,
        required: true,
        enum: ["Yes", "No"]
    },
    nameoftheMedicine: {
        type: String,
        index: true,
        trim: true
    },
    timeofStart: {
        type: Date,
        required: true
    },
    Appointments: {
        type: Schema.Types.ObjectId,
        ref: "Appointments"
    }
})

export const Disease = mongoose.model("Disease", DiseaseSchema)