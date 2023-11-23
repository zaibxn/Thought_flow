import express from "express";
import dotenv from "dotenv";
import authRoutes from "../auth/routes/auth.js";
import userRoutes from "../user/routes/user.js";
import connectdb from "./dbconfig.js";
import cors from "cors";
import blogPostRoutes from "../posts/routes/Post.js"

dotenv.config();
connectdb();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", blogPostRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
