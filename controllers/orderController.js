import asyncHandler from "express-async-handler";
import { Order } from "../config/orderModel.js";
import { User } from "../config/userModel.js";

const createOrder = asyncHandler(async (req, res) => {
    const { items, totalAmount } = req.body;

    // Validate required fields
    if (!items || !items.length || !totalAmount) {
        res.status(400);
        throw new Error("Please provide order items and total amount");
    }

    // Check if user exists
    const userExists = await User.findById(req.user._id);
    if (!userExists) {
        res.status(400);
        throw new Error("User not found");
    }

    // Create a new order
    const order = await Order.create({
        items,
        totalAmount,
        user: req.user._id
    });

    // Emit the order event to all connected clients
    req.io.emit("newOrder", {
        items: order.items,
        totalAmount: order.totalAmount,
        user: userExists.username,
        createdAt: order.createdAt
    });

    res.status(201).json({ message: "Order placed successfully", order });
});

export { createOrder };