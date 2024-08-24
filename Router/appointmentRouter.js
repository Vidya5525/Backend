import express from 'express'
import { postAppointment , getAllAppointments , updateAppointment , deleteAppointment } from '../Controller/appintmentController.js';
import {isAdminAuthenticated,isPatientAuthenticated} from "../middleware/auth.js"

const Router = express.Router()

Router.post("/post" ,isPatientAuthenticated, postAppointment )
Router.get("/getallappointment" ,isAdminAuthenticated, getAllAppointments )
Router.put("/update/:id" ,isAdminAuthenticated, updateAppointment )
Router.delete("/update/:id" ,isAdminAuthenticated, deleteAppointment )
export default Router;