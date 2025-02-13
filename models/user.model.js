import mongoose from "mongoose";
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username must be provided"],
    },
    firstname: {
      type: String,
      required: [true, "Firstname is required"],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: true,
      maxlength: [16, "Password is atmost 16 characters"],
      minlength: [8, "Password is 8 atleast 8 characters"],
    },
  },
);

// hash password before saving 
UserSchema.pre("save", async function(next) {
  if (!this.password) {
    return
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// compare password schema method 
UserSchema.methods.comparePassword = (password) => {
  const isMatch = bcrypt.compare(this.password, password);
  return isMatch;
}

export const User = mongoose.model("User", UserSchema);

