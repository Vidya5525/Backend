import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbconnection from "./Database/database.connect.js";
import messageRouter from './Router/messageRouter.js';
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import userRouter from "./Router/userRouter.js";
import AppointmentRouter from "./Router/appointmentRouter.js";

const app = express();
config({ path: "./config/.env" });

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL, // Using FRONTEND_URL from .env
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", AppointmentRouter);

dbconnection();

app.use(errorMiddleware);

export default app;
