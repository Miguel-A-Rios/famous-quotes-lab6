import express from 'express';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using the POST method
app.use(express.urlencoded({extended:true}));
//setting up database connection pool, replace values in red
// const pool = mysql.createPool({
//     host: "sh4ob67ph9l80v61.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
//     user: "w9c7lwn8um1o99yj",
//     password: "u3rw8lbcasz2h307",
//     database: "pyn5h5u7iu857dd2",
//     connectionLimit: 10,
//     waitForConnections: true
// });
const pool = mysql.createPool({
    host: "qn0cquuabmqczee2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: "l2mhd72tdv4zcjte",
    connectionLimit: 10,
    waitForConnections: true
});
//routes
app.get('/', async (req, res) => {
    let sql = `SELECT authorId, firstName, lastName
               FROM authors
               ORDER BY lastName`;
    const [authors] = await pool.query(sql);              
    res.render('home.ejs', {authors})
 });
 // API to get the author information based on an author Id
app.get('/api/author/:author_Id', async (req, res) => {
    console.log(req);
    let authorId = req.params.author_Id;
    let sql = `SELECT *
               FROM authors
               WHERE authorId = ?`;
   const [authorInfo] = await pool.query(sql, [authorId]);              
   res.send(authorInfo); // displays info in JSON format
});
// app.get('/', async (req, res) => {
//     //    res.render('home');
//     let sql = `SELECT authorId, firstName, lastName
//                   FROM authors
//                   ORDER BY lastName`;
//        const [authors] = await pool.query(sql);              
//        res.render('home.ejs', {authors})
//     });
app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByKeyword", async(req, res) => {
   try {
        let keyword = req.query.keyword;
    let sql = `SELECT *
               FROM quotes
               NATURAL JOIN authors
               WHERE quote LIKE ?`; 

        let sqlParams = [`%${keyword}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render('quotes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByAuthor", async(req, res) => {
   try {
        let author = req.query.author;
    let sql = `SELECT *
               FROM quotes
               NATURAL JOIN authors
               WHERE CONCAT(firstName, ' ', lastName) LIKE ?`;
        let sqlParams = [`%${author}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render('quotesA.ejs', {rows});

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByCategory", async(req, res) => {
   try {
        let category = req.query.category;
        let sql = `SELECT DISTINCT *
                   FROM quotes
                   NATURAL JOIN authors
                   WHERE category LIKE ?`; 
        let sqlParams = [`%${category}%`];
        const [rows] = await pool.query(sql, sqlParams);
        res.render('quotes.ejs', {rows});
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByLikes", async(req, res) => {
   try {
        let likeStart = req.query.likeStart;
        let likeEnd = req.query.likeEnd;
    let sql = `SELECT *
               FROM quotes
               NATURAL JOIN authors
               WHERE likes BETWEEN ? AND ?`;
        let sqlParams = [likeStart, likeEnd];
        const [rows] = await pool.query(sql, sqlParams);
        res.render('searchByLikes.ejs', {rows});

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3001, ()=>{
    console.log("Express server running")
})
