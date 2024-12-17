import {baseConnectWallet, baseDisconnectWallet} from "../util/blockchain/base";

window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/components/modalLogin.scss";
import {
    DisableDialogModalExit,
    DisableDialogModalOkBtn,
    ShowDialogModalHTMLUnsafe
} from "./modalDialog";
import {createPopper} from "@popperjs/core/lib/popper-lite";

// HTML Template: {{template "modalLogin" .}}

let modal: bootstrap.Modal;

export function ShowModalLogin() {
    modal.show();
}
export function HideModalLogin() {
    modal.hide();
    let loginModal = document.getElementById("loginModal")! as HTMLDivElement;
    loginModal.style.display = "none";
}

(function initialize() {
    if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", main);} else {main();}

    function main() {
        modal = new window.bootstrap.Modal("#loginModal", {});
        let DOM = {
            coinbaseWalletBtn: document.getElementById("coinbaseWalletBtn")! as HTMLButtonElement,
            csrfToken: (document.getElementById("csrfToken")! as HTMLInputElement).value,
            metaMaskWalletBtn: document.getElementById("metaMaskWalletBtn")! as HTMLButtonElement,
            modalDialog: document.getElementById("modalDialog")! as HTMLDivElement,
            modalDialogOkBtn: document.getElementsByClassName("yp-modal-btn")[0]! as HTMLButtonElement,
            peraWalletBtn: document.getElementById("peraWalletBtn")! as HTMLButtonElement,
        }

        DOM.coinbaseWalletBtn.addEventListener("click", async function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            HideModalLogin();
            await baseConnectWallet();
            window.LoginCallback();
        });
        DOM.metaMaskWalletBtn.addEventListener("click", async function (e) {
            e.preventDefault();

        });
        DOM.peraWalletBtn.addEventListener("click", async function (e) {
            e.preventDefault();
            baseDisconnectWallet();
            HideModalLogin();
            DOM.modalDialogOkBtn.disabled = true;  // create modal dialog and it's event handlers then show it
            DOM.modalDialogOkBtn.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.replace("/");
            });
            DisableDialogModalExit();
            const modalHTML = "Please sign the $0 transaction in Pera app to finish login<br>" +
                "<btn type='button' id='loginTxnQuestionBtn' class='btn grow' data-bs-toggle='tooltip' data-bs-placement='top' " +
                "data-bs-title='Sign a zero-dollar ($0) transaction to prove who you are'>" +
                "<i class='bi bi-question-circle'></i></btn>" +
                "<btn type='button' id='loginTxnResendBtn' class='btn grow' data-bs-toggle='tooltip' data-bs-placement='top' " +
                "data-bs-title='Re-send the login transaction to your wallet'>" +
                "<i class='bi bi-arrow-clockwise'></i></btn>";
            let renderPeraTxnDialog = function () {
                ShowDialogModalHTMLUnsafe(modalHTML);
                const loginTxnQuestionBtn = document.getElementById("loginTxnQuestionBtn")! as HTMLButtonElement;
                const loginTxnResendBtn = document.getElementById("loginTxnResendBtn")! as HTMLButtonElement;
                const loginTxnQuestionTooltip = document.getElementById("loginTxnQuestionTooltip")! as HTMLDivElement;
                const loginTxnResendTooltip = document.getElementById("loginTxnResendTooltip")! as HTMLDivElement;
                createPopper(loginTxnQuestionBtn, loginTxnQuestionTooltip, {placement: "top",});
                createPopper(loginTxnResendBtn, loginTxnResendTooltip, {placement: "top",});
                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
                loginTxnResendBtn.addEventListener("click", async (e) => {
                    e.preventDefault();
                    //await ConnectWallet("pera"); todo
                });
                DisableDialogModalOkBtn();
            }
            setTimeout(renderPeraTxnDialog, 3000); // delay modal to let Pera wallet render first
            /*ConnectWallet("pera").then((value) => {
                // DOM.modalDialogOkBtn.disabled = false;
                // window.location.replace("/");
                console.log("ConnectWallet() resolved: " + value);
            });*/
            window.LoginCallback();
        });
    }
})();
