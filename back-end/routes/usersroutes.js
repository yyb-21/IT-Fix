import express from "express";
import { getUsers, getITTeam } from "../controllers/userscontroller.js";
import { protect, requireAdmin, requireITSupportOrAdmin } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", protect, requireAdmin, getUsers);
router.get("/it-team", protect, requireITSupportOrAdmin, getITTeam);

export default router;