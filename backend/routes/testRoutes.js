import express from "express";
import protect  from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 PROTECTED ROUTE
router.get("/private", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user,
  });
});

export default router;
