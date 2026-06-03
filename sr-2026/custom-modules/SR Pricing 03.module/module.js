document.querySelectorAll('.sr-pricing-03').forEach(el => {
  const checkbox = el.querySelector('.pricing-toggle__checkbox')
  checkbox.addEventListener('change', function () {
    el.querySelectorAll('.pricing-text').forEach(price => {
      price.classList.toggle('pricing-text--active')
    })
    el.querySelectorAll('.pricing-cta-1').forEach(cta1 => {
      cta1.classList.toggle('pricing-cta-1--active')
    })
    el.querySelectorAll('.pricing-cta-2').forEach(cta2 => {
      cta2.classList.toggle('pricing-cta-2--inactive')
    })
  })
})
