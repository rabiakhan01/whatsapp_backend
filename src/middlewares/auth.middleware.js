import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(createHttpError.Unauthorized());
  }
  const bearerToken = authHeader.split(" ")[1];
  jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createHttpError.Unauthorized());
    } else {
      req.user = payload;
      next();
    }
  });
};

export default authMiddleware;