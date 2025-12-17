// test-cases.js - Sử dụng data.js

// Khởi tạo với dữ liệu từ data.js
const testCases = window.testCaseManagerData.testCasesData;

// Initialize the test cases list
function renderTestCases() {
    const testCasesList = document.getElementById('testCasesList');
    const showingCount = document.getElementById('showingCount');
    
    // Get filter values
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const suiteFilter = document.getElementById('suiteFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    // Sử dụng hàm filter từ data.js
    const filteredTestCases = window.testCaseManagerData.filterTestCases({
        searchTerm,
        suite: suiteFilter,
        priority: priorityFilter,
        status: statusFilter
    });
    
    // Clear the list
    testCasesList.innerHTML = '';
    
    // Render filtered test cases
    filteredTestCases.forEach(testCase => {
        const testCaseElement = document.createElement('div');
        testCaseElement.className = 'test-case-item';
        testCaseElement.dataset.id = testCase.id;
        
        // Lấy màu sắc và icon từ data.js
        const priorityColor = window.testCaseManagerData.getPriorityColor(testCase.priority);
        const statusColor = window.testCaseManagerData.getStatusColor(testCase.status);
        const statusIcon = window.testCaseManagerData.getStatusIcon(testCase.status);
        
        // Priority class
        let priorityClass = '';
        if (testCase.priority === 'critical') priorityClass = 'priority-critical';
        else if (testCase.priority === 'high') priorityClass = 'priority-high';
        else if (testCase.priority === 'medium') priorityClass = 'priority-medium';
        
        // Status class and text
        let statusClass = '', statusText = '';
        if (testCase.status === 'passed') {
            statusClass = 'status-passed';
            statusText = 'Passed';
        } else if (testCase.status === 'failed') {
            statusClass = 'status-failed';
            statusText = 'Failed';
        } else if (testCase.status === 'pending') {
            statusClass = 'status-pending';
            statusText = 'Pending';
        } else if (testCase.status === 'blocked') {
            statusClass = 'status-blocked';
            statusText = 'Blocked';
        }
        
        // Định dạng ngày
        const formattedDate = window.testCaseManagerData.formatDate(testCase.date);
        
        testCaseElement.innerHTML = `
            <div class="test-case-checkbox">
                <input type="checkbox" id="testCase${testCase.id}" ${testCase.selected ? 'checked' : ''}>
            </div>
            <div class="test-case-content">
                <div class="test-case-title">${testCase.title}</div>
                <div class="test-case-details">
                    <span class="test-case-suite">${testCase.suite}</span>
                    <span class="test-case-priority ${priorityClass}">
                        <i class="fas fa-flag"></i> ${testCase.priority} priority
                    </span>
                    <span class="test-case-status ${statusClass}">
                        <i class="fas ${statusIcon}"></i> ${statusText}
                    </span>
                    <span class="test-case-date">Updated ${formattedDate}</span>
                </div>
            </div>
        `;
        
        // Add event listener to the checkbox
        const checkbox = testCaseElement.querySelector(`#testCase${testCase.id}`);
        checkbox.addEventListener('change', function() {
            testCase.selected = this.checked;
            updateSelectedCount();
            updateSelectAllCheckbox();
        });
        
        testCasesList.appendChild(testCaseElement);
    });
    
    // Update showing count
    showingCount.textContent = filteredTestCases.length;
}

// Update selected count
function updateSelectedCount() {
    const selectedTestCases = window.testCaseManagerData.getSelectedTestCases();
    const selectedCount = selectedTestCases.length;
    document.getElementById('selectedCount').textContent = selectedCount;
}

// Update Select All checkbox state
function updateSelectAllCheckbox() {
    const testCases = window.testCaseManagerData.getTestCases();
    const allSelected = testCases.every(testCase => testCase.selected);
    const someSelected = testCases.some(testCase => testCase.selected);
    
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    selectAllCheckbox.checked = allSelected;
    selectAllCheckbox.indeterminate = !allSelected && someSelected;
}

// Select All functionality
document.getElementById('selectAllCheckbox').addEventListener('change', function() {
    const isChecked = this.checked;
    
    window.testCaseManagerData.toggleSelectAll(isChecked);
    
    renderTestCases();
    updateSelectedCount();
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', function() {
    renderTestCases();
});

// Filter functionality
document.getElementById('suiteFilter').addEventListener('change', function() {
    renderTestCases();
});

document.getElementById('priorityFilter').addEventListener('change', function() {
    renderTestCases();
});

document.getElementById('statusFilter').addEventListener('change', function() {
    renderTestCases();
});

// Export functionality
document.getElementById('exportBtn').addEventListener('click', function() {
    const selectedTestCases = window.testCaseManagerData.getSelectedTestCases();
    
    if (selectedTestCases.length === 0) {
        alert('Please select at least one test case to export.');
        return;
    }
    
    const exportData = window.testCaseManagerData.exportSelectedTestCases('json');
    
    // Tạo file download
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-cases-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Exported ${selectedTestCases.length} test case(s) successfully.`);
});

// Add test case functionality
document.getElementById('addTestCaseBtn').addEventListener('click', function() {
    // Mở modal thêm test case
    openAddTestCaseModal();
});

// Modal thêm test case
function openAddTestCaseModal() {
    const modalHTML = `
        <div class="modal-overlay" id="addTestCaseModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> Add New Test Case</h3>
                    <button class="modal-close" id="closeModalBtn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addTestCaseForm">
                        <div class="form-group">
                            <label for="testCaseTitle">Title *</label>
                            <input type="text" id="testCaseTitle" required placeholder="Enter test case title">
                        </div>
                        <div class="form-group">
                            <label for="testCaseDescription">Description</label>
                            <textarea id="testCaseDescription" rows="3" placeholder="Enter test case description"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="testCaseSuite">Suite *</label>
                                <select id="testCaseSuite" required>
                                    <option value="">Select suite</option>
                                    <option value="Authentication">Authentication</option>
                                    <option value="Shopping Cart">Shopping Cart</option>
                                    <option value="Checkout">Checkout</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="testCasePriority">Priority *</label>
                                <select id="testCasePriority" required>
                                    <option value="">Select priority</option>
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="testCaseStatus">Status *</label>
                                <select id="testCaseStatus" required>
                                    <option value="">Select status</option>
                                    <option value="pending">Pending</option>
                                    <option value="passed">Passed</option>
                                    <option value="failed">Failed</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancelModalBtn">Cancel</button>
                    <button class="btn btn-primary" id="saveTestCaseBtn">Save Test Case</button>
                </div>
            </div>
        </div>
    `;
    
    // Thêm modal vào DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Thêm CSS cho modal
    const modalCSS = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal {
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                animation: slideIn 0.3s ease;
            }
            
            .modal-header {
                padding: 20px 25px;
                border-bottom: 1px solid #ecf0f1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #95a5a6;
                cursor: pointer;
                line-height: 1;
            }
            
            .modal-close:hover {
                color: #e74c3c;
            }
            
            .modal-body {
                padding: 25px;
                overflow-y: auto;
                flex-grow: 1;
            }
            
            .modal-footer {
                padding: 20px 25px;
                border-top: 1px solid #ecf0f1;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-row {
                display: flex;
                gap: 20px;
            }
            
            .form-row .form-group {
                flex: 1;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #2c3e50;
            }
            
            input, select, textarea {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.3s;
            }
            
            input:focus, select:focus, textarea:focus {
                border-color: #3498db;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalCSS);
    
    // Xử lý sự kiện modal
    const modal = document.getElementById('addTestCaseModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelModalBtn');
    const saveBtn = document.getElementById('saveTestCaseBtn');
    const form = document.getElementById('addTestCaseForm');
    
    function closeModal() {
        modal.remove();
        // Xóa style modal
        const modalStyle = document.querySelector('style:last-of-type');
        if (modalStyle && modalStyle.textContent.includes('.modal-overlay')) {
            modalStyle.remove();
        }
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Click bên ngoài modal để đóng
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Lưu test case
    saveBtn.addEventListener('click', function() {
        const title = document.getElementById('testCaseTitle').value.trim();
        const description = document.getElementById('testCaseDescription').value.trim();
        const suite = document.getElementById('testCaseSuite').value;
        const priority = document.getElementById('testCasePriority').value;
        const status = document.getElementById('testCaseStatus').value;
        
        if (!title || !suite || !priority || !status) {
            alert('Please fill in all required fields (*).');
            return;
        }
        
        const newTestCase = {
            title,
            description,
            suite,
            priority,
            status
        };
        
        // Thêm test case mới
        window.testCaseManagerData.addTestCase(newTestCase);
        
        // Cập nhật giao diện
        renderTestCases();
        updateSelectedCount();
        
        // Đóng modal
        closeModal();
        
        alert('Test case added successfully!');
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set total count
    const totalTestCases = window.testCaseManagerData.getTestCases().length;
    document.getElementById('totalCount').textContent = totalTestCases;
    
    renderTestCases();
    updateSelectedCount();
    updateSelectAllCheckbox();
});