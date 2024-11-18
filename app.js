import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Convert __dirname to work in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
// mongoose connect (removed deprecated options)
mongoose.connect("mongodb://127.0.0.1:27017/students");

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connection successful");
});

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  work_email: String,
  password: String,
  organization_name: String,
  organization_size: String,
  industry: String,
});

const Users = mongoose.model("data", userSchema);

// Serve static files
app.use(express.static(__dirname));

// Route to serve form.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "form.html"));
});

//
app.post("/post", async (req, res) => {
  const {
    first_name,
    last_name,
    work_email,
    password,
    organization_name,
    organization_size,
    industry,
  } = req.body;
  const user = new Users({
    first_name,
    last_name,
    work_email,
    password,
    organization_name,
    organization_size,
    industry,
  });
  await user.save();
  console.log(user);
  res.send("from Submission Successful");
});

// Handle form submission
app.post("/", express.json(), (req, res) => {
  const formData = req.body;
  console.log("Form Data Received:", formData);
  res.send("Form submission successful! Check your console for details.");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
