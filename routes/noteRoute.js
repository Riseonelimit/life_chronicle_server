const { addComment, getCommentsByNoteID, getReviewComments } = require("../controller/noteCommentController")
const {  addNote, authTest, getUserNotesByDay, getNoteUser, getAllNotes, updateLikeCount, deleteLike, addLike, getLike, getNotesByTitle } = require("../controller/noteController")
const { auth } = require("../middleware/auth,")
const { analyzeCommentContent } = require("../middleware/commentSanitize")
const { validateUser } = require("../middleware/validation")

const router = require("express").Router()


exports.noteRouter = router

.get("/allblogs",getAllNotes)
.get("/getusernotes",getUserNotesByDay)
.get("/getuserinfobynote",getNoteUser)
.get("/getallnotes",getAllNotes)
.get("/getcommentbyid",getCommentsByNoteID)
.get("/test",[auth,validateUser],authTest)
.get("/likes",getLike)
.get("/getreviewcomments",auth,getReviewComments)
.get("/search",getNotesByTitle)

.post("/addcomment",analyzeCommentContent,addComment)
.post("/addNote",auth,addNote)
.post("/likes",addLike)

.patch("/updatelikecount",updateLikeCount)

.delete("/likes",deleteLike)