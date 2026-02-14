import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

import eventRoute from "./models/routes/eventRount.js";
import registrationRoute from "./models/routes/registrationRoute.js";
import authRoute from "./models/routes/authRoute.js";

dotenv.config();

const app = express();
// app.use(cors());

app.use(cors({
  origin: ['https://event-horizon-jpezb6n30-suprith37s-projects.vercel.app'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// connect to DB
connectDB().catch((err) => {
  console.error("DB connection failed:", err);
  process.exit(1);
});

app.use("/api/events", eventRoute);
app.use("/api/registrations", registrationRoute);
app.use("/api/auth", authRoute);

app.get("/", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
