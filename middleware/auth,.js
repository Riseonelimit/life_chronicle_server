const jwt = require('jsonwebtoken')

exports.auth = (req,res,next) => {
    try{
        const token = req.get("Authorization").split("Bearer ")[1]

        const data = jwt.verify(token,process.env.JWT_SECRET)
        if(data){
            console.log("Auth Success");
            req.user = data
            return next()
        }
        else{
            return res.status(401).json("Not Authorize")
        }

    }
    catch(e){
        console.log(e);
        return res.status(401).json("Not Authorize")
    }   
}