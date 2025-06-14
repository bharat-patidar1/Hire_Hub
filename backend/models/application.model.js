import mongoose from 'mongoose'
//ye schema applicants k liye h jo job k liye apply kr rhe h  yha hame pta hona chaiye 
//  ki konsi company m apply kiya aur kisne kiya

const applicationSchema = new mongoose.Schema({
job :{
    //yha hum application aur job k bich m relation bna rhe h taki hum , application se job ko get kr pae  
    type : mongoose.Schema.Types.ObjectId  ,
    ref : "Job",
    required : true
} ,
applicant : {
    //yha hum jisne apply kiya h uska info get karenge by user schema 
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true  
},
//application accept hue ya reject usko pgta krne k l;iye status bhi rakho 
status : {
    type :  String ,
    //jha pr bhi option ho vha enum use kro 
    enum : ["pending" , "accepted" , "rejected"],
    default : "pending"
}
},{collection : "Application", timestamps : true})

export const Application = mongoose.model("Application" , applicationSchema); 