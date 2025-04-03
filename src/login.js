document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            try {
                const response = await fetch("http://localhost:5000/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("userToken", data.token);
                     localStorage.setItem("userRole", data.role);
                    window.location.href = "dashboard.html"; // ✅ Redirect to dashboard
                } else {
                    alert(data.message || "Login failed. Please check your credentials.");
                }
            } catch (error) {
                console.error("Error logging in:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }
});
