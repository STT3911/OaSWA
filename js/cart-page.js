let cart = []
let discount = 0

document.addEventListener('DOMContentLoaded', function () {
  cart = getCart()
  renderCart()
  updateCartBadge()
  if (promoBtn) promoBtn.addEventListener('click', applyPromo)
})

const cartContainer = document.getElementById('CartContainer')
const totalPriceEl = document.getElementById('totalPrice')
const subtotalPriceEl = document.getElementById('subtotalPrice')
const taxPriceEl = document.getElementById('taxPrice')
const orderSummary = document.getElementById('orderSummary')
const promoInput = document.getElementById('promoInput')
const promoBtn = document.getElementById('promoBtn')
const promoMssg = document.getElementById('promoMssg')

function renderCart() {
  if (!cartContainer) return

  if (cart.length === 0) {
    const cartTitle = document.querySelector('.cart-title')
    if (cartTitle) cartTitle.style.display = 'none'
    cartContainer.closest('.cart-layout').style.display = 'block'
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add some amazing products to get started!</p>
        <a href="index.html" class="btn">Continue Shopping</a>
      </div>
    `
    if (orderSummary) orderSummary.style.display = 'none'
    return
  }

  if (orderSummary) orderSummary.style.display = ''

  cartContainer.innerHTML = cart.map(item => {
    const title = item.name || 'Unknown Product'
    const image = item.image || 'images/placeholder.jpg'
    const price = parseFloat(item.price) || 0
    const quantity = parseInt(item.quantity) || 1
    const category = item.subtitle || item.category || ''

    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__img-wrap">
          <img src="${image}" alt="${title}" class="cart-item__img">
        </div>
        <div class="cart-item__info">
          <h3 class="cart-item__title">${title}</h3>
          <p class="cart-item__category">${category}</p>
          <div class="cart-item__qty">
            <button class="qty-btn decrease">−</button>
            <span class="qty-value">${quantity}</span>
            <button class="qty-btn increase">+</button>
          </div>
        </div>
        <div class="cart-item__right">
          <button class="remove-btn" aria-label="Remove">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
          <p class="cart-item__price">$${(price * quantity).toFixed(2)}</p>
          <p class="cart-item__unit-price">$${price.toFixed(2)} each</p>
        </div>
      </div>
    `
  }).join('')

  calculateTotal()
}

function calculateTotal() {
  const TAX_RATE = 0.08
  let subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0
    const quantity = parseInt(item.quantity) || 1
    return sum + price * quantity
  }, 0)
  if (discount > 0) subtotal = subtotal - subtotal * discount
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  if (subtotalPriceEl) subtotalPriceEl.textContent = '$' + subtotal.toFixed(2)
  if (taxPriceEl) taxPriceEl.textContent = '$' + tax.toFixed(2)
  if (totalPriceEl) totalPriceEl.textContent = '$' + total.toFixed(2)
}

function removeItem(id) {
  cart = cart.filter(item => String(item.id) !== String(id))
  saveCart(cart)
  renderCart()
}

function changeQty(id, type) {
  cart = cart.map(item => {
    if (String(item.id) === String(id)) {
      item.quantity = parseInt(item.quantity) || 1
      if (type === 'increase') item.quantity++
      if (type === 'decrease' && item.quantity > 1) item.quantity--
    }
    return item
  })
  saveCart(cart)
  renderCart()
}

function applyPromo() {
  const value = promoInput.value.trim().toUpperCase()
  if (!value) {
    promoMssg.textContent = 'Please enter a promo code'
    promoMssg.style.color = 'red'
    return
  }
  if (value === 'SAVE10') {
    discount = 0.1
    promoMssg.textContent = 'Promo code applied! 10% discount added.'
    promoMssg.style.color = 'green'
  } else {
    discount = 0
    promoMssg.textContent = 'Invalid promo code.'
    promoMssg.style.color = 'red'
  }
  calculateTotal()
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge')
  if (!badge) return
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  badge.textContent = totalItems
}

document.addEventListener('click', (e) => {
  const item = e.target.closest('.cart-item')
  if (!item) return
  const id = item.dataset.id
  if (e.target.closest('.remove-btn')) removeItem(id)
  if (e.target.closest('.increase')) changeQty(id, 'increase')
  if (e.target.closest('.decrease')) changeQty(id, 'decrease')
})