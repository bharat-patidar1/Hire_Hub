//const express = require('express')
//if you want to use import in backend then   in package.json modify "type" : "module"
import express from 'express'
const app = express()
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js'
import jobRoute from './routes/job.route.js'
import applicationRoute from './routes/application.route.js'
dotenv.config({});
// Reads the .env file and loads its variables into process.env The empty {} means no additional configuration options are passed.
import connectDB from './utils/connectDB.js' 

const PORT = process.env.PORT || 8080;

//connect to database



//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const corsOption = {
    origin : "http://localhost:5173",
    //it will allow request from only that frontend url
    credentials : true
}
app.use(cors(corsOption))

//api's .. jo req res ka kam krti h
app.use('/api/v1/user' , userRoute);   //this routings are for user 
app.use('/api/v1/company' , companyRoute); //this routes are for company
app.use('/api/v1/job' , jobRoute);
app.use('/api/v1/application' , applicationRoute)

// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/profile/update"

app.listen(PORT , ()=>{
    connectDB();
    console.log("Server is Running at Port :"+PORT)
})  