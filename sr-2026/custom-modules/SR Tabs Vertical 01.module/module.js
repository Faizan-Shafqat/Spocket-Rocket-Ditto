const modules = document.querySelectorAll('.sr-tabs-vertical-01');

modules.forEach(function (instance) {
    let details;
    instance.querySelectorAll(".details-group").forEach((detail) => {
        details = new Details(detail, {
            one_visible: detail.dataset.one
        });
    })
    const loadMoreBtn = instance.querySelector('.load-more-button');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            Array.from(instance.querySelectorAll('details')).forEach((element) => {
                element.removeAttribute('hidden');
            });
            loadMoreBtn.remove();
            details.render();
        });
    }

    let executed = false;
    const mediaQuery = window.matchMedia('(max-width: 992px)');

    function handleScreenSizeChange () {
        if (mediaQuery.matches && !executed) {
            details.render();
            executed = true;
        } else if (!mediaQuery.matches) {
            executed = false;
        }
    }

    window.addEventListener('resize', handleScreenSizeChange);

    const tabButtons = instance.querySelectorAll('.nav-link');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const moduleTop = instance.getBoundingClientRect().top + window.pageYOffset;
            const navHeight = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--navHeight')) || 50;
            window.scrollTo({
                top: moduleTop - navHeight,
                behavior: 'smooth'
            });
        });
    });
});