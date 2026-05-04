function normalizeCartItem(item) {
  const quantity = Number(item.quantity || item.qty || 1)
  return {
    id: Number(item.id),
    name: item.name || 'Unknown Product',
    price: Number(item.price) || 0,
    subtitle: item.subtitle || item.category || '',
    category: item.category || item.subtitle || '',
    image: item.image || '',
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1
  }
}

function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem('cart')) || []
    return Array.isArray(raw) ? raw.map(normalizeCartItem).filter(item => Number.isFinite(item.id)) : []
  } catch (e) {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart.map(normalizeCartItem)))
  updateBadge()
}

function resolveProduct(productOrId) {
  if (productOrId && typeof productOrId === 'object') return productOrId
  const id = Number(productOrId)
  if (!Number.isFinite(id) || typeof products === 'undefined' || !Array.isArray(products)) return null
  return products.find(product => Number(product.id) === id) || null
}

function addToCart(productOrId) {
  const product = resolveProduct(productOrId)
  if (!product) return

  const cart = getCart()
  const id = Number(product.id)
  const existing = cart.find(item => item.id === id)

  if (existing) {
    existing.quantity += 1
  } else {
    const images = Array.isArray(product.images) ? product.images : []
    cart.push({
      id,
      name: product.name,
      price: product.price,
      subtitle: product.subtitle || product.category || '',
      category: product.category || product.subtitle || '',
      image: images[0] || product.image || '',
      quantity: 1
    })
  }

  saveCart(cart)
}

function updateBadge() {
  const cart = getCart()
  const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const badges = document.querySelectorAll('.cart-badge, #cartBadge')

  badges.forEach(function (badge) {
    badge.textContent = total > 0 ? String(total > 99 ? '99+' : total) : ''
    badge.hidden = total === 0
    badge.classList.toggle('visible', total > 0)
  })
}

window.getCart = getCart
window.saveCart = saveCart
window.addToCart = addToCart
window.updateBadge = updateBadge
window.updateCartBadge = updateBadge

document.addEventListener('DOMContentLoaded', updateBadge)
