import asyncHandler from "express-async-handler";

// In-memory traffic state (you can move to DB if needed)
let currentTraffic = "Low"; // Default level

// Admin POST traffic update
const updateTraffic = asyncHandler(async (req, res) => {
  const { level } = req.body;

  if (!["Low", "Medium", "High", "Full"].includes(level)) {
    res.status(400);
    throw new Error("Invalid traffic level");
  }

  currentTraffic = level;

  // Emit to all connected users via Socket.IO
  req.io.emit("trafficUpdate", level);

  res.status(200).json({ message: "Traffic updated", traffic: { level } });
});

// Optional: GET route to fetch current traffic (for UI refresh)
const getTraffic = asyncHandler(async (req, res) => {
  res.status(200).json({ traffic: { level: currentTraffic } });
});

export { updateTraffic, getTraffic };
