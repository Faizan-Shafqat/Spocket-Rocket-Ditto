const features = document.querySelectorAll('.sr-offer-bar-05 .feature')

const observer = new IntersectionObserver(function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const feature = entry.target
      const featureTl = new TimelineMax()

      featureTl.to(feature, 0.6, { opacity: 1, ease: Back.easeOut.config(1.7) }, 0.1)
      featureTl.fromTo(feature.querySelector('div.circle1'), 0.6, { scale: 0.7, opacity: 0, ease: Back.easeOut.config(1.7) }, { scale: 1, opacity: 0.8, ease: Back.easeOut.config(1.7) }, 0.1)
      featureTl.fromTo(feature.querySelector('div.circle2'), 0.6, { scale: 0.7, opacity: 0, ease: Back.easeOut.config(1.7) }, { scale: 1, opacity: 0.8, ease: Back.easeOut.config(1.7) }, 0.2)
      featureTl.fromTo(feature.querySelector('div.circle3'), 0.6, { scale: 0.7, opacity: 0, ease: Back.easeOut.config(1.7) }, { scale: 1, opacity: 0.5, ease: Back.easeOut.config(1.7) }, 0.3)
      featureTl.fromTo(feature.querySelector('div.circle4'), 0.6, { scale: 0.7, opacity: 0, ease: Back.easeOut.config(1.7) }, { scale: 1, opacity: 0.1, ease: Back.easeOut.config(1.7) }, 0.4)
      featureTl.fromTo(feature.querySelector('div.circle5'), 0.6, { scale: 0.7, opacity: 0, ease: Back.easeOut.config(1.7) }, { scale: 1, opacity: 0.1, ease: Back.easeOut.config(1.7) }, 0.5)
      featureTl.from(feature.querySelector('.sr-offer-bar-05 .feature-image'), 0.6, { scale: 1.2, y: 30, opacity: 0, ease: Power2.easeOut })

      featureTl.play()
      observer.unobserve(feature)
    }
  })
}, {
  threshold: 0.75
})

features.forEach(feature => {
  observer.observe(feature)
})
