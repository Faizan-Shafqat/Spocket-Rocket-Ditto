document.querySelectorAll('.sr-offer-bar-08').forEach(function (el) {
    // Set the date we're counting down to
    let countDownDate = new Date(el.dataset.date).getTime();

    // Update the count down every 1 second
    let x = setInterval(function () {

        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        el.querySelector(".date-counter").innerHTML = "<div class='date-column'>" + "<span class='h1'>" + days + "</span>" + "<p class='date-text'>Days</p></div><div class='date-column'>" + "<span class='h1'>" + hours + "</span>" + "<p class='date-text'>Hours</p></div> <div class='date-column'>" + "<span class='h1'>" + minutes + "</span>" + "<p class='date-text'>Minutes</p></div><div class='date-column'>" + "<span class='h1'>" + seconds + "</span>" + "<p class='date-text'>Seconds</p></div>";

        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(x);
            el.querySelector(".date-counter").innerHTML = "EXPIRED";
        }
    }, 1000);
});