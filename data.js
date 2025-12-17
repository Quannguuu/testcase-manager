// data.js - Dữ liệu và tiện ích chung cho TestCase Manager

console.log('Loading data.js...');

// Tạo object chứa dữ liệu và hàm nếu chưa tồn tại
if (!window.testCaseManagerData) {
    window.testCaseManagerData = {};
}

// Dữ liệu test cases
const testCasesData = [
    {
        id: 1,
        title: "User Login - Valid Credentials",
        suite: "Authentication",
        priority: "critical",
        status: "passed",
        date: "2024-01-20",
        description: "Verify that a user can log in with valid credentials",
        lastExecuted: "2024-01-19",
        executionTime: "15s",
        selected: false
    },
    {
        id: 2,
        title: "User Login - Invalid Password",
        suite: "Authentication",
        priority: "high",
        status: "failed",
        date: "2024-01-21",
        description: "Verify error message when logging in with invalid password",
        lastExecuted: "2024-01-20",
        executionTime: "12s",
        selected: false
    },
    {
        id: 3,
        title: "Add Item to Cart",
        suite: "Shopping Cart",
        priority: "medium",
        status: "pending",
        date: "2024-01-16",
        description: "Verify user can add items to shopping cart",
        lastExecuted: "",
        executionTime: "",
        selected: false
    },
    {
        id: 4,
        title: "Checkout Process - Payment",
        suite: "Checkout",
        priority: "critical",
        status: "blocked",
        date: "2024-01-18",
        description: "Verify payment process during checkout",
        lastExecuted: "2024-01-17",
        executionTime: "45s",
        selected: false,
        blocker: "Payment gateway integration pending"
    },
    {
        id: 5,
        title: "Password Reset Flow",
        suite: "Authentication",
        priority: "high",
        status: "pending",
        date: "2024-01-22",
        description: "Verify password reset functionality",
        lastExecuted: "",
        executionTime: "",
        selected: false
    }
];

// Hàm lấy dữ liệu test cases
window.testCaseManagerData.getTestCases = function() {
    return testCasesData;
};

// Hàm lấy test case theo ID
window.testCaseManagerData.getTestCaseById = function(id) {
    return testCasesData.find(testCase => testCase.id === id);
};

