import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },

    // Dates & Time
    date: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },

    venue: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },

    organizer: {
      type: String,
      required: true
    },

    registrationLimit: {
      type: Number,
      required: true
    },

    enableQr: {
      type: Boolean,
      default: false
    },

    imageUrl: {
      type: String
    },

    category: {
      type: String,
      enum: ["Technical", "Cultural", "Sports", "Other"],
      required: true
    },

    phone: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // auto creates createdAt & updatedAt
  }
);

export default mongoose.model("Event", eventSchema);
