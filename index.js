const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();

// Public klasörü ayarı
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Giriş sayfası
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Giriş işlemi
app.post("/login", (req, res) => {
    const enteredPassword = req.body.password;

    if (enteredPassword === process.env.LOGIN_PASSWORD) {
        res.send("<h2>Giriş başarılı!</h2> <a href='/'>Anasayfa</a>");
    } else {
        res.send("<h2 style='color:red'>Hatalı şifre!</h2> <a href='/'>Tekrar dene</a>");
    }
});

// Ürün rotaları
app.get("/products/:id", (req, res) => {
    res.send("products details: " + req.params.id);
});
app.get("/products", (req, res) => {
    res.send("products");
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});
