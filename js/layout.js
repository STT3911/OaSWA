(function () {
    var headerTarget = document.getElementById("site-header");
    var footerTarget = document.getElementById("site-footer");

    if (headerTarget && typeof window.getHeaderHtml === "function") {
        var currentPage = headerTarget.dataset.page || "";
        headerTarget.outerHTML = window.getHeaderHtml(currentPage);
    }

    if (footerTarget && typeof window.getFooterHtml === "function") {
        footerTarget.outerHTML = window.getFooterHtml();
    }
})();
