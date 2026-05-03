import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";

export const findUser = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw createHttpError.BadRequest("User not found.");
  return user;
};
