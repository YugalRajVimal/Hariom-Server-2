import "dotenv/config";
import express from "express";
import apiRouter from "./routes.js";
import bodyParser from "body-parser";
import authRouter from "./authRoutes.js";
import { connectUsingMongoose } from "./config/mongoose.config.js";
import cors from "cors";
import path from "path";



const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Mount API & Auth routes
app.use("/api", apiRouter);
app.use("/auth", authRouter);

app.use("/api/uploads", express.static(path.join("uploads")));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  connectUsingMongoose();
});
