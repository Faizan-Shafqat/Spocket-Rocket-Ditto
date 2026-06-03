document.querySelectorAll('.sr-showcase .blaze-slider').forEach((el) => {
  new BlazeSlider(el, {
    all: {
      draggable: false,
      enableAutoplay: true,
      autoplayInterval: 4000,
      transitionDuration: 300,
      slidesToShow: 1,
      slidesToScroll: 1
    }
  })
})
