const GITHUB_USERNAME = "StacyMacharia-n";

const gallery = document.getElementById("repo-gallery");
const statusMessage = document.getElementById("repo-status");
const profilePhoto = document.getElementById("profile-photo");
const profilePlaceholder = document.getElementById("profile-placeholder");

// Display the profile photo when it loads successfully.
if (profilePhoto) {
    function showProfilePhoto() {
        profilePhoto.hidden = false;

        if (profilePlaceholder) {
            profilePlaceholder.hidden = true;
        }
    }

    function showProfilePlaceholder() {
        profilePhoto.hidden = true;

        if (profilePlaceholder) {
            profilePlaceholder.hidden = false;
        }
    }

    profilePhoto.addEventListener("load", showProfilePhoto);
    profilePhoto.addEventListener("error", showProfilePlaceholder);

    if (profilePhoto.complete) {
        if (profilePhoto.naturalWidth > 0) {
            showProfilePhoto();
        } else {
            showProfilePlaceholder();
        }
    }
}


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
// =====================================
// INTERACTIVE DEVELOPER TERMINAL
// =====================================

const terminalForm = document.getElementById("terminal-form");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

if (terminalForm && terminalInput && terminalOutput) {

    const commands = {
        help: `
            <p class="terminal-highlight">AVAILABLE COMMANDS</p>
            <p>about - Learn about Stacy</p>
            <p>skills - Explore technical skills</p>
            <p>projects - View my projects</p>
            <p>contact - Find my GitHub profile</p>
            <p>clear - Clear the terminal</p>
            <p>help - Display available commands</p>
        `,

        about: `
            <p class="terminal-highlight">ABOUT STACY</p>
            <p>Hello! I'm Stacy Macharia, a Computer Science student.</p>
            <p>I'm interested in software development, cybersecurity,
            and building useful technology.</p>
            <p>I'm always learning and working on new projects.</p>
        `,

        skills: `
            <p class="terminal-highlight">MY TECHNICAL TOOLKIT</p>
            <p>Programming: Python</p>
            <p>Web development: HTML, CSS</p>
            <p>Databases: SQLite</p>
            <p>Tools: VS Code, Git, GitHub</p>
            <p>Currently developing my skills through practical projects.</p>
        `,

        projects: `
            <p class="terminal-highlight">FEATURED PROJECT</p>
            <p>Lost & Found Management System</p>
            <p>A Python and SQLite application for reporting lost
            items, finding matches, managing claims, and notifications.</p>
            <p><a href="https://github.com/StacyMacharia-n/Lost-and-Found-System"
            target="_blank" rel="noopener noreferrer"
            class="terminal-highlight">Open project on GitHub ↗</a></p>
            <p><a href="#projects" class="terminal-highlight">
            Visit project gallery ↓</a></p>
        `,

        contact: `
            <p class="terminal-highlight">LET'S CONNECT!</p>
            <p>Thank you for exploring my portfolio.</p>
            <p><a href="https://github.com/StacyMacharia-n"
            target="_blank" rel="noopener noreferrer"
            class="terminal-highlight">Visit my GitHub profile ↗</a></p>
        `
    };

    terminalForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const command = terminalInput.value.trim().toLowerCase();

        if (!command) return;

        const commandLine = document.createElement("p");
        commandLine.textContent = "visitor@stacy:~$ " + command;
        terminalOutput.appendChild(commandLine);

        if (command === "clear") {
            terminalOutput.innerHTML = "";
        } else if (commands[command]) {
            terminalOutput.insertAdjacentHTML(
                "beforeend",
                commands[command]
            );
        } else {
            const errorMessage = document.createElement("p");
            errorMessage.textContent =
                "Command not found. Type 'help' to see available commands.";
            terminalOutput.appendChild(errorMessage);
        }

        terminalInput.value = "";
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
}
// PROJECT IMAGE CLICK-TO-ENLARGE FEATURE

