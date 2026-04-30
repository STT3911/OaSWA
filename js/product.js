const productId = parseInt(new URLSearchParams(location.search).get('id'), 10)
const discount = parseInt(new URLSearchParams(location.search).get('discount'), 10) || 0
const product = Number.isFinite(productId) ? products.find(p => p.id === productId) : null
let currentImage = 0
let qty = 1

const money = value => '$' + Number(value).toFixed(2)
const imgs = item => Array.isArray(item.images) ? item.images.filter(Boolean) : []

function cart() {
  try { return JSON.parse(localStorage.getItem('cart')) || [] } catch (e) { return [] }
}

function syncBadge() {
  const badge = document.querySelector('.cart-badge')
  if (!badge) return
  const count = cart().reduce((sum, item) => sum + (item.quantity || item.qty || 0), 0)
  badge.textContent = count ? String(count) : ''
  badge.hidden = !count
}

function addToCartLocal() {
  const items = cart()
  const found = items.find(item => item.id === product.id)
  const image = imgs(product)[0] || ''

  if (found) found.quantity = (found.quantity || 0) + qty
  else items.push({
    id: product.id,
    name: product.name,
    price: product.price,
    subtitle: product.subtitle,
    category: product.category,
    image,
    quantity: qty
  })

  localStorage.setItem('cart', JSON.stringify(items))
  syncBadge()
  const btn = document.getElementById('addToCartBtn')
  btn.textContent = 'In Cart'
  btn.disabled = true
}

function setImage(index) {
  const images = imgs(product)
  currentImage = (index + images.length) % images.length
  document.getElementById('mainImage').src = images[currentImage]
  document.querySelectorAll('.gallery-thumb')
    .forEach((thumb, i) => thumb.classList.toggle('active', i === currentImage))
}

function priceHtml() {
  if (!discount) return `<span class="product-price">${money(product.price)}</span>`
  return `
    <div class="product-price-discount-group">
      <span class="product-price product-price--sale">${money(product.price * (1 - discount / 100))}</span>
      <span class="product-price--original">${money(product.price)}</span>
      <span class="product-price--badge">-${discount}%</span>
    </div>`
}

function galleryHtml() {
  const images = imgs(product)
  return `
    <div class="gallery">
      <div class="gallery-main">
        <img src="${images[0] || ''}" alt="${product.name}" id="mainImage">
        ${images.length > 1 ? `
          <button class="gallery-arrow gallery-prev" id="galleryPrev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
          <button class="gallery-arrow gallery-next" id="galleryNext" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"></polyline></svg></button>` : ''}
      </div>
      <div class="gallery-thumbs">
        ${images.map((src, i) => `
          <button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Show image ${i + 1}">
            <img src="${src}" alt="">
          </button>`).join('')}
      </div>
    </div>`
}

function specsHtml(limit) {
  return Object.entries(product.specs || {})
    .slice(0, limit || undefined)
    .map(([key, value]) => limit
      ? `<li><strong>${key}:</strong> ${value}</li>`
      : `<div class="specs-row"><span class="specs-key">${key}</span><span class="specs-val">${value}</span></div>`)
    .join('')
}

function relatedHtml() {
  return products
    .filter(item => item.id !== product.id && item.category === product.category)
    .slice(0, 4)
    .map(item => `
      <a href="product.html?id=${item.id}" class="related-card">
        <div class="related-card-img"><img src="${imgs(item)[0] || ''}" alt="${item.name}"></div>
        <div class="related-card-info">
          <p class="related-card-name">${item.name}</p>
          <div class="related-card-rating">${renderStars(item.rating)}</div>
          <div class="related-card-meta">
            <p class="related-card-price">${money(item.price)}</p>
            <span class="related-card-category">${item.category}</span>
          </div>
        </div>
      </a>`)
    .join('')
}

function bindEvents() {
  document.querySelectorAll('.gallery-thumb')
    .forEach(thumb => thumb.addEventListener('click', () => setImage(Number(thumb.dataset.index))))

  document.getElementById('galleryPrev')?.addEventListener('click', () => setImage(currentImage - 1))
  document.getElementById('galleryNext')?.addEventListener('click', () => setImage(currentImage + 1))
  document.getElementById('qtyMinus').addEventListener('click', () => {
    qty = Math.max(1, qty - 1)
    document.getElementById('qtyValue').textContent = qty
  })
  document.getElementById('qtyPlus').addEventListener('click', () => {
    qty += 1
    document.getElementById('qtyValue').textContent = qty
  })
  document.getElementById('addToCartBtn').addEventListener('click', addToCartLocal)
  document.getElementById('specsToggle')?.addEventListener('click', e => {
    const open = document.getElementById('specsBody').classList.toggle('open')
    e.currentTarget.classList.toggle('open', open)
  })
}

function render() {
  document.title = product.name + ' - TechStore'
  document.getElementById('breadcrumb').innerHTML = `
    <a href="index.html">Products</a><span class="sep">›</span>
    <a href="index.html?category=${encodeURIComponent(product.category)}">${product.category}</a><span class="sep">›</span>
    <span class="current">${product.name}</span>`

  document.getElementById('productDetail').innerHTML = `
    <div class="product-detail-grid">
      ${galleryHtml()}
      <div class="product-info">
        <h1 class="product-title">${product.name}</h1>
        <div class="product-rating-row">${renderStars(product.rating)}</div>
        <span class="reviews-count">Based on ${(product.reviewCount || 0).toLocaleString('en-US')} reviews</span>
        <div class="product-price-row">${priceHtml()}<span class="free-shipping">Free shipping</span></div>
        <div class="highlights-box"><h3>Key Highlights</h3><ul class="highlights-list">${specsHtml(3)}</ul></div>
        <div class="product-description"><h3>Description</h3><p>${product.description}</p></div>
        <div class="quantity-section"><p class="quantity-label">Quantity</p><div class="quantity-control"><button class="qty-btn" id="qtyMinus" type="button">-</button><span class="qty-value" id="qtyValue">1</span><button class="qty-btn" id="qtyPlus" type="button">+</button></div></div>
        <button class="add-to-cart-btn" id="addToCartBtn" type="button">Add to Cart</button>
        <div class="specs-accordion"><button class="specs-toggle" id="specsToggle" type="button">Technical Specifications</button><div class="specs-body" id="specsBody">${specsHtml()}</div></div>
      </div>
    </div>`

  const related = relatedHtml()
  if (related) {
    document.getElementById('relatedSection').hidden = false
    document.getElementById('relatedGrid').innerHTML = related
  }

  bindEvents()
  syncBadge()
}

document.addEventListener('DOMContentLoaded', () => {
  if (product) render()
  else document.getElementById('productDetail').innerHTML = '<p class="product-loading">Product not found.</p>'
})
