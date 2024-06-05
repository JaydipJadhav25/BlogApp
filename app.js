import express from "express"
import path from "path"
import userroutes from "./routes/user.routes.js"
import  verifyjwt  from "./middlewares/auth.midd.js";
import cookieParser from "cookie-parser";





const app = express()

//set view
app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"))
app.use(express.urlencoded({ extended : false}))
app.use(cookieParser())



app.use("/user" , userroutes)

app.get('/', verifyjwt , function (req, res) {
  res.render("home")
})










export { app}