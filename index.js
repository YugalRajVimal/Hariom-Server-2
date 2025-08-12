import "dotenv/config";
import express from "express";
import apiRouter from "./routes.js";
import bodyParser from "body-parser";
import authRouter from "./authRoutes.js";
import { connectUsingMongoose } from "./config/mongoose.config.js";
import cors from "cors";
import path from "path";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const emptyFolder = (folderName) => (req, res, next) => {
  const dirPath = `public/${folderName}`;
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      if (file !== ".gitkeep") {
        fs.unlinkSync(`${dirPath}/${file}`);
      }
    });
  }
  next();
};

const createMulterUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `public/${folderName}`),
    filename: (req, file, cb) => cb(null, file.originalname),
  });
  return multer({ storage });
};

app.use("/invoices", express.static("public/invoices"));
app.use("/releaseOrders", express.static("public/releaseOrders"));
app.use("/quotations", express.static("public/quotations"));

app.post(
  "/upload-invoice",
  emptyFolder("invoices"),
  createMulterUpload("invoices").single("file"),
  (req, res) => res.json({ fileName: req.file.filename })
);

app.post(
  "/upload-release-order",
  emptyFolder("releaseOrders"),
  createMulterUpload("releaseOrders").single("file"),
  (req, res) => res.json({ fileName: req.file.filename })
);

app.post(
  "/upload-quotation",
  emptyFolder("quotations"),
  createMulterUpload("quotations").single("file"),
  (req, res) => res.json({ fileName: req.file.filename })
);

app.get("/:type(invoice|release-order|quotation)/:fileName", (req, res) => {
  const { type, fileName } = req.params;
  const folderMap = {
    invoice: "invoices",
    "release-order": "releaseOrders",
    quotation: "quotations",
  };

  const dir = folderMap[type];
  const filePath = path.join(__dirname, "public", dir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found.");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
  res.sendFile(filePath);
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
