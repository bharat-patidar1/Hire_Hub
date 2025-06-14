//  --> Yha pr user ka pura bussiness logic h  Student or Recruiter 


import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//I dont add JWT security (token in it)


//This are routings of register and login which come from the srver page 
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body; //dynamically data lelo
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
        //ab check krenge ki user already exist to nhi krta h  . uske liye User collection ko get kro 
        const user = await User.findOne({ email });
        //age user already exist krta h i.e. uska data found hota h then eror
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email",
                success: false
            })
        }
        //ab agr user sachme new h to uske password ko hash m convert krenge 
        const hashedPassword = await bcrypt.hash(password, 10); // second parameter will give length
        //ab hum User collection k andr ek naya user kreate kr denge 
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        })
        return res.status(201).json({
            message: "Account Created Successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                status: false
            })
        }
        //ab check krte h ki user h ya nhi based on email  
        //yha hum password direct check nhi kr skte bcz hamare pass hashed password h 
        //const user = await User.findOne({email ,password});
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        //ab hashed pass nikalo
        // const hashedPassword = bcrypt.hash(password); can do it or 
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }
        //now check if role is correct or not 
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role",
                success: false
            })
        }
        //ab user ka data sara lelo bhr bhejne k liye
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        //ab hum security k liye token generate krenge 
        const tokenData = {
            userId: user._id
        }

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        //ab is token ko hum cookies m store karenge 

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
//Check For Error 
export const logout = async (req, res) => {
    try {

        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged Out Successfully",
            success: true
        })
    } catch (error) {
        comsole.log(error)
    }
}

export const updateProfile = async (req, res) => {
    try {
        //profile update krne k liye apne ko updated data receive hoga body se 
        const { fullname, email, phoneNumber, bio, skills } = req.body

        const file = req.file
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)


        // yha pr String ki form m skills aaega to usko array m convert krna h so add comma (,) in it 
        let skillsArray
        if (skills) {
            skillsArray = skills.split(",");
        }
        //for more security we also talke userId
        const userId = req.id; // ye middleware authentication se aaega y id user ki h (in User collection) it is unique
        //ab hamara updated chij h ab user ko find kro
        let user = await User.findById(userId);
        //ab user k data ko update krdo 
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        //resume comes here later
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url// save the resume url by claudinary
            user.profile.resumeOriginalName = file.originalname;
        }

        //ab tk user update hogya h ab usko daldo vapus 
        await user.save();

        //ab y user return krne k liye banare h 
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            message: "Profile updted successfully",
            user,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}