import express from 'express'
import {patientRegister , login , addNewAdmin, getAllDoctors, getUserDetails , logoutAdmin , logoutPatient, addNewDoctor} from '../Controller/userController.js'
import { isAdminAuthenticated, isPatientAuthenticated } from "../middleware/auth.js"


const Router = express.Router()

Router.post("/patient/registered",patientRegister)
Router.post("/doctor/addnew",isAdminAuthenticated , addNewDoctor)
Router.post("/admin/addnew",isAdminAuthenticated , addNewAdmin)
Router.post("/login",login)
Router.get("/doctors", getAllDoctors)
Router.get("/admin/me", isAdminAuthenticated , getUserDetails)
Router.get("/patient/me", isPatientAuthenticated , getUserDetails)
Router.get("/admin/logout", isAdminAuthenticated , logoutAdmin)
Router.get("/patient/logout", isPatientAuthenticated , logoutPatient)
export default Router;