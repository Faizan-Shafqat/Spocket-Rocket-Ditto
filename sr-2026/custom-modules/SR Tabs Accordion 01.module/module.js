document.querySelectorAll('.sr-tabs-accordion-01 .details-group').forEach(group => {
    const oneVisible = group.dataset.one === 'true';
    // Instantiate Details for each group with configurations
    const detailsInstance = new Details(group, { one_visible: oneVisible });
    
    const loadMoreBtn = group.parentElement.querySelector('.btn-wrapper .load-more-button');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', event => {
            event.preventDefault();
            Array.from(group.querySelectorAll('details[hidden]')).forEach(detail => {
                detail.removeAttribute('hidden');
            });
            detailsInstance.render();
            loadMoreBtn.remove();
        });
    }
});