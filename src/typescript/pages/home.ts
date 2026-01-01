window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/home.scss";
import "../components/menu";
import {ShowDialogModal} from "../components/modalDialog";

(function initialize() {
    if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", main);} else {main();}

    function main() {
        let DOM = {
            ctaBtn: document.getElementById("ctaBtn") as HTMLButtonElement,
            email: document.getElementById("emailInput") as HTMLInputElement,
            iphoneStatusClock: document.getElementById("iphoneStatusClock") as HTMLSpanElement,
        }

        function updateClock() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeStr = `${hours}:${minutes}`;
            if (DOM.iphoneStatusClock) {
                DOM.iphoneStatusClock.textContent = timeStr;
            }
        }

        async function init() {
            updateClock();
            setInterval(updateClock, 1000);
            let testimonials = document.querySelectorAll('.testimonial');
            testimonials.forEach((testimonial, index) => { // Initial setup
                if (index !== 0) {
                    testimonial.classList.remove('active');
                }
            });
            let currentIndex = 0;
            setInterval(showNextTestimonial, 12000);
            function showNextTestimonial() {
                const prevIndex = currentIndex;
                currentIndex = (currentIndex + 1) % testimonials.length;
                testimonials[currentIndex].classList.add('active');
                testimonials[prevIndex].classList.remove('active');
                testimonials[prevIndex].classList.add('exit');
                setTimeout(() => {
                    testimonials[prevIndex].classList.remove('exit');
                }, 1000);
            }
        }
        async function subscribe() {
            try {
                let response = await fetch("/subscribe", {
                    method: "POST",
                    cache: "no-store",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({"email": DOM.email.value})
                });
                if (!response.ok) {
                    ShowDialogModal("An error occurred while subscribing to the newsletter. Please try again later.");
                    return;
                } else {
                    ShowDialogModal("Thanks for subscribing!");
                    return;
                }
            } catch (error) {
                ShowDialogModal("An error occurred while subscribing to the newsletter. Please try again later.");
                return;
            }
        }

        DOM.ctaBtn!.addEventListener("click", subscribe);

        init().then();
    }
})();