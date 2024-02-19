const con = require("../db/db");
const bycrypt = require('bcrypt')
const { createToken } = require("../middleware/token")



exports.signUp = async (req,res)=>{

	try{
		
		console.log(req.body);

		const salt = await bycrypt.genSalt(10)
		const encryptedPassword = await bycrypt.hash(req.body.password,salt)
		
		const userSlug = `${req.body.username}-${req.body.age}${Math.round(Math.random()*200)}`.toLowerCase()

		const newUser = {
			email:req.body.email,
			name:req.body.name,
			username:req.body.username,
			age:req.body.age,
			slug:userSlug,
			is_challenge_started:false,
			completed_days:0,
			current_day:1,
			profile_img:req.body.profile_img,
		}
		
		const token = createToken(newUser) 
		
		
		con.query(`INSERT INTO user (name,age,email,username,password,slug,profile_img)VALUES(?,?,?,?,?,?,?);`,[newUser.name,newUser.age,newUser.email,newUser.username,encryptedPassword,userSlug,newUser.profile_img],(err,result)=>{
			try{
				if (err){
					console.log(err.message);
					return res.status(400).json({message:err.message})
				} 
				console.log(newUser);
				return res.status(200).json({newUser , token})
			}
			catch(e){
				console.log(e);
			}
			
		})
	}
	catch(e){
		console.log(e.message);
		return res.status(400).json(e.message)
	}
}

exports.login = (req,res)=>{

	try{

		con.query(`SELECT username,age,slug,password,is_challenge_started,completed_days,current_day,profile_img,day_timer FROM user WHERE email = ? `,[req.body.email],
			
		(err,result)=>{

			if(err){
				throw err;
			}

			if(result.length <= 0){
				return res.status(404).json({error:"User Not Found"});
			}

			const validUser =  bycrypt.compareSync(req.body.password,result[0].password)
				

			if(validUser){
				const user = {
					email:req.body.email,
					name:result[0].name,
					username: result[0].username ,
					age:result[0].age,
					slug:result[0].slug,
					is_challenge_started:(result[0].is_challenge_started === 0 ? false: true),
					completed_days:result[0].completed_days,
					current_day:result[0].current_day,
					profile_img:result[0].profile_img,
					day_timer:result[0].day_timer

				}
				const token = createToken(user)
				res.json({user ,token})
			}
			else{
				return res.status(402).json({error:"Invalid Password"});
			}
		})
	}
	catch(e){
		return res.status(402).json({error:e.message})
	}


}

exports.authLogin = (req,res)=>{

	try{


		con.query(`SELECT name,username,age,slug,is_challenge_started,completed_days,current_day,profile_img,day_timer FROM user WHERE email = ? `,[req.user.email],
			
		(err,result)=>{

			if(err) throw err;

			if(result.length <= 0){
				return res.status(403).json({error:"Invalid Authorization"});
			}

			const user = {
				email:req.user.email,
				name:result[0].name,
				username: result[0].username ,
				age:result[0].age,
				slug:result[0].slug,
				is_challenge_started:(result[0].is_challenge_started === 0 ? false: true),
				completed_days:result[0].completed_days,
				current_day:result[0].current_day,
				profile_img:result[0].profile_img,
                day_timer:result[0].day_timer
			}

			res.json(user)
		
		})
	}
	catch(e){
		res.status(402).json({error:e.message})
	}
}

exports.adminLogin = (req,res)=>{

	try{

		const userData = req.body;

		con.query("SELECT user_id FROM user WHERE email = ? AND name = ? ;",
		[userData.email,userData.name],
		(err,result)=>{
			if(err){
				throw new Error(err);
			}
			if(result){
				console.log(result);
				userData.user_id = result[0].user_id
				con.query("SELECT * FROM admin WHERE user_id = ? AND email = ? AND name = ? ;",[userData.user_id,userData.email,userData.name],
				(err2,isAdmin)=>{
					if(err2){
						throw new Error(err2);
					}

					if(isAdmin.length == 0){
						return res.status(200).json({isAdmin:false})
					}
					return res.status(200).json({isAdmin:true})
					
				})
				
			}

		})
	}
	catch(e){
		return res.status(200).json({isAdmin:false})
	}
}