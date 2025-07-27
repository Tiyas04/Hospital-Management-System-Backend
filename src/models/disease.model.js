import mongoose, { Schema } from "mongoose";

const DiseaseSchema = new mongoose.Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    disease: {
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
        trim: true,
        default:""
    },
    timeofStart: {
        type: Date,
        required: true
    },
    Appointments: {
        type: Schema.Types.ObjectId,
        ref: "Appointments",
          default: null
    }
})

export const Disease = mongoose.model("Disease", DiseaseSchema)