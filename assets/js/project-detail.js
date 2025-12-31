// Function to get URL parameters
function getUrlParameter(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// Function to render the project detail page
function loadProjectDetail() {
    const projectId = getUrlParameter('id');

    if (!projectId) {
        window.location.href = './work.html';
        return;
    }

    // Wait a moment to ensure projects.js has loaded
    if (typeof getProjectById !== 'function') {
        console.error('getProjectById function not found. Waiting for projects.js to load...');
        setTimeout(loadProjectDetail, 100);
        return;
    }

    const project = getProjectById(projectId);

    if (!project) {
        console.error('Project not found with ID:', projectId);
        window.location.href = './work.html';
        return;
    }

    console.log('Loading project:', project.title);
    console.log('Project images:', project.images);

    // Render carousel
    const carouselContainer = document.getElementById('projectCarousel');
    if (!carouselContainer) {
        console.error('Carousel container not found');
        return;
    }

    carouselContainer.innerHTML = '';

    project.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = `${project.title} - Image ${index + 1}`;
        img.className = 'carousel-item';
        img.style.display = 'block';
        // Disable native dragging and selection to allow custom dragging
        img.draggable = false;
        img.style.userSelect = 'none';
        img.style.webkitUserDrag = 'none';
        img.onerror = function() {
            console.error('Failed to load image:', image);
            this.style.display = 'none';
        };
        img.onload = function() {
            console.log('Successfully loaded image:', image);
        };
        carouselContainer.appendChild(img);
    });

    // Render project info
    const infoContainer = document.getElementById('projectInfo');
    if (!infoContainer) {
        console.error('Info container not found');
        return;
    }

    infoContainer.innerHTML = '';

    // Create and append back link with dynamic behavior based on referrer
    const backLink = document.createElement('a');
    backLink.className = 'detail-back-link';
    backLink.style.cursor = 'pointer';

    // Check the referrer to determine where to go back
    const referrer = document.referrer;
    let backUrl = './work.html';
    let backText = 'Back to Work';

    if (referrer.includes('index.html') || referrer === '' || referrer.endsWith('/')) {
        // Coming from home page or direct navigation
        backUrl = './index.html';
        backText = 'Back to Home';
    }

    backLink.href = backUrl;
    backLink.textContent = backText;

    // Add click handler to scroll to project when navigating back
    backLink.addEventListener('click', (e) => {
        const projectId = getUrlParameter('id');
        if (projectId) {
            sessionStorage.setItem('scrollToProjectId', projectId);
        }
    });

    infoContainer.appendChild(backLink);

    const title = document.createElement('h1');
    title.className = 'detail-title';
    title.textContent = project.title;
    infoContainer.appendChild(title);

    const category = document.createElement('p');
    category.className = 'detail-category';
    category.textContent = project.category;
    infoContainer.appendChild(category);

    const description = document.createElement('p');
    description.className = 'detail-description';
    description.textContent = project.longDescription;
    infoContainer.appendChild(description);

    // Add tools section if tools exist
    if (project.tools && project.tools.length > 0) {
        const toolsContainer = document.createElement('div');
        toolsContainer.className = 'project-tools';
        toolsContainer.style.display = 'flex';
        toolsContainer.style.flexDirection = 'row';
        toolsContainer.style.gap = '12px';
        toolsContainer.style.marginTop = '12px';

        project.tools.forEach(tool => {
            const toolImg = document.createElement('img');
            toolImg.src = tool;
            toolImg.alt = 'Tool';
            toolImg.className = 'tool-icon';
            toolImg.style.width = '40px';
            toolImg.style.height = '40px';
            toolsContainer.appendChild(toolImg);
        });

        infoContainer.appendChild(toolsContainer);
    }

    const hint = document.createElement('p');
    hint.className = 'carousel-hint';
    hint.textContent = 'Click or drag to explore more images';
    infoContainer.appendChild(hint);

    // Set up carousel (no special scroll handling needed)
    setupScrollSync();

    // Update page title
    document.title = `${project.title} | Matthias Castiglione`;

    console.log('Project detail page loaded successfully');
}

