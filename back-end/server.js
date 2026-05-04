import express from "express";
import cors from "cors";

import authRoutes from "./routes/authroutes.js";
import ticketRoutes from "./routes/ticketsroutes.js";
import userRoutes from "./routes/usersroutes.js";

// Error handlers for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const app = express();

app.use(cors({
  origin: [
    "https://it-fix-eight.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
}));


app.use(express.json());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);

const PORT = Number(process.env.PORT) || 5002;

const server = app.listen(PORT);

server.on('listening', () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Another instance of this server may be running.`
    );
    console.error(
      'Stop it first (e.g. close the other terminal, or run: fuser -k ' +
        PORT +
        '/tcp ) or set PORT in .env to a different port.'
    );
    process.exit(1);
    return;
  }
  console.error('Server error:', error);
  process.exit(1);
});