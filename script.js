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

// DETAIL POPUP
const popup = document.createElement("div");
popup.innerHTML = `
<div id="productPopup" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;justify-content:center;align-items:center;padding:20px;">

<div style="background:#111;border-radius:30px;max-width:1100px;width:100%;padding:30px;display:grid;grid-template-columns:1fr 1fr;gap:30px;position:relative;border:1px solid rgba(255,255,255,.08);">

<button id="closePopup" style="position:absolute;top:15px;right:15px;background:#f5b6c8;border:none;padding:10px 14px;border-radius:50%;cursor:pointer;font-weight:bold;">✕</button>

<div>
<img id="popupMainImage" src="unisex-organic-oversized-high-neck-blaster-2.0-t-shirt-black.png" style="width:100%;height:520px;object-fit:cover;border-radius:24px;">

<div style="display:flex;gap:12px;margin-top:18px;justify-content:center;">
<div class="colorSwitch" data-color="black" style="width:28px;height:28px;border-radius:50%;background:black;border:2px solid white;cursor:pointer;"></div>
<div class="colorSwitch" data-color="blue" style="width:28px;height:28px;border-radius:50%;background:#3b82f6;border:2px solid white;cursor:pointer;"></div>
<div class="colorSwitch" data-color="red" style="width:28px;height:28px;border-radius:50%;background:#ef4444;border:2px solid white;cursor:pointer;"></div>
<div class="colorSwitch" data-color="pink" style="width:28px;height:28px;border-radius:50%;background:#f5b6c8;border:2px solid white;cursor:pointer;"></div>
</div>
</div>

<div>
<p style="color:#f5b6c8;font-weight:bold;letter-spacing:2px;">LIMITED DROP</p>

<h1 style="font-size:52px;margin:10px 0;">Elina Hoodie</h1>

<p style="font-size:17px;color:#bbb;line-height:1.8;">
Premium oversized streetwear hoodie mit softem Stoff und modernem Fit. Entwickelt fuer einen cleanen und stylischen Everyday Look.
</p>

<h2 style="margin-top:25px;font-size:34px;">CHF 59.90</h2>

<div style="display:flex;gap:12px;margin:25px 0;flex-wrap:wrap;">
<button style="padding:12px 18px;border:none;border-radius:14px;background:#1d1d22;color:white;">S</button>
<button style="padding:12px 18px;border:none;border-radius:14px;background:#1d1d22;color:white;">M</button>
<button style="padding:12px 18px;border:none;border-radius:14px;background:#1d1d22;color:white;">L</button>
<button style="padding:12px 18px;border:none;border-radius:14px;background:#1d1d22;color:white;">XL</button>
</div>

<div style="display:flex;gap:15px;flex-wrap:wrap;margin-top:25px;">
<button id="popupCartBtn" style="background:#f5b6c8;color:#111;padding:16px 28px;border:none;border-radius:999px;font-weight:bold;font-size:16px;cursor:pointer;">
In den Warenkorb
</button>

<a href="warenkorb.html" style="background:#1f1f24;color:white;padding:16px 28px;border-radius:999px;font-weight:bold;">
Zum Warenkorb
</a>
</div>

<div style="margin-top:30px;color:#aaa;line-height:1.9;">
✓ Oversized Fit<br>
✓ Premium Cotton<br>
✓ Soft Inside Fabric<br>
✓ Designed by elina
</div>

</div>
</div>
</div>
`;

document.body.appendChild(popup);

const popupBox = document.getElementById("productPopup");
const popupMainImage = document.getElementById("popupMainImage");

// Produkt öffnen
setTimeout(() => {
  document.querySelectorAll(".product").forEach(card => {
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      popupBox.style.display = "flex";
    });
  });
}, 100);

// Farbwechsel

document.querySelectorAll(".colorSwitch").forEach(btn => {
  btn.addEventListener("click", () => {
    const color = btn.dataset.color;

    if(color === "blue") {
      popupMainImage.style.filter = "hue-rotate(180deg)";
    }
    else if(color === "red") {
      popupMainImage.style.filter = "hue-rotate(320deg)";
    }
    else if(color === "pink") {
      popupMainImage.style.filter = "hue-rotate(260deg)";
    }
    else {
      popupMainImage.style.filter = "none";
    }
  });
});

// Popup Warenkorb

document.addEventListener("click", e => {
  if(e.target.id === "popupCartBtn") {
    cart.push({
      name: "Elina Hoodie",
      price: 59.90,
      image: "unisex-organic-oversized-high-neck-blaster-2.0-t-shirt-black.png"
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();

    alert("Zum Warenkorb hinzugefügt 😎");
  }
});

// Popup schließen

document.addEventListener("click", e => {
  if (e.target.id === "closePopup") {
    popupBox.style.display = "none";
  }
});

// Produkte hinzufügen

document.querySelectorAll(".product button").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

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
