const testcases = [
  { id: 1, title: "Login thành công", status: "PASS" },
  { id: 2, title: "Login sai mật khẩu", status: "FAIL" }
];

const tbody = document.getElementById("testcase-body");

testcases.forEach(tc => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${tc.id}</td>
    <td>${tc.title}</td>
    <td>${tc.status}</td>
  `;

  tbody.appendChild(tr);
});
