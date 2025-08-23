// index.ts
import express from "express";
import { sendEmail } from "./mailer";
import { scheduleMailHandler } from "./scheduler";
import dotenv from "dotenv";
import { validateEmailPayload } from "./utils";
import studentRoutes from "./firebase/student"; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Mount student routes
app.use("/api/students", studentRoutes);

// Health check
app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "Email system up and running" });
});

// Direct mail endpoint
app.post("/api/mailer/send", async (req, res) => {
  try {
    const response = await sendEmail(req.body);
    res.status(200).json({ success: true, message: "Mail sent successfully", response });
  }catch (error: any) {
  console.error("/mailer/send error:", error);
  res.status(500).json({ success: false, error: error.message || "Internal server error" });
}
});


// Scheduler endpoint
app.post("/api/scheduler/send", async (req, res) => {
  try {
    // OPTIONAL: You could create a new validation method for scheduler if needed
    const { subject, recipients, templateName } = req.body;

    // Minimum required checks
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: "At least one recipient is required." });
    }

    if (!subject) {
      return res.status(400).json({ success: false, error: "Email subject is required." });
    }

    if (!templateName) {
      return res.status(400).json({ success: false, error: "Template name is required." });
    }

    const result = await scheduleMailHandler(req.body);
    res.status(200).json({ success: true, message: "Mails scheduled successfully", result });

  } catch (error: any) {
    console.error("/scheduler/send error:", error);
    res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
});

// Default route
app.use("*", (_, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Email server running at http://localhost:${PORT}`);
});
