// This file should be loaded after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('#content nav .bx-menu');
    const prescriptionDetailModal = document.getElementById('prescriptionDetailModal');
    const closeModalBtn = document.querySelector('.modal .close');
    const exportPrescriptionsBtn = document.getElementById('exportPrescriptionsBtn');
    const dateRangeSelect = document.getElementById('dateRange');
    const customDateRange = document.getElementById('customDateRange');
    const viewPrescriptionBtns = document.querySelectorAll('.btn-view');
    const paginationBtns = document.querySelectorAll('.page-btn');
    const changeStatusSelect = document.getElementById('changeStatus');
    const statusUpdateBtn = document.querySelector('.status-update .btn-primary');

    // Toggle Sidebar
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hide');
        });
    }

    // DARK MODE TOGGLE
    const switchMode = document.getElementById('switch-mode');
    if (switchMode) {
        switchMode.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        });
    }

    // Show Prescription Detail Modal
    function openPrescriptionModal(prescriptionId) {
        document.querySelector('.modal-header .prescription-id').textContent = '#' + prescriptionId;
        // Here you would typically fetch prescription details from API based on prescriptionId
        // and update the modal content
        prescriptionDetailModal.style.display = 'block';
    }

    // Close Prescription Detail Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            prescriptionDetailModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === prescriptionDetailModal) {
            prescriptionDetailModal.style.display = 'none';
        }
    });

    // View Prescription Buttons
    viewPrescriptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prescriptionId = btn.getAttribute('data-id');
            openPrescriptionModal(prescriptionId);
        });
    });

    // Date Range Filter
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', () => {
            if (dateRangeSelect.value === 'custom') {
                customDateRange.style.display = 'block';
            } else {
                customDateRange.style.display = 'none';
            }
        });
    }

    // Apply Filters
    const applyFilterBtn = document.querySelector('.btn-apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', () => {
            const dateRange = dateRangeSelect.value;
            const prescriptionStatus = document.getElementById('prescriptionStatus').value;
            console.log(`Filtering by: Date Range - ${dateRange}, Prescription Status - ${prescriptionStatus}`);
            showNotification('Filters applied successfully');
        });
    }

    // Export Prescriptions
    if (exportPrescriptionsBtn) {
        exportPrescriptionsBtn.addEventListener('click', () => {
            console.log('Exporting prescriptions...');
            showNotification('Prescriptions export started. The file will download shortly.');
            setTimeout(() => {
                console.log('Prescription export completed');
            }, 1500);
        });
    }

    // Pagination
    paginationBtns.forEach(btn => {
        if (!btn.classList.contains('active') && !btn.disabled) {
            btn.addEventListener('click', () => {
                document.querySelector('.page-btn.active').classList.remove('active');
                btn.classList.add('active');
                const page = btn.textContent || '1';
                console.log(`Loading page ${page}`);
                if (!isNaN(page)) {
                    document.querySelector('.page-info span').textContent = `Page ${page} of 5`;
                }
            });
        }
    });

    // Change Items Per Page
    const perPageSelect = document.getElementById('perPage');
    if (perPageSelect) {
        perPageSelect.addEventListener('change', (e) => {
            const perPage = e.target.value;
            console.log(`Changed items per page to ${perPage}`);
            showNotification(`Showing ${perPage} items per page`);
        });
    }

    // Update Prescription Status
    if (statusUpdateBtn) {
        statusUpdateBtn.addEventListener('click', () => {
            const newStatus = changeStatusSelect.value;
            const prescriptionId = document.querySelector('.modal-header .prescription-id').textContent;
            console.log(`Updating prescription ${prescriptionId} status to ${newStatus}`);
            showNotification(`Prescription ${prescriptionId} status updated to ${newStatus}`);
        });
    }

    // Initialize search functionality
    const searchBtn = document.querySelector('.bx-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchQuery = prompt('Enter search query:');
            if (searchQuery) {
                console.log(`Searching for: ${searchQuery}`);
                showNotification(`Searching for "${searchQuery}"`);
            }
        });
    }

    // Set default values
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.value = formattedDate;
    });

    console.log('Prescription Management System initialized');
});

// Helper function to get current date and time formatted
function getCurrentDateTime() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
}

// Show notification
function showNotification(message) {
    console.log(`NOTIFICATION: ${message}`);
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