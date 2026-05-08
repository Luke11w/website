// Warenkorb laden
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

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

// Produkte hinzufügen
document.querySelectorAll(".product button").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    const image = btn.dataset.image;

    cart.push({ name, price, image });

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

    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:15px;width:100%;">
        <img src="${item.image}" style="width:80px;height:80px;object-fit:cover;border-radius:14px;">

        <div>
          <h3 style="margin:0;">${item.name}</h3>
          <p style="margin:4px 0;color:#ccc;">CHF ${item.price.toFixed(2)}</p>
        </div>
      </div>
    `;

    cartItems.appendChild(div);

    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

updateCart();

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Warenkorb ist leer");
      return;
    }

    sendToBackend(cart);

    alert("Bestellung gesendet 🔥");

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  });
}
