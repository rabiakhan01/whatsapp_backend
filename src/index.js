import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// Mongodb server error handling

mongoose.connection.on("error", (error) => {
  console.log("Mongodb connection error: ", error);
  process.exit(1);
});
// Mongoose Connection
mongoose.connect(DATABASE_URL).then(() => {
  console.log("Connected to MongoDB");
});

const server = app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

// Mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// unexpected error handling
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
  exitHandler();
};

process.on("uncaughtException", handleUnexpectedError);
process.on("unhandledRejection", handleUnexpectedError);

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  exitHandler();
});
