document.addEventListener("DOMContentLoaded", function () {
    // Simulate fetching user role (In a real app, get this from backend or session storage)
    const userRole = localStorage.getItem("userRole") || "user"; // Change role as needed ("admin", "staff", "user")

    // Update welcome message based on role
    const welcomeMessage = document.getElementById("welcome-message");
    welcomeMessage.textContent = `Welcome, ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}!`;
    
    // Add role-based class to dashboard
    const dashboard = document.querySelector(".dashboard");
    dashboard.classList.add(`dashboard-${userRole}`);
    
    // Customize dashboard title based on role
    const dashboardTitle = {
        admin: "Admin Control Panel",
        user: "User Dashboard",
        staff: "Staff Management Panel"
    };
    welcomeMessage.textContent = dashboardTitle[userRole] || "Dashboard";

    // Filter sidebar options based on user role
    const sidebarLinks = document.querySelectorAll(".sidebar ul li a");
    sidebarLinks.forEach(link => {
        const allowedRoles = link.getAttribute("data-role").split(" ");
        if (!allowedRoles.includes(userRole)) {
            link.parentElement.style.display = "none";
        }
    });

    // Define features for each role
    const features = {
        admin: [
            { title: "Manage Menu", description: "Add, update, or remove items from the menu." },
            { title: "View Live Traffic", description: "Monitor cafeteria crowd levels in real-time." },
            { title: "Manage Users", description: "Manage user accounts and permissions." }
        ],
        user: [
            { title: "Place Order", description: "Order food from the live menu." },
            { title: "Give Feedback", description: "Share your experience with us." },
            { title: "Track Order", description: "Monitor your order status in real-time." }
        ],
        owner: [
            { title: "Manage Orders", description: "Process and fulfill customer orders." },
            { title: "Inventory Management", description: "Keep track of stock and supplies." }
        ]
    };

    // Render features based on role
    const featuresContainer = document.getElementById("features");
    featuresContainer.innerHTML = ""; // Clear previous features
    features[userRole]?.forEach(feature => {
        const featureCard = document.createElement("div");
        featureCard.classList.add("feature-card");
        featureCard.innerHTML = `<h3>${feature.title}</h3><p>${feature.description}</p>`;
        featuresContainer.appendChild(featureCard);
    });

    // Logout functionality
    document.getElementById("logout").addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        alert("You have been logged out successfully.");
        window.location.replace("login.html"); // Redirect to login page
    });
});
