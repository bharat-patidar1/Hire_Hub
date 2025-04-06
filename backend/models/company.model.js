import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
name :{
    type : String,
    required : true,
    unique : true
},
description :{
    type : String,
},
website  :{
    type : String
},
location :{ 
    type : String
}, 
logo :{
    type : String //Url to company logo
},
userId  :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",    // recruiter ki id hi vha use hogi
    required : true
}
},{collection : "Company"},{timestamps:true})

export const Company = mongoose.model("Company" , companySchema);