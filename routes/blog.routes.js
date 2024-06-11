import { Router } from "express";
import { upload } from "../middlewares/multer.midd.js";
import { Blog } from "../models/blog.model.js"
import { uploadOnCloudinary } from "../services/cloudinary.js";
import { comment } from "../models/comment.models.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";




const router = Router();


router.get("/add-new", (req, res) => {
    return res.render("addblog" ,{
     user : req.user
    });
  });


  //update comment..................
  router.get("/comment/update/:Id" ,async(req , res) =>{
    // console.log(" current comment id: " , req.params.Id);

    const currentcomment = await comment.find({
      _id : req.params.Id
    }).populate("createdby")


    // console.log(currentcomment);



    return res.render("updatecomment" ,{
      currentcomment,
      user : req.user
    });

  })


  router.post("/commentdelete/:id" , async(req , res ) =>{
   try {
     // console.log(" id : " , req.params.id);
     const { content } = req.body;
 
     // console.log("new comment :  ",  content);
     
 
   const newcomment = await comment.findByIdAndUpdate({
       _id :  req.params.id
     },{
       $set :{ 
            content
       }
     },{
       new : true
     })
     console.log(newcomment);
 
     
 
 
     return res.redirect(`/blog/${newcomment.blogid}`)
   } catch (error) {

    return res.redirect(`/blog/${newcomment.blogid}`)
    

   }

  })





  //update blogs ...........

  router.get("/update/:blogId", async (req, res) => {
    console.log(req.params.blogId)
    
    const currentblog = await Blog.findById({_id :req.params.blogId});

    return res.render("updateblog" ,{
     user : req.user,
     blogs : currentblog

    });

  });


 router.post("/update/:blogId" , async(req , res) =>{
   try {
     const { title , body }  =req.body;
     // console.log(" data : " , title , body)
      
         const updateblog = await Blog.findByIdAndUpdate(
           req.params.blogId,
          {
            $set: {
              title,
              body
            }
          },{
            new : true
          }
         )
  console.log(" updated blog : " , updateblog)

         const userallblogs = await Blog.find({
          _id : req.params.blogId
        }).populate("owner");
    
    console.log(" all blogs  : " , userallblogs)
        return res.render("myblogs",{
          user : req.user,
          blogs : userallblogs,
          success : "Blog update successfully..."
    
        })
  
    } catch (error) {

        return res.render("myblogs",{
          user : req.user,
          blogs : userallblogs,
          error : "Blog update failed...."
    
        })

    }
 }) 




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

    
      //  console.log(" id : " , req.params.id)
 
       const currentblog = await Blog.findById(req.params.id).populate("owner")
 
 
        //  console.log("currentblog owner : " , currentblog.owner.fullname)
        //  console.log("currentblog  : " , currentblog.owner._id )
 
 
         const comments = await comment.find({blogid :req.params.id }).populate("createdby")
         console.log("comments: " , comments)
         
         
      
   
         // find crrent user is that of blog owner
         // const currentblogowner = undefined ;
         
         //only find current lognrd user blogs : 
        //  console.log("current user : " , req.user._id)
        //  console.log(req.user.fullname)
   
         // const blogowner = await Blog.find({
         //   owner : req.user._id
   
         // }).populate("owner");
   
         
         const currentblogownerid = currentblog.owner._id.toString()  ;
         const currentlogneduserid = new mongoose.Types.ObjectId(req.user._id).toString();
         // console.log( currentblogownerid , currentlogneduserid );
         // doneuserblog =  currentblogownerid;
         // console.log("done userblog outside: " , doneuserblog)
   
         // if(currentblogownerid === currentlogneduserid) return doneuserblog =  currentblogownerid;
         // console.log("done userblog : " , doneuserblog)
             
       
   
         // const currentuserblogs = await Blog.aggregate([{
         //   $match :{
         //       _id : new mongoose.Types.ObjectId(req.)
         //   }
         // }])
   
         // console.log("blogowner : " , blogowner)
   // console.log("blogonwer : " , blogowner )
   
   
   //and find user comments in other blogs :
   //feaching all comments of current blog
   const currentusercomments = await comment.find({
     blogid : req.params.id
   }) 
   
 
   console.log("current blog comments : " ,currentusercomments)
    //using find function............
  //  const result = currentusercomments.find(cheker || {});

  //  function cheker(data) {
  //   return data.createdby.toString() === req.user._id

  //  }
  // console.log(" result :  ", result);
  //  console.log("current blog comments of current user cretedby :   " ,currentusercomments[0].createdby)//single user chi id yeil na ft
   
   
   //then find only those comments of current user :  
            
   let currentblogcommentowner = undefined;
 
  //  const currentusercommentonblogid = comments.createdby._id
  //  console.log(currentusercommentonblogid)
    // if( currentusercommentonblogid === currentlogneduserid){
    //  console.log("ahe na apli comment ya blog la")
    //  currentblogcommentowner = currentusercommentonblogid;
    // }
    // else{
    //  console.log(" nhi apli comment ya blog la  ")
    // }


     
         let  currentblogowner = undefined;
         //  console.log(new mongoose.Types.ObjectId(req.user._id),  blogowner[0].fullname)
         // jr current blog ahe ani tyacha owner ha login 
         // user ahe tr tyala access ahe ki to all deletes delete kru shakto
         //ani ajun je other blogcomment asetil v ti current user 
         // ne kelia asel tr to ti pn delete kru shakto
   
        if( currentblogownerid  === currentlogneduserid ){
   
   
           // console.log("done,  current blog is user blog")
          currentblogowner = currentblogownerid;
        }
       else{
         console.log("exits not user blog")

       }
       
   
     
       //  console.log( "result : " ,  currentblogowner)
   
   
      
       return res.render("blog" ,{
         user : req.user,
         blog : currentblog,
         comments : comments,
         currentblogowner,
        //  currentblogcommentowner
        // currentusercomments
        // result
        currentusercomments

       })
 
    
    
     
    })
  
 
 //handle comment routes
  //////////////////all about of comment opretion.//////////

  //update comment 


  //deleted user blogs comment only owner of blog///
// find user and owener of blog 

router.get("/delete/comment/:Id" , async(req , res) =>{
  try {
    console.log(" current comment id: " , req.params.Id);
    const currentblog = await comment.findById(req.params.Id);
    // console.log("current blog : " ,currentblog.blogid)
    const currentblogid = currentblog.blogid;//comment vrun current blog bhrtla
    await comment.deleteOne({
      _id :  req.params.Id
    })
  
  
    console.log("deleting successfully......")
    // render same page on BlogId requied..
  
     return res.redirect(`/blog/${currentblogid}`)
  } catch (error) {

    return res.redirect(`/blog/${currentblogid}`)
    
  }

} )


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

        return res.redirect("/",);

    } catch (error) {
      console.log("error" , error)
      return res.render("addblog" ,{
        user : req.user,
        error : "Add blog error"
       });
      
    }

  });


  export default router