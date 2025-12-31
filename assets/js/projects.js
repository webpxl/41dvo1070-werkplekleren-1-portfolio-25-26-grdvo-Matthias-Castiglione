// Projects data model
const projects = [
    {
        id: 1,
        title: "Rum Bottle Design",
        category: "personal",
        shortDescription: "A personal project focused on learning product visualization in Blender.",
        longDescription: "A personal project focused on learning product visualization in Blender.\n\nThis project features a detailed 3D render of a rum flask, with careful attention to glass opacity, liquid shaders, and realistic lighting to achieve a high level of visual realism.\n\nTools used for this project:",
        image: "assets/images/projects/blender project/RumBottle_v02.png",
        images: ["assets/images/projects/blender project/RumBottle_v02.png", "assets/images/projects/blender project/RumBottle_v01.png", "assets/images/projects/blender project/RumBottle_v0.1.png"],
        tools: ["assets/images/tools/blender.png", "assets/images/tools/photoshop.png"],
        dateAdded: "2025-11-30"
    },
    {
         id: 2,
         title: "Dasboard",
         category: "school",
         shortDescription: "This project was a school project where we needed to make a dashboard cv.",
         longDescription: "This project was created as part of the WPL1 course. I started by sketching several components and, with feedback from my buddies, developed two wireframes. The version shown here was the strongest, which I then refined and finished with a polished visual design.\n\nTools used for this project:",
         image: "assets/images/projects/dashboard/dashboard_v01.png",
         images: ["assets/images/projects/dashboard/dashboard_v01.png", "assets/images/projects/dashboard/dashboard_v0.1.png"],
         tools: ["assets/images/tools/figma.png"],
         dateAdded: "2025-12-07"
    },
    {
         id: 3,
         title: "Build & Design A Branded UI",
         category: "school",
         shortDescription: "A school project that was initially developed in a team and is being finalized individually (ongoing).",
         longDescription: "A school project as part of the UI design course. I worked on the ‘Video Tutorial’ feature and designed the UI for the recipe section on both desktop and mobile, as well as the app download section.\n\nTools used for this project:",
         image: "assets/images/projects/Build&DesignABrandedUI/sitemap.png",
         images: ["assets/images/projects/Build&DesignABrandedUI/sitemap.png", "assets/images/projects/Build&DesignABrandedUI/taskflow.png", "assets/images/projects/Build&DesignABrandedUI/landingpage.png", "assets/images/projects/Build&DesignABrandedUI/taskflow_wireframe.png"],
         tools: ["assets/images/tools/figma.png"],
         dateAdded: "2026-01-16"
    },
    {
        id: 4,
        title: "Halloween Poster",
        category: "school",
        shortDescription: "this poster was a school project as part of the graphic design course.",
        longDescription: "With this project we got a few given images where we then needed to make a good composition with and this is my result of this assignment\n\nTools used for this project:",
        image: "assets/images/projects/halloween project/halloween_poster_v01.png",
        images: ["assets/images/projects/halloween project/halloween_poster_v01.png", "assets/images/projects/halloween project/halloween_poster_v02.png"],
        tools: ["assets/images/tools/photoshop.png"],
        dateAdded: "2025-10-22"
    },
];

