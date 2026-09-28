const CART_KEY="elinaCart";
const ACTIVE_PRODUCTS=new Set(["cropped-hoodie","wide-leg-pants"]);
const TEST_ORDER_API="https://ulxgmddnfqxzfvbqwgtd.supabase.co/functions/v1/elina-test-order";
const ANALYTICS_API="https://ulxgmddnfqxzfvbqwgtd.supabase.co/functions/v1/elina-track-event";
const money=n=>new Intl.NumberFormat("de-CH",{style:"currency",currency:"CHF"}).format(n);

function analyticsSession(){
  try{
    let id=sessionStorage.getItem("elinaAnalyticsSession");
    if(!id){id="s_"+crypto.randomUUID();sessionStorage.setItem("elinaAnalyticsSession",id)}
    return id;
  }catch{return "s_"+Math.random().toString(36).slice(2)+Date.now().toString(36)}
}
function referrerHost(){
  try{return document.referrer?new URL(document.referrer).hostname:null}catch{return null}
}
function trackEvent(eventType,productId=null){
  const payload={eventType,productId,path:location.pathname,sessionId:analyticsSession(),referrerHost:referrerHost()};
  fetch(ANALYTICS_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
}
function getCart(){try{const raw=JSON.parse(localStorage.getItem(CART_KEY))||[];const clean=raw.filter(i=>ACTIVE_PRODUCTS.has(i.id));if(clean.length!==raw.length)localStorage.setItem(CART_KEY,JSON.stringify(clean));return clean}catch{return[]}}
function saveCart(cart){const clean=cart.filter(i=>ACTIVE_PRODUCTS.has(i.id));localStorage.setItem(CART_KEY,JSON.stringify(clean));updateCartBadge()}
function updateCartBadge(){const count=getCart().reduce((s,i)=>s+(i.quantity||1),0);document.querySelectorAll("[data-cart-count]").forEach(el=>el.textContent=count)}
function addToCart(product){if(!ACTIVE_PRODUCTS.has(product.id))return;const cart=getCart();const same=cart.find(i=>i.id===product.id&&i.size===product.size);if(same)same.quantity=(same.quantity||1)+1;else cart.push({...product,quantity:1});saveCart(cart);trackEvent("add_to_cart",product.id)}
function initProductPage(){const root=document.querySelector("[data-product]");if(!root)return;let size="";const main=document.querySelector("[data-main-image]");document.querySelectorAll("[data-thumb]").forEach(img=>img.addEventListener("click",()=>main.src=img.src));document.querySelectorAll("[data-size]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-size]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");size=btn.dataset.size;const add=document.querySelector("[data-add]");add.disabled=false;add.textContent="In den Warenkorb"}));const add=document.querySelector("[data-add]");add?.addEventListener("click",()=>{if(!size)return;addToCart({id:root.dataset.id,name:root.dataset.name,price:Number(root.dataset.price),image:root.dataset.image,size});add.textContent="Hinzugefügt ✓";setTimeout(()=>add.textContent="In den Warenkorb",1200)})}
function renderCart(){const list=document.querySelector("[data-cart-list]");if(!list)return;let cart=getCart();const subtotalEl=document.querySelector("[data-subtotal]");const totalEl=document.querySelector("[data-total]");function draw(){list.innerHTML="";if(!cart.length){list.innerHTML='<div class="empty"><h2>Dein Warenkorb ist leer.</h2><p>Such dir im Drop 01 dein Lieblingspiece aus.</p><a class="btn btn-primary" href="shop.html">Zum Shop</a></div>'}cart.forEach((item,index)=>{const row=document.createElement("article");row.className="cart-item";row.innerHTML=`<img src="${item.image}" alt=""><div><strong>${item.name}</strong><p class="muted">Grösse: ${item.size}</p><div class="price">${money(item.price)}</div><button class="icon-btn" data-remove="${index}" aria-label="Entfernen">×</button></div><div class="qty"><button data-minus="${index}">−</button><strong>${item.quantity||1}</strong><button data-plus="${index}">+</button></div>`;list.appendChild(row)});const subtotal=cart.reduce((s,i)=>s+i.price*(i.quantity||1),0);if(subtotalEl)subtotalEl.textContent=money(subtotal);if(totalEl)totalEl.textContent=money(subtotal);document.querySelector("[data-checkout]")?.toggleAttribute("hidden",!cart.length);saveCart(cart)}list.addEventListener("click",e=>{const plus=e.target.closest("[data-plus]"),minus=e.target.closest("[data-minus]"),remove=e.target.closest("[data-remove]");if(plus)cart[+plus.dataset.plus].quantity=(cart[+plus.dataset.plus].quantity||1)+1;if(minus){const i=+minus.dataset.minus;cart[i].quantity=Math.max(1,(cart[i].quantity||1)-1)}if(remove)cart.splice(+remove.dataset.remove,1);draw()});draw()}
function renderCheckout(){const box=document.querySelector("[data-order-summary]");if(!box)return;const cart=getCart();if(!cart.length){location.href="warenkorb.html";return}trackEvent("checkout_start");const total=cart.reduce((s,i)=>s+i.price*(i.quantity||1),0);box.innerHTML=cart.map(i=>`<div class="summary-row"><span>${i.quantity||1}× ${i.name} (${i.size})</span><strong>${money(i.price*(i.quantity||1))}</strong></div>`).join("")+`<div class="summary-row summary-total"><span>Total</span><span>${money(total)}</span></div>`;const form=document.querySelector("[data-checkout-form]");const button=document.querySelector("[data-submit-order]");const status=document.querySelector("[data-checkout-status]");form?.addEventListener("submit",async e=>{e.preventDefault();if(button){button.disabled=true;button.textContent="Wird gespeichert…"}if(status)status.hidden=true;try{const fd=new FormData(form);const payload={items:cart.map(i=>({id:i.id,size:i.size,quantity:i.quantity||1})),customer:{email:String(fd.get("email")||"")},shipping:{firstName:String(fd.get("firstName")||""),lastName:String(fd.get("lastName")||""),street:String(fd.get("street")||""),postalCode:String(fd.get("postalCode")||""),city:String(fd.get("city")||""),country:String(fd.get("country")||"CH")}};const response=await fetch(TEST_ORDER_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.message||"Bestellung konnte nicht gespeichert werden");localStorage.setItem("elinaLastOrder",result.orderId);localStorage.removeItem(CART_KEY);location.href="danke.html"}catch(err){if(status){status.hidden=false;status.textContent="Fehler: "+(err instanceof Error?err.message:"Unbekannter Fehler")}if(button){button.disabled=false;button.textContent="Testbestellung abschliessen"}}})}
function initProductClickTracking(){document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a)return;const href=a.getAttribute("href")||"";if(href.includes("product1.html"))trackEvent("product_click","cropped-hoodie");if(href.includes("product2.html"))trackEvent("product_click","wide-leg-pants")})}

