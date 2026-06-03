var winHeight = window.innerHeight || document.documentElement.clientHeight,
    docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight),
    progressBar = document.querySelector('.sr-nav-progress-bar-01'),
    max, value;

max = docHeight - winHeight;
progressBar.setAttribute('max', max);

window.addEventListener('scroll', function() {
  value = window.scrollY || document.documentElement.scrollTop;
  progressBar.setAttribute('value', value);
});