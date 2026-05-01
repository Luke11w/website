let count = 0;
const cartCount = document.getElementById("cartCount");

document.querySelectorAll(".product button").forEach(btn => {
  btn.addEventListener("click", () => {
    count++;
    cartCount.textContent = count;
  });
});
