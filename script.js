
const GITHUB_USERNAME = "StacyMacharia-n";

const gallery = document.getElementById("repo-gallery");
const statusMessage = document.getElementById("repo-status");

const profilePhoto = document.getElementById("profile-photo");
const profilePlaceholder = document.getElementById("profile-placeholder");

// Show the photo only if the image file exists.
profilePhoto.addEventListener("load", () => {
    profilePlaceholder.hidden = true;
    profilePhoto.hidden = false;
});

profilePhoto.addEventListener("error", () => {
    profilePhoto.hidden = true;
    profilePlaceholder.hidden = false;
});

// Create a page element safely using textContent.
function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

// Create one card for a public GitHub repository.
function createRepoCard(repo) {
    const card = document.createElement("article");
    card.className = "repo-card";

    const title = makeElement("h3", "", repo.name);

    const description = makeElement(
        "p",
        "",
        repo.description || "A project from my GitHub workspace."
    );

    const meta = document.createElement("div");
    meta.className = "repo-meta";

    meta.appendChild(
        makeElement("span", "", repo.language || "Multiple files")
    );

    meta.appendChild(
        makeElement("span", "", `★ ${repo.stargazers_count}`)
    );

    const link = document.createElement("a");
    link.className = "repo-link";
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View repository ↗";

    card.append(title, description, meta, link);

    return card;
}

// Load public repositories from GitHub.
async function loadRepositories() {
    statusMessage.textContent = "Loading public repositories...";
    gallery.replaceChildren();

    const apiUrl =
        `https://api.github.com/users/${GITHUB_USERNAME}/repos` +
        "?type=owner&sort=updated&per_page=100";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`GitHub returned status ${response.status}`);
        }

        const repositories = await response.json();

        // Keep original projects and exclude forks and this portfolio.
        const projects = repositories.filter(repo =>
            !repo.fork &&
            repo.name.toLowerCase() !== "my-portfolio" &&
            repo.name.toLowerCase() !== "lost-and-found-system"
        );

        if (projects.length === 0) {
            statusMessage.textContent =
                "No additional public repositories to display yet. " +
                "Your featured project is linked above.";
            return;
        }

        projects.forEach(repo => {
            gallery.appendChild(createRepoCard(repo));
        });

        statusMessage.textContent =
            `Showing ${projects.length} public projects from GitHub.`;

    } catch (error) {
        console.error("Could not load GitHub repositories:", error);

        statusMessage.textContent =
            "The live gallery could not load right now. " +
            "You can still explore my repositories directly on GitHub.";
    }
}

loadRepositories();

