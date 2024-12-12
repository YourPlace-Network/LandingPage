window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/components/menu.scss";

(function initialize() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
    } else {
        main();
    }

    function main() {
        let bsOffcanvas = new window.bootstrap.Offcanvas("#htmlMenuOffcanvas");
        let DOM = {
            htmlMenu: document.getElementById("htmlMenu")! as HTMLButtonElement,
            offcanvas: document.querySelectorAll('.offcanvas')! as NodeListOf<Element>,
            menuLoginBtn: document.getElementById("menuLoginBtn")! as HTMLButtonElement,
        }

        DOM.htmlMenu.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            bsOffcanvas.show();
        });
        DOM.menuLoginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.replace("/login");
        });
    }
})();