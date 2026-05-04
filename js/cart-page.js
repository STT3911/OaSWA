const TAX_RATE = 0.08
const PROMO_CODES = { SAVE10: 0.10 }
let discount = 0

function formatMoney(value) {
  return '$' + Number(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getCartItemImage(item) {
  return item.image || 'images/placeholder.jpg'
}

function renderSummary(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * discount
  const taxable = Math.max(0, subtotal - discountAmount)
  const tax = taxable * TAX_RATE
  const total = taxable + tax

  document.getElementById('summarySubtotal').textContent = formatMoney(subtotal)
  document.getElementById('summaryTax').textContent = formatMoney(tax)
  document.getElementById('summaryTotal').textContent = formatMoney(total)

  const discountRow = document.getElementById('discountRow')
  const discountValue = document.getElementById('summaryDiscount')
  discountRow.style.display = discountAmount > 0 ? 'flex' : 'none'
  discountValue.textContent = '-' + formatMoney(discountAmount)
}

function renderCart() {
  const cart = getCart()
  const container = document.getElementById('cartItems')
  const sidebar = document.querySelector('.cart-sidebar')
  const title = document.querySelector('.cart-title')
  if (!container) return

  if (cart.length === 0) {
    if (sidebar) sidebar.hidden = true
    if (title) title.hidden = true
    container.style.gridColumn = '1 / -1'
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2 2h3l2.8 13.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6"></path>
          </svg>
        </div>
        <h2 class="cart-empty-title">Your Cart is Empty</h2>
        <p class="cart-empty-sub">Add some amazing products to get started!</p>
        <a href="index.html" class="cart-empty-btn">Continue Shopping</a>
      </div>
    `
    return
  }

  if (sidebar) sidebar.hidden = false
  if (title) title.hidden = false
  container.style.gridColumn = ''

  container.innerHTML = cart.map(item => {
    const category = item.category || item.subtitle || ''
    return `
      <div class="cart-item" data-id="${item.id}">
        <img class="cart-item-img" src="${getCartItemImage(item)}" alt="${item.name}">
        <div class="cart-item-content">
          <div class="cart-item-row-top">
            <div>
              <a href="product.html?id=${item.id}" class="cart-item-name">${item.name}</a>
              <div class="cart-item-category">${category}</div>
            </div>
            <button type="button" class="cart-item-remove" aria-label="Remove ${item.name}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
                <path d="M9 6V4h6v2"></path>
              </svg>
            </button>
          </div>
          <div class="cart-item-row-bottom">
            <div class="cart-item-controls">
              <button type="button" class="qty-btn decrease" aria-label="Decrease quantity" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
              <span class="qty-value">${item.quantity}</span>
              <button type="button" class="qty-btn increase" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item-price">
              <div class="cart-item-total">${formatMoney(item.price * item.quantity)}</div>
              <div class="cart-item-unit">${formatMoney(item.price)} each</div>
            </div>
          </div>
        </div>
      </div>
    `
  }).join('')

  renderSummary(cart)
}

function changeQuantity(id, delta) {
  const cart = getCart()
  const item = cart.find(cartItem => String(cartItem.id) === String(id))
  if (!item) return
  item.quantity = Math.max(1, item.quantity + delta)
  saveCart(cart)
  renderCart()
}

function removeItem(id) {
  const cart = getCart().filter(item => String(item.id) !== String(id))
  saveCart(cart)
  renderCart()
}

function applyPromo() {
  const input = document.getElementById('promoInput')
  const button = document.getElementById('promoBtn')
  const hint = document.getElementById('promoHint')
  const code = input.value.trim().toUpperCase()

  if (PROMO_CODES[code] !== undefined) {
    discount = PROMO_CODES[code]
    document.getElementById('discountLabel').textContent = 'Discount (' + code + ')'
    hint.textContent = 'Promo code applied successfully!'
    hint.className = 'promo-hint success'
    input.disabled = true
    button.disabled = true
  } else {
    discount = 0
    hint.textContent = code ? 'Invalid promo code.' : 'Please enter a promo code.'
    hint.className = 'promo-hint error'
  }

  renderSummary(getCart())
}

document.addEventListener('DOMContentLoaded', function () {
  renderCart()

  const cartItems = document.getElementById('cartItems')
  if (cartItems) {
    cartItems.addEventListener('click', function (event) {
      const item = event.target.closest('.cart-item')
      if (!item) return
      const id = item.dataset.id

      if (event.target.closest('.increase')) changeQuantity(id, 1)
      if (event.target.closest('.decrease')) changeQuantity(id, -1)
      if (event.target.closest('.cart-item-remove')) removeItem(id)
    })
  }

  const promoBtn = document.getElementById('promoBtn')
  if (promoBtn) promoBtn.addEventListener('click', applyPromo)
})
