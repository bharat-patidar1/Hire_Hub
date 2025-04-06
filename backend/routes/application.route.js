import express from 'express'
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from '../controllers/application.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/applyJob/:id').post( isAuthenticated , applyJob); // id is jobId
router.route('/getAppliedJobs').get( isAuthenticated , getAppliedJobs);
router.route('/getApplicants/:id').get( isAuthenticated , getApplicants);
router.route('/updateStatus/:id').post( isAuthenticated , updateStatus);

export default router;