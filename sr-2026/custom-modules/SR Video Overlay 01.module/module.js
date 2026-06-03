document.querySelectorAll('.sr-video-overlay-01').forEach(parentElem => {
    const open = parentElem.querySelector('.play-button-wrapper');
    const modal_container = parentElem.querySelector('.modal-container');
    const close = parentElem.querySelector('.close-button');
    const video = modal_container.querySelector('video'); // Assuming there's a <video> element inside the modal_container

    const openModal = () => {
        modal_container.classList.add('show');
        if (video) {
            video.play();
        }
    };

    const closeModal = () => {
        modal_container.classList.remove('show');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };
    open.addEventListener('click', openModal);
    close.addEventListener('click', closeModal);
    open.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal();
        }
    });

    close.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            closeModal();
        }
    });

    window.addEventListener('click', event => {
        if (event.target === modal_container) {
            closeModal();
        }
    });
});
