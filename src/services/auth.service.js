import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
  const { name, email, picture, password, status } = userData;

  // check if the fields are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields");
  }
  // check name lenth
  if (
    !validator.isLength(name, {
      min: 2,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please provide name characters between 2 to 16",
    );
  }
  //  check status length
  if (status) {
    if (status?.length > 32)
      throw createHttpError.BadRequest(
        "Please make sure sttaus length is less then 32 characters",
      );
  }
  // check if email is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Please provide valid email address");
  }
  // check if user already exists
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.BadRequest(
      "This email is already exists, please try with another email",
    );
  }
  // check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      "Please make sure your password is atleast 6 characters",
    );
  }

  // create new user and store in the database
  const user = await new UserModel({
    name,
    email,
    password,
    picture,
    status,
    password,
  }).save();
  return user;
};

export const signInUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email });
  //  check if user exists
  if (!user) throw createHttpError.NotFound("Invalid credentials.");
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw createHttpError.NotFound("Invalid credentials.");

  return user;
};
