import {ShowDialogModal} from "../components/modalDialog";

window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/home.scss";
import "../../scss/components/menu.scss";

declare global { // Extend the window interface with public objects
    interface Window {
        LoginCallback: () => void;
        PageReloadCallback: () => void;
        DisconnectWalletCallback: () => void;
    }
}

window.addEventListener("load", () => {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;

    function showNextTestimonial() {
        // Remove active class from current testimonial and add exit class
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
    testimonials.forEach((testimonial, index) => { // Initial setup
        if (index !== 0) {
            testimonial.classList.remove('active');
        }
    });
    setInterval(showNextTestimonial, 12000); // Start the carousel

    async function subscribe() {
        const csrfToken = (document.getElementById("csrfToken") as HTMLInputElement).value;
        const email = (document.getElementById("emailInput") as HTMLInputElement).value;
        try {
            let response = await fetch("/subscribe", {
                method: "POST",
                cache: "no-store",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify({"email": email})
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

    document.getElementById("emailInput")!.addEventListener("input", subscribe);
});