// Hàm lọc test cases theo bộ lọc
window.testCaseManagerData.filterTestCases = function(filters = {}) {
    const {
        searchTerm = '',
        suite = 'all',
        priority = 'all',
        status = 'all'
    } = filters;
    
    return testCasesData.filter(testCase => {
        const matchesSearch = searchTerm === '' || 
            testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (testCase.description && testCase.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesSuite = suite === 'all' || testCase.suite === suite;
        const matchesPriority = priority === 'all' || testCase.priority === priority;
        const matchesStatus = status === 'all' || testCase.status === status;
        
        return matchesSearch && matchesSuite && matchesPriority && matchesStatus;
    });
};

// Hàm cập nhật test case
window.testCaseManagerData.updateTestCase = function(id, updates) {
    const index = testCasesData.findIndex(testCase => testCase.id === id);
    
    if (index !== -1) {
        testCasesData[index] = { ...testCasesData[index], ...updates };
        return true;
    }
    
    return false;
};

// Hàm thêm test case mới
window.testCaseManagerData.addTestCase = function(testCase) {
    const newId = testCasesData.length > 0 ? Math.max(...testCasesData.map(tc => tc.id)) + 1 : 1;
    const newTestCase = {
        ...testCase,
        id: newId,
        date: new Date().toISOString().split('T')[0], // Định dạng YYYY-MM-DD
        selected: false
    };
    
    testCasesData.push(newTestCase);
    return newTestCase;
};

// Hàm xóa test case
window.testCaseManagerData.deleteTestCase = function(id) {
    const index = testCasesData.findIndex(testCase => testCase.id === id);
    
    if (index !== -1) {
        testCasesData.splice(index, 1);
        return true;
    }
    
    return false;
};

// Hàm lấy thống kê dashboard
window.testCaseManagerData.getDashboardStats = function() {
    const total = testCasesData.length;
    const passed = testCasesData.filter(tc => tc.status === 'passed').length;
    const failed = testCasesData.filter(tc => tc.status === 'failed').length;
    const pending = testCasesData.filter(tc => tc.status === 'pending').length;
    const blocked = testCasesData.filter(tc => tc.status === 'blocked').length;
    
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    const needsAttention = failed + blocked;
    
    return {
        totalTestCases: total,
        passed,
        failed,
        pending,
        blocked,
        passRate,
        needsAttention,
        lastUpdated: new Date().toISOString()
    };
};

// Hàm lấy dữ liệu test suites
window.testCaseManagerData.getTestSuites = function() {
    const suites = {};
    
    testCasesData.forEach(testCase => {
        if (!suites[testCase.suite]) {
            suites[testCase.suite] = {
                name: testCase.suite,
                testCount: 0,
                passed: 0,
                failed: 0,
                pending: 0,
                blocked: 0
            };
        }
        
        suites[testCase.suite].testCount++;
        
        switch (testCase.status) {
            case 'passed':
                suites[testCase.suite].passed++;
                break;
            case 'failed':
                suites[testCase.suite].failed++;
                break;
            case 'pending':
                suites[testCase.suite].pending++;
                break;
            case 'blocked':
                suites[testCase.suite].blocked++;
                break;
        }
    });
    
    return Object.values(suites);
};

// Hàm lấy dữ liệu priority
window.testCaseManagerData.getPriorityData = function() {
    const priorities = {
        critical: { count: 0, percentage: 0, color: "#e74c3c", label: "Critical" },
        high: { count: 0, percentage: 0, color: "#e67e22", label: "High" },
        medium: { count: 0, percentage: 0, color: "#f39c12", label: "Medium" },
        low: { count: 0, percentage: 0, color: "#95a5a6", label: "Low" }
    };
    
    testCasesData.forEach(testCase => {
        if (priorities[testCase.priority]) {
            priorities[testCase.priority].count++;
        }
    });
    
    const total = testCasesData.length;
    
    // Tính phần trăm
    Object.keys(priorities).forEach(priority => {
        priorities[priority].percentage = total > 0 ? 
            Math.round((priorities[priority].count / total) * 100) : 0;
    });
    
    return priorities;
};

// Hàm lấy test cases được chọn
window.testCaseManagerData.getSelectedTestCases = function() {
    return testCasesData.filter(testCase => testCase.selected);
};

// Hàm chọn/bỏ chọn tất cả test cases
window.testCaseManagerData.toggleSelectAll = function(selectAll) {
    testCasesData.forEach(testCase => {
        testCase.selected = selectAll;
    });
};

// Hàm xuất test cases đã chọn
window.testCaseManagerData.exportSelectedTestCases = function(format = 'json') {
    const selected = this.getSelectedTestCases();
    
    if (selected.length === 0) {
        return null;
    }
    
    if (format === 'json') {
        return JSON.stringify(selected, null, 2);
    } else if (format === 'csv') {
        // Tạo CSV đơn giản
        const headers = ['ID', 'Title', 'Suite', 'Priority', 'Status', 'Date', 'Description'];
        const rows = selected.map(tc => [
            tc.id,
            `"${tc.title.replace(/"/g, '""')}"`,
            tc.suite,
            tc.priority,
            tc.status,
            tc.date,
            `"${(tc.description || '').replace(/"/g, '""')}"`
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        return csvContent;
    }
    
    return null;
};

// Hàm định dạng ngày tháng
window.testCaseManagerData.formatDate = function(dateString) {
    if (!dateString) return 'Never';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

// Hàm lấy màu sắc cho status
window.testCaseManagerData.getStatusColor = function(status) {
    const colors = {
        passed: '#2ecc71',
        failed: '#e74c3c',
        pending: '#f39c12',
        blocked: '#95a5a6'
    };
    
    return colors[status] || '#7f8c8d';
};

// Hàm lấy icon cho status
window.testCaseManagerData.getStatusIcon = function(status) {
    const icons = {
        passed: 'fa-check-circle',
        failed: 'fa-times-circle',
        pending: 'fa-clock',
        blocked: 'fa-ban'
    };
    
    return icons[status] || 'fa-question-circle';
};

// Hàm lấy màu sắc cho priority
window.testCaseManagerData.getPriorityColor = function(priority) {
    const colors = {
        critical: '#e74c3c',
        high: '#e67e22',
        medium: '#f39c12',
        low: '#95a5a6'
    };
    
    return colors[priority] || '#7f8c8d';
};

// Export dữ liệu để truy cập trực tiếp
window.testCaseManagerData.testCasesData = testCasesData;

console.log('data.js loaded successfully');
console.log('Available functions:', Object.keys(window.testCaseManagerData).filter(key => typeof window.testCaseManagerData[key] === 'function'));