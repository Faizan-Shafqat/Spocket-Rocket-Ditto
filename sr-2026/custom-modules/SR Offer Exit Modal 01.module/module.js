
(function() {
  const exit = document.querySelector('#exit-popup');
  if (!exit || exit.hasAttribute('data-preview')) return;
  
  const once = exit.dataset.once === 'true';
  const timer = exit.dataset.timer;
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000); // Adding 60 minutes to current time
  let shown = false;
  
  // Custom showModal function
  function showModal() {
    exit.style.display = 'block';
    exit.classList.add('show');
    document.body.classList.add('modal-open');
  }
  
  // Custom hideModal function
  function hideModal() {
    exit.style.display = 'none';
    exit.classList.remove('show');
    document.body.classList.remove('modal-open');
    
    if (once) Cookie.set('exitIntentShown', true, expirationDate);
  }
  
  // Close button handler
  const closeButton = exit.querySelector('[data-dismiss="modal"]');
  if (closeButton) {
    closeButton.addEventListener('click', hideModal);
  }
  
  // Escape key handler
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && exit.classList.contains('show')) {
      hideModal();
    }
  });
  
  // Exit intent detection
  document.addEventListener('mousemove', function (e) {
    const mousePos = e.pageY - window.pageYOffset;
    if (mousePos <= 7) {
      if ((!once || !Cookie.get('exitIntentShown')) && !shown) {
        showModal();
        shown = true;
      }
    }
  });
  
  // Timer trigger
  if (timer) {
    setTimeout(function () {
      if ((!once || !Cookie.get('exitIntentShown')) && !shown) {
        showModal();
        shown = true;
      }
    }, +timer * 1000);
  }
})();
