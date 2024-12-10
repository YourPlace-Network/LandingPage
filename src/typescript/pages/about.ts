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

window.addEventListener("load", () => {

});