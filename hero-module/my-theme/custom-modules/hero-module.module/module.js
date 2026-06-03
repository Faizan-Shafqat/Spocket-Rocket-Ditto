/*
 * Hero Module JavaScript
 * HubSpot CMS Custom Module
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    
    // Select all hero modules on the page
    var heroModules = document.querySelectorAll('.hero-module');
    
    heroModules.forEach(function(hero) {
      // Add parallax effect on scroll (optional)
      var backgroundImage = hero.style.backgroundImage;
      
      if (backgroundImage && backgroundImage !== 'none') {
        // Parallax effect for desktop
        if (window.innerWidth > 767) {
          window.addEventListener('scroll', function() {
            var scrolled = window.pageYOffset;
            var rate = scrolled * 0.5;
            hero.style.backgroundPositionY = (50 + rate * 0.05) + '%';
          });
        }
      }
      
      // Button click tracking (for analytics)
      var button = hero.querySelector('.hero-button');
      if (button) {
        button.addEventListener('click', function(e) {
          // You can add custom tracking here
          console.log('Hero CTA clicked:', button.href);
        });
      }
    });
    
    // Animation on scroll (Intersection Observer)
    var observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('hero-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    heroModules.forEach(function(hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(20px)';
      hero.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(hero);
    });
    
  });

})();
