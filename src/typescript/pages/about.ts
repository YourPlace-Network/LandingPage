window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/about.scss";
import "../components/menu";

declare global { // Extend the window interface with public objects
    interface Window {
        LoginCallback: () => void;
        PageReloadCallback: () => void;
        DisconnectWalletCallback: () => void;
    }
}

(function initialize() {
    if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", main);} else {main();}

    function main() {
        const DOM = {
            pronounceBtn: document.getElementById("pronounceBtn")! as HTMLButtonElement,
        };

        DOM.pronounceBtn.addEventListener("click", () => {
            const audio = new Audio("/static/audio/nops.mp3");
            audio.play().then();
        });
    }

})();