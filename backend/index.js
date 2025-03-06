require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sanitize = require("express-mongo-sanitize");
const userRouter = require("./routes/Userroutes.js");
const ticketsRouter = require("./routes/Ticketsroute.js");
const authRouter = require("./routes/authRoutes.js");
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://ticketmanag.onrender.com",
    credentials: true,
  })
);
//routes
app.use("/api/user", userRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/auth", authRouter);
app.use(sanitize());
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
