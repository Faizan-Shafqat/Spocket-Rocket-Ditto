document.addEventListener("DOMContentLoaded", function () {
    var parallaxElements = document.querySelectorAll(".sr-offer-parallax-01-image");
    parallaxElements.forEach(function (element) {
        gsap.to(element.querySelector(".parallax-image"), {
            y: "25%",
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
        });
    });
});