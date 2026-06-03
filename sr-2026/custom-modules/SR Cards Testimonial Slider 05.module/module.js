document.addEventListener('DOMContentLoaded', function () {
document
  .querySelectorAll('.sr-cards-testimonial-slider-05 .blaze-slider')
  .forEach(el => {
    new BlazeSlider(el, {
      all: {
        draggable: false,
        enableAutoplay: el.dataset.autoplay == 'true' ? true : false,
        autoplayInterval: +el.dataset.autoplayspeed * 1000,
        transitionDuration: 300,
        slidesToShow: 1,
        slidesToScroll: 1
      },
      '(max-width: 767px)': {
        slidesToShow: 1
      }
    })
  })
})