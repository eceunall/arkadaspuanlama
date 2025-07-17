document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("list.html")) return;

  fetch("/api/friends")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("friendList");
      container.innerHTML = "";

      data.forEach(friend => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        const photoPath = `/images/${friend.photo?.trim() || 'avatar.png'}`;

        const card = `
          <div class="admin-card p-3 text-center">
            <img src="${photoPath}" alt="avatar" style="width: 60px; border-radius: 50%;" class="mb-2">
            <h5>${friend.name}</h5>
            <p>${friend.email}</p>
            <p>${friend.phone}</p>
          </div>
        `;

        col.innerHTML = card;
        container.appendChild(col);
      });
    })
    .catch(err => console.error("Arkadaşlar yüklenemedi:", err));
});
