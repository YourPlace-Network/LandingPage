window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/components/menu.scss";
import {InitTooltips} from "../util/bootstrap";

(function initialize() {
    if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", main);} else {main();}

    function main() {
        let DOM = {
            menuAvatarLink: document.getElementById("menuAvatarLink")! as HTMLAnchorElement,
            htmlMenu: document.getElementById("htmlMenu")! as HTMLButtonElement,
            offcanvas: document.querySelectorAll('.offcanvas')! as NodeListOf<Element>,
            menuLoginBtn: document.getElementById("menuLoginBtn")! as HTMLButtonElement,
            bsOffcanvas: new window.bootstrap.Offcanvas("#htmlMenuOffcanvas"),
            bsOffcanvasElement: document.getElementById("htmlMenuOffcanvas")! as HTMLElement,
        }

        InitTooltips();

        DOM.bsOffcanvasElement.addEventListener("shown.bs.offcanvas", async () => {
            /*const yourPlaceServerRunning = await YourPlaceServerDetector.checkService();
            if (yourPlaceServerRunning) {
                DOM.menuAvatarLink.href = "https://localhost:42424/p/";
            } else {
                DOM.menuAvatarLink.href = "/";
            }*/
        });
        DOM.htmlMenu.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            DOM.bsOffcanvas.show();
        });
        DOM.menuLoginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.replace("/login");
        });
    }
})();