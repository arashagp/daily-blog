import express from "express";

import { User } from "../controllers/userController";

const router = express.Router();

router.route("/").post(User.createUser);
router.route("/:id").get(User.getUser).patch(User.updateUser);

export default router;
