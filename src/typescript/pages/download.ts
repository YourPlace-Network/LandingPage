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

interface ClientInfo {
    os: string;
    architecture: string;
    userAgent: string;
}
interface DownloadLinks {
    [key: string]: {
        [key: string]: string;
    }
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
            // ShowDialogModalHTML("YourPlace is early in its life and <b>many convenience features are not complete.</b><br><br>Only use this if you're comfortable with early-access software.");
            ShowDialogModalHTML("<div id=\"ctaSubscribe\" class=\"ctaDiv\">" +
                "YourPlace downloads are not yet live<br><br>" +
                "<p id=\"subscribeText\">Subscribe to be notified of the Alpha Test!</p>" +
                "<input type=\"text\" id=\"emailInput\" class=\"form-control\" placeholder=\"Email Address\">" +
                "<button id=\"ctaBtn\" class=\"btn btn-primary\">" +
                "<i class=\"bi bi-envelope\"></i> Subscribe" +
                "</button>" +
                "</div>" +
                "</b>");
            (document.getElementById("ctaBtn") as HTMLButtonElement).addEventListener("click", subscribe);
        }
        function setRecommendedDownload() {
            const clientInfo = detectClientInfo();
            if (clientInfo.os in downloadLinks) {
                if (clientInfo.architecture in downloadLinks[clientInfo.os]) {
                    if (clientInfo.os === "osx") {
                        DOM.recommendedText.textContent = "MacOS";
                        DOM.recommendedImg.src = `/static/image/apple.svg`;
                    } else if (clientInfo.os === "windows") {
                        DOM.recommendedText.textContent = "Microsoft Windows"
                        DOM.recommendedImg.src = `/static/image/windows.svg`;
                    }
                }
            }
        }
        async function downloadRecommended() {
            const clientInfo = detectClientInfo();
            if (clientInfo.os in downloadLinks) {
                if (clientInfo.architecture in downloadLinks[clientInfo.os]) {
                    try {
                        const response = await fetch(downloadLinks[clientInfo.os][clientInfo.architecture]);
                        if (!response.ok) {
                            console.log("Failed to download file");
                            return;
                        }
                        const blob = await response.blob();
                        const downloadURL = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = downloadURL;
                        link.download = "YourPlace";
                        link.style.display = "none";
                        link.target = "_blank";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(downloadURL);
                    } catch (error) {
                        console.error(error);
                    }

                }
            }
        }
        function detectClientInfo(): ClientInfo {
            const ua = navigator.userAgent;
            let os = "unknown";
            let architecture = "unknown";
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
            if (ua.indexOf("x64") !== -1 || ua.indexOf("WOW64") !== -1 || ua.indexOf("x86_64") !== -1) {
                architecture = "amd64";
            } else if (ua.indexOf("x86") !== -1 || ua.indexOf("i686") !== -1) {
                architecture = "amd86";
            } else if (ua.indexOf("arm") !== -1 || ua.indexOf("ARM") !== -1) {
                architecture = "arm64";
            } else if (ua.indexOf("aarch64") !== -1) {
                architecture = "arm64";
            }
            if (os === "MacOS" && architecture === "Unknown") {
                if (/Mac OS X/.test(ua)) {
                    architecture = "arm64"; // Modern Macs are likely to be ARM-based
                }
            }
            console.log(`Detected OS: ${os}, Architecture: ${architecture}`);
            return {os, architecture, userAgent: ua};
        }
        async function downloadOSX() {
            try {
                const response = await fetch(downloadLinks["osx"][DOM.osxArch.value]);
                if (!response.ok) {
                    console.log("Failed to download file");
                    return;
                }
                const blob = await response.blob();
                const downloadURL = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadURL;
                link.download = "YourPlace";
                link.style.display = "none";
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadURL);
            } catch (error) {
                console.error(error);
            }
        }
        async function downloadWindows() {
            try {
                const response = await fetch(downloadLinks["windows"][DOM.winArch.value]);
                if (!response.ok) {
                    console.log("Failed to download file");
                    return;
                }
                const blob = await response.blob();
                const downloadURL = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadURL;
                link.download = "YourPlace.exe";
                link.style.display = "none";
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadURL);
            } catch (error) {
                console.error(error);
            }
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
            let DOM = {
                ctaBtn: document.getElementById("ctaBtn") as HTMLButtonElement,
                csrfToken: (document.getElementById("csrfToken") as HTMLInputElement).value,
                email: document.getElementById("emailInput") as HTMLInputElement,
            }
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