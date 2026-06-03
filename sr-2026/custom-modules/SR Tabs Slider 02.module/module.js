document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.sr-tabs-slider-02 .splide').forEach(el => {
        const slidesToShowXL = parseInt(el.dataset.stsXl) || 1;
        const slidesToShowLG = parseInt(el.dataset.stsLg) || 1;
        const slidesToShowMD = parseInt(el.dataset.stsMd) || 1;
        const slidesToShowSM = parseInt(el.dataset.stsSm) || 1;
        
        const splideConfig = {
            pauseOnHover: false,
            pauseOnFocus: false,
            arrows: el.dataset.arrows === 'true',
            pagination: el.dataset.dots === 'true',
            autoplay: el.dataset.autoplay === 'true',
            interval: parseInt(el.dataset.autoplayspeed) * 1000 || 3000,
            focus: 'center',
            gap: '50px',
            perPage: slidesToShowXL,
            padding: '0',
            type: el.dataset.fade === 'true' ? "fade" : "loop",
            rewind: el.dataset.rewind === 'true',
            breakpoints: {
                1200: {
                    perPage: slidesToShowLG,
                },
                993: {
                    perPage: slidesToShowMD,
                },
                767: {
                    perPage: slidesToShowSM,
                }
            }
        };
        
        new Splide(el, splideConfig).mount();
    });
})