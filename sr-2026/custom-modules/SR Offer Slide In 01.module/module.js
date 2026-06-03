document.addEventListener("DOMContentLoaded", function () {
	const slideInElements = document.querySelectorAll('.sr-offer-slide-in-01');

	slideInElements.forEach((slideInElement) => {
		const offerElement = slideInElement.querySelector('.offer');

		if (offerElement.dataset.scroll === 'true') {
			const revealAnimation = gsap.timeline({
				scrollTrigger: {
					trigger: slideInElement,
					start: 'top 80%',
					once: true
				},
				onStart: () => {
					slideInElement.querySelector('.hide-button').classList.add('show');
				}
			});
			revealAnimation.fromTo(
				offerElement,
				{ height: 0 },
				{ height: 'auto', duration: .75 }
			);
		}

		const hideButton = slideInElement.querySelector('.hide-button');

		hideButton.addEventListener('click', () => {
			if (hideButton.classList.contains('show')) {
				gsap.to(offerElement, { height: 0, duration: .75 });
			} else {
				gsap.to(offerElement, { height: 'auto', duration: .75 });
			}
			hideButton.classList.toggle('show');
		});
	});
});