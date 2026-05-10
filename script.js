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

// PRODUKT POPUP
const popup = document.createElement("div");
popup.innerHTML = `
<div id="productPopup" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;justify-content:center;align-items:center;padding:20px;">
  <div style="background:#111;border-radius:24px;max-width:900px;width:100%;padding:20px;position:relative;">

    <button id="closePopup" style="position:absolute;top:15px;right:15px;background:#f5b6c8;border:none;padding:10px 14px;border-radius:50%;cursor:pointer;font-weight:bold;">✕</button>

    <img id="popupImage" src="unisex-organic-oversized-high-neck-blaster-2.0-t-shirt-black.png" style="width:100%;border-radius:18px;max-height:650px;object-fit:cover;">

    <div style="display:flex;gap:10px;margin-top:15px;overflow:auto;">
      <img class="thumb" src="unisex-organic-oversized-high-neck-blaster-2.0-t-shirt-black.png" style="width:90px;height:90px;object-fit:cover;border-radius:12px;cursor:pointer;">
      <img class="thumb" src="unisex-organic-oversized-high-neck-blaster-2.0-t-shirt-black.png" style="width:90px;height:90px;object-fit:cover;border-radius:12px;cursor:pointer;">
      <img class="thumb" src="unisex-organic-oversized-high-neck-blaster-2.0-t-shirt-black.png" style="width:90px;height:90px;object-fit:cover;border-radius:12px;cursor:pointer;">
    </div>

  </div>
</div>
`;

document.body.appendChild(popup);

const popupBox = document.getElementById("productPopup");
const popupImage = document.getElementById("popupImage");

// Produkt klickbar
setTimeout(() => {
  document.querySelectorAll(".product-img").forEach(card => {
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      popupBox.style.display = "flex";
    });
  });

  document.querySelectorAll(".thumb").forEach(img => {
    img.addEventListener("click", () => {
      popupImage.src = img.src;
    });
  });
}, 100);

// Popup schließen
document.addEventListener("click", e => {
  if (e.target.id === "closePopup") {
    popupBox.style.display = "none";
  }
});

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
