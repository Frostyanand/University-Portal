import express from "express";
import admin from "firebase-admin";
import { db } from "./firebase";

const router = express.Router();

// Define types for attendance data
interface AttendanceData {
  DBMS?: number;
  OS?: number;
  DSA?: number;
  CN?: number;
}

// 🚀 Add student(s) — single or bulk
router.post("/add", async (req, res) => {
  const body = req.body;

  const students = Array.isArray(body) ? body : [body]; // Normalize to array

  const results = [];

  for (const data of students) {
    const RegNo = data.RegNo;

    if (!RegNo) {
      results.push({ success: false, message: "Missing RegNo", data });
      continue;
    }

    try {
      // Add to students collection
      await db.collection("students").doc(RegNo).set(data);

      // Add default attendance (can be customized)
      await db.collection("attendance").doc(RegNo).set({
        DBMS: 0,
        OS: 0,
        DSA: 0,
        CN: 0,
      });

      // Add default internal marks (can be customized)
      await db.collection("internalMarks").doc(RegNo).set({
        DBMS: null,
        OS: null,
        DSA: null,
        CN: null,
      });

      results.push({ success: true, RegNo, message: "Student & related data added" });

    } catch (err) {
      console.error(`Error for ${RegNo}:`, err);
      results.push({ success: false, RegNo, message: "Error adding student", error: err });
    }
  }

  return res.status(200).json({
    success: true,
    message: "Student(s) processed",
    results,
  });
});

// 📊 Update attendance (batch or single)
router.post("/attendance/update", async (req, res) => {
  const updates = Array.isArray(req.body) ? req.body : [req.body];
  const results = [];

  for (const data of updates) {
    const { RegNo, DBMS, OS, DSA, CN } = data;

    if (!RegNo) {
      results.push({ success: false, message: "Missing RegNo", data });
      continue;
    }

    // Validate all attendance values
    const subjects = { DBMS, OS, DSA, CN };
    const invalidSubjects = Object.entries(subjects)
      .filter(([_, value]) => value !== undefined && (typeof value !== 'number' || value < 0 || value > 100));

    if (invalidSubjects.length > 0) {
      results.push({
        success: false,
        RegNo,
        message: `Invalid attendance values for subjects: ${invalidSubjects.map(([sub]) => sub).join(', ')}`,
        data
      });
      continue;
    }

    try {
      const attendanceRef = db.collection("attendance").doc(RegNo);
      const attendanceDoc = await attendanceRef.get();

      // Only update subjects that are provided
      const updateData: Record<string, number> = {};
      if (DBMS !== undefined) updateData.DBMS = DBMS;
      if (OS !== undefined) updateData.OS = OS;
      if (DSA !== undefined) updateData.DSA = DSA;
      if (CN !== undefined) updateData.CN = CN;

      if (!attendanceDoc.exists) {
        // Create new attendance record with default values
        const defaultData = {
          DBMS: 0,
          OS: 0,
          DSA: 0,
          CN: 0,
          ...updateData // Override defaults with provided values
        };
        await attendanceRef.set(defaultData);
        results.push({
          success: true,
          RegNo,
          message: "Attendance record created and updated",
          data: defaultData
        });
      } else {
        // Update existing record
        await attendanceRef.update(updateData);
        results.push({
          success: true,
          RegNo,
          message: "Attendance updated successfully",
          data: updateData
        });
      }

    } catch (err) {
      console.error(`Error updating attendance for ${RegNo}:`, err);
      results.push({
        success: false,
        RegNo,
        message: "Failed to update attendance",
        error: err
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: "Attendance update(s) processed",
    results
  });
});

// 📝 Update internal marks (batch or single)
router.post("/marks/update", async (req, res) => {
  const updates = Array.isArray(req.body) ? req.body : [req.body];
  const results = [];

  for (const data of updates) {
    const { RegNo, DBMS, OS, DSA, CN } = data;

    if (!RegNo) {
      results.push({ success: false, message: "Missing RegNo", data });
      continue;
    }

    // Validate all marks values
    const subjects = { DBMS, OS, DSA, CN };
    const invalidSubjects = Object.entries(subjects)
      .filter(([_, value]) => value !== undefined && (typeof value !== 'number' || value < 0 || value > 100));

    if (invalidSubjects.length > 0) {
      results.push({
        success: false,
        RegNo,
        message: `Invalid marks values for subjects: ${invalidSubjects.map(([sub]) => sub).join(', ')}`,
        data
      });
      continue;
    }

    try {
      const marksRef = db.collection("internalMarks").doc(RegNo);
      const marksDoc = await marksRef.get();

      // Only update subjects that are provided
      const updateData: Record<string, number> = {};
      if (DBMS !== undefined) updateData.DBMS = DBMS;
      if (OS !== undefined) updateData.OS = OS;
      if (DSA !== undefined) updateData.DSA = DSA;
      if (CN !== undefined) updateData.CN = CN;

      if (!marksDoc.exists) {
        // Create new marks record with default values
        const defaultData = {
          DBMS: null,
          OS: null,
          DSA: null,
          CN: null,
          ...updateData // Override defaults with provided values
        };
        await marksRef.set(defaultData);
        results.push({
          success: true,
          RegNo,
          message: "Internal marks record created and updated",
          data: defaultData
        });
      } else {
        // Update existing record
        await marksRef.update(updateData);
        results.push({
          success: true,
          RegNo,
          message: "Internal marks updated successfully",
          data: updateData
        });
      }

    } catch (err) {
      console.error(`Error updating internal marks for ${RegNo}:`, err);
      results.push({
        success: false,
        RegNo,
        message: "Failed to update internal marks",
        error: err
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: "Internal marks update(s) processed",
    results
  });
});

// 📋 Get student details with attendance and marks
router.get("/:RegNo", async (req, res) => {
  const { RegNo } = req.params;

  if (!RegNo) {
    return res.status(400).json({
      success: false,
      message: "RegNo is required"
    });
  }

  try {
    const [studentDoc, attendanceDoc, marksDoc] = await Promise.all([
      db.collection("students").doc(RegNo).get(),
      db.collection("attendance").doc(RegNo).get(),
      db.collection("internalMarks").doc(RegNo).get()
    ]);

    if (!studentDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        student: studentDoc.data(),
        attendance: attendanceDoc.exists ? attendanceDoc.data() : null,
        internalMarks: marksDoc.exists ? marksDoc.data() : null
      }
    });
  } catch (err) {
    console.error("Error fetching student details:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student details",
      error: err
    });
  }
});

export default router;
