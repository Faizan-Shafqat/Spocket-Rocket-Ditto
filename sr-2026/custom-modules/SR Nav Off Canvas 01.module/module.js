document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.querySelector('.menu-toggle');
  const navOverlay = document.querySelector('.nav-overlay');
  const bar = document.querySelector('.bar');
  const form = document.querySelector(".search-bar__form");
  const inputField = document.querySelector(".hs-search-field__input");

  // Function to close the nav overlay
  const closeNavOverlay = () => {
    navOverlay.classList.remove('show');
    toggleButton.setAttribute('aria-expanded', 'false');
    navOverlay.setAttribute('aria-hidden', 'true');
    bar.classList.remove('active');
    document.body.classList.remove('lock-scroll');
    toggleButton.focus();
  };

  // Open/Close Nav Overlay on button click
  toggleButton.addEventListener('click', () => {
    const expanded = toggleButton.getAttribute('aria-expanded') === 'true' || false;
    if (expanded) {
      closeNavOverlay();
    } else {
      navOverlay.classList.add('show');
      toggleButton.setAttribute('aria-expanded', 'true');
      navOverlay.setAttribute('aria-hidden', 'false');
      bar.classList.add('active');
      document.body.classList.add('lock-scroll');
      // Move focus to the first menu item when the menu is opened
      const firstMenuItem = document.querySelector('.main-navigation .nav__link');
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }
  });

  // Close Nav Overlay on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navOverlay.classList.contains('show')) {
      closeNavOverlay();
    }
  });

  // Event listener for when the input field is clicked
  inputField.addEventListener("focus", () => {
    form.classList.add("focused");
  });
  // Event listener for when the input field loses focus
  inputField.addEventListener("blur", () => {
    form.classList.remove("focused");
  });

  // Make anchor links close the navigation
  const links = document.querySelectorAll('.main-navigation .nav__item .nav__link');
  links.forEach(function (link) {
    if (link && link.getAttribute('href') && link.getAttribute('href').includes('#')) {
      link.addEventListener('click', function (event) {
        document.body.classList.remove('lock-scroll');
        const mainMenu = document.querySelector('.nav-overlay');
        if (mainMenu) {
          mainMenu.classList.remove('show');
        }
        const menuBarMain = document.querySelector('.navbar-main .menu-toggle .bar');
        if (menuBarMain) {
          menuBarMain.classList.remove('active');
        }
      });
    }
  });
});