const { startChallenge, setNewDay} = require('../controller/userController')
const {body} = require('express-validator')
const { loginValidator, validateUser  } = require('../middleware/validation')
const { auth } = require('../middleware/auth,')
const { login, authLogin, signUp, adminLogin } = require('../controller/authController')

const userRouter = require('express').Router()

exports.userRouter = userRouter

.post("/signin",signUp)
.post("/login",[

    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isLength({min:8}),
    // loginValidator

],login)
.post("/authlogin",auth,authLogin)
.post("/adminlogin",auth,adminLogin)
.post("/verifyuser",auth,(req,res)=>res.status(200).json({verfied:true}))


.patch("/startchallenge",auth,startChallenge)
.patch("/setnewday",auth,setNewDay)