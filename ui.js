function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

function show(name, html) {
    document.getElementById(name).innerHTML = html;
}
