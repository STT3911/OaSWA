function renderProducts(list) {
    const grid = document.getElementById('products-grid')
    const count = document.getElementById('products-count')

    const.textContent = list.length + 'products'

    if(list.length === 0) {
        grid.innerHTML = '<p>No products found</p>'
        return
    }
    grid.innerHTML = list.map(product => '
        <div class="product-card">
        <a href="product.html?id=${product.id}">
            <img src="${product.images[0]}" alt="${product.name}">
        </a>
        <div class="product-card__info">
            <a href="product.html?id=${product.id}">
                <h3 class="product-card__name">${product.name}</h3>
            </a>
            <div class="prodcut-card__raiting">${renderStars(product.raiting)}</div>
            <div class="product-card__bottom">
                <span class="product-card__price">$${product.price}</span>
                <span class="product-card__category">$${product.category}</span>
            </div>
            <button class="btn-add" onClick="addToCart(${product.id})">Add To Cart</button>
            </div>
        </div>
        ').join('') 
}

function renderStars(raiting) {
    let stars=''
    for (let i=1; i<=5; i++) {
        stars+= '<span class="star full"★</span>'
    } else {
        stars+='<span class ="star empty">☆</span>' 
    }
    return stars + '<span class="raiting-num">(${raiting})</span>'
}

function applySortAndFilters() {
    const sortValue=document.getElementById('sort-select').value
    const maxPrice = parseFloat(document.getElementById('price-range').value)
    const raitingInput = document.querySelector('input[name="raiting"]:checked')
    const minRaiting = raitingInput ? parseFloat(raitingInput.value) : 0

    let result = renderProducts.filter(p => {
    result.sort((a, b) => a.name.localCompare(b.name))
        if (sortValue === 'name-asc') {
            result.sort((a,b) => a.name.localCompare(b.name))
        }else if (sortValue === 'name-desc'){
            result.sort((a,b) => b.name.localCompare(a.name))
        }   else if (sortValue === 'price-asc') {
            result.sort((a,b) => a.price - b.price)
        } else if (sortValue === 'price-desc') {
            result.sort((a,b) => b.price - a.price)
        }
        renderProducts(result)
    }
}

function clearFilters() {
    document.getElementById('price-range').value = 3000
    document.getElementById('price-max').textContent = '$3000'
    const checked = document.querySelector ('input[name="raiting"]:checked')
    if (checked) checked.checked = false
    applySortAndFilters()
}


//ползунок и движение 

//фильтр по рейтингу

//сделаю потом Денис андреевич, пж стиля навалите