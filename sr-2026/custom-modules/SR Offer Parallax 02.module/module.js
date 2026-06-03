
document.addEventListener("DOMContentLoaded", function () {
    var parallaxElements = document.querySelectorAll(".sr-offer-parallax-02-image");
    parallaxElements.forEach(function (element) {
        gsap.to(element.querySelector("img"), {
            y: "50%",
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