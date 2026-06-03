document.addEventListener("DOMContentLoaded", function () {
    
    gsap.registerPlugin(ScrollTrigger);

    Array.from(document.querySelectorAll('.sr-hero-parallax-01')).forEach(function (instance) {
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
                gsap.fromTo(coverImage, 
                    { 
                        y: "-25%" 
                    },
                    {
                        y: "25%",
                        ease: "power1.out",
                        scrollTrigger: {
                            trigger: instance,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
                
                gsap.to(coverImage, {
                    scrollTrigger: {
                        trigger: instance,
                        start: "top bottom",
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
