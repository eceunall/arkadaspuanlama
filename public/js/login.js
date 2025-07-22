const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 3000;


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


app.get("/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

// Login işlemi
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.LOGIN_USERNAME;
  const validPassword = process.env.LOGIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
