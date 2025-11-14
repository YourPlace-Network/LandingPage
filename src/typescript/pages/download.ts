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
            email: document.getElementById("emailInput") as HTMLInputElement,
            recommendedDiv: document.getElementById("recommendedDiv") as HTMLDivElement,
            recommendedBtn: document.getElementById("recommendedBtn") as HTMLDivElement,
            recommendedText: document.getElementById("recommendedText") as HTMLParagraphElement,
            recommendedImg: document.getElementById("recommendedImg") as HTMLImageElement,
            osxDiv: document.getElementById("osxDiv") as HTMLDivElement,
            winDiv: document.getElementById("winDiv") as HTMLDivElement,
            linuxDiv: document.getElementById("linuxDiv") as HTMLDivElement,
            tosCheckbox: document.getElementById("tosCheckbox") as HTMLInputElement,
            arrowToTos: document.getElementById("arrowToTos") as HTMLDivElement,
            arrowToDownload: document.getElementById("arrowToDownload") as HTMLDivElement,
            versionText: document.getElementById("versionText") as HTMLParagraphElement,
        }
        const downloadLinks: DownloadLinks = window.downloadJson;

        async function init() {
            DOM.versionText.textContent = "Current Version: " + downloadLinks["version"];
            setRecommendedDownload();
            ShowDialogModalHTML("YourPlace is early in its life and <u>many features are not complete</u><br><br>Only use this if you're comfortable testing early-access software");

            const modalElement = document.getElementById("modalDialog")!;
            modalElement.addEventListener('hidden.bs.modal', () => {
                DOM.arrowToTos.style.display = "block";
            });

            disableDownloadButtons();

            DOM.osxDiv.addEventListener("click", downloadOSX);
            DOM.winDiv.addEventListener("click", downloadWindows);
            DOM.linuxDiv.addEventListener("click", downloadLinux);
            DOM.recommendedBtn.addEventListener("click", downloadRecommended);

            DOM.tosCheckbox.addEventListener("change", toggleDownloadButtons);
        }
        function showTOSWarning() {
            ShowDialogModal("You must accept the Terms of Service before downloading.");
        }
        function toggleDownloadButtons() {
            if (DOM.tosCheckbox.checked) {
                enableDownloadButtons();
                DOM.arrowToTos.style.display = "none";
                DOM.arrowToDownload.style.display = "block";
            } else {
                disableDownloadButtons();
                DOM.arrowToTos.style.display = "block";
                DOM.arrowToDownload.style.display = "none";
            }
        }
        function disableDownloadButtons() {
            DOM.recommendedBtn.classList.add("disabled");
            DOM.osxDiv.classList.add("disabled");
            DOM.winDiv.classList.add("disabled");
            DOM.linuxDiv.classList.add("disabled");
            DOM.osxDiv.removeEventListener("click", downloadOSX);
            DOM.winDiv.removeEventListener("click", downloadWindows);
            DOM.linuxDiv.removeEventListener("click", downloadLinux);
            DOM.recommendedBtn.removeEventListener("click", downloadRecommended);
            DOM.osxDiv.addEventListener("click", showTOSWarning);
            DOM.winDiv.addEventListener("click", showTOSWarning);
            DOM.linuxDiv.addEventListener("click", showTOSWarning);
            DOM.recommendedBtn.addEventListener("click", showTOSWarning);
        }
        function enableDownloadButtons() {
            DOM.recommendedBtn.classList.remove("disabled");
            DOM.osxDiv.classList.remove("disabled");
            DOM.winDiv.classList.remove("disabled");
            DOM.linuxDiv.classList.remove("disabled");
            DOM.osxDiv.removeEventListener("click", showTOSWarning);
            DOM.winDiv.removeEventListener("click", showTOSWarning);
            DOM.linuxDiv.removeEventListener("click", showTOSWarning);
            DOM.recommendedBtn.removeEventListener("click", showTOSWarning);
            DOM.osxDiv.addEventListener("click", downloadOSX);
            DOM.winDiv.addEventListener("click", downloadWindows);
            DOM.linuxDiv.addEventListener("click", downloadLinux);
            DOM.recommendedBtn.addEventListener("click", downloadRecommended);
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
                } else if (clientOS === "linux") {
                    DOM.recommendedText.textContent = "Linux"
                    DOM.recommendedImg.src = `/static/image/linux.svg`;
                }
            }
        }
        function downloadRecommended() {
            const clientInfo = detectClientInfo();
            if (clientInfo == "osx") {
                downloadOSX();
            } else if (clientInfo == "windows") {
                downloadWindows();
            } else if (clientInfo == "linux") {
                downloadLinux();
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
            fetch("/download/record?os=osx&version=" + encodeURI(downloadLinks["version"])).then();
            const link = document.createElement('a');
            link.href = downloadLinks["osx"];
            link.setAttribute("download", "");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        function downloadWindows() {
            fetch("/download/record?os=windows&version=" + encodeURI(downloadLinks["version"])).then();
            const link = document.createElement('a');
            link.href = downloadLinks["windows"];
            link.setAttribute("download", "");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        function downloadLinux() {
            fetch("/download/record?os=linux&version=" + encodeURI(downloadLinks["version"])).then();
            const link = document.createElement('a');
            link.href = downloadLinks["linux"];
            link.setAttribute("download", "");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        init().then();
    }
})();