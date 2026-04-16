const STAR_PATH = 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z'

function renderStarSvg(className) {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${STAR_PATH}"></path></svg>`
}

function renderStars(rating) {
  const r = Math.min(5, Math.max(0, Number(rating) || 0))
  let html = '<span class="stars-inline" aria-label="Rating: ' + r + ' out of 5">'

  for (let i = 1; i <= 5; i++) {
    if (r >= i) {
      html += '<span class="star star--full">' + renderStarSvg('star__icon') + '</span>'
    } else if (r >= i - 0.5) {
      html += '<span class="star star--half" aria-hidden="true"><span class="star__half-bg">' + renderStarSvg('star__icon') + '</span><span class="star__half-fg">' + renderStarSvg('star__icon') + '</span></span>'
    } else {
      html += '<span class="star star--empty">' + renderStarSvg('star__icon') + '</span>'
    }
  }

  html += '</span>'
  return html + `<span class="rating-num">(${r})</span>`
}
