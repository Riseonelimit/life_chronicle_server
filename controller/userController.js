const con = require("../db/db")
const bycrypt = require('bcrypt')
const { createToken } = require("../middleware/token")



exports.updateUserCompletedDays = (data)=>{

	console.log("callled");
	console.log(data);
	con.query("UPDATE user SET completed_days = ? WHERE email = ?",
	[++data.completed_days,data.email],
	(err,result)=>{
		if(err){
				return false;
			}
			return true;
	})
}

exports.startChallenge = (req,res)=>{


	const user = req.body 

	//---------REQ-BODY------------
	//	{
	// 		day_timer:day_timer,
	// 		email:user.email
	//	}

	
	con.query('UPDATE user SET is_challenge_started = true , day_timer = ? WHERE email = ?',[...Object.values(user)],
	(err,result)=>{
		try{

			if(err){
				console.log('in err');
				console.log(err.message);
				return res.status(400).json({message:err.message})
			}
			return res.status(200).json(result)		
		}
		catch(e){

		}
	})
}

exports.setNewDay = (req,res)=>{

	console.log("[BACKEND] new Day Called:");

	const user = req.body 

	console.log(user);

	con.query('UPDATE user SET day_timer = ? , current_day = ? , completed_days = ? WHERE email = ?',[...Object.values(user)],
	(err,result)=>{
		try{

			if(err){
				console.log('in err');
				console.log(err.message);
				return res.status(400).json({message:err.message})
			}
			return res.status(200).json(result)		
		}
		catch(e){

		}
	})
}