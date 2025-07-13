const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
const PORT = 3000;

// Public klasörü (statik dosyalar için)
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Giriş sayfası
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Giriş işlemi
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.LOGIN_USERNAME;
  const validPassword = process.env.LOGIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    res.redirect("/main.html"); // Başarılıysa anasayfa
  } else {
    res.send(`<h2 style="color:red;">Hatalı kullanıcı adı veya şifre!</h2><a href="/">Geri dön</a>`);
  }
});

// Ana sayfa (main.html)
app.get("/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
