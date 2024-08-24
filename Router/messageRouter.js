import express from 'express'
import {sendMessage , getAllMessages} from '../Controller/messageController.js'
import {isAdminAuthenticated} from "../middleware/auth.js"


const Router = express.Router()

Router.post("/send",sendMessage)
Router.get("/getAllMessages", isAdminAuthenticated , getAllMessages)

export default Router;