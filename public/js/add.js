document.getElementById("addFriendForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  
  const friendNames = formData.getAll("friendNames[]");
  const friendScores = formData.getAll("friendScores[]");

  let friendsFormatted = [];

  for (let i = 0; i < friendNames.length; i++) {
    if (friendNames[i] && friendScores[i]) {
      friendsFormatted.push(`${friendNames[i]}:${friendScores[i]}`);
    }
  }

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    friends: friendsFormatted.join("|")
  };

  const response = await fetch("/api/add-friend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  const successMsg = document.getElementById("addSuccess");

  if (result.success) {
    successMsg.classList.remove("d-none");
    successMsg.textContent = "✅ Arkadaş başarıyla eklendi!";
    form.reset();
  } else {
    alert("Ekleme başarısız: " + result.message);
  }
});

function addFriendField() {
  const area = document.getElementById('friendListArea');
  const field = document.createElement('div');
  field.className = "input-group mb-2";
  field.innerHTML = `
    <input type="text" name="friendNames[]" class="form-control" placeholder="Arkadaş Adı">
    <input type="number" name="friendScores[]" class="form-control" placeholder="Yakınlık (1-10)" min="1" max="10">
  `;
  area.appendChild(field);
}
