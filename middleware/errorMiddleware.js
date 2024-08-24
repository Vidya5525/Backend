export class errorhandler extends Error {
  constructor(message, statusCode) {
    super(message), (this.statusCode = statusCode);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.statusCode === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new errorhandler(message, 400);
  }
  if (err.name == "JsonWebTokenError") {
    const message = "Json web Token is invalid , Try Again";
  }
  if (err.name === "TokenExpiredError") {
    const message = "Json web Token is Expired , Try Again";
    err = new errorhandler(message, 400);
  }
  if (err.name === "castError") {
    const message = `Invalid${err.path}`;
    err = new errorhandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((err) => err.message)
        .join(" || ")
    : err.message;
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};
