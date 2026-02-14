import Event from "../Event.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ message: err.message || 'Failed to fetch events' });
  }
};

export const createEvent = async (req, res) => {
  try {
    if (!req.body.name || !req.body.date) {
      return res.status(400).json({ message: 'Missing required fields: name, date' });
    }
    // Add userId from auth middleware
    const eventData = {
      ...req.body,
      userId: req.userId
    };
    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).json({ message: err.message || 'Failed to create event' });
  }
};
