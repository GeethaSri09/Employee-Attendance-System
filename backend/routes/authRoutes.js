import express from "express";
import { registerUser, loginUser, getMe,getProfile, updateProfile} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", auth, getMe);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

export default router;
