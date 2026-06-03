
/** Handle scrolling **/
const nav = document.querySelector('.header__container--min');
if (nav.dataset.fixed === 'true') {
    let previousScrollPosition = 0;
    const handleNavScroll = () => {
        const navH = nav.offsetHeight;
        const st = window.scrollY || document.documentElement.scrollTop;
        const isScrollingDown = st > previousScrollPosition;
        previousScrollPosition = st;
        if (isScrollingDown && nav.classList.contains('header-scroll')) {
            nav.classList.add('scroll-down');
            nav.classList.remove('scroll-up');
        } else if (nav.classList.contains('scroll-down')) {
            nav.classList.add('scroll-up');
            nav.classList.remove('scroll-down');
        }
        if (st < 1) {
            nav.classList.remove('header-scroll');
            nav.classList.remove('scroll-up');
            if (nav.dataset.transparent == 'false') document.body.style.paddingTop = null;
        } else if (nav.dataset.scroll == 'false' || st > navH) {
            nav.classList.add('header-scroll');
            if (nav.dataset.transparent == 'false') document.body.style.paddingTop = `${navH}px`;
        }
    };
    window.addEventListener('scroll', handleNavScroll);
}