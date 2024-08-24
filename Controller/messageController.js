import { Message } from "../models/messageSchema.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { errorhandler } from "../middleware/errorMiddleware.js";
export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !phone || !message) {
    // return res.status(400).json({
    //     status:false,
    //     message:"Please fill full form"
    // });
    return next(new errorhandler("Please fill full form ", 400));
  }
  await Message.create({ firstName, lastName, email, phone, message });
  res.status(200).json({
    status: true,
    message: "Message sent Successfully ",
  });
});

export const getAllMessages = catchAsyncError(async(req , res , next)=>{
  const messages = await Message.find();
  res.status(200).json({
    status: true,
    messages
  });
})