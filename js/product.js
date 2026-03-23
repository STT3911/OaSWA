const params = new URLSearchParams(window.location.search)
const productId = parseInt(params.get('id'), 10)
const product = Number.isFinite(productId)
  ? products.find(p => p.id === productId)
  : null

let currentSlide = 0
let qty = 1
let galleryImages = []

function normalizeProductImages(images) {
  if (images == null) return []
  if (typeof images === 'string') {
    return images.split(/[,;\n]/).map(s => s.trim()).filter(Boolean)
  }
  if (Array.isArray(images)) {
    return images.map(s => String(s).trim()).filter(Boolean)
  }
  return []
}

function formatMoney(n) {
  return '$' + Number(n).toFixed(2)
}

document.addEventListener('DOMContentLoaded', function () {
  if (!product) return

  document.title = product.name + ' | TechStore'
  galleryImages = normalizeProductImages(product.images)

  document.getElementById('product-name').textContent = product.name
  document.getElementById('product-price').textContent = formatMoney(product.price)
  document.getElementById('product-description').textContent = product.description
  const reviews = typeof product.reviewCount === 'number' ? product.reviewCount : 0
  document.getElementById('product-reviews').textContent =
    'Based on ' + reviews.toLocaleString('en-US') + ' reviews'
  document.getElementById('breadcrumb-category').textContent = product.category
  document.getElementById('breadcrumb-name').textContent = product.name

  document.getElementById('product-rating').innerHTML = renderStars(product.rating)

  const highlightsEl = document.getElementById('product-highlights')
  highlightsEl.innerHTML =
    '<div class="product-highlights__box">' +
    Object.entries(product.specs)
      .map(
        ([key, value]) =>
          `<div class="product-highlights__row"><span class="product-highlights__key">${key}</span><span class="product-highlights__val">${value}</span></div>`
      )
      .join('') +
    '</div>'

  const mainImg = document.getElementById('slider-main')
  const thumbsContainer = document.getElementById('slider-thumbs')
  if (galleryImages.length === 0) {
    mainImg.removeAttribute('src')
    mainImg.alt = product.name
    thumbsContainer.innerHTML = ''
  } else {
    currentSlide = 0
    mainImg.src = galleryImages[0]
    mainImg.alt = product.name
    thumbsContainer.innerHTML = galleryImages.map((img, index) => `
    <img src="${img}" alt="thumb ${index}" class="thumb ${index === 0 ? 'thumb--active' : ''}" onclick="goToSlide(${index})">
  `).join('')
  }

  const accordionBody = document.getElementById('accordion-body')
  accordionBody.innerHTML = Object.entries(product.specs).map(([key, value]) => `
    <div class="spec-row">
      <span class="spec-key">${key}</span>
      <span class="spec-value">${value}</span>
    </div>
  `).join('')

  const related = products.filter(p => p.category === product.category && p.id !== product.id)
  const relatedGrid = document.getElementById('related-grid')
  relatedGrid.innerHTML = related.map(p => {
    const relImg = normalizeProductImages(p.images)[0] || ''
    return `
    <div class="product-card">
      <a href="product.html?id=${p.id}" class="product-card__media">
        <img src="${relImg}" alt="${p.name}">
      </a>
      <div class="product-card__info">
        <a href="product.html?id=${p.id}">
          <h3 class="product-card__name">${p.name}</h3>
        </a>
        <div class="product-card__rating">${renderStars(p.rating)}</div>
        <div class="product-card__bottom">
          <span class="product-card__price">${formatMoney(p.price)}</span>
          <span class="product-card__category">${p.category}</span>
        </div>
      </div>
    </div>
  `
  }).join('')
})

function changeSlide(direction) {
  goToSlide(currentSlide + direction)
}

function goToSlide(index) {
  if (!product || galleryImages.length === 0) return
  const images = galleryImages
  if (index < 0) index = images.length - 1
  if (index >= images.length) index = 0
  currentSlide = index
  document.getElementById('slider-main').src = images[currentSlide]
  document.querySelectorAll('.thumb').forEach((t, i) => {
    t.classList.toggle('thumb--active', i === currentSlide)
  })
}

function changeQty(direction) {
  if (!product) return
  qty += direction
  if (qty < 1) qty = 1
  document.getElementById('qty-value').textContent = qty
}

function toggleAccordion() {
  const body = document.getElementById('accordion-body')
  const btn = document.getElementById('accordion-toggle')
  if (!body || !btn) return
  body.classList.toggle('accordion-body--open')
  const open = body.classList.contains('accordion-body--open')
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false')
}

function handleAddToCart() {
  if (!product) return
  for (let i = 0; i < qty; i++) {
    addToCart(product.id)
  }
}
