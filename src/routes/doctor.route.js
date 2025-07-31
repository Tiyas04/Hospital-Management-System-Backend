import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import {
    getDoctorAppointments,
    updateAppointmentStatus
} from "../controllers/appointment.controller.js";
import { generateReceipt } from "../controllers/receipt.controller.js";

const router = Router()

router.route("/appointments").get(verifyJWT, authorizeRole("Doctor"), getDoctorAppointments)
router.route("/appointments/:appointmentId/status").patch(verifyJWT, authorizeRole("Doctor"), updateAppointmentStatus)
router.route("/appointments/:appointmentId/generate-receipt").post(verifyJWT,authorizeRole("Doctor"),generateReceipt)

export default router