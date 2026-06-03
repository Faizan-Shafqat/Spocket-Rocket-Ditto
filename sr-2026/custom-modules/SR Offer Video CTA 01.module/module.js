let observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('active')
        if (entry.target.dataset.autoplay == 'true') {
          const feature_video = entry.target.querySelectorAll('video')
          if (feature_video) {
            feature_video.forEach(v => {
              setTimeout(function() {
                v.autoplay = true
                v.play()
              }, 1200)
            })
          }
        }

        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.9 }
)

document
  .querySelectorAll('.sr-offer-video-cta-01 .sr-offer-video-cta-01-video')
  .forEach(p => {
    observer.observe(p)
  })
