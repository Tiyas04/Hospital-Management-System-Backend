import asyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import { Appointments } from "../models/appointments.model.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

const bookAppointment = asyncHandler(async (req, res) => {
    const { dateandTime, contactNumber, reasonforvisit } = req.body

    const doctorname = req.query.doctorname
    
    const doctor = await User.findOne({ name: doctorname, role: 'doctor' }).select('_id');
    
    if (!doctor) throw new ApiError(404, "Doctor not found");
    const doctorId = doctor._id;


    if ([dateandTime, contactNumber, reasonforvisit].some(field => field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existingAppointment = await Appointments.findOne({
        doctor: doctorId,
        dateandTime: new Date(dateandTime)
    })
    if (existingAppointment) {
        throw new ApiError(409, "Doctor is already booked for this time slot")
    }
    const newAppointment = await Appointments.create({
        patient: req.User._id,
        contactNumber,
        doctor: doctorId,
        dateandTime: new Date(dateandTime),
        reasonforvisit
    })
    return res.status(201).json(
        new ApiResponse(201, newAppointment, "Appointment booked successfully")
    )
})

const getDoctorAppointments = asyncHandler(async (req, res) => {
    const { status } = req.query

    const matchCondition = {
        doctor: new mongoose.Types.ObjectId(req.User._id)
    }

    if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        matchCondition.status = status
    }

    const doctorAppointments = await Appointments.aggregate([
        {
            $match: matchCondition
        },
        {
            $lookup: {
                from: "users",
                localField: "patient",
                foreignField: "_id",
                as: "patientDetails",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            contactNumber: 1,
                            dateofbirth: 1,
                            avatar: 1,
                            address: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "diseases",
                localField: "patient",
                foreignField: "patient",
                as: "patientMedicalHistory"
            }
        },
        {
            $addFields: {
                patient: { $arrayElemAt: ["$patientDetails", 0] }
            }
        },
        {
            $project: {
                patientDetails: 0
            }
        },
        {
            $sort: {
                dateandTime: 1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            doctorAppointments,
            `Doctor appointments fetched successfully${status ? ` (${status})` : ''}`
        )
    )
})

const getPatientAppointments = asyncHandler(async (req, res) => {
    const { status } = req.query

    const matchCondition = {
        patient: new mongoose.Types.ObjectId(req.User._id)
    }

    if (status && ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        matchCondition.status = status
    }

    const patientAppointments = await Appointments.aggregate([
        {
            $match: matchCondition
        },
        {
            $lookup: {
                from: "users",
                localField: "doctor",
                foreignField: "_id",
                as: "doctorDetails",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            contactNumber: 1,
                            avatar: 1,
                            address: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                doctor: { $arrayElemAt: ["$doctorDetails", 0] }
            }
        },
        {
            $project: {
                doctorDetails: 0
            }
        },
        {
            $sort: {
                dateandTime: 1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            patientAppointments,
            `Patient appointments fetched successfully${status ? ` (${status})` : ''}`
        )
    )
})

const getAppointmentById = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        throw new ApiError(400, "Invalid appointment ID")
    }

    const appointment = await Appointments.findById(appointmentId)
        .populate('patient', 'name email contactNumber dateofbirth avatar address')
        .populate('doctor', 'name email contactNumber avatar address')

    if (!appointment) {
        throw new ApiError(404, "Appointment not found")
    }

    const userIsPatient = appointment.patient._id.toString() === req.User._id.toString()
    const userIsDoctor = appointment.doctor._id.toString() === req.User._id.toString()

    if (!userIsPatient && !userIsDoctor) {
        throw new ApiError(403, "Access denied: You can only view your own appointments")
    }

    let appointmentData = appointment.toObject()

    if (userIsDoctor) {
        const patientMedicalHistory = await mongoose.model('Disease').find({
            patient: appointment.patient._id
        }).sort({ timeofStart: -1 })

        appointmentData.patientMedicalHistory = patientMedicalHistory
    }

    return res.status(200).json(
        new ApiResponse(200, appointmentData, "Appointment details fetched successfully")
    )
})

const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params
    const { status } = req.body

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be: pending, confirmed, cancelled, or completed")
    }

    const appointment = await Appointments.findById(appointmentId)

    if (!appointment) {
        throw new ApiError(404, "Appointment not found")
    }

    if (appointment.doctor.toString() !== req.User._id.toString()) {
        throw new ApiError(403, "Only the assigned doctor can update appointment status")
    }

    const updatedAppointment = await Appointments.findByIdAndUpdate(
        appointmentId,
        { status },
        { new: true }
    ).populate('patient', 'name email contactNumber avatar')
        .populate('doctor', 'name email contactNumber avatar')

    return res.status(200).json(
        new ApiResponse(200, updatedAppointment, `Appointment status updated to ${status}`)
    )
})

const cancelAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params

    const appointment = await Appointments.findById(appointmentId)

    if (!appointment) {
        throw new ApiError(404, "Appointment not found")
    }

    if (appointment.patient.toString() !== req.User._id.toString()) {
        throw new ApiError(403, "You can only cancel your own appointments")
    }

    if (appointment.status !== 'pending') {
        throw new ApiError(400, `Cannot cancel appointment with status: ${appointment.status}`)
    }

    const cancelledAppointment = await Appointments.findByIdAndUpdate(
        appointmentId,
        { status: 'cancelled' },
        { new: true }
    ).populate('patient', 'name email contactNumber')
        .populate('doctor', 'name email contactNumber')

    return res.status(200).json(
        new ApiResponse(200, cancelledAppointment, "Appointment cancelled successfully")
    )
})

const getPreviousAppointments = asyncHandler(async (req, res) => {
    const previousAppointments = await Appointments.find({
        patient: req.User._id,
        status: { $in: ['completed', 'cancelled'] }
    }).populate('doctor', 'name email contactNumber avatar address')
        .sort({ dateandTime: -1 })

    return res.status(200).json(
        new ApiResponse(200, previousAppointments, "Previous appointments fetched successfully")
    )
})

export {
    bookAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment,
    getPreviousAppointments
}