document.querySelectorAll('.sr-logos .blaze-slider').forEach(el => {
    if (el.dataset.carousel == 'true') {
        new BlazeSlider(el, {
          all: {
            draggable: false,
            enableAutoplay: el.dataset.autoplay == 'true' ? true : false,
            autoplayInterval: +el.dataset.autoplayspeed * 1000,
            transitionDuration: 300,
            slidesToShow: +el.dataset.show,
            slidesToScroll: +el.dataset.scroll
          },
          '(max-width: 992px)': {
            slidesToShow: 2
          },
          '(max-width: 767px)': {
            slidesToShow: 1
          }
        })
    }
  })
