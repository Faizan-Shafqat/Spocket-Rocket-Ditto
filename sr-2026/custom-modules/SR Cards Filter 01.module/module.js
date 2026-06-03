document.addEventListener("DOMContentLoaded", function () {
	const moduleInstances = document.querySelectorAll('.sr-cards-filter-01');

	function getQueryParam() {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get('filter01');
	}

	function updateURL(filter) {
		const cleanFilter = filter === '*' ? '' : filter;
		const urlParams = new URLSearchParams(window.location.search);
		if (cleanFilter) {
			urlParams.set('filter01', cleanFilter);
		} else {
			urlParams.delete('filter01');
		}
		const newURL = `${window.location.pathname}?${urlParams.toString()}`;
		history.pushState({}, '', newURL);
	}

	function filterItems(container, selector) {
		const items = container.querySelectorAll('.item');
		
		items.forEach(item => {
			if (selector === '*') {
				item.style.display = 'block';
			} else {
				const classes = selector.split('.');
				const hasAllClasses = classes.every(cls => {
					if (cls === '') return true;
					return item.classList.contains(cls);
				});
				
				if (hasAllClasses) {
					item.style.display = 'block';
				} else {
					item.style.display = 'none';
				}
			}
		});
	}

	moduleInstances.forEach(function (instance) {
		const container = instance.querySelector('.isotope.items');
		const items = Array.from(container.querySelectorAll('.item'));
		const filters = instance.querySelectorAll('.filter-option select');
		
		let currentFilter = getQueryParam() || '*';

		if (currentFilter !== '*') {
			filters.forEach(filter => {
				if (filter.value === currentFilter) {
					filter.value = currentFilter;
				}
			});
			filterItems(container, currentFilter);
		}

		if (instance.querySelector('.filter-option')) {
			filters.forEach((filter) => {
				filter.addEventListener('change', function () {
					let selector = '';
					filters.forEach((option) => {
						if (option.value) {
							selector += option.value;
						}
					});
					
					if (!selector) {
						selector = '*';
					}
					
					updateURL(selector);
					
					Array.from(instance.querySelectorAll('.items')).forEach((item) => {
						item.classList.remove('hideitems');
					});
					Array.from(instance.querySelectorAll('.load-more-button')).forEach((item) => {
						item.remove();
					});
					
					filterItems(container, selector);
				});
			});
		}

		const loadMoreBtn = instance.querySelector('.load-more-button');
		if (loadMoreBtn) {
			loadMoreBtn.addEventListener('click', function (e) {
				e.preventDefault();
				Array.from(instance.querySelectorAll('.items')).forEach((element) => {
					element.classList.remove('hideitems');
				});
				loadMoreBtn.remove();
			});
		}
	});
});