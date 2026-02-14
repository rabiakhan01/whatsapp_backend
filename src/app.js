import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import fileUpload from "express-fileupload";
// import mongoSanitize from "express-mongo-sanitize";
import createHttpError from "http-errors";
import helmet from "helmet";
import routes from "./routes/index.js";

const app = express();
dotenv.config();
// Morging middleware for logging HTTP requests in development mode
app.use(morgan("dev"));

// helmet for setting various HTTP headers for app security
app.use(helmet());

// express json middleware to parse JSON request bodies
app.use(express.json());

// express sanitizer to prevent NoSQL injection attacks
// app.use(mongoSanitize());

// cookie parser middleware to parse cookies from incoming requests
app.use(cookieParser());

// compression middleware to gzip responses for better performance
app.use(compression());

// File upload middleware to handle file uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  }),
);

// Enable CORS for all routes
app.use(cors());

app.use("/api/v1", routes);

app.use((req, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const handleUnexpectedError = (error) => {
  console.log("🚀 ~ handleUnexpectedError ~ error:", error);
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", handleUnexpectedError);
process.on("unhandledRejection", handleUnexpectedError);

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  exitHandler();
});

export default app;
