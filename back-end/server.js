import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authroutes.js";
import ticketRoutes from "./routes/ticketsroutes.js";
import userRoutes from "./routes/usersroutes.js";

dotenv.config();

// Error handlers for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const app = express();

app.use(cors());
app.use(express.json());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep the process alive
server.on('error', (error) => {
  console.error('Server error:', error);
});