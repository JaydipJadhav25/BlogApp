import { Router } from "express";
import { User } from "../models/user.model.js";

const router = Router();



router.get("/signin", (req, res) => {
    return res.render("signin");
  });
  
  router.get("/signup", (req, res) => {
    return res.render("signup");
  });

  router.post("/signup",async(req, res) => {
   const { fullname , email , password } = req.body
console.log(fullname , email,  password)
  await User.create({
        fullname,
        email,
        password
  })
return res.redirect("/")

  });

  router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await User.matchPasswordAndGenerateToken(email, password);
  
      return res.cookie("token" , token).redirect("/");
    } catch (error) {

      return res.render("signin", {
        error: "Incorrect Email or Password",
      });
    }
  });


  export default router