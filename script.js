let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

// Produkt hinzufügen
document.querySelectorAll(".product button").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);

    cart.push({ name, price });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });
});

// Warenkorb anzeigen
function updateCart() {
  if (cartCount) {
    cartCount.textContent = cart.length;
  }

  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Warenkorb leer</p>";
    cartTotal.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item.name + " - CHF " + item.price.toFixed(2);
    cartItems.appendChild(div);

    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

// Beim Laden anzeigen
updateCart();

// Checkout Button
const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Warenkorb ist leer");
      return;
    }

    alert("Bestellung gesendet 🔥");

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });
}
