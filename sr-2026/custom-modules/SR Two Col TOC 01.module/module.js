window.addEventListener('DOMContentLoaded', () => {
    const mobileDropdown = document.querySelector('.mobile-toc-dropdown');
    if (mobileDropdown) {
        const currentTitle = mobileDropdown.querySelector('.current-section-title');
        const dropdownToggle = mobileDropdown.querySelector('.mobile-toc-current');
        const dropdownMenu = mobileDropdown.querySelector('.mobile-toc-menu');
        
        dropdownToggle.addEventListener('click', () => {
            mobileDropdown.classList.toggle('open');
            dropdownMenu.classList.toggle('open');
        });
        
        const dropdownLinks = dropdownMenu.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDropdown.classList.remove('open');
                dropdownMenu.classList.remove('open');
                
                currentTitle.textContent = link.textContent;
            });
        });
        
        document.addEventListener('click', (event) => {
            if (!mobileDropdown.contains(event.target)) {
                mobileDropdown.classList.remove('open');
                dropdownMenu.classList.remove('open');
            }
        });
    }
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            if (entry.intersectionRatio > 0) {
                const desktopNavItem = document.querySelector(`nav li a[href="#${id}"]`);
                if (desktopNavItem) {
                    document.querySelectorAll('nav li a').forEach(li => li.classList.remove('active'));
                    desktopNavItem.classList.add('active');
                }
                
                const mobileNavItem = document.querySelector(`.mobile-toc-menu li a[href="#${id}"]`);
                if (mobileNavItem) {
                    document.querySelectorAll('.mobile-toc-menu li a').forEach(li => li.classList.remove('active'));
                    mobileNavItem.classList.add('active');
                    
                    const currentTitle = document.querySelector('.current-section-title');
                    if (currentTitle) {
                        currentTitle.textContent = mobileNavItem.textContent;
                    }
                }
            }
        });
    }, {
        rootMargin: '-20% 0px -70% 0px'
    });
    
    document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
    });
});