const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true } // 🔥 Biar updatedAt berubah saat password diganti
);

module.exports = mongoose.model("User", userSchema);
