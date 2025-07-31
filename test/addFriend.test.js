const fs = require("fs");
const path = require("path");
const request = require("supertest");
const app = require("../index");

const csvPath = path.join(__dirname, "../public/data/friends.csv");

describe("Yeni arkadaş eklendiğinde CSV güncellenmeli", () => {
  let newId = null;

  it("✅ Yeni arkadaş eklendiğinde satır sayısı artmalı", async () => {
    const before = fs.readFileSync(csvPath, "utf-8").trim().split("\n").length;

    const newFriend = {
      name: "Test Eklendi",
      email: "testekle@example.com",
      phone: "1112223333",
      friends: "7"
    };

    const res = await request(app)
      .post("/api/add-friend")
      .send(newFriend)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const afterLines = fs.readFileSync(csvPath, "utf-8").trim().split("\n");
    expect(afterLines.length).toBe(before + 1);

    const lastLine = afterLines[afterLines.length - 1];
    newId = lastLine.split(",")[0]; // ID'yi kaydet (silmek için)
    expect(lastLine).toContain("Test Eklendi");
  });

  it("🧹 Eklenen test verisi temizlenmeli (DELETE)", async () => {
    if (!newId) return;

    const res = await request(app).delete(`/api/friends/${newId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const finalLines = fs.readFileSync(csvPath, "utf-8").trim().split("\n");
    const stillThere = finalLines.find(line => line.startsWith(newId + ","));
    expect(stillThere).toBeUndefined();
  });
});

  it("❌ Eksik bilgiyle ekleme yapılamamalı", async () => {
    const badFriend = {
      name: "",
      email: "",
      phone: "",
    };

    const res = await request(app)
      .post("/api/add-friend")
      .send(badFriend)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/eksik/i);
  });


    it("❌ Geçersiz e-posta ile kayıt yapılmamalı", async () => {
    const res = await request(app)
      .post("/api/add-friend")
      .send({
        name: "Eposta Testi",
        email: "bozukemail", // ❌ yanlış
        phone: "1234567890",
        friends: "5"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/e-posta/i);
  });

  it("❌ Puan alanı sayı değilse hata dönmeli", async () => {
    const res = await request(app)
      .post("/api/add-friend")
      .send({
        name: "Puan Test",
        email: "puan@example.com",
        phone: "1234567890",
        friends: "beş" // ❌ sayı değil
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/sayı/i);
  });

  it("❌ Puan 0-10 dışındaysa hata dönmeli", async () => {
    const res = await request(app)
      .post("/api/add-friend")
      .send({
        name: "Puan Test",
        email: "puan@example.com",
        phone: "1234567890",
        friends: "15" // ❌ geçersiz
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/puan.*arasında/i);
  });
