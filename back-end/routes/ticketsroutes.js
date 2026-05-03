import express from "express";
import {
  createTicket,
  getTickets,
  updateTicket,
} from "../controllers/ticketscontroller.js";

import { protect, requireITSupportOrAdmin } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.put("/:id", protect, requireITSupportOrAdmin, updateTicket);

export default router;