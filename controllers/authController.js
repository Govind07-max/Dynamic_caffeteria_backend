import asyncHandler from "express-async-handler";
import { User } from "../config/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();

const RegisterUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    // validation
    if (!username || !email || !password || !role) {
        res.status(400);
        throw new Error("please fill all the fields");
    }
    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("user already exists");
    }
    // password length
    if (password.length < 6) {
        res.status(400);
        throw new Error("password length should be greater than 6");
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        verificationToken
    });

    // send verification email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: 
        https://dynamic-caffeteria-backend.onrender.com/api/users/verify-email?token=${verificationToken}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.status(201).json({
        message: 'User registered. Please check your email to verify your account.'
    });
});

// login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
        res.status(400);
        throw new Error("please fill all the fields");
    }

    // check if user exists  
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("user does not exist");
    }

    // check if user is verified
    if (!user.isVerified) {
        res.status(400);
        throw new Error("Please verify your email to log in");
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error("invalid credentials");
    }

    // generate token
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    // set cookie and send response
    res.cookie("token", token, {
        httpOnly: true
    });
    res.status(200).json({
        token,
        role: user.role
    });
});

export { RegisterUser, loginUser };  