(function () {
	const module_selector = '.sr-cards-grid-01';
	const card_selector = '.card';
	const extra_height_px = 150;
	const resize_debounce_ms = 150;
	let resizeTimeout = null;

	const setCardMinHeight = (moduleEl) => {
		if (!moduleEl) {
			return;
		}

		const cards = moduleEl.querySelectorAll(card_selector);

		if (!cards.length) {
			return;
		}

		moduleEl.style.setProperty('--card-min-height', 'auto');

		let maxHeight = 0;

		cards.forEach((card) => {
			const { height } = card.getBoundingClientRect();
			if (height > maxHeight) {
				maxHeight = height;
			}
		});

		if (!maxHeight) {
			return;
		}

		moduleEl.style.setProperty(
			'--card-min-height',
			`${Math.round(maxHeight + extra_height_px)}px`,
		);
	};

	const initializeModule = () => {
		document.querySelectorAll(module_selector).forEach((moduleEl) => {
			requestAnimationFrame(() => setCardMinHeight(moduleEl));
		});
	};

	const handleResize = () => {
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}

		resizeTimeout = setTimeout(() => {
			document.querySelectorAll(module_selector).forEach((moduleEl) => {
				requestAnimationFrame(() => setCardMinHeight(moduleEl));
			});
		}, resize_debounce_ms);
	};

	document.addEventListener('DOMContentLoaded', initializeModule);
	window.addEventListener('resize', handleResize);
})();

