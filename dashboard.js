// dashboard.js - Sử dụng data.js

// Cập nhật dashboard với dữ liệu mới nhất
function updateDashboardWithData() {
    const stats = window.testCaseManagerData.getDashboardStats();
    const suites = window.testCaseManagerData.getTestSuites();
    const priorities = window.testCaseManagerData.getPriorityData();
    
    // Cập nhật thống kê
    document.querySelectorAll('.stat-card').forEach(card => {
        const type = card.classList.contains('passed') ? 'passed' :
                     card.classList.contains('failed') ? 'failed' :
                     card.classList.contains('pending') ? 'pending' : 'blocked';
        
        const countElement = card.querySelector('.stat-count');
        if (countElement) {
            countElement.textContent = stats[type];
        }
    });
    
    // Cập nhật pass rate
    const passRateElement = document.querySelector('.pass-rate-value');
    if (passRateElement) {
        passRateElement.textContent = `${stats.passRate}%`;
    }
    
    const passRateLabel = document.querySelector('.pass-rate-label');
    if (passRateLabel) {
        passRateLabel.innerHTML = `Based on ${stats.totalTestCases} total test cases: <strong>${stats.passed} / ${stats.totalTestCases}</strong>`;
    }
    
    // Cập nhật needs attention
    const attentionCount = document.querySelector('.attention-count');
    if (attentionCount) {
        attentionCount.textContent = stats.needsAttention;
    }
    
    // Cập nhật test suites
    const suiteList = document.querySelector('.suite-list');
    if (suiteList) {
        suiteList.innerHTML = '';
        
        suites.forEach(suite => {
            const suiteItem = document.createElement('div');
            suiteItem.className = 'suite-item';
            
            suiteItem.innerHTML = `
                <div class="suite-name">${suite.name}</div>
                <div class="suite-stats">
                    <span class="suite-count">${suite.testCount} tests</span>
                    ${suite.passed > 0 ? `<span class="suite-status passed-count"><i class="fas fa-circle"></i> Passed ${suite.passed}</span>` : ''}
                    ${suite.failed > 0 ? `<span class="suite-status failed-count"><i class="fas fa-circle"></i> Failed ${suite.failed}</span>` : ''}
                    ${suite.pending > 0 ? `<span class="suite-status pending-count"><i class="fas fa-circle"></i> Pending ${suite.pending}</span>` : ''}
                    ${suite.blocked > 0 ? `<span class="suite-status blocked-count"><i class="fas fa-circle"></i> Blocked ${suite.blocked}</span>` : ''}
                </div>
            `;
            
            suiteList.appendChild(suiteItem);
        });
    }
    
    // Cập nhật priority chart
    const priorityChart = document.querySelector('.priority-chart');
    if (priorityChart) {
        priorityChart.innerHTML = '';
        
        Object.keys(priorities).forEach(priorityKey => {
            const priority = priorities[priorityKey];
            
            const priorityItem = document.createElement('div');
            priorityItem.className = 'priority-item';
            
            priorityItem.innerHTML = `
                <div class="priority-label">
                    <span class="priority-dot" style="background-color: ${priority.color}"></span>
                    ${priority.label}
                </div>
                <div class="priority-bar">
                    <div class="priority-fill" style="width: ${priority.percentage}%; background-color: ${priority.color};"></div>
                </div>
                <div class="priority-value">${priority.count} (${priority.percentage}%)</div>
            `;
            
            priorityChart.appendChild(priorityItem);
        });
        
        // Thêm tổng số test cases
        const totalCount = document.querySelector('.total-count');
        if (totalCount) {
            totalCount.innerHTML = `<strong>Total Test Cases: ${stats.totalTestCases}</strong>`;
        }
    }
}

// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Highlight active navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Cập nhật dashboard với dữ liệu từ data.js
    updateDashboardWithData();
    
    // Cập nhật thời gian
    const lastUpdated = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const updateTimeElement = document.querySelector('.update-time');
    if (!updateTimeElement) {
        // Thêm thời gian cập nhật nếu chưa có
        const dashboardTitle = document.querySelector('.page-title');
        if (dashboardTitle) {
            const timeElement = document.createElement('span');
            timeElement.className = 'update-time';
            timeElement.style.cssText = 'font-size: 14px; color: #7f8c8d; margin-left: auto; font-weight: normal;';
            timeElement.textContent = `Last updated: ${lastUpdated}`;
            dashboardTitle.parentElement.appendChild(timeElement);
        }
    } else {
        updateTimeElement.textContent = `Last updated: ${lastUpdated}`;
    }
    
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        updateDashboardWithData();
        
        // Cập nhật thời gian
        const newTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const timeElement = document.querySelector('.update-time');
        if (timeElement) {
            timeElement.textContent = `Last updated: ${newTime}`;
            
            // Hiệu ứng cập nhật
            timeElement.style.color = '#3498db';
            setTimeout(() => {
                timeElement.style.color = '#7f8c8d';
            }, 1000);
        }
    }, 30000);
});