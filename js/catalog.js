const PRICE_MAX = 3000

function renderProducts(list) {
  const grid = document.getElementById('products-grid')
  const count = document.getElementById('products-count')

  count.textContent = list.length + ' products'

  if (list.length === 0) {
    grid.innerHTML = '<p>No products found</p>'
    return
  }
  grid.innerHTML = list
    .map(
      product => `
  <div class="product-card">
    <a href="product.html?id=${product.id}" class="product-card__media">
      <img src="${product.images[0]}" alt="${product.name}">
    </a>
    <div class="product-card__info">
      <a href="product.html?id=${product.id}">
        <h3 class="product-card__name">${product.name}</h3>
      </a>
      <div class="product-card__rating">${renderStars(product.rating)}</div>
      <div class="product-card__bottom">
        <span class="product-card__price">$${Number(product.price).toFixed(2)}</span>
        <span class="product-card__category">${product.category}</span>
      </div>
    </div>
  </div>
`
    )
    .join('')
}

function updatePriceRangeFill() {
  const range = document.getElementById('price-range')
  const fill = document.getElementById('price-range-fill')
  const label = document.getElementById('price-max')
  if (!range || !fill) return
  const v = parseFloat(range.value)
  fill.style.width = (v / PRICE_MAX) * 100 + '%'
  if (label) label.textContent = '$' + v
}

function applySortAndFilter() {
  const sortValue = document.getElementById('sort-select').value
  const maxPrice = parseFloat(document.getElementById('price-range').value)
  const ratingInput = document.querySelector('input[name="rating"]:checked')
  const minRating = ratingInput ? parseFloat(ratingInput.value) : 0

  let result = products.filter(p => {
    return p.price <= maxPrice && p.rating >= minRating
  })

  if (sortValue === 'name-asc') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortValue === 'name-desc') {
    result.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortValue === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortValue === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  }
  renderProducts(result)
}

function clearFilters() {
  const range = document.getElementById('price-range')
  if (range) range.value = String(PRICE_MAX)
  updatePriceRangeFill()
  const checked = document.querySelector('input[name="rating"]:checked')
  if (checked) checked.checked = false
  applySortAndFilter()
}

document.addEventListener('DOMContentLoaded', function () {
  const range = document.getElementById('price-range')
  if (range) {
    range.addEventListener('input', function () {
      updatePriceRangeFill()
      applySortAndFilter()
    })
  }

  updatePriceRangeFill()

  document.querySelectorAll('input[name="rating"]').forEach(input => {
    input.addEventListener('change', applySortAndFilter)
  })

  renderProducts(products)
})
