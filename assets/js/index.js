// Populate work section with two most recent projects
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('work-preview-container');
    const recentProjects = getTwoMostRecentProjects();

    recentProjects.forEach(project => {
        const previewLink = document.createElement('a');
        previewLink.href = `project-detail.html?id=${project.id}`;
        previewLink.className = 'work-preview';
        previewLink.setAttribute('data-project-id', project.id);
        previewLink.innerHTML = `
                    <div class="work-preview-description">
                        <h2>${project.title}</h2>
                        <p>${project.shortDescription}</p>
                    </div>
                    <img src="${project.image}" alt="${project.title}" class="img-fluid">
                `;

        // Store project ID in sessionStorage when clicking
        previewLink.addEventListener('click', () => {
            sessionStorage.setItem('lastViewedProjectId', project.id);
        });

        container.appendChild(previewLink);
    });
});