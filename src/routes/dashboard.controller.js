import {Router} from "express"
import { getDashboardStats } from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRole } from "../middlewares/role.middleware.js"

const router = Router()

router.route("/").get( verifyJWT, authorizeRole("Doctor", "Patient"), getDashboardStats)

export default router
