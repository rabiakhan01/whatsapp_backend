import createHttpError from "http-errors";
import { createUser, signInUser } from "../services/auth.service.js";
import { generateToken, verifyToken } from "../services/token.service.js";
import { findUser } from "../services/user.service.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, picture, password, status } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      password,
      status,
    });
    const access_token = await generateToken(
      { userId: newUser?._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET,
    );
    const refresh_token = await generateToken(
      { userId: newUser?._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET,
    );
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });
    res.json({
      message: "User created successfully",
      access_token: access_token,
      user: {
        _id: newUser?._id,
        name: newUser?.name,
        email: newUser?.email,
        picture: newUser?.picture,
        status: newUser?.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await signInUser(email, password);
    const access_token = await generateToken(
      { userId: user?._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET,
    );
    const refresh_token = await generateToken(
      { userId: user?._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET,
    );
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax", // or "none" if cross-origin
      secure: false, // true only with HTTPS
    });
    res.json({
      message: "User loggedin successfully",
      access_token: access_token,
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        status: user?.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: "/" });
    res.json({
      message: "User logout successfully.",
    });
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshtoken;
    if (!refresh_token) throw createHttpError.Unauthorized("Please login.");
    const check = await verifyToken(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await findUser(check?.userId);
    if (!user) throw createHttpError.Unauthorized("User not found.");
    const access_token = await generateToken(
      { userId: user?._id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET,
    );
    res.json({
      access_token: access_token,
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        status: user?.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
