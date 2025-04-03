import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","owner","admin"],
        default:"user"
    }, isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
},{timestamps:true}
)

const User = mongoose.model("User",userSchema);
export {User};