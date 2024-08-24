import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
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
    // unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  phone: {
    type: String,
    required: true,
    // unique: true,
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
  appointment_date: {
    type: String,
    required: true,
  },
  departemnt: {
    type: String,
    // required: true,
  },
  doctor: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  hasVisited: {
    type: Boolean,
    default:false
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
// export default Appointment;
