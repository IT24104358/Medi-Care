// This file should be loaded after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('#content nav .bx-menu');
    const orderDetailModal = document.getElementById('orderDetailModal');
    const closeModalBtn = document.querySelector('.modal .close');
    const selectAllCheckbox = document.getElementById('selectAll');
    const orderCheckboxes = document.querySelectorAll('.order-select');
    const exportOrdersBtn = document.getElementById('exportOrdersBtn');
    const printInvoicesBtn = document.getElementById('printInvoicesBtn');
    const applyBulkActionBtn = document.getElementById('applyBulkAction');
    const dateRangeSelect = document.getElementById('dateRange');
    const customDateRange = document.getElementById('customDateRange');
    const viewOrderBtns = document.querySelectorAll('.btn-view');
    const editOrderBtns = document.querySelectorAll('.btn-edit');
    const paginationBtns = document.querySelectorAll('.page-btn');
    const changeStatusSelect = document.getElementById('changeStatus');
    const statusUpdateBtn = document.querySelector('.status-update .btn-primary');

    // Toggle Sidebar
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hide');
        });
    }

    // DARK MODE TOGGLE - Fixed by moving it inside DOMContentLoaded
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

    // Load orders from backend and populate the table
    fetch('/api/orders')
        .then(response => response.json())
        .then(orders => {
            const orderTableBody = document.getElementById('orderTableBody');
            orderTableBody.innerHTML = ''; // Clear any existing rows

            orders.forEach(order => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td><input type="checkbox" class="order-select" data-id="${order.id}"></td>
                    <td>${order.id}</td>
                    <td>${order.customerName}</td>
                    <td>${order.productName}</td>
                    <td>${order.quantity}</td>
                    <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>${order.date}</td>
<td>$${order.totalPrice.toFixed(2)}</td>
                    <td class="actions">
                        <button class="btn-view" data-id="${order.id}">View</button>
                        <button class="btn-edit" data-id="${order.id}">Edit</button>
                    </td>
                `;
                orderTableBody.appendChild(row);
            });

            // Rebind view and edit button events after dynamically adding rows
            document.querySelectorAll('.btn-view').forEach(btn => {
                btn.addEventListener('click', () => {
                    const orderId = btn.getAttribute('data-id');
                    openOrderModal(orderId);
                });
            });

            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', () => {
                    const orderId = btn.getAttribute('data-id');
                    openOrderModal(orderId);
                });
            });

            stripeTableRows(); // Re-apply table row striping
        })
        .catch(error => {
            console.error('Failed to load orders:', error);
            showNotification('Failed to load orders from server.');
        });


    // Show Order Detail Modal
    // function openOrderModal(orderId) {
    //     // Update modal content based on order ID
    //     document.querySelector('.modal-header .order-id').textContent = '#' + orderId;
    //
    //     // Here you would typically fetch order details from API based on orderId
    //     // and update the modal content
    //
    //     // Show modal
    //     orderDetailModal.style.display = 'block';
    // }
    function openOrderModal(orderId) {
        fetch(`/api/orders/${orderId}`)
            .then(response => response.json())
            .then(order => {
                // Set general info
                document.getElementById('modal-order-id').textContent = order.orderId;
                document.getElementById('modal-order-date').textContent = order.orderDate;
                document.getElementById('modal-order-status').textContent = order.status;

                // Set customer info
                document.getElementById('modal-customer-name').textContent = order.customer.name;
                document.getElementById('modal-customer-email').textContent = order.customer.email;
                document.getElementById('modal-customer-phone').textContent = order.customer.phone;

                // Set order summary
                document.getElementById('modal-subtotal').textContent = order.summary.subtotal.toFixed(2);
                document.getElementById('modal-shipping').textContent = order.summary.shipping.toFixed(2);
                document.getElementById('modal-tax').textContent = order.summary.tax.toFixed(2);
                document.getElementById('modal-total').textContent = order.summary.total.toFixed(2);

                // Set items
                const itemsBody = document.getElementById('modal-items-body');
                itemsBody.innerHTML = ''; // Clear previous content
                order.items.forEach(item => {
                    const row = `
          <tr>
            <td>${item.name}</td>
            <td>${item.meta}</td>
            <td>Rs. ${item.unitPrice.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${item.total.toFixed(2)}</td>
          </tr>
        `;
                    itemsBody.innerHTML += row;
                });

                // Open the modal
                document.getElementById('orderDetailsModal').style.display = 'block';
            })
            .catch(error => {
                console.error('Error loading order details:', error);
                alert('Failed to load order details.');
            });
        orderDetailModal.style.display = 'block';
    }



    // Close Order Detail Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            orderDetailModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === orderDetailModal) {
            orderDetailModal.style.display = 'none';
        }
    });

    // Select All Orders
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', () => {
            orderCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }

    // View Order Buttons
    viewOrderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.getAttribute('data-id');
            openOrderModal(orderId);
        });
    });

    // Edit Order Buttons
    editOrderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.getAttribute('data-id');
            // Could redirect to an edit page or open edit modal
            console.log(`Editing order ${orderId}`);
            // For now, let's just open the view modal
            openOrderModal(orderId);
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
            const orderStatus = document.getElementById('orderStatus').value;
            const paymentStatus = document.getElementById('paymentStatus').value;

            // Here you would typically send these filters to your backend API
            // and refresh the table with filtered results

            console.log(`Filtering by: Date Range - ${dateRange}, Order Status - ${orderStatus}, Payment Status - ${paymentStatus}`);

            // Simulate filter success
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

            const selectedOrders = [];
            orderCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedOrders.push(checkbox.getAttribute('data-id'));
                }
            });

            if (selectedOrders.length === 0) {
                alert('Please select at least one order');
                return;
            }

            // Here you would typically send the bulk action to your backend API
            console.log(`Performing action "${action}" on orders: ${selectedOrders.join(', ')}`);

            // Simulate action success
            showNotification(`${action.charAt(0).toUpperCase() + action.slice(1)} action applied to ${selectedOrders.length} orders`);
        });
    }

    // Export Orders
    if (exportOrdersBtn) {
        exportOrdersBtn.addEventListener('click', () => {
            // Here you would typically trigger a file download via API
            console.log('Exporting orders...');
            showNotification('Orders export started. The file will download shortly.');

            // Simulate download delay
            setTimeout(() => {
                // In a real app, you'd create an actual file and trigger download
                console.log('Order export completed');
            }, 1500);
        });
    }

    // Print Selected Invoices
    if (printInvoicesBtn) {
        printInvoicesBtn.addEventListener('click', () => {
            const selectedOrders = [];
            orderCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedOrders.push(checkbox.getAttribute('data-id'));
                }
            });

            if (selectedOrders.length === 0) {
                alert('Please select at least one order to print');
                return;
            }

            // In a real app, you would prepare the selected orders for printing
            console.log(`Printing invoices for orders: ${selectedOrders.join(', ')}`);

            // For demo purposes, we'll just print the current page
            window.print();
        });
    }

    // Pagination
    paginationBtns.forEach(btn => {
        if (!btn.classList.contains('active') && !btn.disabled) {
            btn.addEventListener('click', () => {
                // Update active button
                document.querySelector('.page-btn.active').classList.remove('active');
                btn.classList.add('active');

                // Here you would typically fetch page data from your API
                const page = btn.textContent || '1';
                console.log(`Loading page ${page}`);

                // Simulate page load (in real app, would update table content)
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

            // Here you would typically reload the data with new pagination settings
            showNotification(`Showing ${perPage} items per page`);
        });
    }

    // Update Order Status
    if (statusUpdateBtn) {
        statusUpdateBtn.addEventListener('click', () => {
            const newStatus = changeStatusSelect.value;
            const orderId = document.querySelector('.modal-header .order-id').textContent;

            // Here you would typically send the status update to your backend API
            console.log(`Updating order ${orderId} status to ${newStatus}`);

            // Update the timeline visualization based on the new status
            updateOrderTimeline(newStatus);

            // Show success notification
            showNotification(`Order ${orderId} status updated to ${newStatus}`);
        });
    }

    // Add Note to Order
    const addNoteBtn = document.querySelector('.add-note button');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
            const noteContent = document.querySelector('.add-note textarea').value.trim();

            if (!noteContent) {
                alert('Please enter a note');
                return;
            }

            // Create new note element
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

            // Insert note at the top of notes (after any existing notes)
            const existingNotes = document.querySelectorAll('.note');
            if (existingNotes.length > 0) {
                noteContainer.insertBefore(newNote, existingNotes[0]);
            } else {
                noteContainer.insertBefore(newNote, document.querySelector('.add-note'));
            }

            // Clear textarea
            document.querySelector('.add-note textarea').value = '';

            // In a real app, you would also send this note to your backend API
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
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.value = formattedDate;
    });

    console.log('Order Management System initialized');
});

// Update Order Timeline based on status
function updateOrderTimeline(status) {
    // Reset all steps to inactive
    const steps = document.querySelectorAll('.timeline-step');
    steps.forEach(step => step.classList.remove('active'));

    // Mark steps as active based on current status
    const statusIndices = {
        'pending': 0,
        'confirmed': 1,
        'processing': 2,
        'shipped': 3,
        'delivered': 4
    };

    const statusIndex = statusIndices[status] || 0;

    // Mark all steps up to current status as active
    for (let i = 0; i <= statusIndex; i++) {
        if (steps[i]) {
            steps[i].classList.add('active');
            // If we had actual time data, we would update step-date here
            if (i < statusIndex) {
                steps[i].querySelector('.step-date').textContent = getCurrentDateTime();
            }
        }
    }

    // Update order status in modal
    const modalStatusElement = document.querySelector('.modal-header .order-status');
    if (modalStatusElement) {
        modalStatusElement.className = `order-status ${status}`;
        modalStatusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
}

// Helper function to get current date and time formatted
function getCurrentDateTime() {
    const now = new Date();

    // Format: "Apr 14, 2025 - 10:45 AM"
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
}

// Show notification (this would be replaced with a proper notification system)
function showNotification(message) {
    // In a real app, you would use a toast notification library
    // For now, we'll just console.log
    console.log(`NOTIFICATION: ${message}`);

    // Create a simple notification element
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

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Implement table row striping for better readability
function stripeTableRows() {
    const rows = document.querySelectorAll('#orderTableBody tr');
    rows.forEach((row, index) => {
        if (index % 2 === 1) {
            row.style.backgroundColor = 'var(--grey)';
        }
    });
}

// Initialize datepickers if any (would need a date picker library)
function initDatePickers() {
    // For a real app, you would initialize your date picker library here
    // Example with a hypothetical date picker:
    // $('.datepicker').datepicker({ format: 'yyyy-mm-dd' });

    const datePickers = document.querySelectorAll('input[type="date"]');
    if (datePickers.length > 0) {
        console.log('Date pickers initialized');
    }
}