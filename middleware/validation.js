const { validationResult } = require("express-validator")


exports.validateUser = (req,res,next)=>{
    
    const data = req.body
    let flag = true
    try{

        for(let x in data){
            if(x == "name" && !/^[A-Za-z\s]*$/.test(data[x])){
                throw new Error("Validation Failed")
            }
            else if(x == "email" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data[x])){
                throw new Error("Validation Failed")
            }
        }
        return next()
    }
    catch(e){

        return res.status(403).json({
            message:e.message
        })
        
    }
}

exports.loginValidator = (req,res,next)=>{

    try{
        console.log("In test Val");
        console.log(req.body);
        const validationError = validationResult(req);
        
        if(validationError.isEmpty()){
            console.log("Validation S");
            return next()
        }

        throw new Error(JSON.stringify(validationError.array()))
    }
    catch(e){
        console.log(e.message);
        return res.status(403).json({message:JSON.parse(e.message)})
    }
}