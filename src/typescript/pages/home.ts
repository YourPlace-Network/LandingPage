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
            setInterval(showNextTestimonial, 12000); // Start the carousel
            function showNextTestimonial() { // Remove active class from current testimonial and add exit class
                testimonials[currentIndex].classList.remove('active');
                testimonials[currentIndex].classList.add('exit');
                currentIndex = (currentIndex + 1) % testimonials.length; // Update index
                setTimeout(() => { // Remove exit class from previous testimonial after animation
                    testimonials.forEach(testimonial => {
                        testimonial.classList.remove('exit');
                    });
                }, 500);
                testimonials[currentIndex].classList.add('active'); // Add active class to next testimonial
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