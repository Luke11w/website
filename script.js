// Warenkorb laden
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// 👉 BACKEND SENDEN
function sendToBackend(cart) {
  fetch("http://localhost:3000/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cart: cart })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Server Antwort:", data);
  })
  .catch(err => {
    console.error("Fehler:", err);
  });
}

// 👉 PRODUKTE HINZUFÜGEN
document.querySelectorAll(".product button").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);

    cart.push({ name, price });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });
});

// 👉 WARENKORB ANZEIGEN
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

// 👉 BEIM LADEN AKTUALISIEREN
updateCart();

// 👉 CHECKOUT BUTTON
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Warenkorb ist leer");
      return;
    }

    // 🔥 Backend call
    sendToBackend(cart);

    alert("Bestellung gesendet 🔥");

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });
}
