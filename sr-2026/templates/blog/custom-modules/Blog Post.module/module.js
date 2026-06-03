window.addEventListener('DOMContentLoaded', () => {
    const tocContainer = document.querySelector('.blog-toc__container');
    if (!tocContainer) return;

    const headings = document.querySelectorAll('.toc-heading[id]');

    function updateActiveClass(id) {
        document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
        document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active');
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                updateActiveClass(entry.target.getAttribute('id'));
            }
        });
    }, {
        rootMargin: "0px 0px -200px 0px"
    });

    headings.forEach((section) => {
        observer.observe(section);
    });

    tocContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').slice(1);
            updateActiveClass(id);
            document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        });
    });

    const toc = document.querySelector(".blog-toc__container");
    const nav = document.querySelector(".header__container");
    toc.style.setProperty('--top', `${nav.offsetHeight + 15}px`);
});