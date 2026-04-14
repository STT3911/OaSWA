function getCart() {
  
  try {
      return JSON.parse(localStorage.getItem('cart')) || []
  } catch (e) {
    return[]
  }
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
  updateBadge()
}
function addToCart(productId) {
  const cart = getCart()
  const existing = cart.find(item => item.id === productId)
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1
  } else {
    const product = products.find(p => p.id === productId)
    cart.push({ id: product.id, name: product.name, price: product.price, subtitle: product.subtitle, image: product.images[0], quantity: 1 })
  }

  saveCart(cart)
}
function updateBadge() {
  const cart = getCart()
  const total = cart.reduce((sum, item) => sum + (item.quantity  || 0), 0)
  const badge = document.querySelector('.cart-badge')
  if (!badge) return
  badge.textContent = total > 0 ? String(total) : ''
  badge.hidden = total === 0
}
document.addEventListener('DOMContentLoaded', updateBadge)
