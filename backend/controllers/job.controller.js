//--> Yha pr hum Job Ka bussiness logic likhenge 
//yha hum job post krenge get krenge and all related to jobs

import { Job } from "../models/job.model.js";

//admin job post krega (Recruiter)
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body

        //ab user Id leke aaenge kon post krra h
        const userId = req.id; // ye authentication se aaega  

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const jobData = {
            title,
            description,
            requirements: requirements.split(","),
            salary,
            location,
            jobType,
            experience,
            position,
            company: companyId,
            created_by: userId
        }

        //ab agr sb data aaya h to job ko create krenge 
        const newJob = new Job(jobData);
        await newJob.save();
        //new Job posted
        return res.status(201).json({
            message: "Job posted successfully",
            jobData, //it consist companyName and userID
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}


//ab sbhi jobs ko get kro  with filters 
//for students
export const getAllJobs = async (req, res) => {
    try {
        // jo bhi filter ko key = value k pair se pass kra h usko yha get krlo 
        // const keyword = req.query.keyword || "" ;  // agr filter aaya h to ok else empty string (no filter all jobs)
        // keyword k and value aajaegi , ab us value ko title and description k base pr search krdo

        //But i will use my method --> method 1
        // let query = {};

        // //filter on the basis of title
        // if(req.query.title){
        //     query.title = { $regex : req.query.title , $options : "i"}
        // }

        // //filter on the basis of description
        // if(req.query.description){
        //     query.title = { $regex : req.query.description , $options : "i"}
        // }


        // now for understanding also use method - 2 
        //in this only one query key keyword is used for all kind of filtering 
        const keyword = req.query.keyword || "";

        //ye method title || description dono mese jha bhi match hoga vo bta dega 

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }

        //ab query k andr sare filters aagae h 
        //ab find kro by query 
        

        //yha pr company ki Id  jo ki company field m stored h uski jgh uski info aajaegi
        const jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });   // populate method hame id ki jgh info dedega company ki
        // ye humne filered jobs ko find kr liya h aur store kr liya in query

        if (!jobs) {
            return res.status(404).json({
                message: "NO Jobs",
                success: true
            })
        }
        //agr filtered jobs mil gae then return then
        return res.status(200).json({
            jobs,
            success: true
        })


    } catch (error) {
        console.log(error);

    }
}

//ab hame job find krni h by id 
//for students
export const getJobById = async (req, res) => {
    try {
        //Job id url se aaegi by params
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({path : "company"}).sort({createdAt : -1});
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}


//admin (Recruiter) n kitne Job post kre h abhi tk usko get kro

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;  // user id of admin
        //now find jobs created by this user
        const jobs = await Job.find({ created_by: adminId }).populate({path : "company"}).sort({createdAt : -1});  // you have to write {}
        //const jobs = await Job.find({ created_by: adminId }).po pulate({path : "company"}).populate({path : "created_by"}).sort({createdAt : -1}); 
        //also populate user or admin infor  as above
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}