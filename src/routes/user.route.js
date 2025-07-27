import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    updateAvatar,
    updatePassword
} from "../controllers/user.controller.js";
import {
    getAppointmentDetails,
    bookAppointment
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
router.route("/:username/getappointments").get(verifyJWT,authorizeRole("Doctor"),getAppointmentDetails)
router.route("/:username/bookappointment/:doctorId").post(verifyJWT,authorizeRole("Patient"),bookAppointment)

export default router