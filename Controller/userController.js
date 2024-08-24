import { json } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { errorhandler } from "../middleware/errorMiddleware.js";
import User from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    aadharNumber,
    dob,
    gender,
    password
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !aadharNumber ||
    !dob ||
    !gender ||
    !password 
  ) {
    // return res.status(400).json({
    //     status:false,
    //     message:"Please fill full form"
    // });
    return next(new errorhandler("Please fill full form ", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new errorhandler("User Already Resgisted ", 400));
  }
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    aadharNumber,
    dob,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "User Registerd Successfully", 200, res);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new errorhandler("Please Provide All  Details !", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new errorhandler("Password and Confirm Password do not matched!", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorhandler("User not found !", 400));
  }

  const isPasswordMatched = await user.compareUserPassword(password);
  if (!isPasswordMatched) {
    return next(new errorhandler("Invalid  Password !", 400));
  }
  if (role !== user.role) {
    return next(new errorhandler("User with this Role not found !", 400));
  }
  generateToken(user, `${user.role} Logged In Successfully`, 200, res);
});

export const addNewAdmin = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    aadharNumber,
    dob,
    gender,
    password,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !aadharNumber ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new errorhandler("Please fill full form ", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new errorhandler(
        `${isRegistered.role} with This Email is ALready Resgistered !`,
        400
      )
    );
  }
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    aadharNumber,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin Resgistered Successfully",
  });
});

export const getAllDoctors = catchAsyncError(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// admin logout

export const logoutAdmin = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully !",
    });
});

// patient logout

export const logoutPatient = catchAsyncError(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully !",
    });
});

export const addNewDoctor = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorhandler("Doctor Avatar is Required !", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new email("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    aadharNumber,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !aadharNumber ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment
  ) {
    return next(new errorhandler("Please Provide Full Details", 400));
  }
  const isRegisterd = await User.findOne({ email });
  if (isRegisterd) {
    return next(
      new errorhandler(
        `${isRegisterd.role} is Already Registered with this Email`,
        400
      )
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      `Cloudinary Error ${cloudinaryResponse.error} ` ||
        "Unknown Cloudinary Error"
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    aadharNumber,
    dob,
    gender,
    password,
    doctorDepartment,
    role:"Doctor",
    doctorAvatar:{
      Public_Id:cloudinaryResponse.Public_Id ,
      url : cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Resgistered Successfully",
    doctor
  });
});
