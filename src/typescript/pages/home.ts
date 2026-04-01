window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle');
import "../../scss/pages/home.scss";
import "../components/menu";
import {ShowDialogModal, ShowDialogModalHTML} from "../components/modalDialog";

(function initialize() {
    if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", main);} else {main();}

    function main() {
        let DOM = {
            ctaSubscribeBtn: document.getElementById("ctaSubscribeBtn") as HTMLButtonElement,
            email: document.getElementById("emailInput") as HTMLInputElement,
            hostingFeatureDiv: document.getElementById("hostingFeatureDiv") as HTMLDivElement,
            iphoneFrame: document.getElementById("iphoneFrame") as HTMLObjectElement,
            iphoneStatusClock: null as SVGTextElement | null,
            openFeatureDiv: document.getElementById("openFeatureDiv") as HTMLDivElement,
            relationshipFeatureDiv: document.getElementById("relationshipFeatureDiv") as HTMLDivElement,
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
            DOM.iphoneFrame.addEventListener("load", () => {
                const svgDoc = DOM.iphoneFrame.contentDocument;
                if (svgDoc) {
                    DOM.iphoneStatusClock = svgDoc.getElementById("iphoneStatusClock") as unknown as SVGTextElement;
                    updateClock();
                    setInterval(updateClock, 1000);
                }
            });
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

        DOM.ctaSubscribeBtn!.addEventListener("click", subscribe);
        DOM.relationshipFeatureDiv.addEventListener("click", () => {
            ShowDialogModalHTML("<b>Own Your Relationships</b><br><br>Your social connections belong to you, not a corporation. YourPlace stores your relationships locally and on-chain, so no platform can hold your network hostage or sell your data.");
        });
        DOM.openFeatureDiv.addEventListener("click", () => {
            ShowDialogModalHTML("<b>Open and Uncensorable</b><br><br>YourPlace is fully open-source and decentralized. Your content is distributed across the network, making it resistant to censorship and single points of failure.");
        });
        DOM.hostingFeatureDiv.addEventListener("click", () => {
            ShowDialogModalHTML("<b>ALGO, BASE, ETH &amp; more</b><br><br>YourPlace supports posting to multiple blockchains including Algorand, Base and Ethereum. Choose your favorite chain and interact with people from others. And more chains are on the way!");
        });

        init().then();
    }
})();