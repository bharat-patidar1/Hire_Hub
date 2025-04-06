//--> Yha pr company ka bussiness Logic likhenge 


//ab hum Company Collection ko import krenge by companyModel
import { Company } from '../models/company.model.js'

//Jab hum Job ko create krenge tb Company ko register krna pdega 

export const registerCompany = async (req, res) => {
    try {
        const {companyName} = req.body;   //ye variable hoga for company  name
        console.log(req.body)
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            })
        }
        //ab agr companyName aaya h to us Company ko find krenge ki already registered to nhi h 
        let company = await Company.findOne({ name : companyName })
        if (company) {
            //agr company ka name h to same name se aap nae company register nhi kr skre 
            return res.status(400).json({
                message: "You can't register same company ",
                success: false
            })
        }
        const userID = req.id
        //ab agr company name unique h to register krenge
        // company = await Company.create({
        //     name: companyName,
        //     //sbse pehle recruiter login krega then company register krega so , we have authentication token of Recruiter 
        //     userId: userID  //ye authentication se aaega 
        // })

         company = new Company({ name : companyName , userId : userID });
        await company.save();
        //ab create hochuka 

        return res.status(201).json({
            message: "Company registered successfully",
            company, //it consist companyName and userID
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

//ab company ko get krne k liye (usme kuch update vagera k liye)

export const getCompanies = async (req, res) => {
    try {
        //sbse pehle recruiter ki userId leke aao logged in user
        const userId = req.id
        //ab iss recruiter ki sari companies ko find kr lo   .Jo isne create kri h 

        //yha agr hum await use nhi krenge to , vo find krne k liye rukega nhi          
        const companies = await Company.find({ userId });
        // y user Id company collection k data m h , so we find all the companies which have userId inside them .. y sbhi company us user ki h 

        //agr koi comapnies nhi h currest user ki 
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

//ab logged in User ki koi perticular company ko search krna h to 

export const getCompanyById = async (req, res) => {
    try {

        //company ki id ko params (route) m pass kra hua h , vha se get kro   /getCompanyById/:id
        const comapanyId = req.params.id;
        const company = await Company.findById(comapanyId); // y id company Collection m hi h direct so wwe use findById
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }
        //agr company mil gae then
        return res.status(200).json({
            message: "Company found",
            company,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//ab kisi company ki info ko update krna h to 

export const updateCompany = async (req, res) => {
    try {
        //data to update 
        const { name, description, website, location } = req.body

        //logo vagera file m milega
        const file = req.file
        //yha cloudinnary aaega logo upload krne k liye 

        const updateData = {name, description, website, location}; //ekk sath dal denge y pura

        const companyId = req.params.id;
        let company = await Company.findByIdAndUpdate(companyId, updateData, {new : true});
        //y pura data update hojaega  {new :true } dalne se hum sara updated data milega
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }

        //agr company mil gae hogi to data update hogya h 
        return res.status(200).json({
            message : "Company Information Updated Successfully",
            company,
            success :true
        })

    } catch (error) {
        console.log(error);

    }
}