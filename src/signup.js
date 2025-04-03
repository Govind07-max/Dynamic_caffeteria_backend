document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    console.log("signupForm", signupForm);

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            const role = document.getElementById("signup-role").value; // Get selected role

            try {
                const response = await fetch("http://localhost:5000/api/users/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password, role }) // Send role to backend
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Registration successful!.");
                    window.location.href = "login.html"; // ✅ Redirect to login page
                } else {
                    alert(data.message || "Signup failed. Please try again.");
                }
            } catch (error) {
                console.error("Error signing up:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }
});
