const API_URL = "http://localhost:5000";

const loginForm = document.getElementById("loginForm");
const loginModal = document.getElementById("loginModal");
const loginMessage = document.getElementById("loginMessage");
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");

const biodataContainer = document.getElementById("biodataContainer");
const form = document.getElementById("biodataForm");
const formMessage = document.getElementById("formMessage");
const phoneInput = document.getElementById("phone");
const dateOfBirthInput = document.getElementById("dob");

// Run custom checks ourselves so we can show feedback in the form.
form.noValidate = true;

// Send the login details to the server and reveal the biodata form on success.
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "";

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: loginUsernameInput.value.trim(),
                password: loginPasswordInput.value
            })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            loginMessage.textContent = result.message || "Login failed. Please try again.";
            return;
        }

        loginModal.style.display = "none";
        biodataContainer.style.display = "block";
    } catch {
        loginMessage.textContent = "Cannot reach the server. Is it running?";
    }
});

// Add a clear browser validation message for fields with custom rules.
function setValidationMessage(input) {
    const value = input.value.trim();
    let message = "";

    if (input.required && !value) {
        message = "Please complete this required field.";
    } else if (input === phoneInput && value) {
        const digits = value.replace(/\D/g, "");
        const allowedCharacters = /^\+?[\d\s()-]+$/;

        if (!allowedCharacters.test(value) || digits.length < 7 || digits.length > 15) {
            message = "Enter a valid phone number containing 7 to 15 digits.";
        }
    } else if (input === dateOfBirthInput && value) {
        const today = new Date();
        const localToday = new Date(
            today.getTime() - today.getTimezoneOffset() * 60_000
        ).toISOString().slice(0, 10);

        if (value > localToday) {
            message = "Date of birth cannot be in the future.";
        }
    }

    input.setCustomValidity(message);
    return message;
}

// Validate every control and return the first one that needs attention.
function validateForm() {
    let firstInvalidInput = null;

    for (const input of form.querySelectorAll("input, select, textarea")) {
        setValidationMessage(input);

        if (!input.checkValidity() && !firstInvalidInput) {
            firstInvalidInput = input;
        }
    }

    return firstInvalidInput;
}

// Send a validated submission to the server, which saves it to MySQL.
async function saveSubmission(submission) {
    let response;

    // Direct mapping from your existing form names to MySQL database column names
    const mappedSubmission = {
        full_name: submission.fullName || submission.full_name,
        date_of_birth: submission.dateOfBirth || submission.date_of_birth,
        gender: submission.gender,
        phone: submission.phone,
        email: submission.email,
        address: submission.address,
        matric_number: submission.matricNumber || submission.matric_number,
        faculty: submission.faculty,
        department: submission.department,
        level: submission.level,
        programme: submission.programme,
        submittedAt: submission.submittedAt
    };

    try {
        response = await fetch(`${API_URL}/api/biodata`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mappedSubmission)
        });
    } catch {
        throw new Error("Cannot reach the server. Is it running? Your biodata was not saved.");
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "The server could not save your biodata.");
    }
}

// Recheck custom validation as the student edits a field.
form.addEventListener("input", (event) => {
    if (event.target.matches("input, select, textarea")) {
        setValidationMessage(event.target);
        formMessage.textContent = "";
    }
});

// Also validate controls such as select menus when their value changes.
form.addEventListener("change", (event) => {
    if (event.target.matches("input, select, textarea")) {
        setValidationMessage(event.target);
        formMessage.textContent = "";
    }
});

// Validate before saving and only report success after the server confirms the record.
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstInvalidInput = validateForm();

    if (firstInvalidInput) {
        formMessage.textContent = "Please correct the highlighted fields before submitting.";
        firstInvalidInput.reportValidity();
        firstInvalidInput.focus();
        return;
    }

    const rawData = Object.fromEntries(new FormData(form).entries());
    rawData.submittedAt = new Date().toISOString();

    try {
        await saveSubmission(rawData);
        formMessage.textContent = "Your biodata was saved to the database.";
    } catch (error) {
        formMessage.textContent = error.message;
    }
});

// Clear custom validation and feedback after the browser resets all fields.
form.addEventListener("reset", () => {
    window.setTimeout(() => {
        for (const input of form.querySelectorAll("input, select, textarea")) {
            input.setCustomValidity("");
        }
        formMessage.textContent = "";
    }, 0);
});
