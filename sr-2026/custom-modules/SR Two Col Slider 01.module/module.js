document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.sr-two-col-slider-01.splide').forEach(el => {
        new Splide(el, {
            arrows: el.dataset.arrows == 'true' ? true : false,
            pagination: el.dataset.pagination == 'true' ? true : false,
            autoplay: el.dataset.autoplay == 'true' ? true : false,
            interval: +el.dataset.autoplayspeed * 1000,
            type: 'loop',
            focus: 'center',
            gap: '0px',
            perPage: 1,
            padding: '0',
            type: el.dataset.fade == 'true' ? "fade" : "loop",
            rewind: el.dataset.fade == 'true' ? true : false,
            snap: el.dataset.scroll == 'true' ? false : true,
            autoScroll: {
                speed: +el.dataset.scrollspeed,
            },
            breakpoints: {
                993: {
                    arrows: false
                },
            }
        }).mount(el.dataset.scroll == 'true' ? window.splide.Extensions : null);
    });
})