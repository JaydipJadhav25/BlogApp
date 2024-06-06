import express from "express"
import path from "path"
import userroutes from "./routes/user.routes.js"
import  verifyjwt  from "./middlewares/auth.midd.js";
import cookieParser from "cookie-parser";
import blogroutes from "./routes/blog.routes.js"
import { Blog } from "./models/blog.model.js"
import strict from "assert/strict";





const app = express()

//set view
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"))
app.use(express.urlencoded({ extended : false}))
app.use(express.static(path.resolve('./public')));


app.use(cookieParser())

// console.log("path " , path.resolve("./public"))
// app.use(verifyjwt);

app.use("/user" , userroutes)

app.get('/', verifyjwt , async function (req, res) {
const allblogs = await Blog.find({}).populate("owner");

// console.log("allblogs : " , allblogs)
  res.render("home" ,{
    user : req.user,
    blogs : allblogs
  })
})


//blog 
app.use("/blog" ,verifyjwt,  blogroutes)
// app.use("/blog" , blogroutes)






export { app}