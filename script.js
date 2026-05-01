let cart = [];
let total = 0;

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const productButtons = document.querySelectorAll(".product button");

productButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    cart.push({
      name: name,
      price: price
    });

    total = total + price;
    updateCart();
  });
});

function updateCart() {
  cartCount.textContent = cart.length;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='empty'>Noch keine Produkte im Warenkorb.</p>";
  }

  cart.forEach(function(item) {
    const div = document.createElement("div");
    div.textContent = item.name + " - CHF " + item.price.toFixed(2);
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
}

checkoutBtn.addEventListener("click", function() {
  if (cart.length === 0) {
    alert("Dein Warenkorb ist noch leer.");
    return;
  }

  alert("Test Bestellung erfolgreich!");
  cart = [];
  total = 0;
  updateCart();
});
