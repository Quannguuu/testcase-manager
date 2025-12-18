// test-cases.js - Sử dụng data.js

console.log("Loading test-cases.js...");

// Initialize the test cases list
function renderTestCases() {
  const testCasesList = document.getElementById("testCasesList");
  if (!testCasesList) {
    console.error("testCasesList element not found!");
    return;
  }
  // Các phần tử để cập nhật số liệu
  const showingCount = document.getElementById("showingCount");
  const suiteCountEl = document.getElementById("suiteCount");
  const passRateEl = document.getElementById("passRate");
  const attentionCountEl = document.getElementById("attentionCount");
  const footerTotalCountEl = document.getElementById("footerTotalCount");
  if (!showingCount) {
    console.error("showingCount element not found!");
    return;
  }

  // Get filter values
  const searchInput = document.getElementById("searchInput");
  const suiteFilter = document.getElementById("suiteFilter");
  const priorityFilter = document.getElementById("priorityFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (!searchInput || !suiteFilter || !priorityFilter || !statusFilter) {
    console.error("Filter elements not found!");
    return;
  }

  const searchTerm = searchInput.value.toLowerCase();
  const suiteFilterValue = suiteFilter.value;
  const priorityFilterValue = priorityFilter.value;
  const statusFilterValue = statusFilter.value;

  // Sử dụng hàm filter từ data.js
  const filteredTestCases = window.testCaseManagerData.filterTestCases({
    searchTerm,
    suite: suiteFilterValue,
    priority: priorityFilterValue,
    status: statusFilterValue,
  });

  // Clear the list
  testCasesList.innerHTML = "";

  // Ẩn loading state
  const loadingState = document.getElementById("loadingState");
  if (loadingState) {
    loadingState.style.display = "none";
  }

  // Nếu không có test case nào
  if (filteredTestCases.length === 0) {
    testCasesList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No test cases found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;

    showingCount.textContent = "0";
    return;
  }

  // Render filtered test cases
  filteredTestCases.forEach((testCase) => {
    const testCaseElement = document.createElement("div");
    testCaseElement.className = "test-case-item";
    testCaseElement.dataset.id = testCase.id;

    // Lấy màu sắc và icon từ data.js
    const priorityColor = window.testCaseManagerData.getPriorityColor(
      testCase.priority
    );
    const statusColor = window.testCaseManagerData.getStatusColor(
      testCase.status
    );
    const statusIcon = window.testCaseManagerData.getStatusIcon(
      testCase.status
    );

    // Priority class
    let priorityClass = "";
    if (testCase.priority === "critical") priorityClass = "priority-critical";
    else if (testCase.priority === "high") priorityClass = "priority-high";
    else if (testCase.priority === "medium") priorityClass = "priority-medium";

    // Status class and text
    let statusClass = "",
      statusText = "";
    if (testCase.status === "passed") {
      statusClass = "status-passed";
      statusText = "Passed";
    } else if (testCase.status === "failed") {
      statusClass = "status-failed";
      statusText = "Failed";
    } else if (testCase.status === "pending") {
      statusClass = "status-pending";
      statusText = "Pending";
    } else if (testCase.status === "blocked") {
      statusClass = "status-blocked";
      statusText = "Blocked";
    }

    // Định dạng ngày
    const formattedDate = window.testCaseManagerData.formatDate(testCase.date);

    testCaseElement.innerHTML = `
            <div class="test-case-checkbox">
                <input type="checkbox" id="testCase${testCase.id}" ${
      testCase.selected ? "checked" : ""
    }>
            </div>
            <div class="test-case-content">
                <div class="test-case-title">${testCase.title}</div>
                <div class="test-case-details">
                    <span class="test-case-suite">${testCase.suite}</span>
                    <span class="test-case-priority ${priorityClass}">
                        <i class="fas fa-flag"></i> ${
                          testCase.priority
                        } priority
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
    if (checkbox) {
      checkbox.addEventListener("change", function () {
        // Cập nhật dữ liệu trong data.js
        const testCasesData = window.testCaseManagerData.testCasesData;
        const testCaseToUpdate = testCasesData.find(
          (tc) => tc.id === testCase.id
        );
        if (testCaseToUpdate) {
          testCaseToUpdate.selected = this.checked;
        }
        updateSelectedCount();
        updateSelectAllCheckbox();
      });
    }

    testCasesList.appendChild(testCaseElement);
  });

  // Update showing count
  showingCount.textContent = filteredTestCases.length;
  updateSummaryStats(filteredTestCases);
}

// Update selected count
function updateSelectedCount() {
  const selectedTestCases = window.testCaseManagerData.getSelectedTestCases();
  const selectedCount = selectedTestCases.length;
  const selectedCountElement = document.getElementById("selectedCount");
  if (selectedCountElement) {
    selectedCountElement.textContent = selectedCount;
  }
}

// Update Select All checkbox state
function updateSelectAllCheckbox() {
  const testCases = window.testCaseManagerData.getTestCases();
  const allSelected = testCases.every((testCase) => testCase.selected);
  const someSelected = testCases.some((testCase) => testCase.selected);

  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = allSelected;
    selectAllCheckbox.indeterminate = !allSelected && someSelected;
  }
}

// Chỉ gắn event listeners khi các element tồn tại
function setupEventListeners() {
  // Select All functionality
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener("change", function () {
      const isChecked = this.checked;
      window.testCaseManagerData.toggleSelectAll(isChecked);
      renderTestCases();
      updateSelectedCount();
    });
  } else {
    console.warn("selectAllCheckbox element not found");
  }

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderTestCases();
    });
  } else {
    console.warn("searchInput element not found");
  }

  // Filter functionality
  const suiteFilter = document.getElementById("suiteFilter");
  if (suiteFilter) {
    suiteFilter.addEventListener("change", function () {
      renderTestCases();
    });
  }

  const priorityFilter = document.getElementById("priorityFilter");
  if (priorityFilter) {
    priorityFilter.addEventListener("change", function () {
      renderTestCases();
    });
  }

  const statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      renderTestCases();
    });
  }

  // Export functionality
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      const selectedTestCases =
        window.testCaseManagerData.getSelectedTestCases();

      if (selectedTestCases.length === 0) {
        alert("Please select at least one test case to export.");
        return;
      }

      const exportData =
        window.testCaseManagerData.exportSelectedTestCases("json");

      // Tạo file download
      const blob = new Blob([exportData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `test-cases-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(`Exported ${selectedTestCases.length} test case(s) successfully.`);
    });
  }

  // Add test case functionality
  const addTestCaseBtn = document.getElementById("addTestCaseBtn");
  if (addTestCaseBtn) {
    addTestCaseBtn.addEventListener("click", function () {
      // Mở modal thêm test case
      openAddTestCaseModal();
    });
  }
}

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
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Xử lý sự kiện modal
  const modal = document.getElementById("addTestCaseModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelModalBtn");
  const saveBtn = document.getElementById("saveTestCaseBtn");
  const form = document.getElementById("addTestCaseForm");

  function closeModal() {
    modal.remove();
  }

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Click bên ngoài modal để đóng
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Lưu test case
  saveBtn.addEventListener("click", function () {
    const title = document.getElementById("testCaseTitle").value.trim();
    const description = document
      .getElementById("testCaseDescription")
      .value.trim();
    const suite = document.getElementById("testCaseSuite").value;
    const priority = document.getElementById("testCasePriority").value;
    const status = document.getElementById("testCaseStatus").value;

    if (!title || !suite || !priority || !status) {
      alert("Please fill in all required fields (*).");
      return;
    }

    const newTestCase = {
      title,
      description,
      suite,
      priority,
      status,
    };

    // Thêm test case mới
    window.testCaseManagerData.addTestCase(newTestCase);

    // Cập nhật giao diện
    renderTestCases();
    updateSelectedCount();

    // Đóng modal
    closeModal();

    alert("Test case added successfully!");
  });
}

