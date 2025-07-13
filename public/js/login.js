const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
const PORT = 3000;

// Statik dosyaları servis et
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Giriş sayfası
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Ana sayfa (giriş sonrası yönlendirme buraya olur)
app.get("/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

// Login işlemi
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.LOGIN_USERNAME;
  const validPassword = process.env.LOGIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    // Giriş başarılıysa main.html sayfasına yönlendir
    res.redirect("/main.html");
  } else {
    res.send(`
      <h2 style="color:red;">Kullanıcı adı veya şifre hatalı!</h2>
      <a href="/">Tekrar dene</a>
    `);
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
