import { Router } from "express";
import { upload } from "../middlewares/multer.midd.js";
import { Blog } from "../models/blog.model.js"
import { uploadOnCloudinary } from "../services/cloudinary.js";
import { comment } from "../models/comment.models.js";




const router = Router();


router.get("/add-new", (req, res) => {
    return res.render("addblog" ,{
     user : req.user
    });
  });

  //delete blog 


router.get("/delete/:id" , async(req, res) =>{
  try {
    
    console.log("id : " , req.params.id);

    //steps : 
    //1.this is allready logned user blog
    //2.delete blog 
    //3.delete comments of this blogs
    //4.returen remaning blogs
    const delectblog = await Blog.findByIdAndDelete({
      _id : req.params.id

    },{
      new : true
    });
    console.log("deleted blog: " , delectblog);

    await comment.deleteMany({
      blogid : req.params.id,
    })

    //feach reaming blogs

    const userallblogs = await Blog.find({
      _id : req.params.id
    }).populate("owner");


    return res.render("myblogs",{
      user : req.user,
      blogs : userallblogs,
      success : "Blog deleted successfully..."

    })

  } catch (error) {
       
    return res.render("myblogs",{
      user : req.user,
      blogs : userallblogs,
      error : "Blog Deleting Error"

    }) 
    
  }

})


//get all blogs of user
 router.get("/myblog/:userId" , async (req ,res) =>{
  //  console.log("current user : " , req.params.userId);

  const userallblogs = await Blog.find({
    owner : req.params.userId
  }).populate("owner");
  //  console.log("current user all blogs: " ,userallblogs);
  
  return res.render("myblogs" ,{
    user : req.user,
    blogs : userallblogs
  })
 }) 


  // feaching all blogs and comments
  router.get("/:id" , async (req , res) => {
    const currentblog = await Blog.findById(req.params.id).populate("owner")
      // console.log("blog" , currentblog)
      const comments = await comment.find({blogid :req.params.id }).populate("createdby")
      // console.log("comments: " , comments)
      // console.log(req.user)
    return res.render("blog" ,{
      user : req.user,
      blog : currentblog,
      comments : comments
    })
  })

 //handle comment routes
 //..../blog/comment/...........
 router.post("/comment/:blogId" , async(req, res) =>{
// console.log("data",req.body.content,req.params.blogId )
try {
  const currentusercomment = await comment.create({
    content : req.body.content,
    blogid : req.params.blogId,
    createdby : req.user._id
  })
  
  console.log("currentusercomments: " , currentusercomment)
  return res.redirect(`/blog/${req.params.blogId}`);
} catch (error) {

  return res.redirect(`/blog/${req.params.blogId}`)
  
}

 }) 

  router.post("/addnewblog" ,upload.single("coverimage"), async (req, res) => {
    try {
      const { title , body } =req.body
      // const localpath = req.file object of file
      const localpath = req.file.path;  
      //  console.log(title, body , localpath)
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