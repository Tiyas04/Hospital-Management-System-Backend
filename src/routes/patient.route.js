import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import {
    bookAppointment,
    cancelAppointment,
    getPatientAppointments,
    getPreviousAppointments
} from "../controllers/appointment.controller.js";

const router = Router()

router.route("/appointments").get(verifyJWT, authorizeRole("Patient"), getPatientAppointments)
router.route("/appointments/:doctorId/book").post(verifyJWT, authorizeRole("Patient"), bookAppointment)
router.route("/appointments/:appointmentId/cancel").patch(verifyJWT, authorizeRole("Patient"), cancelAppointment)
router.route("/appointments/previous").get(verifyJWT, authorizeRole("Patient"), getPreviousAppointments)

export default router