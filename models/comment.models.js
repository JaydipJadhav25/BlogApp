import mongoose, { Schema } from "mongoose";

const commentschema = new Schema({
    content :{
        type:String,
        required :true
    },
    blogid: {
        type :Schema.Types.ObjectId,
        ref : "Blog"
    },
    createdby: {
        type :Schema.Types.ObjectId,
        ref : "User"
    },

},{
    timestamps :true
})

export const comment = mongoose.model("comment" , commentschema)