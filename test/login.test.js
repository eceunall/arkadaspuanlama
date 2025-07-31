const request = require("supertest");
const app = require("../index");

describe("Login Sistemi Testleri", () => {
  it("✅ Doğru bilgilerle giriş yönlendirme yapmalı", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        username: process.env.LOGIN_USERNAME,
        password: process.env.LOGIN_PASSWORD,
      });

    // 302 yönlendirme bekleniyor
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/main.html");
  });

  it("❌ Hatalı bilgilerle giriş başarısız olmalı", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        username: "yanlis",
        password: "bilgi",
      });

    expect(res.statusCode).toBe(200); // çünkü HTML mesaj dönüyor
    expect(res.text).toMatch(/Hatalı kullanıcı adı veya şifre/);
  });
});
