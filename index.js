const express = require("express");
const app = express();
const path = require("path")
const bodyParser = require("body-parser");
const mysql = require("mysql2")
 
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "crud_js"
})
// app.use(express.urlencoded({ extended: true }));

app.use(bodyParser({extended: true}))
app.use(express.json())
app.set('view engine', 'ejs')
// app.use("/", require(path.join(__dirname, './route.js')))
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req,res) => {
    const data = db.query("SELECT * FROM crud", (err,data) => {
        if(err) {console.log(err)}
        else{ 
            res.render('index', {data:data})
        }
    })
})

app.post("/post", (req,res) => {
    // const { product_name, product_brand, mrp, price, discount } = req.body;
    const details = req.body;
     db.query('INSERT INTO crud SET ?', details, (err, data) => {
        if(err){console.log(err)}
        else{ 
            res.redirect("/");
        } 
    })
})

app.get("/edit/:id", (req,res) => {
    const id = req.params.id;
    db.query(`SELECT * FROM crud WHERE id = ${id}` , (err, result) => {  
        res.render("edit", {data: result})
    })
})

app.post("/edited/:id", (req,res) => {
    const id = req.params.id;
    const updatedDetails = req.body;
    db.query(`UPDATE crud SET ? WHERE id = ${id}`, updatedDetails, (err,data) => {
        if(data) {
            // res.json({data})
            res.redirect("/")
        }
    })
})

app.get("/delete/:id", (req,res) => {
    const id = req.params.id;
    db.query(`DELETE FROM crud WHERE id = ${id}` , (err, result) => {  
        res.redirect("/")
    })
})

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})