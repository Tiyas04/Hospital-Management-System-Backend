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

const router = Router()
//register user
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)
//login user
router.route("/login").post(loginUser)
//logout user
router.route("/logout").post(verifyJWT, logoutUser)
//update password
router.route("/:username/updatepassword").patch(verifyJWT, updatePassword)
//update avatar
router.route("/:username/updateavatar").patch(verifyJWT,
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
    ]),
    updateAvatar
)
//get user profile
router.route("/profile").get(verifyJWT, getUser)
//get appointment by id
router.route("/appointments/:appointmentId").get(verifyJWT, getAppointmentById)
//search doctor
router.route("/searchdoctor").get(verifyJWT, searchDoctor)

export default router