// Function for carousel setup (adds fixed navigation buttons and drag-to-scroll)
function setupScrollSync() {
    const carousel = document.getElementById('projectCarousel');
    if (!carousel) return;

    // Avoid duplicate initialization
    if (carousel._carouselInitialized) return;
    carousel._carouselInitialized = true;

    // Create fixed nav buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav-button prev';
    prevBtn.innerHTML = '&#x2039;'; // ‹
    prevBtn.title = 'Previous';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav-button next';
    nextBtn.innerHTML = '&#x203A;'; // ›
    nextBtn.title = 'Next';

    // Ensure buttons are clickable and above other content
    prevBtn.style.pointerEvents = 'auto';
    nextBtn.style.pointerEvents = 'auto';
    prevBtn.style.zIndex = '9999';
    nextBtn.style.zIndex = '9999';

    // Append to body so they are fixed-positioned
    document.body.appendChild(prevBtn);
    document.body.appendChild(nextBtn);

    // Scroll step (one slide width)
    function slideWidth() {
        return carousel.clientWidth;
    }

    // Track drag state
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    // Update button states and cursor class
    function updateButtons() {
        const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth - 1);
        const atLeft = carousel.scrollLeft <= 0;
        const atRight = carousel.scrollLeft >= maxScrollLeft;

        prevBtn.disabled = atLeft;
        nextBtn.disabled = atRight;

        // Toggle 'no-drag' class only when carousel cannot scroll at all (single item)
        if (atLeft && atRight) {
            carousel.classList.add('no-drag');
        } else {
            carousel.classList.remove('no-drag');
        }

        // While dragging show grabbing cursor
        if (isDown) carousel.classList.add('dragging'); else carousel.classList.remove('dragging');
    }

    // Ensure updateButtons runs immediately and after layout settles
    function triggerInitialUpdates() {
        updateButtons();
        requestAnimationFrame(updateButtons);
        setTimeout(updateButtons, 50);
        setTimeout(updateButtons, 200);
        setTimeout(updateButtons, 600);
    }

    // Button handlers
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
        setTimeout(updateButtons, 250);
    });

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: slideWidth(), behavior: 'smooth' });
        setTimeout(updateButtons, 250);
    });

    carousel.addEventListener('scroll', updateButtons);

    // Make sure buttons/cursor update after images/layout settle
    function onLayoutChange() {
        triggerInitialUpdates();

        // Short polling loop to catch late changes (cached images/layout shifts)
        let checks = 0;
        const maxChecks = 20;
        let lastWidth = carousel.scrollWidth;
        const poll = setInterval(() => {
            checks++;
            const current = carousel.scrollWidth;
            if (current !== lastWidth) {
                lastWidth = current;
                updateButtons();
            }
            if (checks >= maxChecks) {
                clearInterval(poll);
                updateButtons();
            }
        }, 100);
    }

    // Listen for images load inside carousel
    const imgs = Array.from(carousel.querySelectorAll('img'));
    let pending = imgs.length;
    if (pending === 0) {
        onLayoutChange();
    } else {
        imgs.forEach(img => {
            if (img.complete) {
                pending--;
            } else {
                img.addEventListener('load', () => { pending--; if (pending <= 0) onLayoutChange(); });
                img.addEventListener('error', () => { pending--; if (pending <= 0) onLayoutChange(); });
            }
        });
        if (pending <= 0) onLayoutChange();
    }

    // Also update on window resize
    window.addEventListener('resize', onLayoutChange);

    // Pointer (mouse/touch) drag-to-scroll
    let pointerCapturedEl = null;

    function onPointerMove(e) {
        if (!isDown) return;
        e.preventDefault();
        const dx = e.pageX - startX; // use pageX for robustness when page scrolls
        carousel.scrollLeft = scrollLeftStart - dx;
        updateButtons();
    }

    function onPointerUp(e) {
        if (isDown) release(e);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
    }

    carousel.addEventListener('pointerdown', (e) => {
        // ignore pointerdown if it originated on a nav button
        if (e.target.closest && e.target.closest('.carousel-nav-button')) return;

        isDown = true;
        carousel.classList.add('dragging');
        startX = e.pageX; // use pageX
        scrollLeftStart = carousel.scrollLeft;

        // Prefer capturing on the event target (usually the image); fallback to carousel
        pointerCapturedEl = e.target || carousel;
        try {
            if (pointerCapturedEl.setPointerCapture) pointerCapturedEl.setPointerCapture(e.pointerId);
        } catch (err) {
            pointerCapturedEl = carousel;
            try { if (pointerCapturedEl.setPointerCapture) pointerCapturedEl.setPointerCapture(e.pointerId); } catch (err) {}
        }

        // listen globally while pointer is active
        document.addEventListener('pointermove', onPointerMove, { passive: false });
        document.addEventListener('pointerup', onPointerUp);

        // prevent native image drag/select which interferes with pointer drag
        e.preventDefault();

        // disable text selection during drag
        try { document.body.style.userSelect = 'none'; } catch (err) {}
        try { document.body.style.cursor = 'grabbing'; } catch (err) {}

        updateButtons();
    });

    function release(e) {
        isDown = false;
        carousel.classList.remove('dragging');
        try { if (pointerCapturedEl && pointerCapturedEl.releasePointerCapture) pointerCapturedEl.releasePointerCapture(e.pointerId); } catch (err) {}
        pointerCapturedEl = null;

        // re-enable text selection and reset cursor
        try { document.body.style.userSelect = ''; } catch (err) {}
        try { document.body.style.cursor = ''; } catch (err) {}

        // remove global listeners if still attached
        try { document.removeEventListener('pointermove', onPointerMove); } catch (err) {}
        try { document.removeEventListener('pointerup', onPointerUp); } catch (err) {}

        // small delay to let momentum finish then update
        setTimeout(updateButtons, 50);
    }

    // keep pointerup/cancel handlers to ensure release if pointer is canceled
    carousel.addEventListener('pointercancel', release);
    // removed pointerleave to avoid prematurely ending drags

    // Clean up when page unloads
    window.addEventListener('beforeunload', () => {
        try { prevBtn.remove(); nextBtn.remove(); } catch (err) {}
    });

    // Initial update: make buttons enabled immediately and then refine states
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    triggerInitialUpdates();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadProjectDetail();
});
