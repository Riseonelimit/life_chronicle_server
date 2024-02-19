const con = require("../db/db")


exports.addNoteMedia = (mediaData,noteID)=>{

    let media = []

    media.push(noteID)
    
    media = [...media,...Object.values(mediaData)]
    const res = con.query( "INSERT INTO note_media (note_id,media_1,media_2,media_3,media_4) VALUES (?,?,?,?,?)" ,media,
    (err,result)=>{
        if(err){
            console.log(err.message);
            return "Failed"
        }
        return "Success"
    })
    if(res == "Success"){
        return "Success"
    }
}