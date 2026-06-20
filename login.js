document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.className = "";
      }

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      
      const checkedRoleInput = document.querySelector('input[name="role"]:checked');
      if (!checkedRoleInput) {
        if (errorMessage) {
          errorMessage.textContent = "Please select a role (Admin or Employee).";
          errorMessage.className = "show";
        }
        return;
      }
      const role = checkedRoleInput.value;

      try {
        const response = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, role }),
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
          // Store user info in localStorage for session state
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          
          // Redirect based on role returned by backend
          if (data.user.role === "admin") {
            window.location.href = "admin-dashboard.html";
          } else {
            window.location.href = "employee-dashboard.html";
          }
        } else {
          if (errorMessage) {
            errorMessage.textContent = data.detail || "Login failed. Please check your credentials.";
            errorMessage.className = "show";
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        if (errorMessage) {
          errorMessage.textContent = "Server error! Cannot connect to the backend.";
          errorMessage.className = "show";
        }
      }
    });
  }
});
