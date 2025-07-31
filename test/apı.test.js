const request = require("supertest");
const express = require("express");
const app = require("../index");

describe("Arkadaş API Testleri", () => {
  it("GET /api/friends -> tüm arkadaşları döner", async () => {
    const response = await request(app).get("/api/friends");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("POST /api/add-friend -> yeni arkadaş ekler", async () => {
    const newFriend = {
      name: "Test Kullanıcı",
      email: "test@example.com",
      phone: "1234567890",
      friends: "7"
    };
    const response = await request(app)
      .post("/api/add-friend")
      .send(newFriend)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("PUT /api/friends/:id -> arkadaş bilgilerini günceller", async () => {
    const update = {
      name: "Güncel Ad",
      email: "guncel@example.com",
      phone: "9999999999",
      friends: "1"
    };
    const response = await request(app)
      .put("/api/friends/1") // ID 1 varsa başarılı olur
      .send(update)
      .set("Accept", "application/json");

    expect([200, 404]).toContain(response.statusCode);
  });

  it("DELETE /api/friends/:id -> arkadaş siler", async () => {
    const response = await request(app).delete("/api/friends/1"); // ID 1 varsa silinir
    expect([200, 404]).toContain(response.statusCode);
  });
});


describe("❌ Geçersiz ID ile işlemler", () => {
  it("PUT /api/friends/99999 → kişi yoksa 404 dönmeli", async () => {
    const res = await request(app)
      .put("/api/friends/99999")
      .send({
        name: "Yok Kullanıcı",
        email: "yok@example.com",
        phone: "0000000000",
        friends: ""
      })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/bulunamadı/);
  });

  it("DELETE /api/friends/99999 → kişi yoksa 404 dönmeli", async () => {
    const res = await request(app).delete("/api/friends/99999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/bulunamadı/);
  });
});
