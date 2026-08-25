// Main script compatibility wrapper
document.addEventListener('DOMContentLoaded', () => {
    // If main.js hasn't loaded, load it dynamically
    if (typeof toggleNav === 'undefined') {
        const script = document.createElement('script');
        script.src = 'js/main.js';
        document.head.appendChild(script);
    }
});
