// --> yha pr hum user aur Job k bich ka relation wala bussiness logic likhenge 

import { Application } from '../models/application.model.js'
import { Job } from '../models/job.model.js';

export const applyJob = async (req, res) => {
    try {
        //yha ek user ko student ko job k liye apply krna h req user Id Job id   
        //yha authentication k bad hi aaega 
        const userId = req.id;
        //const {id : jobId} = req.params;
        const jobId = req.params.id;   // both are same
        if (!jobId) {
            return res.status(400).json({
                message: "Job Id is required",
                success: true
            })
        }
        //ab hum check krenge ki 'user' n pehle se apply to nhi kr diya is job k liye   by userId and jobId  
        //ek user same job k liye apply nhi kr skta firse
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }
        //ab hum check krenge ki Job exist kr rhi h ya nhi 
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(400).json({
                message: "Job not found",
                success: false
            })
        }
        //ab agr sb sahi h to hum ek new application create krenge . taki user job pr apply hojae
        const applicationData = {
            job: jobId,
            applicant: userId
        }
        const newApplication = new Application(applicationData);
        await newApplication.save();
        //application saved
        //ab hame job k liye iss user n apply kr diya h vo show krna h aur us application ki id Job m store krni h 

        //it is an array which store total no. of applications   .. iss jobId k andr hame add krna h job == jobId
        job.applications.push(newApplication._id);  // iss job k liye konsi application aae h uski id 
        await job.save()

        return res.status(201).json({
            message: "Job applied Successfully",
            success: true
        })


    } catch (error) {
        console.log(error);
    }
};


//ek user n jitni bhi jobs pr apply kiya h vo sb get kro

 const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        //yha pr job field ki id likhi h usse job related sari info hame mil jaegi 
        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } }, // jobs bhi ascending order m chahiye
            //ab hame job kis company m h vo bhi chahiye to nested populate lagaos
            populate: {
                path: "company",
                options: { sort: { createdAt: -1 } }   // sorted chahiye 
            }
        }) // sort in ascending order

        if (!applications) {
            return res.status(404).json({
                message: "No applications found",
                success: false
            })
        }
        return res.status(200).json({
            applications,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}
export {getAppliedJobs}

//admin dekhega kitne user n apply kiya h 
//ab hum applicant k liye banaenge ki posted job pr kitne applications aae h , kitne students n apply kra h 
export const getApplicants = async (req, res) => {
    try {
        const { id: jobId } = req.params;
        //iss job ki applications ko bhi show kro 
        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: { path: "applicant" }   // nested populate to get user data from application
        })
        if (!job) {
            return res.status(404).json({
                message: "Job Not Found!",
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}


//ab hamara application reject hua h ya accept hua h uske liye 

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id: applicationId } = req.params;
        if(!status){
            return res.status(400).json({
                message : "Status is required",
                success : true
            })
        };
        //find the application by applicationId
        let application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({
                message : "application not found",
                success : true
            })
        };

        //update the status  jo status body se aaya h usko application m daldo 
        application.status = status.toLowerCase();
        await application.save(); // ab updated data show hoga 
        return res.status(200).json({
            message : "Status updated successfully ",
            success : true
        })


    } catch (error) {
        console.log(error);

    }
}