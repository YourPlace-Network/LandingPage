import {ShowDialogModal, ShowDialogModalHTML, ShowDialogModalHTMLUnsafe} from "../components/modalDialog";

window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/unsubscribe.scss";
import "../components/menu";

(function initialize() {
    if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", main);} else {main();}

    function main() {
        const DOM = {
            csrfToken: (document.getElementById("csrfToken") as HTMLInputElement).value,
            unsubscribeEmail: document.getElementById("unsubscribedEmail") as HTMLInputElement,
            unsubscribeButton: document.getElementById("unsubscribeButton") as HTMLButtonElement,
        };

        interface DebouncedInputParams {
            inputElement: HTMLInputElement;
            callback: (value: string) => void;
            delayMs?: number;
        }

        function init() {
            const params = new URLSearchParams(window.location.search);
            const email = params.get("email");
            if (email) {
                DOM.unsubscribeEmail.value = email;
                DOM.unsubscribeButton.click();
            }
        }
        function debounceInput({ inputElement, callback, delayMs = 500 }: DebouncedInputParams): void {
            let timeoutId: number | undefined;

            inputElement.addEventListener('input', function(this: HTMLInputElement) {
                // Clear any existing timeout
                clearTimeout(timeoutId);

                // Set up new timeout
                timeoutId = window.setTimeout(() => {
                    const value = this.value.trim();
                    callback(value);
                }, delayMs);
            });
        }
        function handleInput(value: string) {
            console.log(value);
        }
        async function unsubscribe(email: string) {
            try {
                let response = await fetch("/unsubscribe", {
                    method: "POST",
                    cache: "no-store",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "X-CSRF-Token": DOM.csrfToken,
                    },
                    body: JSON.stringify({"email": email})
                });
                if (!response.ok) {
                    ShowDialogModal("An error occurred while unsubscribing to the newsletter. Please try again later.");
                    return;
                } else {
                    const html = "You won't recieve any more emails<br><br>" +
                        "<iframe src=\"https://giphy.com/embed/LTFbyWuELIlqlXGLeZ\" width=\"240\" height=\"135\" style=\"\" frameBorder=\"0\" class=\"giphy-embed\"></iframe>";
                    ShowDialogModalHTMLUnsafe(html);
                    return;
                }
            } catch (error) {
                ShowDialogModal("An error occurred while subscribing to the newsletter. Please try again later.");
                return;
            }
        }

        DOM.unsubscribeButton.addEventListener("click", () => {
            unsubscribe(DOM.unsubscribeEmail.value);
        });

        debounceInput({inputElement: DOM.unsubscribeEmail, callback: handleInput});
        init();
    }
})();