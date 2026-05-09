import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export default authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    next(createHttpError.Unauthorized());
  }
  const bearerToken = authHeader.split(" ")[1];
  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      next(createHttpError.Unauthorized());
    } else {
      req.user = payload;
      next();
    }
  });
};
