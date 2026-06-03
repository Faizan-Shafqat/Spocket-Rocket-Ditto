document.addEventListener("DOMContentLoaded", function () {
    const body = document.querySelector('body');
    const smartPopups = document.querySelectorAll('.sr-offer-smart-pop-01');
    let userClosed = false;

    const setPopupPosition = function (popup) {
        const smartPopContent = popup.querySelector('.smart-pop-content');
        const smartPopOpenWrapper = popup.querySelector('.smart-pop-open-wrapper');
        const smartPopShowH = smartPopContent.offsetHeight;
        body.style.paddingBottom = smartPopOpenWrapper.offsetHeight + 'px';
        popup.style.bottom = -smartPopShowH + 'px';
    };

    const showPopup = function (popup) {
        popup.style.opacity = '1';
        if (!Cookie.get('smartPopShown') && !userClosed) {
            popup.classList.toggle('up');
        }
        if (!Cookie.get('smartPopShown')) {
            Cookie.set('smartPopShown', true, new Date(Date.now() + 60 * 60 * 1000));
        }
    };

    smartPopups.forEach(function (popup) {
        setPopupPosition(popup);
        setTimeout(function () { showPopup(popup); }, +popup.dataset.timer * 1000);
    });

    window.addEventListener("resize", function () {
        smartPopups.forEach(function (popup) {
            setPopupPosition(popup);
        });
    });

    smartPopups.forEach(function (popup) {
        const smartPopOpenWrapper = popup.querySelector('.smart-pop-open-wrapper');
        smartPopOpenWrapper.addEventListener('click', function () {
            let smartPopShowH = popup.querySelector('.smart-pop-content').offsetHeight;
            if (window.innerWidth < 767) {
                smartPopShowH = popup.querySelector('.smart-pop-content').offsetHeight;
            }

            popup.style.bottom = -smartPopShowH + 'px';
            popup.classList.toggle('up');

            userClosed = true;
        });
    });

    document.addEventListener("scroll", function (e) {
        const winheight = window.innerHeight;
        const docheight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const trackLength = docheight - winheight;
        const scrollPercent = Math.floor(scrollTop / trackLength * 100);

        smartPopups.forEach(function (popup) {
            if ((scrollPercent < 50) && (popup.classList.contains('up'))) {
                setPopupPosition(popup);
                popup.classList.toggle('up');
            }

            if (scrollPercent > 50 && !(popup.classList.contains('up')) && !userClosed) {
                setPopupPosition(popup);
                popup.style.opacity = '1';
                if (!Cookie.get('smartPopShown')) {
                    popup.classList.toggle('up');
                }
                if (!Cookie.get('smartPopShown')) {
                    Cookie.set('smartPopShown', true, new Date(Date.now() + 60 * 60 * 1000));
                }
            }
        });
    });
});
