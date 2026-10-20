const form = document.getElementById("biodataForm");
const formMessage = document.getElementById("formMessage");
const phoneInput = document.getElementById("phone");
const dateOfBirthInput = document.getElementById("dob");
const storageKey = "studentBiodataSubmissions";

// Run custom checks ourselves so we can show feedback in the form.
form.noValidate = true;

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

// Append a validated submission to this browser's local storage.
function saveSubmission(submission) {
    let savedSubmissions;

    try {
        savedSubmissions = window.localStorage.getItem(storageKey);
    } catch {
        throw new Error("Browser storage is unavailable. Your biodata was not saved.");
    }

    let submissions = [];
    if (savedSubmissions) {
        try {
            submissions = JSON.parse(savedSubmissions);
        } catch {
            throw new Error("Previously saved data could not be read. Your biodata was not saved.");
        }

        if (!Array.isArray(submissions)) {
            throw new Error("Previously saved data is invalid. Your biodata was not saved.");
        }
    }

    submissions.push(submission);

    try {
        window.localStorage.setItem(storageKey, JSON.stringify(submissions));
    } catch {
        throw new Error("Could not save biodata in this browser. Check available storage and try again.");
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

// Validate before saving and only report success after local storage accepts the record.
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstInvalidInput = validateForm();

    if (firstInvalidInput) {
        formMessage.textContent = "Please correct the highlighted fields before submitting.";
        firstInvalidInput.reportValidity();
        firstInvalidInput.focus();
        return;
    }

    const submission = Object.fromEntries(new FormData(form).entries());
    submission.submittedAt = new Date().toISOString();

    try {
        saveSubmission(submission);
        formMessage.textContent =
            "Your biodata was saved in this browser. It is only available on this device and browser.";
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
