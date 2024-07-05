import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Vedio",
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    RrefreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// pre middleware
User.pre("save", async function (next) {
  this.password = bcrypt.hash(this.password, 10);
  next();
});

export const Usermodel = mongoose.model("User", userSchema);
