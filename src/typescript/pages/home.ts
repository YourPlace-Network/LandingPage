window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "bootstrap";
import '../../scss/pages/home.scss';

declare global { // Extend the window interface with public objects
    interface Window {
        LoginCallback: () => void;
        PageReloadCallback: () => void;
        DisconnectWalletCallback: () => void;
    }
}

window.addEventListener("load", () => {

});