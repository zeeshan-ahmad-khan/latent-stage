import { Response } from "express";
import { ProtectedRequest } from "../middlewares/authMiddleware.js";
import Slot, { SlotStatus } from "../models/Slot.js";
import { getSetting } from "../services/settingsService.js";

const SLOT_DURATION_MINUTES = getSetting("SLOT_DURATION_MINUTES", 20);
const CANCELLATION_WINDOW_HOURS = getSetting("CANCELLATION_WINDOW_HOURS", 1.25);
const LAST_MINUTE_WINDOW_HOURS = getSetting("LAST_MINUTE_WINDOW_HOURS", 1.25);

/**
 * @desc    Get schedule, generating slots if they don't exist.
 * @route   GET /api/schedule
 * @access  Public
 */
export const getSchedule = async (req: ProtectedRequest, res: Response) => {
  try {
    const now = new Date();

    // ✅ FIX: Set the start of the range to the BEGINNING of today.
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 3);
    endDate.setHours(23, 59, 59, 999);

    let cursorDate = new Date(now);
    const minutes = cursorDate.getMinutes();
    const remainder = minutes % SLOT_DURATION_MINUTES;
    if (remainder !== 0) {
      cursorDate.setMinutes(minutes + (SLOT_DURATION_MINUTES - remainder));
    }
    cursorDate.setSeconds(0, 0);

    const slotsToCreate = [];
    while (cursorDate < endDate) {
      slotsToCreate.push({
        updateOne: {
          filter: { startTime: new Date(cursorDate) },
          update: {
            $setOnInsert: {
              startTime: new Date(cursorDate),
              status: SlotStatus.Available,
            },
          },
          upsert: true,
        },
      });
      cursorDate.setMinutes(cursorDate.getMinutes() + SLOT_DURATION_MINUTES);
    }
    if (slotsToCreate.length > 0) {
      await Slot.bulkWrite(slotsToCreate);
    }

    // ✅ FIX: Query the database using the new startDate to include all of today's slots.
    const schedule = await Slot.find({
      startTime: { $gte: startDate, $lte: endDate },
    })
      .populate({
        path: "performer",
        select: "username profilePictureUrl",
      })
      .sort({ startTime: "asc" });

    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Server error while fetching schedule." });
  }
};

// ... bookSlot and cancelSlot functions remain unchanged and are correct ...
export const bookSlot = async (req: ProtectedRequest, res: Response) => {
  // This function is correct and does not need changes.
  const slot = await Slot.findById(req.params.slotId);
  if (!slot) return res.status(404).json({ message: "Slot not found." });
  if (slot.status === SlotStatus.Booked)
    return res.status(400).json({ message: "This slot is already booked." });
  const now = new Date();
  if (slot.startTime <= now)
    return res.status(400).json({ message: "Cannot book a slot in the past." });
  const performerId = req.user._id;
  const timeToSlotHours =
    (slot.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isToday = slot.startTime.toDateString() === now.toDateString();
  if (isToday && timeToSlotHours > LAST_MINUTE_WINDOW_HOURS) {
    return res.status(403).json({
      message:
        "Slots for today can only be booked if they are less than 1 hour and 15 minutes away.",
    });
  }
  if (timeToSlotHours > LAST_MINUTE_WINDOW_HOURS) {
    const existingBooking = await Slot.findOne({
      performer: performerId,
      startTime: { $gt: now },
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "You already have a past performance booked." });
    }
  }
  slot.performer = performerId;
  slot.status = SlotStatus.Booked;
  await slot.save();
  res.status(200).json({ message: "Slot booked successfully!", slot });
};
export const cancelSlot = async (req: ProtectedRequest, res: Response) => {
  // This function is correct and does not need changes.
  const slot = await Slot.findById(req.params.slotId);
  if (!slot) return res.status(404).json({ message: "Slot not found." });
  const performerId = req.user._id;
  if (slot.performer?.toString() !== performerId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to cancel this slot." });
  }
  const now = new Date();
  const timeToSlotHours =
    (slot.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (timeToSlotHours < CANCELLATION_WINDOW_HOURS) {
    return res.status(400).json({
      message:
        "It is too late to cancel this booking. Cancellations must be made more than 1 hour and 15 minutes in advance.",
    });
  }
  slot.performer = undefined;
  slot.status = SlotStatus.Available;
  await slot.save();
  res.status(200).json({ message: "Booking cancelled successfully.", slot });
};
