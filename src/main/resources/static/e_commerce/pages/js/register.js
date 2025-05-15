// Password validation
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;

    if (password !== confirmPassword) {
        this.setCustomValidity('Passwords do not match');
    } else {
        this.setCustomValidity('');
    }
});

// Phone number validation
document.getElementById('phone').addEventListener('input', function() {
    const phoneNumber = this.value;
    const phoneRegex = /^\d+$/;

    if (!phoneRegex.test(phoneNumber)) {
        this.setCustomValidity('Phone number should contain only digits');
    } else {
        this.setCustomValidity('');
    }
});

// Password strength check
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;

    if (password.length < 6) {
        this.setCustomValidity('Password must be at least 6 characters long');
    } else {
        this.setCustomValidity('');
    }
});

// Form submission handling
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Basic client-side validation
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('password').value;
    const agree = document.getElementById('agree').checked;

    if (!username || !phone || !email || !address || !password || !agree) {
        errorMessage.style.display = 'flex';
        errorText.textContent = 'Please fill all required fields and agree to terms';
        return;
    }

    // Here you would typically send the form data to a server
    console.log('Form submitted:', { username, phone, email, address, password });

    // Clear form after submission (optional)
    this.reset();
    errorMessage.style.display = 'none';
});