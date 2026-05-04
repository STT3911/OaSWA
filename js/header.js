window.getHeaderHtml = function getHeaderHtml(currentPage) {
    const page = currentPage || "";
    const navLinks = [
        { key: "products", href: "index.html", label: "Products" },
        { key: "categories", href: "categories.html", label: "Categories" },
        { key: "deals", href: "deals.html", label: "Deals" },
        { key: "about", href: "about.html", label: "About" }
    ];

    const navHtml = navLinks.map(function (link) {
        const isCurrent = link.key === page;
        const currentAttr = isCurrent ? ' aria-current="page"' : "";
        return '<a href="' + link.href + '" class="nav__link"' + currentAttr + ">" + link.label + "</a>";
    }).join("");

    const mobileNavHtml = navLinks.map(function (link) {
        const isCurrent = link.key === page;
        const currentAttr = isCurrent ? ' aria-current="page"' : "";
        return '<a href="' + link.href + '"' + currentAttr + ">" + link.label + "</a>";
    }).join("");

    return '' +
        '<header class="header">' +
            '<div class="container">' +
                '<a href="index.html" class="logo">' +
                    '<span class="logo-icon">T</span>' +
                    '<span class="logo-wordmark">TechStore</span>' +
                '</a>' +
                '<nav class="nav" aria-label="Main">' +
                    navHtml +
                '</nav>' +
                '<div class="header-icons">' +
                    '<button type="button" class="icon-btn" aria-label="Search">' +
                        '<svg class="icon-btn__svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
                    '</button>' +
                    '<a href="cart.html" class="icon-btn cart-link" aria-label="Cart">' +
                        '<svg class="icon-btn__svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
                        '<span class="cart-badge" id="cartBadge" hidden></span>' +
                    '</a>' +
                    '<button type="button" class="icon-btn menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="mobileNav">' +
                        '<svg class="icon-btn__svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</header>' +
        '<div class="mobile-nav" id="mobileNav" aria-hidden="true">' +
            '<nav class="mobile-nav-links" aria-label="Mobile">' +
                mobileNavHtml +
            '</nav>' +
        '</div>';
};

window.initMobileMenu = function initMobileMenu() {
    const btn = document.getElementById("menuBtn");
    const nav = document.getElementById("mobileNav");
    if (!btn || !nav || btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    function closeMenu() {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        nav.setAttribute("aria-hidden", "true");
    }

    btn.addEventListener("click", function (event) {
        event.stopPropagation();
        const isOpen = nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
        nav.setAttribute("aria-hidden", String(!isOpen));
    });

    document.addEventListener("click", function (event) {
        if (!nav.classList.contains("open")) return;
        if (!btn.contains(event.target) && !nav.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
    });
};
