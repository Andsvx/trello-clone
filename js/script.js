$(document).ready(function () {
    Application.load();

    $(".add-column").click(function () {
        new Column();
    });
});
