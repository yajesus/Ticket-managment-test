const Ticket = require("../model/ticketSchema.js");
const {
  authenticate,
  authorizeAdmin,
} = require("../Middleware/authmiddleware.js");
const express = require("express");
const router = express.Router();
router.post("/create", authenticate, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTicket = new Ticket({
      title,
      description,
      status: "Open",
      user: req.user.id,
    });
    await newTicket.save();
    res.status(201).json({ message: "Ticket created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket", error });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const tickets =
      req.user.role === "admin"
        ? await Ticket.find().populate("user", "username email")
        : await Ticket.find({ user: req.user.id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets", error });
  }
});

router.put("/:id", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket", error });
  }
});
module.exports = router;
