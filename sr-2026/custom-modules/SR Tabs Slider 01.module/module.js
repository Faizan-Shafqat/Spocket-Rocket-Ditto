document.addEventListener('DOMContentLoaded', function () {
document.querySelectorAll('.sr-tabs-slider-01 .blaze-slider').forEach(el => {
    const slidesToShowXL = parseInt(el.dataset.stsXl);
    const slidesToShowLG = parseInt(el.dataset.stsLg);
    const slidesToShowMD = parseInt(el.dataset.stsMd);
    const slidesToShowSM = parseInt(el.dataset.stsSm);
  
    new BlazeSlider(el, {
        all: {
            draggable: false,
            enableAutoplay: el.dataset.autoplay == 'true',
            autoplayInterval: +el.dataset.autoplayspeed * 1000,
            transitionDuration: 300,
            slidesToShow: slidesToShowXL
        },
        '(max-width: 1199px)': {
            slidesToShow: slidesToShowLG
        },
        '(max-width: 991px)': {
            slidesToShow: slidesToShowMD,
            draggable: true
        },
        '(max-width: 767px)': {
            slidesToShow: slidesToShowSM,
            draggable: true
        }
    });
  });
})