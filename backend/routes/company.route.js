import express from 'express'
import { registerCompany, getCompanies, getCompanyById, updateCompany } from '../controllers/company.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';


const router = express.Router();

//agr User logged in h tbhi y sab hona chahiye else nhi

router.route('/register').post( isAuthenticated , registerCompany)   
router.route('/get').get( isAuthenticated , getCompanies)
router.get('/get/:id', isAuthenticated , getCompanyById) // we are using only single http request so can use this 
router.put('/update/:id', isAuthenticated , updateCompany)

export default router;