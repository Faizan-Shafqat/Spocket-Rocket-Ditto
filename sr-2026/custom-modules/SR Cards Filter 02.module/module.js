document.addEventListener("DOMContentLoaded", function () {
    const moduleInstances = document.querySelectorAll('.sr-cards-filter-02');

    function getQueryParam() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('filter02');
    }

    function updateURL(filter) {
        const cleanFilter = filter === '*' ? '' : filter.replace('.tag-', '');
        const urlParams = new URLSearchParams(window.location.search);
        if (cleanFilter) {
            urlParams.set('filter02', cleanFilter);
        } else {
            urlParams.delete('filter02');
        }
        const newURL = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState({}, '', newURL);
    }

    function filterItems(grid, filterValue) {
        if (!grid) return;
        
        const items = grid.querySelectorAll('.sr-cards-filter-02-item');
        const targetClass = filterValue.replace('.', '');
        
        items.forEach(item => {
            const shouldShow = filterValue === '*' || item.classList.contains(targetClass);
            
            if (shouldShow) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    moduleInstances.forEach(function (instance) {
        const grid = instance.querySelector('.sr-cards-filter-02-items');
        const buttons = instance.querySelectorAll('.filter-button-group button');
        const loadMoreBtn = instance.querySelector('.load-more');
        
        let filterValue = getQueryParam();
        filterValue = filterValue ? `.tag-${filterValue}` : '*';

        const images = grid.getElementsByTagName('img');
        const loadedImages = [];

        function initFilter() {
            if (!grid || !buttons.length) return;
            
            if (filterValue !== '*') {
                const activeButton = Array.from(buttons).find(button => 
                    button.getAttribute('data-filter') === filterValue
                );
                if (activeButton) {
                    buttons.forEach(btn => btn.classList.remove('active', 'text-primary'));
                    activeButton.classList.add('active', 'text-primary');
                }
                filterItems(grid, filterValue);
                
                if (loadMoreBtn) {
                    loadMoreBtn.classList.add('d-none');
                }
                Array.from(instance.querySelectorAll('.sr-cards-filter-02-items')).forEach(item => {
                    item.classList.remove('hideitems');
                });
            }

            buttons.forEach(button => {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    
                    this.classList.add('active', 'text-primary');
                    Array.from(this.parentNode.children).forEach(sibling => {
                        if (sibling !== this)
                            sibling.classList.remove('active', 'text-primary');
                    });
                    
                    filterValue = this.getAttribute('data-filter');
                    updateURL(filterValue);
                    
                    Array.from(instance.querySelectorAll('.sr-cards-filter-02-items')).forEach(item => {
                        item.classList.remove('hideitems');
                    });
                    Array.from(instance.querySelectorAll('.load-more')).forEach(item => {
                        item.classList.add('d-none');
                    });
                    
                    filterItems(grid, filterValue);
                });
            });

            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    Array.from(instance.querySelectorAll('.sr-cards-filter-02-items')).forEach(card => {
                        card.classList.remove('hideitems');
                    });
                    filterItems(grid, filterValue);
                    if (this.classList.contains('d-none')) {
                        this.classList.remove('d-none');
                    } else {
                        this.classList.add('d-none');
                    }
                });
            }
        }

        if (images.length === 0) {
            initFilter();
        } else {
            Array.from(images).forEach(img => {
                if (img.complete) {
                    loadedImages.push(img);
                    if (loadedImages.length === images.length) {
                        initFilter();
                    }
                } else {
                    img.addEventListener('load', function() {
                        loadedImages.push(img);
                        if (loadedImages.length === images.length) {
                            initFilter();
                        }
                    });
                }
            });
        }
    });
});