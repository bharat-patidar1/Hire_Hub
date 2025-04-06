//ye file bataegi ki req or res in updateProfile is proper (Authenticated or not)
//jo token humne banaya tha usko verify krna h bs 

import jwt from "jsonwebtoken";

const isAuthenticated = async (req , res , next)=>{
    try{
        //ab token h ya nhi vo check kro
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message : "User Not Authenticated",
                success : false
            })
        }
        //age token mil gya to usko decode krke match krenge 
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        //age dono match hojate h to thik h vrna
        if(!token){
            return res.status(401).json({
                message : "Invalid Token",
                success : false
            })
        }
        //ab req ko user id provide kr denge 
        req.id =  decode.userId; 
        next();
    }catch(error){
        console.log(error);
    }
}

export default isAuthenticated ; 