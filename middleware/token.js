const jwt = require('jsonwebtoken')


exports.createToken = (data)=>{
    try{

        const token = jwt.sign({email:data.email,name:data.name},process.env.JWT_SECRET,{
            expiresIn:'10D'
        })

        if(token){
            return token
        }
        throw new jwt.JsonWebTokenError("Error Creating Token")
    }
    catch(e){
        console.log(e);
        return null
    }

}