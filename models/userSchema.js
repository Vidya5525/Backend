import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [3, "minimum 3 characters are required"],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [3, "minimum 3 characters are required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: [10, "Please Enter a valid Number of 10 Digits"],
    maxlength: [10, "Please Enter a valid Number of 10 Digits"],
  },
  aadharNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: [12, "Please Enter a valid Number of 12 Digits"],
    maxlength: [12, "Please Enter a valid Number of 12 Digits"],
  },
  dob: {
    type: Date,
    require: [true, "DOB is Required"],
  },
  gender: {
    type: String,
    require: true,
    enum: ["MALE", "FEMALE", "OTHERS"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must contain atleast 8 characters"],
    select: false,
  },
  role: {
    type: String,
    require: true,
    enum: ["Admin", "Patient", "Doctor"],
  },
  doctorDepartment: {
    type: String,
  },
  doctorAvatar: {
    Public_Id: String,
    url: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.compareUserPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword , this.password );
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

 const User = mongoose.model("User", userSchema);
export default User;
