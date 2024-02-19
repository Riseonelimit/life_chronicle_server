const mysql = require("mysql");

const info = {
  host: "localhost",
  port: "3306",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "life_chronicle",
};

    let con = mysql.createConnection(info);

    con.connect((err) => {
      if (err) throw err;
      console.log("Database Connected!");
    });
    module.exports = con;