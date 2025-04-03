import mongoose from "mongoose";

const seatBookingSchema = new mongoose.Schema({
    tableType: {
        type: String,
        required: [true, "Table type is required"],
        enum: ["4-seater", "8-seater", "family"]
    },
    date: {
        type: Date,
        required: [true, "Booking date is required"]
    },
    time: {
        type: String,
        required: [true, "Booking time is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    contact: {
        type: String,
        required: [true, "Contact number is required"]
    },
    advancePayment: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SeatBooking = mongoose.model("SeatBooking", seatBookingSchema);
export { SeatBooking };