document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('#content nav .bx-menu');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closeModalBtn = document.querySelector('.modal .close');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const adminNameInput = document.getElementById('adminName');
    const adminEmailInput = document.getElementById('adminEmail');
    const emailNotifications = document.getElementById('emailNotifications');
    const smsNotifications = document.getElementById('smsNotifications');
    const notificationFrequency = document.getElementById('notificationFrequency');
    const themeToggle = document.getElementById('themeToggle');
    const navbarThemeToggle = document.getElementById('switch-mode');
    const fontSizeSelect = document.getElementById('fontSize');
    const searchBtn = document.querySelector('.bx-search');
    const sidebarLinks = document.querySelectorAll('#sidebar .side-menu li');

    // Load saved settings from localStorage
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('adminSettings')) || {};
        adminNameInput.value = settings.adminName || 'Admin User';
        adminEmailInput.value = settings.adminEmail || 'admin@medistore.com';
        emailNotifications.checked = settings.emailNotifications !== false;
        smsNotifications.checked = settings.smsNotifications || false;
        notificationFrequency.value = settings.notificationFrequency || 'daily';
        const isDarkMode = settings.theme === 'dark';
        themeToggle.checked = isDarkMode;
        navbarThemeToggle.checked = isDarkMode; // Sync navbar toggle
        fontSizeSelect.value = settings.fontSize || 'medium';

        // Apply theme
        document.body.classList.toggle('dark', isDarkMode);

        // Apply font size
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${fontSizeSelect.value}`);
    }

    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            adminName: adminNameInput.value.trim(),
            adminEmail: adminEmailInput.value.trim(),
            emailNotifications: emailNotifications.checked,
            smsNotifications: smsNotifications.checked,
            notificationFrequency: notificationFrequency.value,
            theme: themeToggle.checked ? 'dark' : 'light',
            fontSize: fontSizeSelect.value
        };
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        showNotification('Settings saved successfully');
    }

    // Toggle Sidebar
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hide');
        });
    }

    // Dynamically set active class based on current page
    function setActiveSidebarItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'Settings.html';
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.querySelector('a').getAttribute('href');
            if (linkHref === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Theme Toggle (Settings page)
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark', themeToggle.checked);
            navbarThemeToggle.checked = themeToggle.checked; // Sync navbar toggle
            saveSettings();
        });
    }

    // Navbar Theme Toggle
    if (navbarThemeToggle) {
        navbarThemeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark', navbarThemeToggle.checked);
            themeToggle.checked = navbarThemeToggle.checked; // Sync settings toggle
            saveSettings();
        });
    }

    // Font Size Change
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', () => {
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            document.body.classList.add(`font-${fontSizeSelect.value}`);
            saveSettings();
        });
    }

    // Save Settings
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            if (!adminNameInput.value.trim()) {
                alert('Admin name cannot be empty');
                return;
            }
            if (!adminEmailInput.value.trim() || !/\S+@\S+\.\S+/.test(adminEmailInput.value)) {
                alert('Please enter a valid email address');
                return;
            }
            saveSettings();
            console.log('Settings saved:', JSON.parse(localStorage.getItem('adminSettings')));
        });
    }

    // Open Change Password Modal
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            changePasswordModal.style.display = 'block';
        });
    }

    // Close Change Password Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            changePasswordModal.style.display = 'none';
            clearPasswordFields();
        });
    }

    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
            changePasswordModal.style.display = 'none';
            clearPasswordFields();
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === changePasswordModal) {
            changePasswordModal.style.display = 'none';
            clearPasswordFields();
        }
    });

    // Save New Password
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', () => {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('All password fields are required');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('New password and confirm password do not match');
                return;
            }

            if (newPassword.length < 8) {
                alert('New password must be at least 8 characters long');
                return;
            }

            // Simulate password change (replace with actual backend call)
            console.log('Changing password for:', adminEmailInput.value);
            console.log('Current Password:', currentPassword);
            console.log('New Password:', newPassword);
            showNotification('Password changed successfully');
            changePasswordModal.style.display = 'none';
            clearPasswordFields();
        });
    }

    // Clear password fields
    function clearPasswordFields() {
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    // Search Functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchQuery = prompt('Enter search query:');
            if (searchQuery) {
                console.log(`Searching for: ${searchQuery}`);
                showNotification(`Searching for "${searchQuery}"`);
            }
        });
    }

    // Show Notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--blue)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '5000';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Initialize
    loadSettings();
    setActiveSidebarItem();
    console.log('Settings Page Initialized');
});