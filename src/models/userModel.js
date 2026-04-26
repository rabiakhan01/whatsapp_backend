import mongoose from "mongoose";
import validator from "validator";
import bcrypt, { hash } from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide you email"],
      unique: [true, "This email is already exists"],
      validate: [validator.isEmail, "Please provide valid email"],
    },
    picture: {
      type: String,
    },
    status: {
      type: String,
      default: "Hey there! I am using whatsapp",
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: [
        6,
        "Please make sure your passwored is atleast 6 characters long ",
      ],
    },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
  } catch (error) {
    throw error;
  }
});

const UserModel =
  mongoose.models.userModel || mongoose.model("UserModel", userSchema);

export default UserModel;
