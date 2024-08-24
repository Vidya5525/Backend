import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:[3 , "minimum 3 characters are required"]
    },
    lastName:{
        type:String,
        required:true,
        minlength:[3 , "minimum 3 characters are required"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    phone:{
        type:String,
        required:true,
        minlength:[10 , "Please Enter a valid Number of 10 Digits"],
        maxlength:[10 ,"Please Enter a valid Number of 10 Digits"]
    },
    message:{
        type:String , 
        required:true,
        minlength:[10 , "Message Contains Atleast 10 Characters"],
    }
} )

export const Message = mongoose.model("Message" ,messageSchema )