document.addEventListener("DOMContentLoaded", function () {

    const projectImages = document.querySelectorAll(".enlargeable-image");

    projectImages.forEach(function (image) {

        image.addEventListener("click", function () {

            const lightbox = document.createElement("div");
            lightbox.className = "image-lightbox";

            const enlargedImage = document.createElement("img");
            enlargedImage.src = image.src;
            enlargedImage.alt = image.alt;

            const closeButton = document.createElement("button");
            closeButton.innerHTML = "&times;";
            closeButton.setAttribute("aria-label", "Close enlarged image");

            lightbox.appendChild(enlargedImage);
            lightbox.appendChild(closeButton);

            document.body.appendChild(lightbox);

            function closeLightbox() {
                lightbox.remove();
            }

            closeButton.addEventListener("click", closeLightbox);

            lightbox.addEventListener("click", function (event) {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });

            document.addEventListener("keydown", function handleEscape(event) {
                if (event.key === "Escape") {
                    closeLightbox();
                    document.removeEventListener("keydown", handleEscape);
                }
            });

        });

    });

});
// PROJECT DETAILS POP-UP FUNCTIONALITY

const projectDetails = {
    "lost-found": {
        title: "Lost and Found Items Management System",
        description: `
            <p>A Python-based system designed to help people report lost and found
            belongings and identify possible matches.</p>

            <h3>Key Features</h3>
            <ul>
                <li>User registration and login</li>
                <li>Reporting lost and found items</li>
                <li>Automated item matching with similarity scores</li>
                <li>Item claiming and administrator approval</li>
                <li>Notifications and item image viewing</li>
                <li>Search and reporting features</li>
            </ul>

            <h3>Technologies Used</h3>
            <p>Python, SQLite and Tkinter.</p>

            <p><strong>What I learned:</strong> Database management,
            authentication, problem-solving and building practical
            software solutions.</p>
        `
    },

    "portfolio": {
        title: "Personal Developer Portfolio Website",
        description: `
            <p>A personal website showcasing my skills, projects,
            achievements and interests in software development and cybersecurity.</p>

            <h3>Key Features</h3>
            <ul>
                <li>Responsive dark-themed design</li>
                <li>Interactive developer terminal</li>
                <li>Automatic GitHub project gallery</li>
                <li>CV download and certificates section</li>
                <li>Experience and community service gallery</li>
                <li>Interactive project image viewer</li>
            </ul>

            <h3>Technologies Used</h3>
            <p>HTML, CSS and JavaScript.</p>

            <p><strong>What I learned:</strong> Web development,
            responsive design, JavaScript interactivity and GitHub Pages deployment.</p>
        `
    }
};

const projectModal = document.getElementById("project-details-modal");
const modalTitle = document.getElementById("modal-project-title");
const modalDescription = document.getElementById("modal-project-description");
const closeProjectModal = document.getElementById("close-project-modal");

document.querySelectorAll(".project-details-btn").forEach(button => {
    button.addEventListener("click", function () {
        const project = projectDetails[this.dataset.project];

        if (project) {
            modalTitle.textContent = project.title;
            modalDescription.innerHTML = project.description;
            projectModal.style.display = "flex";
        }
    });
});

closeProjectModal.addEventListener("click", function () {
    projectModal.style.display = "none";
});

projectModal.addEventListener("click", function (event) {
    if (event.target === projectModal) {
        projectModal.style.display = "none";
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        projectModal.style.display = "none";
    }
});

// CONTACT FORM SUBMISSION
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (response.ok) {
                contactStatus.textContent = "Thank you! Your message has been sent successfully.";
                contactStatus.style.color = "#7ee7a8";
                contactForm.reset();
            } else {
                contactStatus.textContent = "Sorry, your message could not be sent. Please try again.";
                contactStatus.style.color = "#ff8585";
            }
        } catch (error) {
            contactStatus.textContent = "Connection error. Please check your internet and try again.";
            contactStatus.style.color = "#ff8585";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Message ↗";
        }
    });
}
