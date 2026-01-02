// Disable right click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Block common devtools shortcuts
document.addEventListener('keydown', function (e) {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
    }
});

// Console warning for anyone opening DevTools
console.warn("This project is for educational purposes. Please do not copy the code.");

// Detect DevTools opening (works for docked DevTools)
let devtoolsOpen = false;
const threshold = 160;

setInterval(() => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > threshold || heightDiff > threshold) {
        if (!devtoolsOpen) {
            devtoolsOpen = true;

            // Replace body content as before
            document.body.innerHTML = `
          <h1 style="text-align:center;margin-top:20%; font-size:2rem; color:#333;">
            Source inspection is disabled
          </h1>
            `;

            // Create a polite overlay warning
            const overlay = document.createElement('div');
            overlay.id = 'copy-warning';
            overlay.innerText = "⚠️ Please do not copy this code. This project is for educational purposes only.";
            overlay.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.85);
                color: white;
                font-family: sans-serif;
                font-size: 1.2rem;
                padding: 20px 30px;
                border-radius: 10px;
                text-align: center;
                z-index: 9999;
                line-height: 1.5;
                max-width: 90%;
            `;
            document.body.appendChild(overlay);

            // Keep console warning
            console.warn("This project is for educational purposes.");
        }
    } else {
        devtoolsOpen = false;

        // Optional: remove overlay if DevTools closed (if you want)
        const existing = document.getElementById('copy-warning');
        if (existing) existing.remove();
    }
}, 500);