document.addEventListener("DOMContentLoaded", function () {
    Array.from(document.querySelectorAll('.sr-hero-500')).forEach(function (instance) {
        if (instance.dataset.parallax == "true") {
            var coverInner = instance.querySelector('.sr-cover-inner');
            gsap.to(coverInner, {
                scrollTrigger: {
                    trigger: instance,
                    start: "bottom bottom",
                    end: "60%",
                    scrub: true
                },
                y: 30
            });
            var backgroundOption = instance.dataset.backgroundOption;
            if (backgroundOption == "image" || backgroundOption == "video") {
                var coverImage = instance.querySelector('.sr-cover-image');
                gsap.to(coverImage, {
                    scrollTrigger: {
                        trigger: instance,
                        start: "top top",
                        end: "250%",
                        scrub: true
                    },
                    y: "80%",
                    ease: "none"
                });
                gsap.to(coverImage, {
                    scrollTrigger: {
                        trigger: instance,
                        start: "top top",
                        end: "50%",
                        scrub: true
                    },
                    opacity: 0.4,
                    ease: "none"
                });
            }
        }
    });adocument.addEventListener("DOMContentLoaded", function () {
        Array.from(document.querySelectorAll('.sr-hero-500')).forEach(function (instance) {
            if (instance.dataset.parallax == "true") {
                var coverInner = instance.querySelector('.sr-cover-inner');
                gsap.to(coverInner, {
                    scrollTrigger: {
                        trigger: instance,
                        start: "bottom bottom",
                        end: "60%",
                        scrub: true
                    },
                    y: 30
                });
                var backgroundOption = instance.dataset.backgroundOption;
                if (backgroundOption == "image" || backgroundOption == "video") {
                    var coverImage = instance.querySelector('.sr-cover-image');
                    gsap.to(coverImage, {
                        scrollTrigger: {
                            trigger: instance,
                            start: "top top",
                            end: "250%",
                            scrub: true
                        },
                        y: "80%",
                        ease: "none"
                    });
                    gsap.to(coverImage, {
                        scrollTrigger: {
                            trigger: instance,
                            start: "top top",
                            end: "50%",
                            scrub: true
                        },
                        opacity: 0.4,
                        ease: "none"
                    });
                }
            }
        });
    });
    
});
