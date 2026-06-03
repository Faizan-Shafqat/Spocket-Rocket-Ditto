document.addEventListener('DOMContentLoaded', () => {
    // Initial setup for module toggles
    const modules = document.querySelectorAll(".srp");
    modules.forEach(module => {
        const switchInputs = module.querySelectorAll(".switch-wrapper input");
        switchInputs.forEach(input => {
            input.addEventListener("input", function () {
                module.dataset.toggle = input.value;
            });
        });
    });

    // Add keyboard accessibility to switch-wrapper labels
    modules.forEach(module => {
        const switchLabels = module.querySelectorAll(".switch-wrapper label");
        switchLabels.forEach(label => {
            label.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    const inputId = this.getAttribute("for");
                    const input = document.getElementById(inputId);
                    input.checked = true;
                    module.dataset.toggle = input.value;
                }
            });
        });
    });

    // Track which details elements were open on desktop view
    const openDetailsOnDesktopMap = new Map();

    // Iterate over all .srp instances
    modules.forEach(srp => {
        const openDetailsOnDesktop = new Set();
        openDetailsOnDesktopMap.set(srp, openDetailsOnDesktop);

        // Add click event listeners to details elements
        srp.querySelectorAll('.details-row details').forEach(detail => {
            detail.addEventListener('click', () => {
                if (detail.hasAttribute('open')) {
                    openDetailsOnDesktop.delete(detail);
                } else {
                    openDetailsOnDesktop.add(detail);
                }
            });
        });
    });

    function resizeHandler() {
        // Iterate over all .srp instances
        modules.forEach(srp => {
            const detailsRows = srp.querySelectorAll('.details-row');
            if (detailsRows.length === 0) return;

            const width = detailsRows[0].clientWidth;
            const openDetailsOnDesktop = openDetailsOnDesktopMap.get(srp);

            if (width < 993) {
                srp.querySelectorAll('.details-row details.closed-m').forEach(detail => {
                    if (detail.hasAttribute('open') && !openDetailsOnDesktop.has(detail)) {
                        detail.removeAttribute('open');
                    }
                });
            } else {
                openDetailsOnDesktop.forEach(detail => {
                    detail.setAttribute('open', '');
                });
            }
        });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize handler
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeHandler, 100);
    });
    
    resizeHandler(); // Ensure it runs when the page loads

    function updateHeaderHeight() {
        const srNav = document.querySelector('.header__bottom');
        const srpContainer = document.querySelector('.srp');
        
        if (srNav && srpContainer) {
            const headerHeight = srNav.offsetHeight;
            srpContainer.style.setProperty('--header-bottom-height', `${headerHeight}px`);
        }
    }

    // Initial update
    updateHeaderHeight();

    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);

    // Update when navigation changes (e.g., mobile menu opens/closes)
    const observer = new MutationObserver(updateHeaderHeight);
    const srNav = document.querySelector('.header__bottom');
    if (srNav) {
        observer.observe(srNav, { 
            attributes: true,
            childList: true,
            subtree: true
        });
    }
});
