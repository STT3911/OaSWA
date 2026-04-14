let cart = []
let discount = 0

const cartContainer = document.getElementById('CartContainer')
const totalPriceEl = document.getElementById('totalPrice')
const subtotalPriceEl = document.getElementById('subtotalPrice')
const taxPriceEl = document.getElementById('taxPrice')
const orderSummary = document.getElementById('orderSummary')
const discountRow = document.getElementById('discountRow')
const discountLabel = document.getElementById('discountLabel')
const discountPrice = document.getElementById('discountPrice')
const promoInput = document.getElementById('promoInput')
const promoBtn = document.getElementById('promoBtn')
const promoMssg = document.getElementById('promoMssg')

document.addEventListener('DOMContentLoaded', function () {
  cart = getCart()
  renderCart()
  updateCartBadge()
  if (promoBtn) promoBtn.addEventListener('click', applyPromo)
})

function renderCart() {
  if (!cartContainer) return

  if (cart.length === 0) {
    const cartTitle = document.querySelector('.cart-title')
    const cartLayout = cartContainer.closest('.cart-layout')

    if (cartTitle) cartTitle.style.display = 'none'
    if (cartLayout) cartLayout.style.display = 'block'

    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add some amazing products to get started!</p>
        <a href="index.html" class="btn">Continue Shopping</a>
      </div>
    `

    if (orderSummary) orderSummary.parentElement.style.display = 'none'
    return
  }

  if (orderSummary) orderSummary.parentElement.style.display = ''

  cartContainer.innerHTML = cart.map(item => {
    const title = item.name || 'Unknown Product'
    const image = item.image || 'images/placeholder.jpg'
    const price = parseFloat(item.price) || 0
    const quantity = parseInt(item.quantity, 10) || 1
    const category = item.subtitle || item.category || ''

    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__img-wrap">
          <img src="${image}" alt="${title}" class="cart-item__img">
        </div>
        <div class="cart-item__info">
          <div class="cart-item__header">
            <div>
              <a href="product.html?id=${item.id}" class="cart-item__title">${title}</a>
              <p class="cart-item__category">${category}</p>
            </div>
            <button class="remove-btn" aria-label="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
          <div class="cart-item__footer">
            <div class="cart-item__qty">
              <button class="qty-btn decrease" ${quantity <= 1 ? 'disabled' : ''} aria-label="Decrease quantity">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><line x1="2" y1="6" x2="10" y2="6"/></svg>
              </button>
              <span class="qty-value">${quantity}</span>
              <button class="qty-btn increase" aria-label="Increase quantity">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><line x1="6" y1="2" x2="6" y2="10"/><line x1="2" y1="6" x2="10" y2="6"/></svg>
              </button>
            </div>
            <div class="cart-item__right">
              <p class="cart-item__price">$${(price * quantity).toFixed(2)}</p>
              <p class="cart-item__unit-price">$${price.toFixed(2)} each</p>
            </div>
          </div>
        </div>
      </div>
    `
  }).join('')

  calculateTotal()
}

function calculateTotal() {
  const TAX_RATE = 0.08
  const rawSubtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0
    const quantity = parseInt(item.quantity, 10) || 1
    return sum + price * quantity
  }, 0)

  const discountAmount = discount > 0 ? rawSubtotal * discount : 0
  const subtotal = rawSubtotal - discountAmount
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  if (subtotalPriceEl) subtotalPriceEl.textContent = '$' + rawSubtotal.toFixed(2)
  if (taxPriceEl) taxPriceEl.textContent = '$' + tax.toFixed(2)
  if (totalPriceEl) totalPriceEl.textContent = '$' + total.toFixed(2)

  if (discountRow && discountLabel && discountPrice) {
    discountRow.hidden = discountAmount === 0
    discountLabel.textContent = 'Discount (SAVE10)'
    discountPrice.textContent = '-$' + discountAmount.toFixed(2)
  }
}

function removeItem(id) {
  cart = cart.filter(item => String(item.id) !== String(id))
  saveCart(cart)
  renderCart()
  updateCartBadge()
}

function changeQty(id, type) {
  cart = cart.map(item => {
    if (String(item.id) === String(id)) {
      item.quantity = parseInt(item.quantity, 10) || 1
      if (type === 'increase') item.quantity += 1
      if (type === 'decrease' && item.quantity > 1) item.quantity -= 1
    }
    return item
  })

  saveCart(cart)
  renderCart()
  updateCartBadge()
}

function applyPromo() {
  const value = promoInput ? promoInput.value.trim().toUpperCase() : ''
  if (!promoMssg) return

  if (!value) {
    discount = 0
    promoMssg.textContent = 'Please enter a promo code'
    promoMssg.style.color = '#dc2626'
    if (promoInput) promoInput.disabled = false
    if (promoBtn) promoBtn.disabled = false
    if (discountRow) discountRow.hidden = true
    calculateTotal()
    return
  }

  if (value === 'SAVE10') {
    discount = 0.1
    promoMssg.textContent = 'Promo code applied successfully!'
    promoMssg.style.color = '#16a34a'
    if (promoInput) promoInput.disabled = true
    if (promoBtn) promoBtn.disabled = true
  } else {
    discount = 0
    promoMssg.textContent = 'Invalid promo code.'
    promoMssg.style.color = '#dc2626'
    if (promoInput) promoInput.disabled = false
    if (promoBtn) promoBtn.disabled = false
  }

  calculateTotal()
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge')
  if (!badge) return
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  badge.textContent = totalItems > 0 ? String(totalItems) : ''
  badge.hidden = totalItems === 0
}

document.addEventListener('click', (e) => {
  const item = e.target.closest('.cart-item')
  if (!item) return

  const id = item.dataset.id
  if (e.target.closest('.remove-btn')) removeItem(id)
  if (e.target.closest('.increase')) changeQty(id, 'increase')
  if (e.target.closest('.decrease')) changeQty(id, 'decrease')
})
