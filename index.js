import express from "express";
import dotenv from "dotenv";
import { db } from "./configs/db.js";
import { User } from "./models/user.model.js";
import { Book } from "./models/book.model.js";
import bodyParser from "body-parser";

dotenv.config();

const port = process.env.PORT || 8081;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("./index");
});

app.get("/form-basic", (req, res) => {
    res.render("./pages/form-basic");
});

// Create Book 
app.post("/form-basic", async (req, res) => {
    try {
        await Book.create(req.body);
        return res.redirect(req.get("Referrer") || "/");
    } catch (error) {
        console.log(error.message);
        return res.redirect(req.get("Referrer") || "/");
    }
});

// View Book 
app.get("/tables", async(req, res) => {
    try {
        let books = await Book.find({});
        return res.render('./pages/tables',{
            books
        })
    } catch (error) {
        console.log(error.message);
        return res.render('./pages/tables',{
            books:[]
        });
    }
});

// Delete Book 
app.get('/book/delete/:id',async(req,res) => {
    try {
        let books = await Book.findByIdAndDelete(req.params.id);
        console.log("Book Deleted.");
        return res.redirect(req.get("Referrer") || "/");
    } catch (error) {
        console.log(error.message);
        return res.redirect(req.get("Referrer") || "/");
    }
})

// Render Edit Page 
app.get('/book/edit/:id',async(req,res) => {
    try {
        let { id } = req.params;
        let book = await Book.findById(id);
        return res.render('./pages/editBook',{
            book
        })
    } catch (error) {
        console.log(error.message);
        return res.render('./pages/editBook',{
            book:{}
        })
    }
})

app.post('/book/edit/:id',async(req,res) => {
    try {
        let { id } = req.params;
        await Book.findByIdAndUpdate(id,req.body);
        return res.redirect("/tables");
    } catch (error) {
        console.log(error.message);
        return res.redirect(req.get("Referrer") || "/");
    }
})

app.get("/login", (req, res) => {
    res.render("pages/login");
});

app.get("/signup", (req, res) => {
    res.render("pages/signup");
});

app.listen(port,(error) => {
    db;
    if(port){
        console.log("Server started on port", port);
        console.log("http://localhost:" + port);
    } else {
        console.log(error.message);
    }
});
