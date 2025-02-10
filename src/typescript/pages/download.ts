window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/download.scss";
import "../components/menu";
import {ShowDialogModal, ShowDialogModalHTML} from "../components/modalDialog";

declare global { // Extend the window interface with public objects
    interface Window {
        LoginCallback: () => void;
        PageReloadCallback: () => void;
        DisconnectWalletCallback: () => void;
        downloadJson: DownloadLinks;
    }
}

interface DownloadLinks {
    [key: string]: string;
}

(function initialize() {
    if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", main);} else {main();}

    function main() {
        let DOM = {
            ctaBtn: document.getElementById("ctaBtn") as HTMLButtonElement,
            csrfToken: (document.getElementById("csrfToken") as HTMLInputElement).value,
            email: document.getElementById("emailInput") as HTMLInputElement,
            recommendedDiv: document.getElementById("recommendedDiv") as HTMLDivElement,
            recommendedText: document.getElementById("recommendedText") as HTMLParagraphElement,
            recommendedImg: document.getElementById("recommendedImg") as HTMLImageElement,
            osxArch: document.getElementById("osxArch") as HTMLSelectElement,
            osxDiv: document.getElementById("osxDiv") as HTMLDivElement,
            winArch: document.getElementById("winArch") as HTMLSelectElement,
            winDiv: document.getElementById("winDiv") as HTMLDivElement,
        }
        const downloadLinks: DownloadLinks = window.downloadJson;

        async function init() {
            setRecommendedDownload();
            ShowDialogModalHTML("YourPlace is early in its life and <u>many features are not complete</u><br><br>Only use this if you're comfortable testing early-access software");
            /*ShowDialogModalHTML("<div id=\"ctaSubscribe\" class=\"ctaDiv\">" +
                "YourPlace downloads are not yet live<br><br>" +
                "<p id=\"subscribeText\">Subscribe to be notified of the Alpha Test!</p>" +
                "<input type=\"text\" id=\"emailInput\" class=\"form-control\" placeholder=\"Email Address\">" +
                "<button id=\"ctaBtn\" class=\"btn btn-primary\">" +
                "<i class=\"bi bi-envelope\"></i> Subscribe" +
                "</button>" +
                "</div>" +
                "</b>");*/
            //(document.getElementById("ctaBtn") as HTMLButtonElement).addEventListener("click", subscribe);
        }
        function setRecommendedDownload() {
            const clientOS = detectClientInfo();
            if (clientOS in downloadLinks) {
                if (clientOS === "osx") {
                    DOM.recommendedText.textContent = "MacOS";
                    DOM.recommendedImg.src = `/static/image/apple.svg`;
                } else if (clientOS === "windows") {
                    DOM.recommendedText.textContent = "Microsoft Windows"
                    DOM.recommendedImg.src = `/static/image/windows.svg`;
                }
            }
        }
        function downloadRecommended() {
            const clientInfo = detectClientInfo();
            if (clientInfo == "osx") {
                downloadOSX();
            } else if (clientInfo == "windows") {
                downloadWindows();
            }
        }
        function detectClientInfo(): string {
            const ua = navigator.userAgent;
            let os = "unknown";
            if (ua.indexOf("Win") != -1) {
                os = "windows";
            } else if (ua.indexOf("Mac") != -1) {
                os = "osx";
            } else if (ua.indexOf("Linux") != -1) {
                os = "linux";
            } else if (ua.indexOf("Android") != -1) {
                os = "android";
            } else if (ua.indexOf("iOS") != -1 || ua.indexOf("iPhone") != -1 || ua.indexOf("iPad") != -1) {
                os = "ios";
            }
            console.log("Detected OS: " + os);
            return os;
        }
        function downloadOSX() {
            const link = document.createElement('a');
            link.href = downloadLinks["osx"];
            link.setAttribute("download", "");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        function downloadWindows() {
            const link = document.createElement('a');
            link.href = downloadLinks["windows"];
            link.setAttribute("download", "");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        function countdownAndRedirect(): void {
            let secondsLeft = 5;
            const countdownElement = document.createElement('div');
            document.body.appendChild(countdownElement);
            const countdownInterval = setInterval(() => {
                if (secondsLeft > 0) {
                    countdownElement.textContent = `Redirecting in ${secondsLeft} seconds...`;
                    secondsLeft--;
                } else {
                    clearInterval(countdownInterval);
                    window.location.href = '/';
                }
            }, 1000);
        }
        async function subscribe() {
            try {
                let response = await fetch("/subscribe", {
                    method: "POST",
                    cache: "no-store",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "X-CSRF-Token": DOM.csrfToken,
                    },
                    body: JSON.stringify({"email": DOM.email.value})
                });
                if (!response.ok) {
                    ShowDialogModal("An error occurred while subscribing to the newsletter. Returning you hom.");
                    countdownAndRedirect();
                    return;
                } else {
                    ShowDialogModal("Thanks for subscribing!");
                    countdownAndRedirect();
                    return;
                }
            } catch (error) {
                ShowDialogModal("An error occurred while subscribing to the newsletter. Returning you home.");
                countdownAndRedirect();
                return;
            }
        }

        DOM.osxDiv.addEventListener("click", downloadOSX);
        DOM.winDiv.addEventListener("click", downloadWindows);
        DOM.recommendedDiv.addEventListener("click", downloadRecommended);

        init().then();
    }
})();