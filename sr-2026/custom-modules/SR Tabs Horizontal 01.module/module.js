const modules = document.querySelectorAll('.sr-tabs-horizontal-01');

modules.forEach(function (instance) {
    var buttons = instance.querySelectorAll('.tabs-nav__button');

    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            var buttonId = this.id;
            var panelId = this.getAttribute('aria-controls');
            activateTab(buttonId, panelId);
        });
    });

    function activateTab(buttonId, panelId) {
        var button = instance.querySelector(`#${buttonId}`);
        var panel = instance.querySelector(`#${panelId}`);

        var activeButton = instance.querySelector('[aria-selected="true"]');
        activeButton.removeAttribute("data-state");
        activeButton.removeAttribute("aria-selected");

        var activePanel = instance.querySelector('div[data-state="active"]');
        activePanel.removeAttribute("data-state");
        activePanel.setAttribute("hidden", "");

        button.setAttribute("aria-selected", "true");
        button.setAttribute("data-state", "active");
        panel.setAttribute("data-state", "active");
        panel.removeAttribute("hidden");
    }
});