// Function to render projects (optionally filtered by category)
function renderProjects(filterCategory = null) {
    const container = document.getElementById('projectsContainer');

    // Check if container exists before trying to access it
    if (!container) {
        console.error('projectsContainer element not found in DOM');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Normalize helper
    const normalize = (c) => (c || '').toString().trim().toLowerCase();

    // Decide which list to render
    let listToRender = [];
    if (filterCategory) {
        const target = normalize(filterCategory);
        listToRender = projects.filter(p => normalize(p.category) === target);
    } else {
        // default: all projects
        listToRender = projects.slice();
    }

    // Sort by dateAdded desc (most recent first)
    listToRender.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    // Create a project card for each project
    listToRender.forEach(project => {
        const projectCard = createProjectCard(project);
        container.appendChild(projectCard);
    });
}

// Utility to extract category label text from heading (remove sup)
function getHeadingCategoryText(heading) {
    if (!heading) return '';
    const clone = heading.cloneNode(true);
    const sup = clone.querySelector('sup');
    if (sup) sup.remove();
    return (clone.textContent || '').trim();
}

// Function to create a single project card element
function createProjectCard(project) {
    const card = document.createElement('a');
    card.href = `project-detail.html?id=${project.id}`;
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);

    // Create tools HTML
    const toolsHTML = project.tools && project.tools.length > 0
        ? `<div class="project-tools" style="display: flex; flex-direction: row; gap: 12px; margin-top: 12px;">
                ${project.tools.map(tool => `<img src="${tool}" alt="Tool" class="tool-icon" style="width: 40px; height: 40px;">`).join('')}
           </div>`
        : '';

    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-info">
            <h2 class="project-title">${project.title}</h2>
            <p class="project-category">${project.category}</p>
            <p class="project-description">${project.shortDescription}</p>
            ${toolsHTML}
        </div>
    `;

    // Store project ID in sessionStorage when clicked
    card.addEventListener('click', () => {
        sessionStorage.setItem('lastViewedProjectId', project.id);
    });

    return card;
}

// Function to add a new project dynamically
function addProject(projectData) {
    projects.push(projectData);
    renderProjects();
    updateCategoryCounts();
}

// Function to get project by ID
function getProjectById(id) {
    return projects.find(p => p.id === parseInt(id));
}

// Function to get unique categories from projects
function getCategories() {
    const categories = new Set();
    projects.forEach(project => {
        categories.add(project.category.charAt(0).toUpperCase() + project.category.slice(1));
    });
    return Array.from(categories);
}

// Function to count projects in a category
function getProjectCountByCategory(category) {
    const categoryLower = category.toLowerCase();
    return projects.filter(p => p.category.toLowerCase() === categoryLower).length;
}

// Function to format count with leading zero (e.g., 3 becomes "03")
function formatCountWithLeadingZero(count) {
    return String(count).padStart(2, '0');
}

// Function to update category counts in the DOM
function updateCategoryCounts() {
    const categories = getCategories();

    categories.forEach(category => {
        const count = getProjectCountByCategory(category);
        const formattedCount = formatCountWithLeadingZero(count);

        // Find the h1 element that contains this category and update the sup value
        const headings = document.querySelectorAll('.info-body-hyperlinks h1');
        headings.forEach(heading => {
            if (heading.textContent.includes(category)) {
                const sup = heading.querySelector('sup');
                if (sup) {
                    sup.textContent = formattedCount;
                }
            }
        });
    });
}

// Function to get the two most recent projects
function getTwoMostRecentProjects() {
    return projects
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 2);
}

// Function to scroll to a project element by ID
function scrollToProject(projectId) {
    // Wait a moment for DOM to settle after rendering
    setTimeout(() => {
        const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
        if (projectElement) {
            projectElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('Scrolled to project:', projectId);
        }
    }, 100);
}

// Function to initialize projects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Setup category heading click/toggle behavior
    const headings = Array.from(document.querySelectorAll('.info-body-hyperlinks h1'));
    let activeCategory = null; // normalized lower-case category

    function updateHeadingStyles() {
        headings.forEach(h => {
            const catText = getHeadingCategoryText(h);
            const norm = (catText || '').toLowerCase();

            const root = document.documentElement;
            const primaryColor = getComputedStyle(root).getPropertyValue('--primary-500');

            if (activeCategory && norm === activeCategory) {
                // simple visual indicator: underline and bolder weight (inline so we don't change CSS files)
                h.style.textDecoration = 'underline';
                //h.style.fontWeight = '700';
                h.style.textDecorationcolor = 'primaryColor';
            } else {
                h.style.textDecoration = '';
                //h.style.fontWeight = '';
                h.style.textDecorationcolor = '';
            }
        });
    }

    headings.forEach(h => {
        // make headings interactive
        h.style.cursor = 'pointer';
        h.addEventListener('click', (e) => {
            const catText = getHeadingCategoryText(h);
            const norm = (catText || '').toLowerCase();

            // toggle logic: click same category -> clear filter
            if (activeCategory === norm) {
                activeCategory = null;
            } else {
                activeCategory = norm;
            }

            updateHeadingStyles();
            renderProjects(activeCategory);
        });
    });

    // Initial render: show all projects sorted by recency
    renderProjects();
    updateCategoryCounts();

    // Check if we need to scroll to a specific project
    const scrollToProjectId = sessionStorage.getItem('scrollToProjectId');
    if (scrollToProjectId) {
        scrollToProject(scrollToProjectId);
        // Clear the sessionStorage item after use
        sessionStorage.removeItem('scrollToProjectId');
    }
});
