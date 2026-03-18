function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || []
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
  updateBadge()
}
function addToCart(productId) {
  const cart = getCart()
  const existing = cart.find(item => item.id === productId)

  if (existing) {
    existing.qty += 1
  } else {
    const product = products.find(p => p.id === productId)
    cart.push({ id: product.id, name: product.name, price: product.price, subtitle: product.subtitle, image: product.images[0], qty: 1 })
  }

  saveCart(cart)
}
function updateBadge() {
  const cart = getCart()
  const total = cart.reduce((sum, item) => sum + item.qty, 0)
  const badge = document.querySelector('.cart-badge')
  if (badge) badge.textContent = total
}
document.addEventListener('DOMContentLoaded', updateBadge)