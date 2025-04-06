import express from 'express'
import {  postJob , getAllJobs , getAdminJobs, getJobById } from '../controllers/job.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';


const router = express.Router();


router.route('/postJob').post(isAuthenticated , postJob);
router.route('/getAllJobs').get(isAuthenticated , getAllJobs);
router.route('/get/:id').get(isAuthenticated , getJobById);
router.route('/getAdminJobs').get(isAuthenticated , getAdminJobs);

export default router;