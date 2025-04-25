import asyncHandler from "express-async-handler";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

const createPaymentOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    razorpay.orders.create(options, function(err, order) {
        if (err) {
            console.error("Razorpay Error:", err);
            res.status(500).send("Error creating order");
            return;
        }
        res.json(order);
    });
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { order_id, payment_id, signature } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    let generated_signature = crypto.createHmac('sha256', key_secret)
        .update(order_id + "|" + payment_id)
        .digest('hex');

    if (generated_signature === signature) {
        res.json({ status: 'OK' });
    } else {
        res.json({ status: 'FAILED' });
    }
});

export { createPaymentOrder, verifyPayment };