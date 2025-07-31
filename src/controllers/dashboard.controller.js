import asyncHandler from "../utils/asynchandler.js"
import ApiResponse from "../utils/apiresponse.js"
import { User } from "../models/user.model.js"
import { Appointments } from "../models/appointments.model.js"
import { Disease } from "../models/disease.model.js"

const getDashboardStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalDoctors, totalPatients, totalAppointments, appointmentsByStatus, diseaseStats] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "Doctor" }),
        User.countDocuments({ role: "Patient" }),
        Appointments.countDocuments(),
        Appointments.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]),
        Disease.aggregate([
            { $group: { _id: "$disease", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ])
    ])

    return res.status(200).json(new ApiResponse(200, {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        appointmentsByStatus,
        topDiseases: diseaseStats
    }, "Dashboard statistics fetched successfully"))
})

export { getDashboardStats }