function initVisualEffects(){
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems=[...document.querySelectorAll("[data-reveal]")];

  if(reduceMotion){
    revealItems.forEach(el=>el.classList.add("is-visible"));
  }else{
    document.body.classList.add("effects-ready");
    if("IntersectionObserver" in window){
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },{threshold:.12,rootMargin:"0px 0px -6% 0px"});
      revealItems.forEach(el=>observer.observe(el));
    }else{
      revealItems.forEach(el=>el.classList.add("is-visible"));
    }
  }

  const tilt=document.querySelector("[data-tilt]");
  const finePointer=window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if(tilt && finePointer && !reduceMotion){
    let frame=0;
    const move=e=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const r=tilt.getBoundingClientRect();
        const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
        const y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
        tilt.style.setProperty("--ry",((x-.5)*5).toFixed(2)+"deg");
        tilt.style.setProperty("--rx",((.5-y)*5).toFixed(2)+"deg");
        tilt.style.setProperty("--mx",(x*100).toFixed(1)+"%");
        tilt.style.setProperty("--my",(y*100).toFixed(1)+"%");
      });
    };
    tilt.addEventListener("pointermove",move);
    tilt.addEventListener("pointerleave",()=>{
      tilt.style.setProperty("--ry","0deg");
      tilt.style.setProperty("--rx","0deg");
      tilt.style.setProperty("--mx","65%");
      tilt.style.setProperty("--my","25%");
    });
  }
}
document.addEventListener("DOMContentLoaded",()=>{trackEvent("page_view");initProductClickTracking();updateCartBadge();initProductPage();renderCart();renderCheckout();initVisualEffects()});