import express from "express";
import {
  createTicket,
  getTickets,
  acceptTicket,
  refuseTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketscontroller.js";

import { protect, requireITSupportOrAdmin } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.delete("/:id", protect, deleteTicket);
router.put("/:id/accept", protect, requireITSupportOrAdmin, acceptTicket);
router.put("/:id/refuse", protect, requireITSupportOrAdmin, refuseTicket);
router.put("/:id", protect, requireITSupportOrAdmin, updateTicket);

export default router;