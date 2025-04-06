import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : true
    },
    description : {
        type : String ,
        required : true
    },
    requirements : [{
        type : String
    }] ,
    salary : {
        type : Number  ,
        required : true
    },
    location : {
        type : String  ,
        required : true
    },
    jobType : {
        type : String,
        required : true 
    },
    experience : {
        type : Number,
        required : true
    },
    position : {
        type : Number ,
        required : true  
    },
    //now it is the relation between Job and Company 
    //it will give company id
    company : {
         type : mongoose.Schema.Types.ObjectId ,
         ref : 'Company',
         required : true 
    },
    
    //it will give userID
    created_by : {
         type : mongoose.Schema.Types.ObjectId ,
         ref : 'User', // admin 
         required : true 
    } ,
    //kitne user n is job k liye apply kra 
    applications : [
        {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Application',  
        }
    ]
},{collection : "Job"},{timestamps:true})

 
// ek database ki collection for Job 
export const Job = mongoose.model('Job' , jobSchema);