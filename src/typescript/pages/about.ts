window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/about.scss";
import "../../scss/components/menu.scss";

declare global { // Extend the window interface with public objects
    interface Window {
        LoginCallback: () => void;
        PageReloadCallback: () => void;
        DisconnectWalletCallback: () => void;
    }
}

window.addEventListener("load", () => {

});