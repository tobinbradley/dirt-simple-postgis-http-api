var converter = new Markdown.Converter();

$(document).ready( function () {
    $('.sidenav li').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
        loadDocs($(this).data("md"));
    });

    loadDocs("README.md");

});

function loadDocs(md) {
    // the random bit makes sure your docs aren't getting cached, which can cause swearing
    $.get(md + '?rnd=' + Math.floor(Math.random()*1001), function(data) {
        $('.data-content').html(converter.makeHtml(data));
    });
}
