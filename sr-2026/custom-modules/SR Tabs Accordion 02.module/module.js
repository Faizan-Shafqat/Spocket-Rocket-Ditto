const modules = document.querySelectorAll('.sr-tabs-accordion-02');

modules.forEach(function (instance) {
    let details;
    instance.querySelectorAll(".details-group").forEach((detail) => {
        details = new Details(detail, {
            one_visible: detail.dataset.one
        });
    })
});