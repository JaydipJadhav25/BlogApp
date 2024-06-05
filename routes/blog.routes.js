import { Router } from "express";
import { upload } from "../middlewares/multer.midd.js";
import { Blog } from "../models/blog.model.js"
import { uploadOnCloudinary } from "../services/cloudinary.js";




const router = Router();

router.get("/add-new", (req, res) => {
    return res.render("addblog" ,{
     user : req.user
    });
  });

  router.get("/:id" , async (req , res) => {
    const currentblog = await Blog.findById(req.params.id).populate("owner")
      console.log("blog" , currentblog)
    return res.render("blog" ,{
      user : req.user,
      blog : currentblog
    })
  })

  router.post("/addnewblog" ,upload.single("coverimage"), async (req, res) => {
    try {
      const { title , body } =req.body
      // const localpath = req.file object of file
      const localpath = req.file.path;  
       console.log(title, body , localpath)
       if(title ==="") throw new Error("title is requrid..")
        if(!localpath) throw new Error("coverimage is reqried ..")

        const coverimagepath =  await uploadOnCloudinary(localpath);
        // console.log("done path : " , coverimagepath)


       const userblog =  await Blog.create({
          title,
          body,
          coverimage : coverimagepath.url ,
          owner : req.user._id
        })
        if(!userblog) throw new Error("something went wrong ")

        return res.redirect("/");

    } catch (error) {
      console.log("error" , error)
      return res.render("addblog" ,{
        user : req.user,
        error : "Add blog error"
       });
      
    }

  });


  export default router