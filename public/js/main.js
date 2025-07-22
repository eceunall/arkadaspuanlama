document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleFriends");
  const friendList = document.getElementById("friendList");
  const arrowIcon = document.getElementById("arrowIcon");

  if (toggleBtn && friendList && arrowIcon) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = friendList.classList.contains("show");

     
      friendList.classList.toggle("show");

      
      arrowIcon.classList.toggle("fa-chevron-down", isOpen);
      arrowIcon.classList.toggle("fa-chevron-up", !isOpen);

   
      if (!isOpen && friendList.children.length <= 1) {
        fetch("/api/friends")
          .then(res => res.json())
          .then(data => {
            const admin = data.find(f => f.name.toLowerCase().includes("ece"));
            if (!admin || !admin.friends) return;

            const pairs = admin.friends.split("|");
            pairs.forEach(pair => {
              const [name, score] = pair.split(":");
              const col = document.createElement("div");
              col.className = "col-6";

              col.innerHTML = `
                <div class="card bg-light text-dark text-center shadow-sm">
                  <div class="card-body p-2">
                    <h6 class="card-title mb-1">${name.toUpperCase()}</h6>
                    <small>${score}/10</small>
                  </div>
                </div>
              `;
              friendList.appendChild(col);
            });
          });
      }
    });
  }
});
