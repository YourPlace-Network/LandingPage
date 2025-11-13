window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/components/menu.scss";
import {InitTooltips} from "../util/bootstrap";

(function initialize() {
    if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", main);} else {main();}

    function main() {
        let DOM = {
            htmlMenu: document.getElementById("htmlMenu")! as HTMLButtonElement,
            offcanvas: document.querySelectorAll('.offcanvas')! as NodeListOf<Element>,
            bsOffcanvas: new window.bootstrap.Offcanvas("#htmlMenuOffcanvas"),
            bsOffcanvasElement: document.getElementById("htmlMenuOffcanvas")! as HTMLElement,
        }

        InitTooltips();

        DOM.bsOffcanvasElement.addEventListener("shown.bs.offcanvas", async () => {
            // No-Op
        });
        DOM.htmlMenu.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            DOM.bsOffcanvas.show();
        });
    }
})();