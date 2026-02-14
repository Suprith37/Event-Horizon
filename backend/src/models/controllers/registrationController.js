import Registration from "../Registration.js";
import { v4 as uuid } from "uuid";

export const createRegistration = async (req, res) => {
  const ticketId = uuid();

  const registration = await Registration.create({
    ...req.body,
    eventTicketId: req.body.ticketId,
    ticketId
  });

  console.log('Created registration: create registration', registration);
  console.log('Created registration: create registration body', registration);

  res.status(201).json(registration);
};

export const getAllRegistrations = async (req, res) => {
  const regs = await Registration.find();
  res.json(regs);
};

export const getEventRegistrations = async (req, res) => {
  const regs = await Registration.find({ eventId: req.params.id });
  res.json(regs);
};

export const updateAttendance = async (req, res) => {
  const { attended } = req.body;

  const reg = await Registration.findByIdAndUpdate(
    req.params.id,
    { attended },
    { new: true }
  );

  res.json(reg);
};

export const verifyTicket = async (req, res) => {
    console.log('Verifying ticket with ID: params', req.params.ticketId);
    console.log('Verifying ticket with ID: body', req.body);
  const reg = await Registration.findOne({ ticketId: req.params.ticketId });
  if (!reg) return res.status(404).json({ message: "Invalid ticket" });

  res.json(reg);
};
