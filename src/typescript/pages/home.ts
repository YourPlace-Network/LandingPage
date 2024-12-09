window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/home.scss";
import "../components/menu";
import {ShowDialogModal} from "../components/modalDialog";

window.addEventListener("load", () => {
    let DOM = {
        ctaBtn: document.getElementById("ctaBtn") as HTMLButtonElement,
        csrfToken: (document.getElementById("csrfToken") as HTMLInputElement).value,
        email: document.getElementById("emailInput") as HTMLInputElement,
    }

    async function main() {
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
                    "X-CSRF-Token": DOM.csrfToken,
                },
                body: JSON.stringify({"email": DOM.email.value})
            });
            if (!response.ok) {
                ShowDialogModal("An error occurred while subscribing to the newsletter. Please try again later.");
                return;
            } else {
                ShowDialogModal("Thank you for subscribing!");
                return;
            }
        } catch (error) {
            ShowDialogModal("An error occurred while subscribing to the newsletter. Please try again later.");
            return;
        }
    }

    DOM.ctaBtn!.addEventListener("click", subscribe);

    main().then();
});