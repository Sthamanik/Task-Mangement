import {Router} from "express";
import { changeAccountDetails, changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, setUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([{
        name: 'avatar',
        maxCount: 1
    }]),
    registerUser
)
router.route('/login').post(loginUser)
router.route('/refresh-token').put( refreshAccessToken)

// secured routes
router.route('/logout'). put( verifyJWT, logoutUser)
router.route('/change-password').put(verifyJWT, changeCurrentPassword)
router.route('/getUser').get(verifyJWT, getCurrentUser)
router.route('/change-details').put(verifyJWT, changeAccountDetails)
router.route('/set-avatar').put(verifyJWT, upload.fields([{
    name: 'avatar',
    maxCount: 1
}]) , setUserAvatar)


export default router