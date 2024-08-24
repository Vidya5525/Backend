import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { errorhandler } from "../middleware/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import User from "../models/userSchema.js";



export const postAppointment = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    aadharNumber,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !aadharNumber ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new errorhandler("Please Fill Full Form!", 400));
  }
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new errorhandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new errorhandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    aadharNumber,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    status: true,
    message: "Appointment sent Successfully ",
    appointment,
  });
});


export const getAllAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    status: true,
    appointments,
  });
});

export const updateAppointment = catchAsyncError(async (req, res, next) => {
  const {id} = req.params;
  let appointments = await Appointment.findById(id);
  if (!appointments) {
    return next(new errorhandler("Appointment not found", 404));
  }
  appointments = await Appointment.findByIdAndUpdate(id , req.body,{
    new :true , 
    runValidator:true,
    useFindAndModify:true
   })
  res.status(200).json({
    status: true,
    message:"Appointment Status Updated Successfully ",
    appointments,
  });
});

export const deleteAppointment = catchAsyncError(async(req , res , next)=>{
    const{id} = req.params;
    let appointment = await Appointment.findById(id)
    if(!appointment){
        return next(new errorhandler("Appointment not found", 404));
    }
    await Appointment.deleteOne();
    res.status(200).json({
        status: true,
        message:"Appointment Deleted Successfully ",
        appointment,
      });
})