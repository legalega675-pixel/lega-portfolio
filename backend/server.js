
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Frontend connection
app.use(express.static(path.join(__dirname, "../frontend")));

// Messages file
const messagesFile = path.join(__dirname, "messages.json");
if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, "[]", "utf8");
}
// Test API
app.get("/api", (req, res) => {
    res.json({
        message: "Portfolio backend is running successfully!"
    });
});

// Contact form API
app.post("/api/contact", (req, res) => {

    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields."
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address."
        });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    try {

        const messages = JSON.parse(
            fs.readFileSync(messagesFile, "utf8")
        );

        messages.push(newMessage);

        fs.writeFileSync(
            messagesFile,
            JSON.stringify(messages, null, 2)
        );

        res.status(201).json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error!"
        });

    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
