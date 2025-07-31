import { Router } from "express";
import {
    getUser,
    loginUser,
    logoutUser,
    registerUser,
    searchDoctor,
    updateAvatar,
    updatePassword
} from "../controllers/user.controller.js";
import {
    getAppointmentById
} from "../controllers/appointment.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDiseaseRecords } from "../controllers/disease.controller.js";

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
router.route("/profile").get(verifyJWT, getUser)
router.route("/appointments/:appointmentId").get(verifyJWT, getAppointmentById)
router.route("/searchdoctor").get(verifyJWT, searchDoctor)
router.route("/:patientId/diseaserecord").get(verifyJWT, getDiseaseRecords)

export default router