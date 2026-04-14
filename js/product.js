const params = new URLSearchParams(window.location.search)
const productId = parseInt(params.get('id'), 10)
const product = Number.isFinite(productId)
  ? products.find(p => p.id === productId)
  : null

let currentSlide = 0
let qty = 1
let galleryImages = []

function getSliderAlt(name, index, total) {
  if (!name) return ''
  if (!total || total <= 1) return name
  return `${name} - Image ${index + 1}`
}

function updateSliderUI() {
  if (!product) return

  const mainImg = document.getElementById('slider-main')
  const prevBtn = document.getElementById('slider-prev')
  const nextBtn = document.getElementById('slider-next')
  const hasMultipleImages = galleryImages.length > 1

  if (mainImg && galleryImages.length > 0) {
    mainImg.src = galleryImages[currentSlide]
    mainImg.alt = getSliderAlt(product.name, currentSlide, galleryImages.length)
  }

  if (prevBtn) prevBtn.hidden = !hasMultipleImages
  if (nextBtn) nextBtn.hidden = !hasMultipleImages

  document.querySelectorAll('.thumb-btn').forEach((button, index) => {
    const active = index === currentSlide
    button.setAttribute('aria-current', active ? 'true' : 'false')
  })

  document.querySelectorAll('.thumb').forEach((thumb, index) => {
    thumb.classList.toggle('thumb--active', index === currentSlide)
    thumb.alt = getSliderAlt(product.name, index, galleryImages.length)
  })
}

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
    '<h3 class="product-highlights__title">Key Highlights</h3>' +
    '<div class="product-highlights__list">' +
    Object.entries(product.specs)
      .slice(0, 3)
      .map(
        ([key, value]) =>
          `<div class="product-highlights__row"><span class="product-highlights__dot" aria-hidden="true"></span><span><span class="product-highlights__key">${key}:</span> ${value}</span></div>`
      )
      .join('') +
    '</div>' +
    '</div>'

  const mainImg = document.getElementById('slider-main')
  const thumbsContainer = document.getElementById('slider-thumbs')
  if (galleryImages.length === 0) {
    mainImg.removeAttribute('src')
    mainImg.alt = product.name
    thumbsContainer.innerHTML = ''
    updateSliderUI()
  } else {
    currentSlide = 0
    thumbsContainer.innerHTML = galleryImages.length > 1 ? galleryImages.map((img, index) => `
    <button type="button" class="thumb-btn" onclick="goToSlide(${index})" aria-label="Show image ${index + 1}">
      <img src="${img}" alt="" class="thumb ${index === 0 ? 'thumb--active' : ''}">
    </button>
  `).join('') : ''
    updateSliderUI()
  }

  const accordionBody = document.getElementById('accordion-body')
  accordionBody.innerHTML = Object.entries(product.specs).map(([key, value]) => `
    <div class="spec-row">
      <span class="spec-key">${key}</span>
      <span class="spec-value">${value}</span>
    </div>
  `).join('')

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)
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
  updateSliderUI()
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
