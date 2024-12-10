window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/download.scss";
import "../components/menu";
import {ShowDialogModalHTML} from "../components/modalDialog";

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

window.addEventListener("load", () => {
    let DOM = {
        recommendedDiv: document.getElementById("recommendedDiv") as HTMLDivElement,
        recommendedText: document.getElementById("recommendedText") as HTMLParagraphElement,
        recommendedImg: document.getElementById("recommendedImg") as HTMLImageElement,
        osxArch: document.getElementById("osxArch") as HTMLSelectElement,
        osxDiv: document.getElementById("osxDiv") as HTMLDivElement,
        winArch: document.getElementById("winArch") as HTMLSelectElement,
        winDiv: document.getElementById("winDiv") as HTMLDivElement,
    }
    const downloadLinks: DownloadLinks = window.downloadJson;

    async function main() {
        setRecommendedDownload();
        ShowDialogModalHTML("YourPlace is early in its life and <b>many convenience features are not complete.</b><br><br>Only use this if you're comfortable with early-access software.");
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

    DOM.osxDiv.addEventListener("click", downloadOSX);
    DOM.winDiv.addEventListener("click", downloadWindows);
    DOM.recommendedDiv.addEventListener("click", downloadRecommended);

    main().then();
});