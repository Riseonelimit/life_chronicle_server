const con = require("../db/db");
const bycrypt = require("bcrypt");
const { createToken } = require("../middleware/token");
const { updateUserCompletedDays } = require("./userController");
const { addNoteMedia } = require("./noteMediaController");
const { getCommentsByNoteID } = require("./noteCommentController");
const { Response } = require("../utils/response");

exports.getAllNotes = (req, res) => {
    const offSet = req.query.pageOffSet;
    console.log(offSet);
    con.query(
        "SELECT title,content,publish_date,likes_count,user_slug,day_no,username FROM notes INNER JOIN user on notes.user_email = user.email limit ?,10 ",
        [parseInt(offSet)],
        (err, result) => {
            try {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                return res
                    .status(200)
                    .json(new Response(200, "Success", result));
            } catch (e) {
                return res.status(400).json({ error: "Something Went Wrong" });
            }
        }
    );
};

exports.addNote = (req, res) => {
    const data = req.body;
    // console.log(data);
    // console.log(data.user_id);
    const user = {
        email: data.user.email,
        slug: data.user.slug,
        current_day: data.user.current_day,
        completed_days: data.user.completed_days,
    };
    let date = new Date();
    updateUserCompletedDays(user);

    con.query(
        `INSERT INTO notes (user_email,user_slug,title,content,day_no,publish_date,is_day_completed)VALUES(?,?,?,?,?,?,?);`,
        [
            user.email,
            user.slug,
            data.note.title,
            data.note.content,
            user.current_day,
            date,
            true,
        ],
        (err, result) => {
            try {
                if (err) {
                    throw new Error(err.message);
                }
                addNoteMedia(data.media, result.insertId);
                return res.status(200).json(new Response(200, "Success", user));
            } catch (e) {
                return res.status(400).json({ error: e });
            }
        }
    );
};

exports.getUserNotesByDay = (req, res) => {
    const user = req.query.userData;
    con.query(
        "SELECT *,notes.note_id FROM notes LEFT JOIN note_media ON notes.note_id = note_media.note_id WHERE day_no = ? AND user_slug = ? ;",
        [user.day_no, user.slug],
        async (err, result) => {
            try {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                const commentData = await getCommentsByNoteID(
                    result[0].note_id
                );

                const responseData = {
                    noteData: {
                        note_id: result[0].note_id,
                        user_email: result[0].user_email,
                        user_slug: result[0].user_slug,
                        title: result[0].title,
                        publish_date: result[0].publish_date,
                        content: result[0].content,
                        likes_count: result[0].likes_count,
                        is_day_completed: result[0].is_day_completed,
                        day_no: result[0].day_no,
                        media_id: result[0].media_id,
                    },
                    images: [
                        result[0].media_1,
                        result[0].media_2,
                        result[0].media_3,
                        result[0].media_4,
                    ],
                    comments: commentData == null ? [] : commentData,
                };
                res.status(200).json(
                    new Response(200, "Success", responseData)
                );
            } catch (e) {
                return res
                    .status(400)
                    .json({ message: "Something Went Wrong" });
            }
        }
    );
};

exports.getNoteUser = (req, res) => {
    const user = req.query.userslug;

    con.query(
        "SELECT username,name,profile_img,completed_days FROM user WHERE slug = ?;",
        [user],
        (err, result) => {
            try {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                res.status(200).json(new Response(200, "Success", result[0]));
            } catch (e) {}
        }
    );
};

exports.updateLikeCount = (req, res) => {
    const data = req.body;

    con.query(
        "UPDATE notes SET likes_count = ? WHERE note_id = ?;",
        [...Object.values(data)],
        (err, result) => {
            try {
                if (err) {
                    throw new Error(err.message);
                }
                return res.status(200).json(new Response(200, "Success"));
            } catch (e) {
                res.status(400).json({ error: e.message });
            }
        }
    );
};

exports.getLike = (req, res) => {
    const data = req.query;

    con.query(
        "SELECT * FROM liked_notes WHERE note_id = ? AND user_email = ? ;",
        [...Object.values(data)],
        (err, result) => {
            try {
                if (err) {
                    throw new Error(err.message);
                }
                if (result.length > 0) {
                    return res
                        .status(200)
                        .json(new Response(200, "Success", true));
                }
                throw new Error(false);
            } catch (e) {
                res.status(200).json(false);
            }
        }
    );
};

exports.addLike = (req, res) => {
    const data = req.body;
    con.query(
        "INSERT INTO liked_notes (note_id,user_email) VALUES (?,?);",
        [...Object.values(data)],
        (err, result) => {
            try {
                if (err) {
                    throw new Error(err.message);
                }
                return res.status(200).json(new Response(200, "Success"));
            } catch (e) {
                res.status(400).json({ error: e.message });
            }
        }
    );
};

exports.deleteLike = (req, res) => {
    const data = req.query;

    con.query(
        "DELETE FROM liked_notes WHERE note_id = ? AND user_email = ?;",
        [...Object.values(data)],
        (err, result) => {
            try {
                if (err) {
                    throw new Error(err.message);
                }
                return res.status(200).json(new Response(200, "Success"));
            } catch (e) {
                return res.status(400).json({ error: e.message });
            }
        }
    );
};

exports.getNotesByTitle = (req, res) => {
    const { title } = req.query;
    con.query(
        "SELECT title,user_slug,day_no from notes where title LIKE ?;",
        ["%" + title + "%"],
        (err, result) => {
            try {
                if (err) {
                    throw new Error(err.message);
                }
                return res
                    .status(200)
                    .json(new Response(200, "Success", result));
            } catch (e) {
                res.status(400).json({ error: e.message });
            }
        }
    );
};

exports.authTest = async (req, res) => {
    return res.json("Test Success");
};
