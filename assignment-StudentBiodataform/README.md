Assignment: Student Biodata Form📋 Overview


This folder contains the source code and documentation for the Student Biodata Form assignment.

👥 Task Allocation & Responsibilities of Team Member, Role and Responsibility

Shima : Project LeadOverall project direction, HTML structure & testing.

Ceejay: DocumentationRequirements & documentation.

Helena: StylingCSS styling & layout.

Christopher:ScriptingJavaScript validation & interactive functionality

🛠️ Folder Structureassignment-StudentBiodataform/
│
├── README.md             # Assignment guidelines and details
├── index.html            # Primary HTML biodata form layout
├── style.css             # Form styling and responsive design
├── script.js             # JavaScript validation and dynamic behavior
└── docs/                 # Requirements and design documentation
🚀 Workflow & Submission Guidelines
To keep our repository organized and prevent code overwrites, follow these steps when making changes:

Step 1: Pull Latest MainBefore starting work on any task, make sure your local copy of the code is up to date:git checkout main
git pull origin main


Step 2: Create Your Feature BranchNever write code directly on the main branch. Create a new branch named after your task or assigned role:

Shima (Project Lead/HTML):git checkout -b biodata/html-structure


Ceejay (Documentation):git checkout -b biodata/requirements-doc


Helena (CSS):git checkout -b biodata/css-styling


Christopher (JavaScript):git checkout -b biodata/js-validation


Step 3: Stage, Commit, and Push Your WorkSave your changes, write a descriptive commit message, and push your branch to GitHub:# Stage your changes
git add .

# Commit with a clear description
git commit -m "feat(validation): add phone number format validation"

# Push your branch to GitHub
git push origin <your-branch-name>
Step 4: Submit a Pull Request (PR)Go to our repository page on GitHub.Click the Compare & pull request button next to your recently pushed branch.Add a clear title describing your additions (e.g., Added CSS responsive form styling).Request a review from Shima (Project Lead).Once reviewed and approved, click Merge pull request to merge your code into main.

📌 Team Rules

No direct pushes to main: All code must go through a branch and Pull Request.
Pull before you branch: Always pull the latest main branch before starting new work to prevent merge conflicts.
Test locally: Make sure your HTML, CSS, or JS runs without errors in your browser before opening a PR.