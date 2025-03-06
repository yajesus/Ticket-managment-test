require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./model/userSchema.js"); // Adjust path based on your project structure

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10); // Hash the password

  const admin = new User({
    username: "admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date(),
  });

  await admin.save();
  console.log("Admin user created successfully!");
  mongoose.connection.close();
};

createAdmin().catch(console.error);
