window.addEventListener('load', () => {
	initializeModules();
});
window.addEventListener('resize', function() {
	initializeModules();
});

function initializeModules() {
	// Find all module instances on the page
	const modules = document.querySelectorAll('[id^="gr-map"]');
	
	modules.forEach(module => {
		// Skip if already initialized
		if (module.dataset.initialized === 'true') return;
		
		// Mark as initialized
		module.dataset.initialized = 'true';
		
		// Initialize this specific module instance
		tooltip(module);
		renderCoordinates(module);
	});
}

function tooltip(module) {
	if (window.innerWidth >= 576) {
		const dots = module.querySelectorAll('.dot');
		const tooltips = module.querySelectorAll('.dot-card-wrapper');
		
		dots.forEach(dot => {
			dot.addEventListener('mouseenter', function() {
				// Remove active class from all tooltips in this module
				tooltips.forEach(tooltip => {
					tooltip.classList.remove('dot-card-wrapper--active');
				});
				showTooltip(dot, module);
			});
			dot.addEventListener('focus', function() {
				// Remove active class from all tooltips in this module
				tooltips.forEach(tooltip => {
					tooltip.classList.remove('dot-card-wrapper--active');
				});
				showTooltip(dot, module);
			});
		});

		tooltips.forEach(tooltip => {
			tooltip.addEventListener('mouseleave', function() {
				const getSiblings = function (elem) {
					return Array.prototype.filter.call(tooltip.parentNode.children, function (sibling) {
						return sibling !== tooltip;
					});
				};
				getSiblings().forEach(tooltip => tooltip.classList.remove('dot-card-wrapper--active'));
				tooltip.classList.remove('dot-card-wrapper--active');
			});
		});
	}
}

function renderCoordinates(module) {
	const mapImage = module.querySelector(".map");
	if (!mapImage) return;
	
	const mapWidth = mapImage.clientWidth;
	const mapHeight = mapImage.clientHeight;
	const dots = module.querySelectorAll('.dot');
	const latLong = [];

	[...dots].forEach(dot => {
		const coordinates = { lat: dot.dataset.lat, lon: dot.dataset.lon };
		latLong.push(coordinates);
	});

	latLong.forEach(({ lat, lon }, i) => {
		const x = (parseFloat(lon) + 180) * (mapWidth / 360);
		const y = Math.round(((-1 * parseFloat(lat)) + 90) * (mapHeight / 180));

		renderPointer(x, y, i, module);
	});
}

function renderPointer(x, y, i, module) {
	const dots = module.querySelectorAll('.dot');
	if (dots[i]) {
		dots[i].style.left = `${x}px`;
		dots[i].style.top = `${y}px`;
	}
}

function showTooltip(dot, module) {
	const mapImage = module.querySelector(".map");
	if (!mapImage) return;
	
	const mapWidth = mapImage.clientWidth;
	const dotX = dot.style.left;
	const dotY = dot.style.top;
	const TOOLTIP_WIDTH = 320;
	const TOOLTIP_MARGIN = 30;
	const index = dot.dataset.index;

	const tooltip = module.querySelector(`.dot-card-wrapper[data-index="${index}"]`);
	if (!tooltip) return;

	tooltip.style.left = `${dotX}`;
	tooltip.style.top = `${dotY}`;

	if (TOOLTIP_WIDTH + parseInt(dotX) > mapWidth) {
		const transform = `translateX(-${TOOLTIP_WIDTH + TOOLTIP_MARGIN}px) translateY(calc(-50% + 4px))`;

		tooltip.classList.add('dot-card-wrapper--active-right');
		tooltip.style.transform = transform;
	} else {
		const transform = `translateX(${TOOLTIP_MARGIN}px) translateY(calc(-50% + 4px))`;

		tooltip.style.transform = transform;
	}

	tooltip.classList.add('dot-card-wrapper--active');
}