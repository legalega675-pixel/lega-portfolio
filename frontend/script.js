const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.style.color = "red";
        return;
    }
    formStatus.textContent = "Sending message...";
    formStatus.style.color = "#82747a";
    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        formStatus.textContent = result.message;
        formStatus.style.color = "green";
        contactForm.reset();
    } catch (error) {
        formStatus.textContent = error.message || "Unable to connect to server.";
        formStatus.style.color = "red";
    }
});
