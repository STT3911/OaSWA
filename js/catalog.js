const PRICE_MAX = 3000
const MIN_GAP = 100


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

function updateSlider() {
  const minSlider = document.getElementById(`slider-min`);
  const maxSlider = document.getElementById(`slider-max`);
  const sliderFill = document.getElementById(`slider-fill`);
  const minLabel = document.getElementById(`price-min-label`);
  const maxLabel = document.getElementById(`price-max-label`);

  if (!minSlider || !maxSlider || !sliderFill) return;
  let minVal = parseInt(minSlider.value);
  let maxVal = parseInt(maxSlider.value);

  if (maxVal - minVal < MIN_GAP) {
    if (document.activeElement === minSlider) {
      minSlider.value = maxVal - MIN_GAP;
      minVal = maxVal - MIN_GAP;
    } else {
      maxSlider.value = minVal + MIN_GAP;
      maxVal = minVal + MIN_GAP;
    }
  }

  if (minLabel) minLabel.textContent = '$' + minVal;
  if (maxLabel) maxLabel.textContent = '$' + maxVal;

  const percentMin = (minVal / PRICE_MAX) * 100;
  const percentMax = (maxVal / PRICE_MAX) * 100;

  sliderFill.style.left = percentMin + '%';
  sliderFill.style.width = (percentMax - percentMin) + '%';
}

function applySortAndFilter() {
  const sortSelect = document.getElementById(`sort-select`);
  const sortValue = sortSelect ? sortSelect.value : `name-asc`;

  const minSlider = document.getElementById(`slider-min`);
  const maxSlider = document.getElementById(`slider-max`);

  const minPrice = minSlider ? parseFloat(minSlider.value) : 0;
  const maxPrice = maxSlider ? parseFloat(maxSlider.value) : PRICE_MAX;

  const ratingInput = document.querySelector(`input[name="rating"]:checked`);
  const minRating = ratingInput ? parseFloat(ratingInput.value) : 0;

  let result = products.filter(p => {
    return p.price >= minPrice && p.price <= maxPrice && p.rating >= minRating;
  });

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
  const minSlider = document.getElementById('slider-min');
  const maxSlider = document.getElementById(`slider-max`);

  if (minSlider && maxSlider) {
    minSlider.value = 0;
    maxSlider.value = String(PRICE_MAX);
  }
  updateSlider();

  const checked = document.querySelector(`input[name="rating"]:checked`);
  if (checked) checked.checked = false
  applySortAndFilter();
}

document.addEventListener('DOMContentLoaded', function () {
  const filterToggle = document.querySelector('.catalog-filter-btn')
  const filters = document.querySelector('.filters')
  const minSlider = document.getElementById(`slider-min`);
  const maxSlider = document.getElementById('slider-max');

  if (filterToggle && filters) {
    filterToggle.addEventListener('click', function () {
      filters.classList.toggle('filters--open')
    })
  }

  [minSlider, maxSlider].forEach(slider =>  {
    if (slider) {
      slider.addEventListener('input', function () {
        updateSlider()
        applySortAndFilter()
      });
    }
  });

  updateSlider();
  document.querySelectorAll('input[name="rating"]').forEach(input => {
    input.addEventListener('change', applySortAndFilter);
  });

  renderProducts(products)
})
