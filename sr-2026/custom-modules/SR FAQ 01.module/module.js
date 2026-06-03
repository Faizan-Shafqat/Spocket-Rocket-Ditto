document.querySelectorAll('.sr-faq-01').forEach(function (el) {
    const loadMoreBtn = el.querySelector('.load-more-button');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            Array.from(el.querySelectorAll('.faq-item')).forEach((element) => {
                element.classList.remove('d-md-none');
            });
            loadMoreBtn.remove();
        });
    }

    let slider = null; // Reference to the slider instance

    function initializeBlazeSlider () {
        const sliderElement = el.querySelector('.blaze-slider');
        el.querySelector('.blaze-pagination ').innerHTML = '';
        if (sliderElement && !slider) {
            slider = new BlazeSlider(sliderElement, {
                all: {
                    draggable: true,
                    enableAutoplay: true,
                    autoplayInterval: 3000,
                    transitionDuration: 300,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            });
        }
    }

    function destroyBlazeSlider () {
        if (slider !== null) {
            el.querySelector('.blaze-pagination ').innerHTML = '';
            slider.destroy();
        }
    }

    function handleWindowResize () {
        if (window.innerWidth < 768) {
            if (slider === null) {
                initializeBlazeSlider();
            }
        } else {
            destroyBlazeSlider();
        }
    }

    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleWindowResize, 250);
    });

    let resizeTimeout;
    handleWindowResize();
});
