const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 3000;

// Statik dosyaları servis et
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Giriş sayfası
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Ana sayfa
app.get("/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

// Login işlemi (JSON yanıt döner)
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

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
