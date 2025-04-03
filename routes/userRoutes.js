import express from "express";
import {RegisterUser,loginUser} from "../controllers/authController.js";
import {User} from "../config/userModel.js";
import {validateToken} from "../middlewares/validateToken.js";
import {checkRole} from "../middlewares/RoleCheck.js";
import { bookTable } from "../controllers/seatbookController.js";
const router = express.Router();

router.post("/register",RegisterUser);
router.post("/login",loginUser);
router.post("/bookTable", validateToken, bookTable);


router.get("/admin", validateToken, checkRole(['admin']), (req, res) => {
    res.send("Welcome Admin");
  });

  router.get("/owner", validateToken, checkRole(['admin','owner']), (req, res) => {
    res.send("Welcome owner");
  });
  router.get("/user", validateToken, checkRole(['admin','owner','user']), (req, res) => {
    res.send("Welcome user");
  });

  router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200) 
    res.json({message:"email verified successfully"})

  })


export default router;