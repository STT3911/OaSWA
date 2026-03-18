function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart() {
    localStorage.saveItem("cart", JSON.stringify(cart));
}

let cart = getCart();
let discount = 0;


const cartContainer = document.getElementById('CartContainer');
const totalPriceEl = document.getElementById('totalPrice');
const promoInput = document.getElementById('promoInput');
const promoBtn = document.getElementById('promoBtn');
const promoMssg = document.getElementById('promoMssg');


function renderCart() {
    if (!cartContainer) return;

    if (cart.length === 0){

    
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <p>Корзина пуста</p>
        <a href="index.html">Вернуться в каталог</a>
      </div>
    `;
    totalPriceEl.textContent = '0';
    return;
    }

    cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <h3>${item.title}</h3>
      <p>${item.price} ₽</p>

      <div class="quantity">
        <button class="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="increase">+</button>
      </div>

      <p class="item-total">${item.price * item.quantity} ₽</p>

      <button class="remove">🗑</button>
    </div>
  `).join("");
  
  calculateTotal();
}

function calculateTotal(){
    let total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    if (discount > 0){
        total = total - total * discount;
    }

    totalPriceEl.textContent = total.toFixed(2);

}


function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();

}

function changeQuantity(id, type) {
    cart = cart.map(item => {
        if (item.id === id){
            if (type === 'increase') item.quantity++;
            if (type === 'decrease' && item.quantity > 1) item.quantity--;
        }
        return item;
    });

    saveCart(cart);
    renderCart();
}


function applyPromo() {
    const value = promoInput.value.trim().tuUpperCase();

    if (!value) return;

    if (value === 'SAVE10'){
        discount = 0.1;
        promoMssg.textContent = 'Promo code applied successfully!'
        promoMssg.style.color = 'green';
    } 
    calculateTotal();
}


document.addEventListener('click', (e) => {
    const item = e.target.closest(".cart-item");
    if (!item) return;
    const id = Number(item.dataset.id);
    if (e.target.classList.contains("remove")) {
    removeItem(id);
    }

    if (e.target.classList.contains("increase")) {
    changeQuantity(id, "increase");
    }

    if (e.target.classList.contains("decrease")) {
    changeQuantity(id, "decrease");
    }
});

if (promoBtn){
    promoBtn.addEventListener('click', applyPromo);
}

renderCart();

