import express from "express";
import { getUsers } from "../controllers/userscontroller.js";
import { protect, requireAdmin } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", protect, requireAdmin, getUsers);

export default router;