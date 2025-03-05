const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true
       },
  email: { 
        type: String,
        required: true,
        unique: true 
        },
  password: {
        type: String,
        required: true 
        },
});

// Hash or Hashing  Password before saving tha password not visible in normal password they get  encrypted format 
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password"))
  return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// password of your login and the database saved password get compare while login then their is the formation of token after endup in  login 
UserSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};//use normal function not the arrow function

module.exports = mongoose.model("User", UserSchema);
