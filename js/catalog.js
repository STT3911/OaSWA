function renderProducts(list) {
    const grid = document.getElementById('products-grid')
    const count = document.getElementById('products-count')

    count.textContent = list.length + 'products'

    if(list.length === 0) {
        grid.innerHTML = '<p>No products found</p>'
        return
    }
    grid.innerHTML = list.map(product => `
  <div class="product-card">
    <a href="product.html?id=${product.id}">
      <img src="${product.images[0]}" alt="${product.name}">
    </a>
    <div class="product-card__info">
      <a href="product.html?id=${product.id}">
        <h3 class="product-card__name">${product.name}</h3>
      </a>
      <div class="product-card__rating">${renderStars(product.rating)}</div>
      <div class="product-card__bottom">
        <span class="product-card__price">$${product.price}</span>
        <span class="product-card__category">${product.category}</span>
      </div>
    </div>
  </div>
`).join('')
}

function renderStars(rating) {
    let stars=''
    for (let i=1; i<=5; i++) {
        if (i <= rating) {
        stars += '<span class="star full">★</span>';
    } else {
        stars += '<span class ="star empty">☆</span>';
        }
    }
    return stars + `<span class="rating-num">(${rating})</span>`
}

function applySortAndFilter() {
    const sortValue=document.getElementById('sort-select').value
    const maxPrice = parseFloat(document.getElementById('price-range').value)
    const ratingInput = document.querySelector('input[name="rating"]:checked')
    const minRaiting = ratingInput ? parseFloat(ratingInput.value) : 0

    let result = products.filter(p => {
        return p.price <= maxPrice && p.rating >=minRaiting
        })
        if (sortValue === 'name-asc') {
            result.sort((a,b) => a.name.localeCompare(b.name))
        }else if (sortValue === 'name-desc'){
            result.sort((a,b) => b.name.localeCompare(a.name))
        }   else if (sortValue === 'price-asc') {
            result.sort((a,b) => a.price - b.price)
        } else if (sortValue === 'price-desc') {
            result.sort((a,b) => b.price - a.price)
        }
        renderProducts(result)
    }

function clearFilters() {
    document.getElementById('price-range').value = 3000
    document.getElementById('price-max').textContent = '$3000'
    const checked = document.querySelector ('input[name="rating"]:checked')
    if (checked) checked.checked = false
    applySortAndFilter()
}


//ползунок и движение 
document.addEventListener('DOMContentLoaded', function () {
    const range = document.getElementById('price-range')
    if (range) {
        range.addEventListener('input', function () {
            document.getElementById('price-max').textContent = '$' + this.value
            applySortAndFilter()
        })
    }
//фильтр по рейтингу

document.querySelectorAll('input[name="rating"]').forEach(input => {
 input.addEventListener('change', applySortAndFilter)   
});

renderProducts(products)
})
//сделаю потом Денис андреевич, пж стиля навалите