import asyncHandler from "../utils/asynchandler.js"
import ApiError from "../utils/apierror.js"
import ApiResponse from "../utils/apiresponse.js"
import { Appointments } from "../models/appointments.model.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

const bookAppointment = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { dateandTime, contactNumber, reasonforvisit } = req.body

    if ([dateandTime, contactNumber, reasonforvisit, doctorId].some(field => !field || (typeof field === 'string' && field.trim() === ""))) {
        throw new ApiError(401, "All fields are required")
    }

    const doctor = await User.findById(doctorId)
    if (!doctor || doctor.role !== 'Doctor') {
        throw new ApiError(404, "Doctor not found")
    }

    const appointment = await Appointments.create({
        patient: req.User._id,
        doctor: doctorId,
        contactNumber,
        dateandTime,
        reasonforvisit
    })

    await User.findByIdAndUpdate(req.User._id, {
        $push: { appointments: appointment._id }
    })
    
    await User.findByIdAndUpdate(doctorId, {
        $push: { appointments: appointment._id }
    })

    return res.status(201).json(
        new ApiResponse(201, appointment, "Appointment requested successfully")
    )
})

const getAppointmentDetails = asyncHandler(async (req, res) => {
    const { username } = req.params
    const existingUser = await User.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.User._id)
                }
            },
            {
                $lookup: {
                    from: "appointments",
                    localField: "appointments",
                    foreignField: "_id",
                    as: "appointments",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "patient",
                                foreignField: "_id",
                                as: "patient",
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1,
                                            contactNumber: 1,
                                            dateofbirth: 1,
                                            avatar: 1,
                                            address: 1
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existingUser[0].appointments,
                "Appointments fetched successfully"
            )
        )
})

export {
    bookAppointment,
    getAppointmentDetails
}