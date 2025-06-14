import express from 'express'

//jab bhi hum ek file m multiple chijo ko export krte h to hame named export use krna hota h
import { login, logout, register , updateProfile} from '../controllers/ user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();


//register route aaegi to register pr forward krdo 
router.route("/register").post(singleUpload  , register)
router.route("/login").post(login)
router.route("/logout").get(logout) //koi data bhej ni rhe h to get request
router.route("/profile/update").post(isAuthenticated ,singleUpload, updateProfile) // is

export default router;