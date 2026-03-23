function renderStars(rating) {
  const r = Math.min(5, Math.max(0, Number(rating) || 0))
  let html = '<span class="stars-inline">'
  for (let i = 1; i <= 5; i++) {
    if (r >= i) {
      html += '<span class="star star--full">★</span>'
    } else if (r >= i - 0.5) {
      html += '<span class="star star--half" aria-hidden="true"><span class="star__half-bg">☆</span><span class="star__half-fg">★</span></span>'
    } else {
      html += '<span class="star star--empty">☆</span>'
    }
  }
  html += '</span>'
  return html + `<span class="rating-num">(${r})</span>`
}
