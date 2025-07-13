document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleFriends");
  const friendList = document.getElementById("friendList");
  const arrowIcon = document.getElementById("arrowIcon");

toggleBtn.addEventListener("click", () => {
  const isOpen = friendList.classList.contains("show");

  friendList.classList.toggle("show");
  arrowIcon.classList.toggle("fa-chevron-down", isOpen);  // Ters mantık
  arrowIcon.classList.toggle("fa-chevron-up", !isOpen);
});

});
