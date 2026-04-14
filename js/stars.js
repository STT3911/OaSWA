function renderStars(rating) {
  const r = Math.min(5, Math.max(0, Number(rating) || 0))
  let html = '<span class="stars-inline">'

  for (let i = 1; i <= 5; i++) {
    if (r >= i) {
      html += '<span class="star star--full">&#9733;</span>'
    } else if (r >= i - 0.5) {
      html += '<span class="star star--half" aria-hidden="true"><span class="star__half-bg">&#9734;</span><span class="star__half-fg">&#9733;</span></span>'
    } else {
      html += '<span class="star star--empty">&#9734;</span>'
    }
  }

  html += '</span>'
  return html + `<span class="rating-num">(${r})</span>`
}
