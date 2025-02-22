const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `photo-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Upload Image API
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `/${req.file.filename}` });
});

// Get Uploaded Images API
app.get("/images", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading uploads" });
    }
    res.json(files.map(file => ({ url: `/${file}` })));
  });
});

// Leave a Message API
app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("Incoming message:", {name, email, message});

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: `New Message from ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent::", info.response);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
});

console.log("Loaded Email:", process.env.EMAIL);
console.log("Loaded App Password:", process.env.EMAIL_PASS ? "Loaded Successfully" : "Not Loaded");


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
