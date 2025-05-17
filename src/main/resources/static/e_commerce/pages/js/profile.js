document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Mobile Dropdown Toggle
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const dropdown = parent.querySelector('.mobile-dropdown-menu');

            dropdown.classList.toggle('active');
            this.classList.toggle('active');
        });
    });

    // Edit Profile Modal
    const editProfileBtn = document.querySelector('.edit-profile');
    const modal = document.getElementById('edit-profile-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelEdit = document.querySelector('.cancel-edit');

    if (editProfileBtn && modal) {
        editProfileBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (cancelEdit) {
        cancelEdit.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // View Order Details
    const viewOrderButtons = document.querySelectorAll('.view-order');

    viewOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('.order-item').querySelector('h4').textContent;
            alert(`Viewing details for ${orderId} (This is a demo feature)`);
        });
    });

    // Add notification functionality
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add CSS for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--blue);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.error {
            background-color: var(--red);
        }
        
        .modal {
            display: none;
        }
        
        .no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Check for success or error messages from server
    const urlParams = new URLSearchParams(window.location.search);
    const successMsg = urlParams.get('success');
    const errorMsg = urlParams.get('error');

    if (successMsg) {
        showNotification(decodeURIComponent(successMsg), 'success');
    }

    if (errorMsg) {
        showNotification(decodeURIComponent(errorMsg), 'error');
    }
});