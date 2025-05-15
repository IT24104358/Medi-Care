document.addEventListener('DOMContentLoaded', function() {
    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const email = this.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email) && email.length > 0) {
            this.setCustomValidity('Please enter a valid email address');
        } else {
            this.setCustomValidity('');
        }
    });

    // Password validation
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        if (this.value.length < 6 && this.value.length > 0) {
            this.setCustomValidity('Password must be at least 6 characters long');
        } else {
            this.setCustomValidity('');
        }
    });

    // Form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        // This is where you would normally send the data to a server
        // For demonstration, we'll just show a success or error message

        if (email === "test@example.com" && password === "password123") {
            // Success - redirect to dashboard
            window.location.href = "dashboard.html";
        } else {
            // Show error message
            const errorMessage = document.getElementById('error-message');
            const errorText = document.getElementById('error-text');
            errorText.textContent = "Invalid email or password";
            errorMessage.style.display = "flex";

            // Clear password field
            passwordInput.value = "";
        }
    });

    // Remember me functionality
    const rememberCheckbox = document.getElementById('remember');

    // Check if we have saved credentials
    const savedEmail = localStorage.getItem('medicare_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }

    // Save email if remember me is checked
    loginForm.addEventListener('submit', function() {
        if (rememberCheckbox.checked) {
            localStorage.setItem('medicare_email', emailInput.value);
        } else {
            localStorage.removeItem('medicare_email');
        }
    });
});