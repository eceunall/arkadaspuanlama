const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const csv = require("csv-parser");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
const PORT = 3000;

const csvPath = path.join(__dirname, "public", "data", "friends.csv");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Giriş sayfası
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.LOGIN_USERNAME;
  const validPassword = process.env.LOGIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    res.redirect("/main.html");
  } else {
    res.send(`<h2 style="color:red;">Hatalı kullanıcı adı veya şifre!</h2><a href="/">Geri dön</a>`);
  }
});

// ✅ API: Tüm arkadaşları getir
app.get("/api/friends", (req, res) => {
  const results = [];
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => res.json(results))
    .on("error", (err) => {
      console.error("CSV okuma hatası:", err);
      res.status(500).json({ error: "Veriler yüklenemedi" });
    });
});

// ✅ API: Yeni arkadaş ekle (Test uyumlu)
app.post("/api/add-friend", (req, res) => {
  const { name, email, phone, friends } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: "Zorunlu alanlar eksik" });
  }

  // E-posta format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Geçersiz e-posta formatı" });
  }

  // Puan kontrolleri
  if (friends) {
    const score = Number(friends);
    if (isNaN(score)) {
      return res.status(400).json({ success: false, message: "Puan sayı olmalı" });
    }
    if (score < 0 || score > 10) {
      return res.status(400).json({ success: false, message: "Puan 0 ile 10 arasında olmalı" });
    }
  }

  const fileContent = fs.readFileSync(csvPath, "utf-8").trim();
  const lines = fileContent.split("\n");
  const existingData = lines.slice(1);

  let maxId = 0;
  existingData.forEach(line => {
    const id = parseInt(line.split(",")[0]);
    if (!isNaN(id) && id > maxId) maxId = id;
  });

  const newId = maxId + 1;
  const newLine = `${newId},${name},${email},${phone},"${friends || ""}"`;

  fs.appendFile(csvPath, "\n" + newLine, (err) => {
    if (err) {
      console.error("CSV yazma hatası:", err);
      return res.status(500).json({ success: false, message: "Dosyaya yazılamadı" });
    }
    res.json({ success: true });
  });
});

// ✅ API: Arkadaş sil
app.delete("/api/friends/:id", (req, res) => {
  const targetId = req.params.id;
  const lines = fs.readFileSync(csvPath, "utf-8").trim().split("\n");

  const headers = lines[0];
  const filtered = lines.filter(line => !line.startsWith(targetId + ","));

  if (filtered.length === lines.length) {
    return res.status(404).json({ success: false, message: "Kişi bulunamadı" });
  }

  fs.writeFile(csvPath, filtered.join("\n") + "\n", err => {
    if (err) {
      console.error("Silme hatası:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// ✅ API: Arkadaş güncelle
app.put("/api/friends/:id", (req, res) => {
  const { name, email, phone, friends } = req.body;
  const targetId = req.params.id;

  const raw = fs.readFileSync(csvPath, "utf-8").trim();
  const lines = raw.split("\n");
  const headers = lines[0];
  const updatedLines = [headers];
  let found = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!parts || parts.length < 5) continue;

    const id = parts[0];

    if (id === targetId) {
      updatedLines.push(`${id},${name},${email},${phone},"${friends || ""}"`);
      found = true;
    } else {
      updatedLines.push(line);
    }
  }

  if (!found) {
    return res.status(404).json({ success: false, message: "Kişi bulunamadı" });
  }

  fs.writeFile(csvPath, updatedLines.join("\n") + "\n", err => {
    if (err) {
      console.error("Güncelleme hatası:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// Sunucu başlat (test uyumlu)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  });
}

module.exports = app;
