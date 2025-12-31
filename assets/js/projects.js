// Projects data model
const projects = [
    {
        id: 1,
        title: "Rum Bottle Design",
        category: "personal",
        description: "A personal project to learn product visualization in blender.\n\nDetailed 3D-render of a Rum flask with attention to glass opacity liquid shaders and realistic lighting.",
        image: "assets/projects/blender project/RumBottle_v02.png",
        images: ["assets/projects/blender project/RumBottle_v02.png", "assets/projects/blender project/RumBottle_v02.png", "assets/img-placeholder.png", "assets/logo.svg"] // Array of images for carousel
    },
    // Add more projects here following the same structure
    // Example:
    {
         id: 2,
         title: "Project Name",
         category: "Personal",
         description: "Project description",
         image: "assets/projects/path-to-image.png",
         images: ["assets/projects/path-to-image-1.png", "assets/projects/path-to-image-2.png"]}
];

// Function to render projects
function renderProjects() {
    const container = document.getElementById('projectsContainer');

    // Check if container exists before trying to access it
    if (!container) {
        console.error('projectsContainer element not found in DOM');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Create a project card for each project
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        container.appendChild(projectCard);
    });
}

// Function to create a single project card element
function createProjectCard(project) {
    const card = document.createElement('a');
    card.href = `project-detail.html?id=${project.id}`;
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);

    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-info">
            <h2 class="project-title">${project.title}</h2>
            <p class="project-category">${project.category}</p>
            <p class="project-description">${project.description}</p>
        </div>
    `;

    return card;
}

// Function to add a new project dynamically
function addProject(projectData) {
    projects.push(projectData);
    renderProjects();
}

// Function to get project by ID
function getProjectById(id) {
    return projects.find(p => p.id === parseInt(id));
}

// Initialize projects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});

