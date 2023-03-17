import express from "express";
import { authUsers, deleteUser, getUserProfile, getUsers, registerUser, updateUserProfile, getUserById, updateUser } from "../controllers/userControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router()

router.route("/").post(registerUser).get(protect, admin, getUsers)

router.post("/login", authUsers)

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile)

router.route("/:id")
    .delete(protect, admin, deleteUser)
    .get(protect,admin,getUserById)
    .put(protect,admin,updateUser)

export default router
