const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Login sayfası
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Ana sayfa (başarılı girişten sonra)
app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

// Login işlemi
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.LOGIN_USERNAME;
  const validPassword = process.env.LOGIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    res.redirect("/main");
  } else {
    res.send(`
      <h2 style="color:red;">Kullanıcı adı veya şifre hatalı!</h2>
      <a href="/">Tekrar dene</a>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
