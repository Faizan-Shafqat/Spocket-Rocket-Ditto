function rgb2hex(rgb) {
  if (rgb.search("rgb") == -1) {
    return rgb;
  } else {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }
}

document.querySelectorAll('.d-color').forEach(function(element) {
  var color = window.getComputedStyle(element.querySelector('span')).backgroundColor;
  var hex = rgb2hex(color);
  element.querySelector('label').textContent = hex;
  if (hex == "#ffffff") {
    element.querySelector('span').classList.add('border');
  }
});
