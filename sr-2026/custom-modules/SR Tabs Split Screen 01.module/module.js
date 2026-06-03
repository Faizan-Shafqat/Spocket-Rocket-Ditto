if (window.innerWidth > 767) {
    // Find all instances of this module on the page
    const moduleInstances = document.querySelectorAll('.sr-tabs-split-screen-01');
    
    moduleInstances.forEach(moduleInstance => {
        const sections = moduleInstance.querySelectorAll('[data-section]');
        const options = {
            threshold: 0.3
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const intersecting = entry.isIntersecting;

                if (intersecting) {
                    moduleInstance.querySelector(`[data-image="${entry.target.dataset.section}"`).classList.add('active');
                    moduleInstance.querySelector(`[data-link="${entry.target.dataset.section}"]`).classList.add('active');
                    moduleInstance.querySelector('.sr-tabs-split-screen-01-image [data-title] .heading').textContent = moduleInstance.querySelector(`[data-section="${entry.target.dataset.section}"]`).dataset.title;
                    moduleInstance.querySelector('.sr-tabs-split-screen-01-image [data-title] .heading').classList.forEach(classlist => {
                        if (classlist.startsWith('text-')) {
                            moduleInstance.querySelector('.sr-tabs-split-screen-01-image [data-title] .heading').classList.remove(classlist);
                        }
                        moduleInstance.querySelector('.sr-tabs-split-screen-01-image [data-title] .heading').classList.add(moduleInstance.querySelector(`[data-section="${entry.target.dataset.section}"]`).dataset.textColor);
                    })
                    moduleInstance.querySelector('.sr-tabs-split-screen-01-image__overlay').dataset.overlay = entry.target.dataset.section;
                } else {
                    moduleInstance.querySelector(`[data-image="${entry.target.dataset.section}"`).classList.remove('active');
                    moduleInstance.querySelector(`[data-link="${entry.target.dataset.section}"]`).classList.remove('active');
                }

                if (moduleInstance.querySelectorAll('[data-image].active').length === 0) {
                    const imageLength = moduleInstance.querySelectorAll('[data-image]').length - 1;

                    if (moduleInstance.getBoundingClientRect().top > 0) {
                        moduleInstance.querySelectorAll('[data-image]')[0].classList.add('active');
                    } else if (moduleInstance.querySelector(`[data-section="${imageLength}"`).getBoundingClientRect().top < 0) {
                        moduleInstance.querySelectorAll('[data-image]')[imageLength].classList.add('active');
                    }
                }
            });
        }, options)

        sections.forEach(section => {
            observer.observe(section);
        });

        Array.from(moduleInstance.querySelectorAll('.menu li')).forEach(menu => menu.addEventListener('click', function() {
            const section = this.dataset.link;

            moduleInstance.querySelector(`[data-section="${section}"`).scrollIntoView({ behavior: 'smooth' });
        }));
    });
}