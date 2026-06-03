(function() {
	const modules = document.querySelectorAll('.sr-tabs-01');
	
	modules.forEach(function(moduleContainer) {
		const tabStyle = moduleContainer.dataset.tabStyle;
		const activeTabStyle = moduleContainer.dataset.activeTabStyle;

		// Only proceed if tab style is custom
		if (tabStyle !== 'custom') return;
		
		const navItems = moduleContainer.querySelectorAll('.nav-item');
		const tabLinks = moduleContainer.querySelectorAll('.nav-link');

		function updateActiveTabStyling() {
			navItems.forEach(navItem => {
				const navLink = navItem.querySelector('.nav-link');
				const isActive = navLink && navLink.classList.contains('active');
				navItem.classList.remove(`btn-${activeTabStyle}-wrapper`);
				if (isActive) {
					navItem.classList.add(`btn-${activeTabStyle}-wrapper`);
				}
			});
		}

		// Listen for clicks on tab links to update active styling
		tabLinks.forEach(function(tabLink) {
			tabLink.addEventListener('click', function() {
				setTimeout(updateActiveTabStyling, 0);
			});
			tabLink.addEventListener('keydown', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					tabLink.click();
				}
			});
		});
		updateActiveTabStyling();
	});
})();
