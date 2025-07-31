import { Receipt } from "../models/receipt.model.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import ApiResponse from "../utils/apiresponse.js";
import { Appointments } from "../models/appointments.model.js";

const generateReceipt = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;

    const appointment = await Appointments.findById(appointmentId)
        .populate("patient doctor", "name email contactNumber avatar address");

    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    if (appointment.status !== "Completed") {
        throw new ApiError(400, "Receipt can only be generated for completed appointments");
    }

    const { medicines } = req.body;

    if (!Array.isArray(medicines) || medicines.length === 0) {
        throw new ApiError(400, "Medicines are required to generate a receipt");
    }

    for (const medicine of medicines) {
        if (!medicine.name || !medicine.dosage || !medicine.frequency) {
            throw new ApiError(400, "All medicine details are required");
        }
    }

    const receipt = await Receipt.create({
        appointment: appointment._id,
        patient: appointment.patient,
        doctor: appointment.doctor,
        dateandTime: appointment.dateandTime,
        medicines: medicines
    });

    res.status(201).json(new ApiResponse(201, "Receipt generated successfully", receipt));
})

const getReceipt = asyncHandler(async (req, res) => {
    const { receiptId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(receiptId)) {
        throw new ApiError(400, "Invalid receipt ID");
    }

    const receipt = await Receipt.findById(receiptId)
        .populate("patient doctor", "name email contactNumber avatar address");

    if (!receipt) {
        throw new ApiError(404, "Receipt not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Receipt retrieved successfully", receipt)
        );
})

export {
    generateReceipt,
    getReceipt
}