// Hiển thị thông báo lỗi
function showErrorMessage(message) {
  const testCasesList = document.getElementById("testCasesList");
  if (testCasesList) {
    testCasesList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Test Cases</h3>
                <p>${message}</p>
                <button onclick="location.reload()">
                    <i class="fas fa-redo"></i> Reload Page
                </button>
            </div>
        `;
  }
}

// Initialize the page
function initializePage() {
  console.log("DOM loaded, initializing test cases page...");

  try {
    // Kiểm tra dữ liệu đã tải chưa
    if (!window.testCaseManagerData) {
      console.error("testCaseManagerData not found!");
      showErrorMessage("Data module not loaded. Please refresh the page.");
      return;
    }

    console.log("Data module loaded successfully");
    console.log(
      "Available functions:",
      Object.keys(window.testCaseManagerData).filter(
        (key) => typeof window.testCaseManagerData[key] === "function"
      )
    );

    // Set total count
    const totalTestCases = window.testCaseManagerData.getTestCases().length;
    console.log("Total test cases:", totalTestCases);

    const totalCountElement = document.getElementById("totalCount");
    if (totalCountElement) {
      totalCountElement.textContent = totalTestCases;
    }

    // Thiết lập event listeners
    setupEventListeners();

    // Render test cases ban đầu
    renderTestCases();
    updateSelectedCount();
    updateSelectAllCheckbox();

    console.log("Test cases page initialized successfully");
  } catch (error) {
    console.error("Error initializing page:", error);
    showErrorMessage("Error loading test cases: " + error.message);
  }
}

// Chỉ gắn event listener một lần
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  // DOM đã sẵn sàng
  initializePage();
}
// XỬ LÝ NHẤN ENTER ĐỂ NHẢY Ô
document.addEventListener("keydown", function (e) {
  // Kiểm tra nếu đang trong quá trình gõ dấu tiếng Việt (composition) thì bỏ qua
  if (e.isComposing || e.keyCode === 229) {
    return;
  }

  if (e.key === "Enter") {
    const active = document.activeElement;

    // Nếu đang đứng ở Textarea, cho phép xuống dòng bình thường
    if (active.tagName === "TEXTAREA") return;

    // Nếu đang ở các nút bấm: Cho phép Enter kích hoạt nút
    if (
      active.type === "button" ||
      active.type === "submit" ||
      active.classList.contains("btn")
    ) {
      return;
    }

    // Nếu đang ở ô Input hoặc Select
    if (active.tagName === "INPUT" || active.tagName === "SELECT") {
      e.preventDefault(); // Chặn hành động gửi form mặc định

      const form =
        active.closest("form") || document.getElementById("addTestCaseForm");
      if (form) {
        // Lấy danh sách các ô nhập liệu
        const inputs = Array.from(
          form.querySelectorAll("input, select, textarea")
        ).filter((el) => !el.disabled && el.type !== "hidden");

        const index = inputs.indexOf(active);
        if (index > -1 && index < inputs.length - 1) {
          // Xóa focus khỏi ô hiện tại trước khi chuyển để tránh lỗi copy chữ
          active.blur();
          setTimeout(() => {
            inputs[index + 1].focus(); // Nhảy sang ô tiếp theo sau 1 khoảng trễ siêu nhỏ
          }, 10);
        } else if (index === inputs.length - 1) {
          // Nếu là ô cuối, tự động bấm Save
          document.getElementById("saveTestCaseBtn").click();
        }
      }
    }
  }
});
function updateSummaryStats(testCases) {
  const total = testCases.length;

  // Lấy danh sách các Suite không trùng lặp
  const suites = [...new Set(testCases.map((tc) => tc.suite))].filter(
    (s) => s && s !== ""
  );

  // Tính tỷ lệ Pass
  const passedCount = testCases.filter((tc) => tc.status === "passed").length;
  const passRate = total > 0 ? Math.round((passedCount / total) * 100) : 0;

  // Đếm số Needs Attention (Failed + Blocked)
  const attentionCount = testCases.filter(
    (tc) => tc.status === "failed" || tc.status === "blocked"
  ).length;

  // Cập nhật vào HTML qua ID
  if (document.getElementById("suiteCount"))
    document.getElementById("suiteCount").textContent = suites.length;
  if (document.getElementById("passRate"))
    document.getElementById("passRate").textContent = passRate + "%";
  if (document.getElementById("attentionCount"))
    document.getElementById("attentionCount").textContent = attentionCount;
  if (document.getElementById("footerTotalCount"))
    document.getElementById("footerTotalCount").textContent = total;

  // Cập nhật số liệu hiển thị phía trên (Showing X of Y)
  if (document.getElementById("totalCount"))
    document.getElementById("totalCount").textContent = total;
}
