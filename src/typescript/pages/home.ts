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
});