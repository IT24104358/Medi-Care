// This file should be loaded after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('#content nav .bx-menu');
    const deliveryDetailModal = document.getElementById('deliveryDetailModal');
    const closeModalBtn = document.querySelector('.modal .close');
    const selectAllCheckbox = document.getElementById('selectAll');
    const deliveryCheckboxes = document.querySelectorAll('.delivery-select');
    const exportDeliveriesBtn = document.getElementById('exportDeliveriesBtn');
    const applyBulkActionBtn = document.getElementById('applyBulkAction');
    const dateRangeSelect = document.getElementById('dateRange');
    const customDateRange = document.getElementById('customDateRange');
    const viewDeliveryBtns = document.querySelectorAll('.btn-view');
    const editDeliveryBtns = document.querySelectorAll('.btn-edit');
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

    // Show Delivery Detail Modal
    function openDeliveryModal(deliveryId) {
        document.querySelector('.modal-header .delivery-id').textContent = '#' + deliveryId;
        deliveryDetailModal.style.display = 'block';
    }

    // Close Delivery Detail Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            deliveryDetailModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === deliveryDetailModal) {
            deliveryDetailModal.style.display = 'none';
        }
    });

    // Select All Deliveries
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', () => {
            deliveryCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }

    // View Delivery Buttons
    viewDeliveryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const deliveryId = btn.getAttribute('data-id');
            openDeliveryModal(deliveryId);
        });
    });

    // Edit Delivery Buttons
    editDeliveryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const deliveryId = btn.getAttribute('data-id');
            console.log(`Editing delivery ${deliveryId}`);
            openDeliveryModal(deliveryId);
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
            const deliveryStatus = document.getElementById('deliveryStatus').value;
            console.log(`Filtering by: Date Range - ${dateRange}, Delivery Status - ${deliveryStatus}`);
            showNotification('Filters applied successfully');
        });
    }

    // Apply Bulk Action
    if (applyBulkActionBtn) {
        applyBulkActionBtn.addEventListener('click', () => {
            const action = document.getElementById('bulkAction').value;
            if (!action) {
                alert('Please select an action to perform');
                return;
            }

            const selectedDeliveries = [];
            deliveryCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedDeliveries.push(checkbox.getAttribute('data-id'));
                }
            });

            if (selectedDeliveries.length === 0) {
                alert('Please select at least one delivery');
                return;
            }

            console.log(`Performing action "${action}" on deliveries: ${selectedDeliveries.join(', ')}`);
            showNotification(`${action.charAt(0).toUpperCase() + action.slice(1)} action applied to ${selectedDeliveries.length} deliveries`);
        });
    }

    // Export Deliveries
    if (exportDeliveriesBtn) {
        exportDeliveriesBtn.addEventListener('click', () => {
            console.log('Exporting deliveries...');
            showNotification('Deliveries export started. The file will download shortly.');
            setTimeout(() => {
                console.log('Delivery export completed');
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
                    document.querySelector('.page-info span').textContent = `Page ${page} of 3`;
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

    // Update Delivery Status
    if (statusUpdateBtn) {
        statusUpdateBtn.addEventListener('click', () => {
            const newStatus = changeStatusSelect.value;
            const deliveryId = document.querySelector('.modal-header .delivery-id').textContent;
            console.log(`Updating delivery ${deliveryId} status to ${newStatus}`);
            updateDeliveryTimeline(newStatus);
            showNotification(`Delivery ${deliveryId} status updated to ${newStatus}`);
        });
    }

    // Add Note to Delivery
    const addNoteBtn = document.querySelector('.add-note button');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
            const noteContent = document.querySelector('.add-note textarea').value.trim();
            if (!noteContent) {
                alert('Please enter a note');
                return;
            }

            const noteContainer = document.querySelector('.notes-container');
            const newNote = document.createElement('div');
            newNote.className = 'note';
            const currentDateTime = getCurrentDateTime();

            newNote.innerHTML = `
                <div class="note-meta">
                    <span class="note-date">${currentDateTime}</span>
                    <span class="note-author">Admin User</span>
                </div>
                <div class="note-content">
                    ${noteContent}
                </div>
            `;

            const existingNotes = document.querySelectorAll('.note');
            if (existingNotes.length > 0) {
                noteContainer.insertBefore(newNote, existingNotes[0]);
            } else {
                noteContainer.insertBefore(newNote, document.querySelector('.add-note'));
            }

            document.querySelector('.add-note textarea').value = '';
            console.log(`Added note: ${noteContent}`);
            showNotification('Note added successfully');
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

    // Initialize components
    stripeTableRows();
    initDatePickers();

    // Set default values
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.value = formattedDate;
    });

    console.log('Delivery Management System initialized');
});

// Update Delivery Timeline based on status
function updateDeliveryTimeline(status) {
    const steps = document.querySelectorAll('.timeline-step');
    steps.forEach(step => step.classList.remove('active'));

    const statusIndices = {
        'scheduled': 0,
        'in_transit': 1,
        'delivered': 2,
        'delayed': 2,
        'failed': 2
    };

    const statusIndex = statusIndices[status] || 0;
    for (let i = 0; i <= statusIndex; i++) {
        if (steps[i]) {
            steps[i].classList.add('active');
            if (i < statusIndex) {
                steps[i].querySelector('.step-date').textContent = getCurrentDateTime();
            }
        }
    }
}

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

// Implement table row striping
function stripeTableRows() {
    const rows = document.querySelectorAll('#deliveryTableBody tr');
    rows.forEach((row, index) => {
        if (index % 2 === 1) {
            row.style.backgroundColor = 'var(--grey)';
        }
    });
}

// Initialize datepickers
function initDatePickers() {
    const datePickers = document.querySelectorAll('input[type="date"]');
    if (datePickers.length > 0) {
        console.log('Date pickers initialized');
    }
}