document.addEventListener('DOMContentLoaded', function () {
    const sliderElements = document.querySelectorAll('.sr-video-slider-01 .splide');

    sliderElements.forEach(el => {
        const autoplay = el.dataset.autoplay === 'true';
        const autoplayInterval = (parseInt(el.dataset.autoplayspeed, 10) || 5) * 1000;

        const splide = new Splide(el, {
            type: 'loop',
            focus: 'center',
            perPage: 3,
            perMove: 1,
            gap: '30px',
            drag: false,
            arrows: el.dataset.arrows === 'true',
            pagination: el.dataset.dots === 'true',
            autoplay: autoplay,
            interval: autoplayInterval,
            pauseOnHover: true,
            pauseOnFocus: true,
            keyboard: 'focused',
            speed: 400,
            breakpoints: {
                767: {
                    perPage: 1,
                    gap: '16px'
                }
            }
        });

        const updateMinHeight = () => {
            const slideImages = el.querySelectorAll('.slide-image');
            if (!slideImages.length) {
                return;
            }

            let maxMinHeight = 0;
            slideImages.forEach(slide => {
                const minHeight = window.getComputedStyle(slide).minHeight;
                const minHeightValue = parseInt(minHeight, 10) || 0;
                maxMinHeight = Math.max(maxMinHeight, minHeightValue);
            });

            if (maxMinHeight > 0) {
                el.style.setProperty('--min-height', `${maxMinHeight}px`);
            }
        };

        const recalcHeights = () => {
            equalHeight(el.querySelectorAll('.slide-image'), true);
            updateMinHeight();
        };

        splide.on('mounted', () => {
            recalcHeights();
            updateFocusableSlides(el);
        });

        splide.on('moved', () => {
            updateFocusableSlides(el);
        });

        splide.on('resized', () => {
            recalcHeights();
            updateFocusableSlides(el);
        });

        splide.on('updated', () => {
            recalcHeights();
            updateFocusableSlides(el);
        });

        splide.mount();

        el.setAttribute('tabindex', '0');
        el.style.outline = 'none';

        el.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                splide.go('<');
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                splide.go('>');
            }
        });

        setTimeout(recalcHeights, 100);

        window.addEventListener('resize', () => {
            recalcHeights();
            updateFocusableSlides(el);
        });
    });

    const triggerElements = document.querySelectorAll('[data-theVideo]');

    triggerElements.forEach(function (element) {
        element.addEventListener("click", function () {
            var theModal = this.getAttribute("data-target");
            var videoSRC = this.getAttribute("data-theVideo");

            document.querySelector(theModal + " video").pause();
            document.querySelector(theModal + " video source").setAttribute('src', videoSRC);
            document.querySelector(theModal + " video").load();

            setTimeout(function() {
                var video = document.querySelector(theModal + " video");
                if (video) {
                    video.play();
                }
            }, 300);
        });
    });

    var modals = document.querySelectorAll('.sr-video-slider-01 .modal');
    modals.forEach(function(modal) {
        modal.addEventListener('hidden.bs.modal', function() {
            var video = this.querySelector('video');
            if (video) {
                video.pause();
            }
        });

        modal.addEventListener('click', function(e) {
            if (e.target === this || e.target.dataset.dismiss === 'modal') {
                var video = this.querySelector('video');
                if (video) {
                    video.pause();
                }
            }
        });
    });

    var slides = document.querySelectorAll(".video-slide");

    slides.forEach(function (slide) {
        slide.addEventListener("mouseenter", function () {
            var video = slide.querySelector("video");
            var videoSRC = video.getAttribute("data-src");

            if (!video.src) {
                fetchVideoAndPlay(video, videoSRC);
            } else {
                playVideo(video);
            }
        });

        slide.addEventListener("mouseleave", function () {
            var video = slide.querySelector("video");
            video.pause();
        });
    });
});

function fetchVideoAndPlay (video, videoSRC) {
    fetch(videoSRC)
        .then(function (response) {
            return response.blob();
        })
        .then(function (blob) {
            var objectURL = URL.createObjectURL(blob);
            video.src = objectURL;
            video.load();
            video.closest('.video-slide').classList.add("loaded");
            playVideo(video);
        })
        .catch(function (error) {
            console.error("Error fetching video:", error);
        });
}

function playVideo (video) {
    var playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(function (error) {
            video.play();
        });
    }
}

// Manage focusable slides for accessibility
function updateFocusableSlides(sliderEl) {
    sliderEl.querySelectorAll('.splide__slide').forEach(slide => {
        const isVisible = slide.getAttribute('aria-hidden') === 'false';
        slide.setAttribute('tabindex', isVisible ? '0' : '-1');
        slide.style.outline = 'none';
    });
}