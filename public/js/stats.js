fetch("/api/friends")
  .then(res => res.json())
  .then(data => {
    const averages = [];

    data.forEach(person => {
      const scores = (person.friends || "").split("|").map(pair => {
        const val = parseInt(pair.split(":")[1]);
        return isNaN(val) ? 0 : val;
      }).filter(num => num > 0);

      const avg = scores.length > 0
        ? (scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

      averages.push({
        name: person.name,
        average: avg
      });
    });

    // 🔝 En yüksek ortalamalı kişi
    const sorted = averages.sort((a, b) => b.average - a.average);
    document.getElementById("mostSocial").textContent = sorted[0]?.name || "Veri bulunamadı";

    // 📋 Listele
    const ul = document.getElementById("rankingList");
    sorted.forEach(p => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `<strong>${p.name}</strong><span class="badge bg-primary rounded-pill">${p.average.toFixed(2)}</span>`;
      ul.appendChild(li);
    });
  })
  .catch(err => {
    console.error("Veri okunamadı:", err);
    document.getElementById("mostSocial").textContent = "Veri hatası";
  });
