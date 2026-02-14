import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    studentName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true
    },

    college: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    attended: {
      type: Boolean,
      default: false
    },

    ticketId: {
      type: String,
      required: true,
      unique: true
    },

    eventTicketId: {
        type: String,
        required: true
    }
  },
  {
    timestamps: {
      createdAt: "registeredAt",
      updatedAt: false
    }
  }
);

export default mongoose.model("Registration", registrationSchema);
