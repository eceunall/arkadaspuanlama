const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const rootDir = path.resolve(__dirname, "..");
const csvFilePath = path.join(rootDir, "public", "data", "friends.csv");


// CSV okuma fonksiyonu
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

describe("CSV Testleri", () => {
  test("✅ friends.csv dosyası mevcut olmalı", () => {
    const exists = fs.existsSync(csvFilePath);
    expect(exists).toBe(true);
  });

  test("✅ CSV içeriği en az 1 kişi içermeli", async () => {
    const data = await readCSV(csvFilePath);
    expect(data.length).toBeGreaterThan(0);
  }, 10000); // zaman aşımı 10 saniye

  test("✅ CSV içeriğinde name, email ve phone alanları olmalı", async () => {
    const data = await readCSV(csvFilePath);
    expect(data[0]).toHaveProperty("name");
    expect(data[0]).toHaveProperty("email");
    expect(data[0]).toHaveProperty("phone");
  }, 10000);
});
