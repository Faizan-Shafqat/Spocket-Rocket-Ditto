document.addEventListener('DOMContentLoaded', function () {
document.querySelectorAll('.sr-cards-testimonial-slider-02 .blaze-slider').forEach(el => {
    new BlazeSlider(el, {
        all: {
            draggable: true,
            enableAutoplay: el.dataset.autoplay == 'true' ? true : false,
            autoplayInterval: +el.dataset.autoplayspeed * 1000,
            transitionDuration: 300,
            slidesToShow: 1
        }
    })
})
})