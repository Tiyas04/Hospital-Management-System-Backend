import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    updateAvatar,
    updatePassword
} from "../controllers/user.controller.js";
import {
    bookAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment
} from "../controllers/appointment.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/:username/updatepassword").patch(verifyJWT, updatePassword)
router.route("/:username/updateavatar").patch(verifyJWT,
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
    ]),
    updateAvatar
)
router.route("/doctor/appointments").get(verifyJWT, authorizeRole("Doctor"), getDoctorAppointments)
router.route("/doctor/appointments/:appointmentId/status").patch(verifyJWT, authorizeRole("Doctor"), updateAppointmentStatus)
router.route("/patient/appointments").get(verifyJWT, authorizeRole("Patient"), getPatientAppointments)
router.route("/patient/appointments/:doctorId/book").post(verifyJWT, authorizeRole("Patient"), bookAppointment)
router.route("/patient/appointments/:appointmentId/cancel").patch(verifyJWT, authorizeRole("Patient"), cancelAppointment)
router.route("/appointments/:appointmentId").get(verifyJWT, getAppointmentById)

export default router