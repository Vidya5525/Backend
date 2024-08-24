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

// Initialize Express app
const app = express();

// Load environment variables from .env file
config({ path: "./config/.env" });

// Define allowed origins
const allowedOrigins = [process.env.FRONTEND_URL];

// CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) { // Allow requests without an origin (e.g., Postman or server-side requests)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true
}));

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Route handlers
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", AppointmentRouter);

// Connect to the database
dbconnection();

// Error handling middleware
app.use(errorMiddleware);

export default app;
