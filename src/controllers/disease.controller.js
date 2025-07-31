import { Disease } from "../models/disease.model.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import ApiResponse from "../utils/apiresponse.js";

const diseaseRecord = asyncHandler(async (req,res) =>{
    const { disease, symptom, medicinesUsed, nameoftheMedicine, timeofStart } = req.body;

    if ([disease, symptom, medicinesUsed, timeofStart].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const newDisease = await Disease.create({
        patient: req.User._id,
        disease,
        symptom,
        medicinesUsed,
        nameoftheMedicine: nameoftheMedicine || "",
        timeofStart: new Date(timeofStart)
    });

    return res.status(201).json(new ApiResponse(201, newDisease, "Disease record created successfully"));
})

const getDiseaseRecords = asyncHandler(async (req, res) => {
    const diseaseRecords = await Disease.find({ patient: req.User._id })
        .populate("patient", "name email contactNumber avatar address")
        .populate("Appointments", "dateandTime status");

    if (!diseaseRecords || diseaseRecords.length === 0) {
        throw new ApiError(404, "No disease records found for this patient");
    }

    return res.status(200).json(new ApiResponse(200, diseaseRecords, "Disease records retrieved successfully"));
})

export {
    diseaseRecord,
    getDiseaseRecords
}