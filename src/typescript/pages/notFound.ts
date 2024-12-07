window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import '../../scss/pages/notFound.scss';
import {Sleep} from "../util/time";

window.addEventListener("load", () => {
    var count = 10;
    let DOM = {
        countdown: document.getElementById('countdown') as HTMLSpanElement,
    };

    async function load () {
        for (var i = count; i >= 0; i--) {
            if (i === 0) {
                window.location.href = '/';
                break;
            }
            (DOM.countdown).textContent = i.toString();
            await Sleep(1000);
        }
    }

    load();
});