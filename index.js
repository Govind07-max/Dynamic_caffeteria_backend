import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import { connectDB } from "./config/db_connect.js";
import cors from "cors";
import path from "path";
import http from "http"; // Required to create an HTTP server
import { Server } from "socket.io"; // Import Socket.IO

dotenv.config();

const port = process.env.PORT || 5001;
const app = express();

// Enable CORS
app.use(cors({
    origin: "*", // Replace with your frontend URL in production
    credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "src/")));

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your frontend URL in production
        methods: ["GET", "POST"]
    }
});

// Attach Socket.IO to the request object
app.use((req, res, next) => {
    req.io = io; // Attach the Socket.IO instance to the request object
    next();
});

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRouter);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});