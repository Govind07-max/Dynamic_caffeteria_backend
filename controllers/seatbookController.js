import asyncHandler from "express-async-handler";
import { SeatBooking } from "../config/seatBookModel.js";
import { User } from "../config/userModel.js";

const bookTable = asyncHandler(async (req, res) => {
    const { tableType, date, time, name, contact, advancePayment, payment_id } = req.body;

    // Validate required fields
    if (!tableType || !date || !time || !name || !contact || !advancePayment || !payment_id) {
        res.status(400);
        throw new Error("Please fill all the required fields");
    }

    // Check if user exists
    const userExists = await User.findById(req.user._id);
    if (!userExists) {
        res.status(400);
        throw new Error("User not found");
    }

    // Create a new booking
    const booking = await SeatBooking.create({
        tableType,
        date,
        time,
        name,
        contact,
        advancePayment,
        payment_id,
        user: req.user._id
    });

    // Emit the booking event to all connected clients
    req.io.emit("newBooking", {
        
        payment_id: booking.payment_id,
        tableType: booking.tableType,
        date: booking.date,
        time: booking.time,
        name: booking.name,
        contact: booking.contact,
        advancePayment: booking.advancePayment,
        status: booking.status,
        createdAt: booking.createdAt
    });

    res.status(201).json({ message: "Table booked successfully", booking });
});

export { bookTable };