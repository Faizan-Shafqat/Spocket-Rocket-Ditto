(function () {
	const module_selector = '.sr-cards-steps-01';
	const extra_height_px = 150;
	let resizeTimeout = null;

	const setCardContentHeight = (moduleEl) => {
		if (!moduleEl) {
			return;
		}

		const cardContents = moduleEl.querySelectorAll('.card-content');

		if (typeof equalHeight === 'function' && cardContents.length) {
			equalHeight(cardContents);
		}
	};

	const setCardsContainerHeight = (moduleEl) => {
		if (!moduleEl) {
			return;
		}

		const cardsContainer = moduleEl.querySelector('.cards');

		if (!cardsContainer) {
			return;
		}

		const containerHeight = cardsContainer.getBoundingClientRect().height;

		if (!containerHeight) {
			return;
		}

		moduleEl.style.setProperty(
			'--cards-container-height',
			`${Math.round(containerHeight + extra_height_px)}px`,
		);
	};

	const initializeModule = () => {
		document.querySelectorAll(module_selector).forEach((moduleEl) => {
			setCardContentHeight(moduleEl);
			requestAnimationFrame(() => setCardsContainerHeight(moduleEl));
		});
	};

	document.addEventListener('DOMContentLoaded', initializeModule);

	window.addEventListener('resize', () => {
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}

		resizeTimeout = setTimeout(() => {
			document.querySelectorAll(module_selector).forEach((moduleEl) => {
				setCardContentHeight(moduleEl);
				requestAnimationFrame(() => setCardsContainerHeight(moduleEl));
			});
		}, 150);
	});
})();