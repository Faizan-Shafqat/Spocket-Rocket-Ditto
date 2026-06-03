window.addEventListener('DOMContentLoaded', function() {
    var featureContainers = document.querySelectorAll(".sr-three-col-features-01");

    featureContainers.forEach(function(container) {
        var max = 0;
        var mobile = window.innerWidth;
        var featureListItems = container.querySelectorAll(".feature-list ul li");

        featureListItems.forEach(function(item) {
            item.style.minHeight = 'inherit';
        });

        function setMinHeight() {
            if (mobile > 767) {
                featureListItems.forEach(function(item) {
                    if (item.offsetHeight > max) {
                        max = item.offsetHeight;
                    }
                });
                featureListItems.forEach(function(item) {
                    item.style.minHeight = max + 'px';
                });
            }
        }

        window.addEventListener('load', setMinHeight);
        window.addEventListener('resize', function() {
            mobile = window.innerWidth;
            setMinHeight();
        });

        featureListItems.forEach(function(item) {
            ['mouseover', 'focus'].forEach(function(eventType) {
                item.addEventListener(eventType, function() {
                    var img = this.querySelector('img');
                    var floatImg = container.querySelector('.float-image img');
                    floatImg.src = img.getAttribute('data-hover') + "?width=562";
                    floatImg.srcset = img.getAttribute('data-hover') + "?width=562 1x," + img.getAttribute('data-hover') + "?width=1125 2x";
                });
            });
        });
    });
});