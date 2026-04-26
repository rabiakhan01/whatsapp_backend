import { createUser } from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js";

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
      { userId: newUser?.i_id },
      "1d",
      process.env.ACCESS_TOKEN_SECRET,
    );
    const refresh_token = await generateToken(
      { userId: newUser?.i_id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET,
    );
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000,
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
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
