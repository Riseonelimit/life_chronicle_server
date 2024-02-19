const con = require("../db/db");

exports.addComment = (req, res) => {

    
    const commentData = req.body;
    const isCommentValid = req.body.isCommentValid;
    const date = new Date();
   

    con.query(
        "INSERT INTO note_comments (note_id,user_email,username,content,isPositive,date) VALUES (?,?,?,?,?,?)",
        [...Object.values(commentData),date],
        (err, result) => {
            try {
                if (err) {
                    console.log(err.message);
                    return res.status(400).json({ message: err.message });
                }
                if(!isCommentValid){
                    console.log("Invalid Comment");
                    con.query("INSERT INTO comment_review (comment_id,content,email) VALUES (?,?,?)",
                    [result.insertId,commentData.content,commentData.user_email],
                    (err,response)=>{
                        if(err){
                            throw new Error(err);
                        }
                        return;
                    }                  
                    )
                }
                console.log(result.insertId);
                res.status(200).json(result[0]);
            } catch (e) {
                return res.status(400).json({ message: err.message });
            }
        }
    );
};

exports.getCommentsByNoteID = async (noteID) => {

    const note_id = noteID;
    console.log("called comments");
    const res = await new Promise((resolve, reject) => {
        con.query(
            "SELECT * FROM note_comments WHERE note_id = ? ",
            [note_id],
            (err, result) => {
                try {
                    if (err) {
                        throw new Error();
                    }
                    if (result.length == 0) {
                        throw new Error();
                    }
                    return resolve(result)

                } catch (e) {
                    return resolve(null);
                }
            }
        );
    });
        // console.log({res});
    return res;
};

exports.getReviewComments = async(req,res)=>{

    // console.log("called comments");
    const response = await new Promise((resolve, reject) => {
        con.query(
            "SELECT * FROM comment_review ; ",
            (err, result) => {
                try {
                    if (err) {
                        throw new Error(err);
                    }
                    if (result.length == 0) {
                        throw new Error();
                    }
                    return resolve(result)

                } catch (e) {
                    return resolve(null);
                }
            }
        );
    });
        console.log({response});
    return res.status(200).json({reviewComments:response});
}