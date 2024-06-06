import mongoose from "mongoose";
import {createHmac , randomBytes} from "node:crypto"
import { settokenuser } from "../services/token.services.js";

const userschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      salt: {
        type: String,
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: "http://res.cloudinary.com/mudemoenv/image/upload/v1717647155/jxrnu4ugkcbt8agrkkaz.png",
      },
      role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
      },
    },
    { timestamps: true }
)

userschema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    console.log("hashed password : " , hashedPassword)

  this.salt = salt;
  this.password = hashedPassword;

  next();
});


userschema.static("matchPasswordAndGenerateToken",async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");

    const token = settokenuser(user);

    return token;
  }
);


export const User = mongoose.model("User" , userschema);