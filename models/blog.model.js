import mongoose, { Schema } from "mongoose";


const blogschema = new mongoose.Schema({
    title :{
      type: String,
      required :true  
    },
    body :{
        type: String,
        required :true 
    },
    coverimage :{
        type: String,
        required :false
    },
    owner :{
       type : Schema.Types.ObjectId,
       ref : "User" 
    }
},{
    timestamps :true
})


export const Blog = mongoose.model("Blog" , blogschema)